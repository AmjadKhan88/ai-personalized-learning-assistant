// app/layout.js
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "AI Tutor",
  description: "Personalized AI-powered learning — powered by Gemini",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}