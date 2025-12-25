// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-API-COURSES
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-23T06:00:00Z

import { auth } from "@repo/auth";
import { NextResponse } from "next/server";
import { studentService } from "@repo/backend";

const __FP_SIG = "FP-20251223-US-API-COURSES|HASH-PLACEHOLDER";

/**
 * GET /api/student/courses
 * Fetches the courses the student is currently enrolled in.
 * Supports filtering by semester and year.
 * Requires "student" role.
 *
 * @param req - The request object (can contain query params)
 * @returns JSON response with list of courses
 */

export async function GET(req: Request) {
  // 1. Authenticate Session
  const session = await auth();

  // 2. Role Verification
  if (!session || !session.user || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3. Parse Query Parameters
  const { searchParams } = new URL(req.url);
  const semester = searchParams.get("semester");
  const year = searchParams.get("year");

  try {
    const email = session.user.email;
    if (!email)
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );

    // 4. Data Fetching via Service
    const filters: any = {};
    if (semester) filters.semester = parseInt(semester);
    if (year) filters.year = year;

    const courses = await studentService.getCourses(email, filters);

    if (!courses) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Failed to fetch courses", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
