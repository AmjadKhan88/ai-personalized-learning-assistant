// app/login/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  // If already logged in, skip login page
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  async function handleGoogleSignIn() {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
      // AuthContext detects the login → useEffect above fires → redirects to /dashboard
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Sign-in failed. Please try again.");
    } finally {
      setSigningIn(false);
    }
  }

  // Don't flash the login UI while Firebase is checking existing session
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#f5f5f5"
    }}>
      <div style={{
        background: "white",
        padding: "2.5rem",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        textAlign: "center",
        width: "100%",
        maxWidth: "380px"
      }}>
        {/* Branding */}
        <div style={{ marginBottom: "2rem" }}>
          <span style={{ fontSize: "3rem" }}>🎓</span>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "700", margin: "0.5rem 0 0.25rem" }}>
            AI Tutor
          </h1>
          <p style={{ color: "#666", fontSize: "0.95rem" }}>
            Your Gemini-powered learning companion
          </p>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={signingIn}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "0.75rem 1.25rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: signingIn ? "#f9f9f9" : "white",
            cursor: signingIn ? "not-allowed" : "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            color: "#333",
            transition: "background 0.2s"
          }}
        >
          {signingIn ? (
            "Signing in…"
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </button>

        {/* Error message */}
        {error && (
          <p style={{ color: "red", marginTop: "1rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}

        <p style={{ color: "#aaa", fontSize: "0.8rem", marginTop: "1.5rem" }}>
          Your progress is saved securely to Firestore.
        </p>
      </div>
    </main>
  );
}

// Inline Google "G" SVG icon
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}