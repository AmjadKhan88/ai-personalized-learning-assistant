// app/dashboard/page.js
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

  const [selectedTopic, setSelectedTopic]   = useState(null);
  const [lesson, setLesson]                 = useState(null);
  const [lessonLoading, setLessonLoading]   = useState(false);
  const [lessonError, setLessonError]       = useState(null);
  const [progress, setProgress]             = useState([]);
  const [weakAreas, setWeakAreas]           = useState([]);
  const [chatMessages, setChatMessages]     = useState([]);
  const [sidebarOpen, setSidebarOpen]       = useState(false);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  // Load user data
  useEffect(() => {
    if (!user) return;
    async function load() {
      const [prog, weak] = await Promise.all([
        getAllProgress(user.uid),
        getWeakAreas(user.uid),
      ]);
      setProgress(prog);
      setWeakAreas(weak);
    }
    load();
  }, [user]);

  const handleTopicSelect = useCallback(async (topic) => {
    setSelectedTopic(topic);
    setLesson(null);
    setLessonError(null);
    setChatMessages([]);
    setLessonLoading(true);
    setSidebarOpen(false); // Close mobile sidebar on topic pick

    try {
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
      setLessonError("Couldn't generate the lesson. Please try again.");
    } finally {
      setLessonLoading(false);
    }
  }, []);

  const handleLessonComplete = useCallback(async (score, weakTopics = []) => {
    if (!user || !selectedTopic) return;
    await saveProgress(user.uid, selectedTopic, score);
    for (const wt of weakTopics) await addWeakArea(user.uid, wt);
    const [prog, weak] = await Promise.all([
      getAllProgress(user.uid),
      getWeakAreas(user.uid),
    ]);
    setProgress(prog);
    setWeakAreas(weak);
  }, [user, selectedTopic]);

  const handleSendMessage = useCallback(async (userText) => {
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
      setChatMessages((prev) => [...prev, { role: "model", text: reply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "model", text: "Sorry, I ran into an error. Try again!" },
      ]);
    }
  }, [chatMessages, selectedTopic]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gray-50 dark:bg-gray-950">
        <div className="w-8 h-8 border-4 border-brand-400 border-t-transparent
                        rounded-full animate-spin" />
      </div>
    );
  }

  const completedTopics = progress.map((p) => p.topic);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />

      {/* Mobile sidebar toggle */}
      <div className="md:hidden flex items-center gap-3 px-4 py-2.5
                      border-b border-gray-200 dark:border-gray-800
                      bg-white dark:bg-gray-900">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn-ghost gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {selectedTopic || "Pick a topic"}
        </button>
        {selectedTopic && (
          <span className="text-xs text-brand-500 dark:text-brand-400 font-medium truncate">
            {selectedTopic}
          </span>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Sidebar ─────────────────────────────────────────── */}
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          fixed md:static top-0 left-0 h-full z-30
          w-64 shrink-0
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          overflow-y-auto
          transition-transform duration-300 ease-in-out
          flex flex-col
          pt-4 md:pt-0
        `}>
          {/* Close button — mobile only */}
          <div className="md:hidden flex justify-end px-4 pb-2">
            <button onClick={() => setSidebarOpen(false)} className="btn-ghost p-1.5">
              ✕
            </button>
          </div>

          {/* Progress summary */}
          <div className="px-4 py-3 mx-3 mb-2 rounded-xl
                          bg-brand-50 dark:bg-brand-900/20
                          border border-brand-100 dark:border-brand-800/40">
            <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
              Progress
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-brand-100 dark:bg-brand-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((completedTopics.length / 10) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs text-brand-600 dark:text-brand-400 font-bold tabular-nums">
                {completedTopics.length}/10
              </span>
            </div>
          </div>

          <TopicSelector
            onSelectTopic={handleTopicSelect}
            selectedTopic={selectedTopic}
            completedTopics={completedTopics}
          />

          <div className="mt-auto">
            <WeakAreasTracker
              weakAreas={weakAreas}
              onSelectTopic={handleTopicSelect}
            />
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">

          {/* Empty state */}
          {!selectedTopic && !lessonLoading && (
            <div className="flex flex-col items-center justify-center
                            min-h-[60vh] text-center animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-900/30
                              flex items-center justify-center text-5xl mb-5 shadow-inner">
                🎓
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">
                Ready to learn?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                Pick a topic from the sidebar and your AI tutor will generate
                a personalized lesson in seconds.
              </p>
              <div className="md:hidden mt-5">
                <button onClick={() => setSidebarOpen(true)} className="btn-primary">
                  Browse Topics
                </button>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {lessonLoading && (
            <div className="max-w-2xl animate-pulse space-y-4">
              <div className="skeleton h-8 w-2/3" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton h-36 w-full mt-4 rounded-2xl" />
              <div className="skeleton h-36 w-full rounded-2xl" />
              <div className="skeleton h-48 w-full rounded-2xl" />
            </div>
          )}

          {/* Error */}
          {lessonError && (
            <div className="max-w-2xl card p-5 border-red-200 dark:border-red-800/50
                            bg-red-50 dark:bg-red-900/10 flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-700 dark:text-red-400 text-sm">
                  {lessonError}
                </p>
                <button
                  onClick={() => handleTopicSelect(selectedTopic)}
                  className="text-xs text-red-500 dark:text-red-400 underline mt-1"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Lesson + Chat */}
          {lesson && !lessonLoading && (
            <>
              {/* Topic badge */}
              <div className="flex items-center gap-2 mb-5">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                                 bg-brand-100 dark:bg-brand-900/40
                                 text-brand-600 dark:text-brand-400">
                  {selectedTopic}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  Generated by Gemini 2.5 Flash
                </span>
              </div>

              <LessonDisplay lesson={lesson} onComplete={handleLessonComplete} />
              <ChatInterface
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                topic={selectedTopic}
              />

              {/* Bottom padding */}
              <div className="h-10" />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
