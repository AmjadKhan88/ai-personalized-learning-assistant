// components/Navbar.js
// ─────────────────────────────────────────────────────────────
// WHY: A standalone Navbar component keeps layout concerns out
// of page files. It reads auth state from context (not props)
// so it works identically on every page without any wiring.
// ─────────────────────────────────────────────────────────────

"use client";

import { useRouter } from "next/navigation";
import { logOut } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logOut();
      // After signOut, Firebase auth state updates → AuthContext clears user
      // We then redirect manually to ensure a clean slate
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  // Don't render the navbar at all when unauthenticated
  // (login page handles its own layout)
  if (!user) return null;

  return (
    <header className="navbar">
      {/* Brand / Logo */}
      <div className="navbar-brand">
        <span className="navbar-logo">🎓</span>
        <span className="navbar-title">AI Tutor</span>
      </div>

      {/* User info + actions */}
      <div className="navbar-user">
        {/* 
          user.photoURL comes from Google OAuth — it's the profile picture.
          We fall back to initials if the photo fails to load.
        */}
        {user.photoURL ? (
          <img
            className="navbar-avatar"
            src={user.photoURL}
            alt={user.displayName || "User"}
            referrerPolicy="no-referrer" // Required for Google-hosted avatars
          />
        ) : (
          <div className="navbar-avatar-fallback">
            {(user.displayName || user.email || "?")[0].toUpperCase()}
          </div>
        )}

        <span className="navbar-name">
          {/* displayName is the full name from Google; email is the fallback */}
          {user.displayName || user.email}
        </span>

        <button className="navbar-logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
