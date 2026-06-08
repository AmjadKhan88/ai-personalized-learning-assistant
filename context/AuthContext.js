// context/AuthContext.js
// ─────────────────────────────────────────────────────────────
// WHY: A React Context wrapping the whole app lets any component
// call `useAuth()` to get the current user without prop-drilling.
// It's also the single place that listens to Firebase auth state —
// one listener, not one per component.
// ─────────────────────────────────────────────────────────────

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // `loading` prevents the login page from flashing before Firebase
  // has a chance to confirm the user is already signed in.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase calls this immediately with the cached user (if any),
    // then again whenever auth state changes (login/logout).
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Cleanup: unsubscribe when the provider unmounts (e.g., during tests)
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook for consuming auth state anywhere in the app.
 * Usage: const { user, loading } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
