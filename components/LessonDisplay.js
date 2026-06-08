// components/LessonDisplay.js
"use client";

import { useState } from "react";

export default function LessonDisplay({ lesson, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  function handleAnswer(idx, option) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [idx]: option }));
  }

  function handleSubmit() {
    if (!lesson.quiz || lesson.quiz.length === 0) {
      onComplete(100, []);
      return;
    }
    const total = lesson.quiz.length;
    let correct = 0;
    const wrongTopics = [];
    lesson.quiz.forEach((q, idx) => {
      if (answers[idx] === q.answer) {
        correct++;
      } else {
        wrongTopics.push(q.question.split(" ").slice(0, 4).join(" "));
      }
    });
    const finalScore = Math.round((correct / total) * 100);
    setScore(finalScore);
    setSubmitted(true);
    onComplete(finalScore, wrongTopics);
  }

  return (
    <article style={{ padding: "1.5rem", maxWidth: "720px" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem", color: "#1e1e2e" }}>
        {lesson.title}
      </h2>
      <p style={{ color: "#555", marginBottom: "1.5rem", lineHeight: "1.6" }}>
        {lesson.summary}
      </p>

      {/* Sections */}
      {lesson.sections?.map((sec, i) => (
        <section key={i} style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#4338ca", marginBottom: "0.4rem" }}>
            {sec.heading}
          </h3>
          <p style={{ color: "#444", lineHeight: "1.7" }}>{sec.content}</p>
        </section>
      ))}

      {/* Key Points */}
      {lesson.keyPoints?.length > 0 && (
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: "10px", padding: "1rem 1.25rem", marginBottom: "1.5rem"
        }}>
          <h3 style={{ fontWeight: "700", marginBottom: "0.5rem", color: "#15803d" }}>
            ✅ Key Takeaways
          </h3>
          <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
            {lesson.keyPoints.map((kp, i) => (
              <li key={i} style={{ color: "#166534", marginBottom: "0.3rem" }}>{kp}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Quiz */}
      {lesson.quiz?.length > 0 && (
        <div style={{
          background: "#fafafa", border: "1px solid #e5e7eb",
          borderRadius: "10px", padding: "1.25rem", marginTop: "1rem"
        }}>
          <h3 style={{ fontWeight: "700", marginBottom: "1rem", color: "#1e1e2e" }}>
            🧠 Quick Quiz
          </h3>
          {lesson.quiz.map((q, idx) => (
            <div key={idx} style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                Q{idx + 1}: {q.question}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {q.options.map((opt) => {
                  let bg = "#fff";
                  let border = "1px solid #d1d5db";
                  let color = "#333";
                  if (submitted) {
                    if (opt === q.answer) { bg = "#dcfce7"; border = "1px solid #22c55e"; color = "#15803d"; }
                    else if (opt === answers[idx]) { bg = "#fee2e2"; border = "1px solid #ef4444"; color = "#b91c1c"; }
                  } else if (answers[idx] === opt) {
                    bg = "#eef2ff"; border = "1px solid #6366f1"; color = "#4338ca";
                  }
                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(idx, opt)}
                      disabled={submitted}
                      style={{
                        textAlign: "left", padding: "0.6rem 1rem",
                        borderRadius: "7px", border, background: bg,
                        color, cursor: submitted ? "default" : "pointer",
                        fontSize: "0.9rem", transition: "all 0.15s"
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < lesson.quiz.length}
              style={{
                marginTop: "0.5rem", padding: "0.7rem 1.5rem",
                background: Object.keys(answers).length < lesson.quiz.length ? "#e5e7eb" : "#6366f1",
                color: Object.keys(answers).length < lesson.quiz.length ? "#9ca3af" : "white",
                border: "none", borderRadius: "8px", fontWeight: "600",
                cursor: Object.keys(answers).length < lesson.quiz.length ? "not-allowed" : "pointer",
                fontSize: "0.95rem"
              }}
            >
              Submit Quiz
            </button>
          ) : (
            <div style={{
              marginTop: "1rem", padding: "0.75rem 1rem",
              background: score >= 70 ? "#f0fdf4" : "#fff7ed",
              borderRadius: "8px", fontWeight: "600",
              color: score >= 70 ? "#15803d" : "#c2410c"
            }}>
              Your score: {score}%
              {score === 100 && " 🎉 Perfect!"}
              {score >= 70 && score < 100 && " 👍 Good work!"}
              {score < 70 && " 📚 Review the weak areas below."}
            </div>
          )}
        </div>
      )}
    </article>
  );
}