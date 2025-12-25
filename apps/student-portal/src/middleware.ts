// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251220-US-f6g7h8
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:30:00Z

import { auth } from "@repo/auth";
import { NextResponse } from "next/server";

const __FP_SIG = "FP-20251220-US-f6g7h8|HASH-PLACEHOLDER";
const STUDENT_portal_URL =
  process.env.NEXT_PUBLIC_STUDENT_URL || "http://localhost:3000";
const LIBRARY_PORTAL_URL =
  process.env.NEXT_PUBLIC_LIBRARY_URL || "http://localhost:3001";
const ADMIN_PORTAL_URL =
  process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002";

/**
 * Student Portal Middleware.
 * Enforces role-based access control.
 */
export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const userRole = req.auth?.user?.role;

  // 1. Redirect to login if not authenticated
  if (
    !isAuthenticated &&
    nextUrl.pathname !== "/login" &&
    !nextUrl.pathname.startsWith("/auth/")
  ) {
    return NextResponse.redirect(new URL("/login", nextUrl.origin));
  }

  // 2. Redirect authenticated users to their specific portal if role mismatches
  if (
    isAuthenticated &&
    nextUrl.pathname !== "/login" &&
    !nextUrl.pathname.startsWith("/auth/")
  ) {
    if (userRole === "librarian") {
      return NextResponse.redirect(
        new URL(
          `/auth/redirect?to=${encodeURIComponent(LIBRARY_PORTAL_URL)}`,
          nextUrl.origin
        )
      );
    }
    if (userRole === "admin") {
      return NextResponse.redirect(
        new URL(
          `/auth/redirect?to=${encodeURIComponent(ADMIN_PORTAL_URL)}`,
          nextUrl.origin
        )
      );
    }
    // If student, allow access (do nothing)
  }

  // 3. If on login page but authenticated, redirect to home
  if (isAuthenticated && nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
