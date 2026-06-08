// components/TopicSelector.js
"use client";

const TOPICS = [
  "JavaScript Basics",
  "React Fundamentals",
  "Node.js & Express",
  "MongoDB & Mongoose",
  "Next.js App Router",
  "TypeScript Essentials",
  "REST API Design",
  "Authentication & JWT",
  "CSS & Tailwind",
  "Git & GitHub",
];

export default function TopicSelector({ onSelectTopic, selectedTopic, completedTopics }) {
  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.75rem", color: "#333" }}>
        📚 Topics
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {TOPICS.map((topic) => (
          <li key={topic}>
            <button
              onClick={() => onSelectTopic(topic)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.6rem 0.85rem",
                borderRadius: "8px",
                border: selectedTopic === topic ? "2px solid #6366f1" : "2px solid transparent",
                background: selectedTopic === topic ? "#eef2ff" : "#f9f9f9",
                color: selectedTopic === topic ? "#4338ca" : "#444",
                fontWeight: selectedTopic === topic ? "600" : "400",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "all 0.15s",
              }}
            >
              {completedTopics?.includes(topic) && (
                <span style={{ marginRight: "6px", color: "#22c55e" }}>✓</span>
              )}
              {topic}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}