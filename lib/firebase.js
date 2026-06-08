// lib/firebase.js
// ─────────────────────────────────────────────────────────────
// WHY: Centralizing Firebase setup here means one place to swap
// credentials or add new Firebase services later. Never import
// directly from "firebase/app" in your components.
// ─────────────────────────────────────────────────────────────

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔑 WHERE TO ADD YOUR KEYS:
// Create a .env.local file in the project root (never commit this file).
// These variables are safe to expose here because they're PUBLIC Firebase
// config — Firebase security comes from Firestore Rules, not hiding keys.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Prevent re-initializing Firebase on every hot reload in dev mode
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// ── Auth helpers ─────────────────────────────────────────────

/**
 * Opens Google sign-in popup and returns the Firebase user.
 * We use popup (not redirect) because it's simpler in Next.js App Router —
 * redirect-based auth needs extra handling for the callback URL.
 */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logOut() {
  await signOut(auth);
}
