// components/Navbar.js
"use client";

import { useRouter } from "next/navigation";
import { logOut } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logOut();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50
                       bg-white/80 dark:bg-gray-900/80
                       backdrop-blur-md
                       border-b border-gray-200 dark:border-gray-800
                       px-4 md:px-6 h-14 flex items-center justify-between">

      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">🎓</span>
        <span className="font-extrabold text-lg text-gray-900 dark:text-white tracking-tight">
          AI Tutor
        </span>
        <span className="hidden sm:inline-flex items-center px-2 py-0.5
                         text-xs font-semibold rounded-full
                         bg-brand-100 dark:bg-brand-900/40
                         text-brand-600 dark:text-brand-400">
          Beta
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn-ghost w-9 h-9 p-0 text-base"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Avatar */}
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "User"}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-200 dark:ring-brand-800"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-500 text-white
                          flex items-center justify-center font-bold text-sm
                          ring-2 ring-brand-200 dark:ring-brand-800">
            {(user.displayName || user.email || "?")[0].toUpperCase()}
          </div>
        )}

        {/* Name — hidden on mobile */}
        <span className="hidden md:block text-sm font-medium
                         text-gray-700 dark:text-gray-300 max-w-[140px] truncate">
          {user.displayName || user.email}
        </span>

        {/* Logout */}
        <button onClick={handleLogout} className="btn-ghost text-xs px-3 py-1.5">
          Log out
        </button>
      </div>
    </header>
  );
}