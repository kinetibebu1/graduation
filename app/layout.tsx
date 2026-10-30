import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyHabit — Focused Study Habit Tracker for Students",
  description:
    "A clean, focused daily study habit and focus tracker built for academic consistency and deep work.",
  keywords: [
    "study habits",
    "habit tracker",
    "student productivity",
    "focus tracker",
    "academic success",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8F9F6] text-[#20251F] selection:bg-[#6D896F]/20 selection:text-[#20251F]">
        {children}
      </body>
    </html>
  );
}
