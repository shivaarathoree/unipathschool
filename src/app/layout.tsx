import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "UNIPATH SCHOOL - AI Career Infrastructure",
  description:
    "UNIPATH SCHOOL uses AI to help students discover the right career, build the exact skills companies expect, and prepare for real interviews.",
  keywords: ["AI", "career", "students", "interview prep", "skill gap", "job ready"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen flex flex-col overflow-x-hidden antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
