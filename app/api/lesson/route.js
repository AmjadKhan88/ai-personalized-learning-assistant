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
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const LESSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          content: { type: "string" },
        },
        required: ["heading", "content"],
      },
    },
    keyPoints: {
      type: "array",
      items: { type: "string" },
    },
    quiz: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: {
            type: "array",
            items: { type: "string" },
          },
          answer: { type: "string" },
        },
        required: ["question", "options", "answer"],
      },
    },
  },
  required: ["title", "summary", "sections", "keyPoints", "quiz"],
};

function parseLessonJson(raw) {
  if (!raw) {
    throw new Error("Gemini returned an empty response");
  }

  const cleaned = raw
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Gemini response did not contain a JSON object");
    }

    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

export async function POST(request) {
  try {
    if (!GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY");
      return NextResponse.json({ error: "AI service is not configured" }, { status: 500 });
    }

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

      Return only valid JSON. The quiz answer must exactly match one of its options.
    `;

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 3000,
          responseMimeType: "application/json",
          responseJsonSchema: LESSON_SCHEMA,
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
    const lesson = parseLessonJson(raw);

    return NextResponse.json({ lesson });
  } catch (err) {
    console.error("Lesson generation error:", err);
    // 🔒 SECURITY: Never leak internal error messages to the client
    return NextResponse.json({ error: "Failed to generate lesson" }, { status: 500 });
  }
}
