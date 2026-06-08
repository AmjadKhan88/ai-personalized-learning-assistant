// app/layout.js
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

export const metadata = {
  title: "AI Tutor",
  description: "Personalized AI-powered learning — powered by Gemini",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        suppressHydrationWarning on <html> is needed because ThemeProvider
        adds the "dark" class client-side — without it Next.js throws a
        hydration mismatch warning (server renders without "dark", client adds it).
      */}
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}