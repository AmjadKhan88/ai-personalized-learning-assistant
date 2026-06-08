// app/api/chat/route.js
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request) {
  try {
    const { messages, topic } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const contents = [
      {
        role: "user",
        parts: [{ text: `You are a patient, encouraging tutor helping a student learn about "${topic || "general topics"}". Answer questions clearly and concisely. If the student is confused, use analogies.` }],
      },
      {
        role: "model",
        parts: [{ text: "Understood! I'm ready to help. What would you like to know?" }],
      },
      ...messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
    ];

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.6, maxOutputTokens: 600 },
      }),
    });

    if (!geminiRes.ok) {
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await geminiRes.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}