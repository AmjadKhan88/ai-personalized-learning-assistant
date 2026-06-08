// context/ThemeContext.js
// ─────────────────────────────────────────────────────────────
// WHY: We store the user's theme preference in localStorage so
// it persists across sessions. On load we read it and add/remove
// the "dark" class on <html> BEFORE paint to avoid a flash.
// ─────────────────────────────────────────────────────────────
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Default to system preference on first visit
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Read saved preference, or fall back to OS preference
    const saved = localStorage.getItem("ai-tutor-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function applyTheme(t) {
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("ai-tutor-theme", next);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}