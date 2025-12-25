// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-API-GRADES
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-23T06:00:00Z

import { auth } from "@repo/auth";
import { NextResponse } from "next/server";
import { studentService } from "@repo/backend";

const __FP_SIG = "FP-20251223-US-API-GRADES|HASH-PLACEHOLDER";

/**
 * GET /api/student/grades
 * Fetches the student's grade history grouped by course.
 * Requires "student" role.
 *
 * @param req - The request object
 * @returns JSON response with list of grades
 */

export async function GET(req: Request) {
  // 1. Authenticate Session
  const session = await auth();

  // 2. Role Verification
  if (!session || !session.user || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 3. User Lookup
    const email = session.user.email;
    if (!email)
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );

    // 4. Data Fetching via Service
    const grades = await studentService.getGrades(email);

    if (!grades) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(grades);
  } catch (error) {
    console.error("Failed to fetch grades", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
