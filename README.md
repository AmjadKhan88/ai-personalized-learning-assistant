# 🎓 AI Tutor

> A personalized, AI-powered learning platform built with **Next.js 14**, **Firebase**, and **Gemini 1.5 Flash** — featuring dynamic lesson generation, interactive quizzes, Q&A chat, progress tracking, and a full dark/light theme system.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-10-orange?style=for-the-badge&logo=firebase)
![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-blue?style=for-the-badge&logo=google)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwindcss)
![License: GPL v3](https://img.shields.io/badge/License-GPLv3-green?style=for-the-badge&logo=gnu)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Firebase Setup](#-firebase-setup)
- [Running Locally](#-running-locally)
- [Deployment](#-deployment-vercel)
- [Architecture & Data Flow](#-architecture--data-flow)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**AI Tutor** is a full-stack web application that uses Google's Gemini AI to generate personalized lessons on any topic. Users sign in with Google, pick a topic, receive a structured AI-generated lesson with a quiz, chat with an AI tutor for follow-up questions, and have their progress and weak areas automatically tracked in Firestore.

The project was built entirely solo as a self-taught full-stack developer project, demonstrating production-level patterns: server-side AI key protection, Firebase auth + Firestore, a responsive Tailwind UI, and dark/light theme persistence.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Google Authentication** | One-click sign-in via Firebase OAuth — no passwords |
| 🤖 **AI Lesson Generation** | Gemini 1.5 Flash generates structured lessons: sections, key points, and quiz |
| 🧠 **Interactive Quiz** | Multiple-choice quiz with instant feedback and scoring |
| 💬 **AI Chat Tutor** | Ask follow-up questions mid-lesson with full conversation history |
| 📊 **Progress Tracking** | Quiz scores saved to Firestore per user, per topic |
| ⚠️ **Weak Areas Tracker** | Automatically surfaces topics the user struggled with |
| 🌙 **Dark / Light Theme** | System-preference aware, persisted to localStorage |
| 📱 **Responsive Layout** | Mobile-first sidebar with overlay drawer on small screens |
| 🔒 **Secure API Routes** | Gemini API key is server-only — never exposed to the browser |

---

## 🛠 Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** — App Router, server components, API routes
- **[Tailwind CSS 3](https://tailwindcss.com/)** — Utility-first styling with `darkMode: "class"`
- **[Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)** — Primary typeface (Google Fonts)

### Backend / Services
- **[Firebase Authentication](https://firebase.google.com/docs/auth)** — Google OAuth provider
- **[Cloud Firestore](https://firebase.google.com/docs/firestore)** — User progress and weak areas storage
- **[Gemini 1.5 Flash API](https://ai.google.dev/)** — Lesson generation and chat responses

### Architecture
- **Next.js API Routes** — Proxy layer between browser and Gemini (key protection)
- **React Context** — `AuthContext` (user state) + `ThemeContext` (dark/light)
- **Server Components + Client Components** — Mixed rendering per Next.js App Router patterns

---

## 📁 Project Structure

```
ai-tutor/
│
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root layout — AuthProvider + ThemeProvider
│   ├── page.js                   # Root redirect (→ /login or /dashboard)
│   ├── globals.css               # Tailwind directives + base styles
│   │
│   ├── login/
│   │   └── page.js               # Google sign-in page
│   │
│   ├── dashboard/
│   │   └── page.js               # Main app — wires all components + data flow
│   │
│   └── api/
│       ├── lesson/
│       │   └── route.js          # POST /api/lesson → Gemini → lesson JSON
│       └── chat/
│           └── route.js          # POST /api/chat → Gemini → reply string
│
├── components/
│   ├── Navbar.js                 # Sticky header: user info, logout, theme toggle
│   ├── TopicSelector.js          # Sidebar: topic list with completion indicators
│   ├── LessonDisplay.js          # Lesson sections, key points, quiz
│   ├── ChatInterface.js          # Conversational Q&A with typing indicator
│   └── WeakAreasTracker.js       # Remediation widget for missed quiz topics
│
├── context/
│   ├── AuthContext.js            # Firebase auth state → useAuth() hook
│   └── ThemeContext.js           # Dark/light toggle → useTheme() hook
│
├── lib/
│   ├── firebase.js               # Firebase init, signInWithGoogle, logOut
│   └── progress.js               # Firestore helpers: saveProgress, getWeakAreas, etc.
│
├── tailwind.config.js            # darkMode: "class", brand colors, custom animations
├── jsconfig.json                 # @/ import alias
├── .env.example                  # Template for environment variables
└── .env.local                    # Your actual keys — never committed
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine:

```bash
node --version    # v18.17 or higher required
npm --version     # v9 or higher
git --version     # any recent version
```

Download Node.js LTS from [nodejs.org](https://nodejs.org) if needed.

---

### Installation

**1. Create a new Next.js 14 project**

```bash
npx create-next-app@14 ai-tutor
cd ai-tutor
```

Answer the prompts as follows:

```
✔ TypeScript?           → No
✔ ESLint?               → Yes
✔ Tailwind CSS?         → Yes
✔ src/ directory?       → No
✔ App Router?           → Yes   ← critical
✔ Customize alias?      → No
```

**2. Install dependencies**

```bash
npm install firebase
```

**3. Create the folder structure**

```bash
mkdir -p app/login app/dashboard app/api/lesson app/api/chat
mkdir -p components context lib
```

**4. Copy project files**

Replace the default files and add new ones according to this map:

| Source File | Destination |
|---|---|
| `lib/firebase.js` | `ai-tutor/lib/firebase.js` |
| `lib/progress.js` | `ai-tutor/lib/progress.js` |
| `context/AuthContext.js` | `ai-tutor/context/AuthContext.js` |
| `context/ThemeContext.js` | `ai-tutor/context/ThemeContext.js` |
| `app/layout.js` | `ai-tutor/app/layout.js` *(replace)* |
| `app/page.js` | `ai-tutor/app/page.js` *(replace)* |
| `app/globals.css` | `ai-tutor/app/globals.css` *(replace)* |
| `app/login/page.js` | `ai-tutor/app/login/page.js` |
| `app/dashboard/page.js` | `ai-tutor/app/dashboard/page.js` |
| `app/api/lesson/route.js` | `ai-tutor/app/api/lesson/route.js` |
| `app/api/chat/route.js` | `ai-tutor/app/api/chat/route.js` |
| `components/Navbar.js` | `ai-tutor/components/Navbar.js` |
| `components/TopicSelector.js` | `ai-tutor/components/TopicSelector.js` |
| `components/LessonDisplay.js` | `ai-tutor/components/LessonDisplay.js` |
| `components/ChatInterface.js` | `ai-tutor/components/ChatInterface.js` |
| `components/WeakAreasTracker.js` | `ai-tutor/components/WeakAreasTracker.js` |
| `tailwind.config.js` | `ai-tutor/tailwind.config.js` *(replace)* |

**5. Verify the `@/` import alias**

Open or create `jsconfig.json` in the project root:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

### Environment Variables

Create a `.env.local` file in the project root (never commit this file):

```env
# ── Gemini AI — server-only, never expose to browser ──────────
GEMINI_API_KEY=your_gemini_api_key_here

# ── Firebase — public config, safe to expose ──────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

> ⚠️ `GEMINI_API_KEY` has **no** `NEXT_PUBLIC_` prefix intentionally. It is server-only and never reaches the browser. Firebase keys are public config — they're protected by Firestore Security Rules, not by being secret.

Get your keys:
- **Gemini API key** → [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Firebase config** → [Firebase Console](https://console.firebase.google.com) → Project Settings → Your Apps

---

## 🔥 Firebase Setup

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. **Add project** → name it → disable Google Analytics → **Create**

### 2. Register a Web App
1. Click the `</>` (Web) icon on the project dashboard
2. Nickname: `ai-tutor-web` → **Register app**
3. Copy the `firebaseConfig` object values into your `.env.local`

### 3. Enable Google Authentication
1. **Build → Authentication → Get started**
2. **Sign-in providers → Google → Enable**
3. Add a support email → **Save**

### 4. Create Firestore Database
1. **Build → Firestore Database → Create database**
2. Choose **Production mode**
3. Select a region (e.g., `asia-south1`)

### 5. Set Firestore Security Rules

Navigate to **Firestore → Rules** and replace all content with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == uid;
    }
  }
}
```

Click **Publish**. This ensures each user can only read and write their own data.

---

## 💻 Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Expected flow:**
1. Root `/` redirects to `/login`
2. Click **Continue with Google** → Firebase OAuth popup
3. After sign-in → redirects to `/dashboard`
4. Pick a topic → Gemini generates a lesson
5. Complete the quiz → score saved to Firestore
6. Chat with the AI tutor in the panel below
7. Weak areas appear in the sidebar automatically

---

## ☁️ Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial AI tutor app"
git remote add origin https://github.com/YOUR_USERNAME/ai-tutor.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. **Do not deploy yet** — add environment variables first

### 3. Add Environment Variables

In the Vercel import screen, expand **Environment Variables** and add all 7 variables from your `.env.local`. Set each for **Production + Preview + Development**.

### 4. Deploy

Click **Deploy**. Vercel builds and provides a URL like `https://ai-tutor-xxxx.vercel.app`.

### 5. Add Vercel Domain to Firebase

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. **Add domain** → paste your Vercel URL (without `https://`)
3. **Save**

---

## 🏗 Architecture & Data Flow

```
[Browser]
   │
   │  1. Google OAuth popup
   ▼
[Firebase Auth] ──► AuthContext (user state, uid)
   │
   │  2. User picks a topic
   ▼
[Dashboard Page]
   │
   ├──► POST /api/lesson { topic }          ← server route
   │         │
   │         ▼
   │    [Gemini 1.5 Flash]  (GEMINI_API_KEY stays server-side)
   │         │
   │         ▼
   │    lesson JSON → LessonDisplay component
   │
   ├──► POST /api/chat { messages, topic }  ← server route
   │         │
   │         ▼
   │    [Gemini 1.5 Flash]
   │         │
   │         ▼
   │    reply string → ChatInterface component
   │
   └──► Firestore (progress, weakAreas)     ← client SDK
             │
             ▼
        WeakAreasTracker + progress bar
```

---

## 🔒 Security

| Concern | Mitigation |
|---|---|
| AI API key exposure | `GEMINI_API_KEY` is server-only — no `NEXT_PUBLIC_` prefix, never reaches the browser |
| Unauthorized Firestore access | Security Rules enforce `request.auth.uid == uid` on all user documents |
| API route abuse | Input validation on `/api/lesson` and `/api/chat`; error messages sanitized before returning to client |
| Auth bypass | `useEffect` auth guards on dashboard redirect unauthenticated users; `loading` state prevents flash |
| Secrets in version control | `.env.local` is in `.gitignore`; `.env.example` contains no real values |

> **Recommended for production:** Add rate limiting to `/api/lesson` and `/api/chat` using [Upstash Redis](https://upstash.com/) + `@upstash/ratelimit` to prevent unexpected Gemini API billing.

---

## 🗺 Roadmap

- [ ] **Streaming responses** — Word-by-word lesson text via Gemini streaming API
- [ ] **Difficulty levels** — Beginner / Intermediate / Advanced selector
- [ ] **Progress charts** — Quiz score history visualized with Recharts
- [ ] **Streak tracking** — Consecutive daily lessons tracked in Firestore
- [ ] **Rate limiting** — Upstash Redis on API routes
- [ ] **Spaced repetition** — Auto-resurface weak areas after N days
- [ ] **Topic search** — Dynamic subtopics generated by Gemini
- [ ] **Mobile app** — Capacitor.js wrapper for iOS/Android

---

## 🤝 Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feat/your-feature-name`
5. Open a Pull Request

Please follow the existing code style and include comments explaining *why*, not just *what*.

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0**.
See the [LICENSE](./LICENSE) file for full terms.

---

<div align="center">

Built with ❤️ by **Amjad** — [@AgentCode](https://youtube.com/@AgentCode)

*Self-taught. Full-stack. Building toward agentic AI.*

</div>