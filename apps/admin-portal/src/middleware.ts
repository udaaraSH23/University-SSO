// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251220-US-h8i9j0
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T17:20:00Z

import { auth } from "@repo/auth";
import { NextResponse } from "next/server";

const __FP_SIG = "FP-20251220-US-h8i9j0|HASH-PLACEHOLDER";
const STUDENT_PORTAL_URL =
  process.env.NEXT_PUBLIC_STUDENT_URL || "http://localhost:3000";
const LIBRARY_PORTAL_URL =
  process.env.NEXT_PUBLIC_LIBRARY_URL || "http://localhost:3001";

/**
 * Admin Portal Middleware.
 * Enforces role-based access control.
 */
const PUBLIC_ROUTES = ["/login", "/auth"];

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // 1. Redirect to login if not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl.origin));
  }

  // 2. Handle authenticated users
  if (isAuthenticated) {
    // If on login page, redirect to dashboard
    if (nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/", nextUrl.origin));
    }

    // Role-based redirection for protected routes
    if (!isPublicRoute) {
      if (userRole === "student") {
        return NextResponse.redirect(
          new URL(
            `/auth/redirect?to=${encodeURIComponent(STUDENT_PORTAL_URL)}`,
            nextUrl.origin
          )
        );
      }
      if (userRole === "librarian") {
        return NextResponse.redirect(
          new URL(
            `/auth/redirect?to=${encodeURIComponent(LIBRARY_PORTAL_URL)}`,
            nextUrl.origin
          )
        );
      }
      // Allows "admin" role to proceed
    }
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
