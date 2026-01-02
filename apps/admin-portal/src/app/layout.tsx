// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-ADMIN4
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-30T18:36:05+05:30

const __FP_SIG = "FP-20251230-US-ADMIN4|HASH-PLACEHOLDER";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeToggle, DeleteConfirmationProvider } from "@repo/ui";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "University Admin Portal",
  description: "Administrative dashboard for University Portal",
};

/**
 * Root Layout
 *
 * Top-level layout for the admin application.
 * Defines global fonts, providers, theme toggle, and basic structure.
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
          <DeleteConfirmationProvider>
            <ThemeToggle />
            <Toaster />
            {children}
          </DeleteConfirmationProvider>
        </Providers>
      </body>
    </html>
  );
}
