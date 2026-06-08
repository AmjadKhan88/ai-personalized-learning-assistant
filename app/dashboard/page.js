// app/dashboard/page.js
// ─────────────────────────────────────────────────────────────
// THE MAIN WIRING FILE — read this to understand data flow.
//
// DATA FLOW OVERVIEW:
//
//  [Firebase Auth] ──► AuthContext (user state)
//         │
//         ▼
//  [Dashboard Page] ◄─ user.uid (from useAuth)
//    │       │
//    │       ▼
//    │  [Firestore] ──► progress, weakAreas (loaded on mount)
//    │
//    ├──► TopicSelector
//    │        │ onSelectTopic(topic)
//    │        ▼
//    │    sets `selectedTopic` state
//    │        │
//    │        ▼
//    ├──► LessonDisplay ◄── POST /api/lesson { topic }
//    │        │                    │
//    │        │                    ▼
//    │        │              Gemini 1.5 Flash
//    │        │
//    │        │ onComplete(score, weakTopics)
//    │        ▼
//    │    saveProgress() → Firestore
//    │
//    ├──► ChatInterface ◄── POST /api/chat { messages, topic }
//    │
//    └──► WeakAreasTracker ◄── Firestore weakAreas[]
// ─────────────────────────────────────────────────────────────

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import TopicSelector from "@/components/TopicSelector";
import LessonDisplay from "@/components/LessonDisplay";
import ChatInterface from "@/components/ChatInterface";
import WeakAreasTracker from "@/components/WeakAreasTracker";
import { getAllProgress, getWeakAreas, saveProgress, addWeakArea } from "@/lib/progress";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // ── State ─────────────────────────────────────────────────
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonError, setLessonError] = useState(null);
  const [progress, setProgress] = useState([]);   // [{topic, score, completedAt}]
  const [weakAreas, setWeakAreas] = useState([]);  // [topicString, ...]
  const [chatMessages, setChatMessages] = useState([]); // [{role, text}]

  // ── Auth guard ────────────────────────────────────────────
  // Redirect unauthenticated users to login.
  // We check `loading` first to avoid a flash redirect while Firebase warms up.
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // ── Load user data on mount ───────────────────────────────
  useEffect(() => {
    if (!user) return;
    async function loadUserData() {
      const [prog, weak] = await Promise.all([
        getAllProgress(user.uid),
        getWeakAreas(user.uid),
      ]);
      setProgress(prog);
      setWeakAreas(weak);
    }
    loadUserData();
  }, [user]);

  // ── Lesson generation ─────────────────────────────────────
  // Called when the user picks a topic from TopicSelector.
  const handleTopicSelect = useCallback(async (topic) => {
    setSelectedTopic(topic);
    setLesson(null);
    setLessonError(null);
    setChatMessages([]); // Reset chat when switching topics
    setLessonLoading(true);

    try {
      // This hits our server-side API route → Gemini (key never leaves server)
      const res = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level: "beginner" }),
      });

      if (!res.ok) throw new Error("Failed to load lesson");
      const { lesson } = await res.json();
      setLesson(lesson);
    } catch (err) {
      console.error(err);
      setLessonError("Couldn't generate the lesson. Try again in a moment.");
    } finally {
      setLessonLoading(false);
    }
  }, []);

  // ── Lesson completion handler ─────────────────────────────
  // LessonDisplay calls this after the user finishes the quiz.
  // `weakTopics` = array of sub-topics the user got wrong.
  const handleLessonComplete = useCallback(
    async (score, weakTopics = []) => {
      if (!user || !selectedTopic) return;

      // Save to Firestore
      await saveProgress(user.uid, selectedTopic, score);

      // Track weak areas if any quiz answers were wrong
      for (const wt of weakTopics) {
        await addWeakArea(user.uid, wt);
      }

      // Refresh local state so the WeakAreasTracker updates immediately
      const [prog, weak] = await Promise.all([
        getAllProgress(user.uid),
        getWeakAreas(user.uid),
      ]);
      setProgress(prog);
      setWeakAreas(weak);
    },
    [user, selectedTopic]
  );

  // ── Chat handler ──────────────────────────────────────────
  // ChatInterface calls this with each new user message.
  const handleSendMessage = useCallback(
    async (userText) => {
      const newMessages = [...chatMessages, { role: "user", text: userText }];
      setChatMessages(newMessages);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages, topic: selectedTopic }),
        });

        if (!res.ok) throw new Error("Chat failed");
        const { reply } = await res.json();

        // Append the model's reply to history
        setChatMessages((prev) => [...prev, { role: "model", text: reply }]);
      } catch (err) {
        console.error(err);
        setChatMessages((prev) => [
          ...prev,
          { role: "model", text: "Sorry, I ran into an error. Try again!" },
        ]);
      }
    },
    [chatMessages, selectedTopic]
  );

  // ── Render ────────────────────────────────────────────────
  if (loading || !user) {
    return (
      <div className="page-loading">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="dashboard">
        {/* ── Left column ─────────────────────────────── */}
        <aside className="dashboard-sidebar">
          {/*
            TopicSelector: Browse and pick a topic.
            `completedTopics` is passed so it can visually mark finished ones.
          */}
          <TopicSelector
            onSelectTopic={handleTopicSelect}
            selectedTopic={selectedTopic}
            completedTopics={progress.map((p) => p.topic)}
          />

          {/* WeakAreasTracker: shows topics the user needs to review */}
          <WeakAreasTracker
            weakAreas={weakAreas}
            onSelectTopic={handleTopicSelect} // clicking a weak area re-generates that lesson
          />
        </aside>

        {/* ── Main content ─────────────────────────────── */}
        <section className="dashboard-content">
          {!selectedTopic && (
            <div className="dashboard-empty">
              <h2>Pick a topic to start learning 👈</h2>
              <p>Your progress is saved automatically after each lesson.</p>
            </div>
          )}

          {lessonLoading && (
            <div className="lesson-skeleton">
              <div className="skeleton-line wide" />
              <div className="skeleton-line" />
              <div className="skeleton-line narrow" />
            </div>
          )}

          {lessonError && (
            <div className="error-banner">
              {lessonError}
              <button onClick={() => handleTopicSelect(selectedTopic)}>Retry</button>
            </div>
          )}

          {/*
            LessonDisplay: renders the AI-generated lesson + quiz.
            It tells us when the quiz is done via onComplete.
          */}
          {lesson && !lessonLoading && (
            <LessonDisplay
              lesson={lesson}
              onComplete={handleLessonComplete}
            />
          )}

          {/*
            ChatInterface: persistent Q&A while a topic is active.
            We pass messages as a prop so this component is pure/controlled.
          */}
          {selectedTopic && (
            <ChatInterface
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              topic={selectedTopic}
            />
          )}
        </section>
      </main>
    </>
  );
}
