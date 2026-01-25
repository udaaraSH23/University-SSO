// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-F8G9H0
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:05:00Z

const __FP_SIG = "FP-20251222-US-F8G9H0|HASH-PLACEHOLDER";

import { signOut } from "@repo/auth";
import { NextResponse } from "next/server";

/**
 * GET /auth/logout-callback
 *
 * Handles the callback after a federated logout.
 * Clears the local session and redirects to the home page or error page.
 *
 * @param req - The request object.
 * @returns JSON response redirect.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  await signOut({ redirect: false });
  // Use the configured external URL as the base, or fallback to request URL
  const baseUrl = process.env.NEXT_PUBLIC_STUDENT_URL || req.url;
  return NextResponse.redirect(new URL("/", baseUrl));
}
