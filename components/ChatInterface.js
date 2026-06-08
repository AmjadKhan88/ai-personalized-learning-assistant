// components/ChatInterface.js
"use client";

import { useRef, useEffect, useState } from "react";

export default function ChatInterface({ messages, onSendMessage, topic }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div style={{
      border: "1px solid #e5e7eb", borderRadius: "12px",
      overflow: "hidden", marginTop: "1.5rem", maxWidth: "720px"
    }}>
      {/* Header */}
      <div style={{ background: "#6366f1", padding: "0.75rem 1rem" }}>
        <h3 style={{ color: "white", margin: 0, fontSize: "0.95rem", fontWeight: "600" }}>
          💬 Ask anything about <em>{topic || "this lesson"}</em>
        </h3>
      </div>

      {/* Messages */}
      <div style={{
        height: "280px", overflowY: "auto", padding: "1rem",
        display: "flex", flexDirection: "column", gap: "0.75rem",
        background: "#fafafa"
      }}>
        {messages.length === 0 && (
          <p style={{ color: "#aaa", textAlign: "center", marginTop: "2rem", fontSize: "0.9rem" }}>
            No messages yet. Ask a question about the lesson!
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#6366f1" : "white",
              color: msg.role === "user" ? "white" : "#333",
              padding: "0.6rem 1rem",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              maxWidth: "80%",
              fontSize: "0.9rem",
              lineHeight: "1.5",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: msg.role === "user" ? "none" : "1px solid #e5e7eb"
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        display: "flex", gap: "0.5rem", padding: "0.75rem",
        borderTop: "1px solid #e5e7eb", background: "white"
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question… (Enter to send, Shift+Enter for new line)"
          rows={2}
          style={{
            flex: 1, resize: "none", padding: "0.6rem 0.85rem",
            border: "1px solid #d1d5db", borderRadius: "8px",
            fontSize: "0.9rem", outline: "none", fontFamily: "inherit"
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            padding: "0 1.25rem",
            background: input.trim() ? "#6366f1" : "#e5e7eb",
            color: input.trim() ? "white" : "#9ca3af",
            border: "none", borderRadius: "8px",
            fontWeight: "600", cursor: input.trim() ? "pointer" : "not-allowed",
            fontSize: "0.9rem", transition: "all 0.15s"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}