// lib/progress.js
// ─────────────────────────────────────────────────────────────
// WHY: All Firestore reads/writes go through this file, not
// scattered in components. If we ever switch databases or add
// caching, there's exactly one file to update.
//
// DATA SHAPE in Firestore:
//   users/{uid}/progress/{topic}
//   {
//     topic: string,
//     completedAt: Timestamp,
//     score: number,        // quiz score 0-100
//     weakAreas: string[]   // topics the user got wrong
//   }
// ─────────────────────────────────────────────────────────────

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Save or update progress for a completed lesson.
 * Uses setDoc with merge:true so re-attempting a topic updates, not duplicates.
 */
export async function saveProgress(uid, topic, score) {
  const ref = doc(db, "users", uid, "progress", topic);
  await setDoc(
    ref,
    {
      topic,
      score,
      completedAt: serverTimestamp(),
      // Keep the highest score if they retry
      // NOTE: Firestore doesn't support conditional writes without transactions.
      // For now we overwrite; add a transaction here if you need "keep best score".
    },
    { merge: true }
  );
}

/**
 * Add a topic to the user's weak areas list.
 * arrayUnion ensures no duplicates automatically.
 */
export async function addWeakArea(uid, topic) {
  const ref = doc(db, "users", uid, "stats");
  await setDoc(
    ref,
    { weakAreas: arrayUnion(topic) },
    { merge: true }
  );
}

/**
 * Fetch all completed topics and their scores for the dashboard.
 * Returns: [{ topic, score, completedAt }]
 */
export async function getAllProgress(uid) {
  const colRef = collection(db, "users", uid, "progress");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Fetch the user's weak areas list for the tracker widget.
 */
export async function getWeakAreas(uid) {
  const ref = doc(db, "users", uid, "stats");
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  return snap.data().weakAreas || [];
}

// 🔒 SECURITY REMINDER (for teammates):
// This code runs in the browser, so it uses the client-side Firestore SDK.
// Access control lives in your Firestore Security Rules, NOT here.
// Make sure your rules look something like:
//
//   match /users/{uid}/{document=**} {
//     allow read, write: if request.auth != null && request.auth.uid == uid;
//   }
//
// This ensures users can ONLY read/write their own data.
