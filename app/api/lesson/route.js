// app/api/lesson/route.js
// ─────────────────────────────────────────────────────────────
// WHY: NEVER call Gemini (or any AI API) from the client/browser.
// Your API key would be visible in the Network tab to any user.
// Instead: browser → this Next.js API route → Gemini.
// The key lives only on the server inside process.env.
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

// 🔑 WHERE TO ADD YOUR KEY:
// In .env.local:  GEMINI_API_KEY=your_key_here
// Note: No NEXT_PUBLIC_ prefix — this is server-only. Good.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request) {
  try {
    const { topic, level = "beginner" } = await request.json();

    // Basic input validation — never trust client data
    if (!topic || typeof topic !== "string" || topic.length > 200) {
      return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
    }

    const prompt = `
      You are an expert tutor. Generate a concise, engaging lesson on: "${topic}"
      for a ${level} learner.

      Structure your response as JSON with these keys:
      {
        "title": "Lesson title",
        "summary": "2-3 sentence overview",
        "sections": [
          { "heading": "...", "content": "..." }
        ],
        "keyPoints": ["point 1", "point 2", "point 3"],
        "quiz": [
          { "question": "...", "options": ["a","b","c","d"], "answer": "a" }
        ]
      }

      Return only valid JSON, no markdown fences.
    `;

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const geminiData = await geminiRes.json();
    const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let lesson;
    try {
      lesson = JSON.parse(raw);
    } catch {
      // If Gemini wraps in markdown fences despite instructions, strip them
      const cleaned = raw.replace(/```json|```/g, "").trim();
      lesson = JSON.parse(cleaned);
    }

    return NextResponse.json({ lesson });
  } catch (err) {
    console.error("Lesson generation error:", err);
    // 🔒 SECURITY: Never leak internal error messages to the client
    return NextResponse.json({ error: "Failed to generate lesson" }, { status: 500 });
  }
}
