// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-V6W7X8
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T17:45:00Z

const __FP_SIG = "FP-20251222-US-V6W7X8|HASH-PLACEHOLDER";

import { signOut } from "@repo/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  await signOut({ redirect: false });
  // Use the configured external URL as the base, or fallback to request URL
  const baseUrl = process.env.NEXT_PUBLIC_LIBRARY_URL || req.url;
  return NextResponse.redirect(new URL("/login", baseUrl));
}
