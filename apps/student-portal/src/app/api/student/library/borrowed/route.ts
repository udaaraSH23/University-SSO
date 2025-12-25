// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-API-BORROWED
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:05:00Z

import { auth } from "@repo/auth";
import { NextResponse } from "next/server";
import { studentService } from "@repo/backend";

const __FP_SIG = "FP-20251223-US-API-BORROWED|HASH-PLACEHOLDER";

/**
 * GET /api/student/library/borrowed
 * Fetches the books currently borrowed by the student.
 * Requires "student" role.
 *
 * @param req - The request object
 * @returns JSON response with list of borrowed books
 */

export async function GET(req: Request) {
  // 1. Authenticate Session
  const session = await auth();

  // 2. Role Verification
  if (!session || !session.user || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const email = session.user.email;
    if (!email)
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );

    // 3. Data Fetching via Service
    const books = await studentService.getBorrowedBooks(email);

    if (!books) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(books);
  } catch (error) {
    console.error("Failed to fetch borrowed books", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
