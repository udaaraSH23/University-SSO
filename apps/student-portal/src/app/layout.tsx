// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-W9X0Y1
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:05:00Z

const __FP_SIG = "FP-20251222-US-W9X0Y1|HASH-PLACEHOLDER";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeToggle } from "@repo/ui";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Portal",
  description: "Student Control panel for school functions",
};

/**
 * Root Layout
 *
 * Top-level layout for the entire application.
 * Defines global fonts, providers, and basic structure.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeToggle />
          {children}
        </Providers>
      </body>
    </html>
  );
}
