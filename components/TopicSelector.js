// components/TopicSelector.js
"use client";

const TOPICS = [
  { label: "JavaScript Basics",    icon: "⚡" },
  { label: "React Fundamentals",   icon: "⚛️" },
  { label: "Node.js & Express",    icon: "🟢" },
  { label: "MongoDB & Mongoose",   icon: "🍃" },
  { label: "Next.js App Router",   icon: "▲" },
  { label: "TypeScript Essentials",icon: "🔷" },
  { label: "REST API Design",      icon: "🔗" },
  { label: "Authentication & JWT", icon: "🔒" },
  { label: "CSS & Tailwind",       icon: "🎨" },
  { label: "Git & GitHub",         icon: "🐙" },
];

export default function TopicSelector({ onSelectTopic, selectedTopic, completedTopics }) {
  return (
    <div className="p-4">
      <h2 className="text-xs font-bold uppercase tracking-widest
                     text-gray-400 dark:text-gray-500 mb-3 px-1">
        Topics
      </h2>

      <ul className="flex flex-col gap-1">
        {TOPICS.map(({ label, icon }) => {
          const isActive = selectedTopic === label;
          const isDone   = completedTopics?.includes(label);
          return (
            <li key={label}>
              <button
                onClick={() => onSelectTopic(label)}
                className={`topic-btn ${isActive ? "active" : ""}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{icon}</span>
                  <span className="flex-1 text-left">{label}</span>
                  {isDone && (
                    <span className="ml-auto text-green-500 dark:text-green-400 text-xs font-bold">
                      ✓
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}