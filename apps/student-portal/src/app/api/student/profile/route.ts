// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-API-PROFILE
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:05:00Z

import { auth } from "@repo/auth";
import { NextResponse } from "next/server";
import { studentService } from "@repo/backend";

const __FP_SIG = "FP-20251223-US-API-PROFILE|HASH-PLACEHOLDER";

/**
 * GET /api/student/profile
 * Fetches the currently logged-in student's profile information.
 * Requires "student" role.
 *
 * @param req - The request object
 * @returns JSON response with profile data or error
 */

export async function GET(req: Request) {
  // 1. Authenticate the session
  const session = await auth();

  // 2. Authorization Check: Ensure user is logged in and has 'student' role
  if (!session || !session.user || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 3. User Identification
    const email = session.user.email;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 400 }
      );
    }

    // 4. Data Fetching via Service
    const userProfile = await studentService.getProfile(email);

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 5. Response Formatting
    return NextResponse.json({
      id: userProfile.id,
      fullName: userProfile.fullName,
      email: userProfile.email,
      gpa: userProfile.gpa,
      degreeProgram: userProfile.degreeProgram,
      academicYear: userProfile.academicYear,
    });
  } catch (error) {
    console.error("Failed to fetch profile", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
