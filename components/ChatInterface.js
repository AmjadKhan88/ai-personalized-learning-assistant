// components/ChatInterface.js
"use client";

import { useRef, useEffect, useState } from "react";

export default function ChatInterface({ messages, onSendMessage, topic }) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const prevLenRef = useRef(messages.length);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // Detect when AI finishes replying (message count grew by 1 with role "model")
    if (messages.length > prevLenRef.current) {
      setIsTyping(false);
    }
    prevLenRef.current = messages.length;
  }, [messages]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setIsTyping(true);
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
    <div className="card mt-6 overflow-hidden max-w-2xl">

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800
                      bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
        <span className="text-base">💬</span>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Chat with Tutor
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Ask anything about{" "}
            <span className="text-brand-500 dark:text-brand-400 font-medium">
              {topic || "this lesson"}
            </span>
          </p>
        </div>
        {/* Live indicator */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
          <span className="text-xs text-gray-400 dark:text-gray-500">Gemini</span>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 flex flex-col gap-3
                      bg-white dark:bg-gray-900">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full
                          text-gray-300 dark:text-gray-700 gap-2">
            <span className="text-4xl">🤖</span>
            <p className="text-xs text-center">
              Ask a question about the lesson
              <br />and I&apos;ll explain it for you.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}
                        animate-fade-in`}
          >
            {msg.role === "model" && (
              <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40
                               text-brand-600 dark:text-brand-400 flex items-center justify-center
                               text-xs mr-2 mt-auto mb-0.5 shrink-0">
                AI
              </span>
            )}
            <div className={msg.role === "user" ? "bubble-user" : "bubble-ai"}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40
                             text-brand-600 dark:text-brand-400 flex items-center justify-center
                             text-xs mr-2 shrink-0">
              AI
            </span>
            <div className="bubble-ai">
              <span className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 border-t border-gray-100 dark:border-gray-800
                      bg-gray-50 dark:bg-gray-800/50">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question… (Enter to send)"
          rows={1}
          className="flex-1 resize-none px-3.5 py-2.5 text-sm
                     bg-white dark:bg-gray-900
                     border border-gray-200 dark:border-gray-700
                     rounded-xl outline-none
                     text-gray-800 dark:text-gray-200
                     placeholder-gray-400 dark:placeholder-gray-600
                     focus:border-brand-400 dark:focus:border-brand-600
                     focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/30
                     transition-all duration-150 font-sans"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="btn-primary px-4 self-end"
        >
          {isTyping ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}