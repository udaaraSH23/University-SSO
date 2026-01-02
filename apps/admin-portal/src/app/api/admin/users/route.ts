// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251231-AG-API-ADMIN-USERS
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-31T12:31:00Z

import { NextRequest, NextResponse } from "next/server";
import { studentService, adminService, AppError } from "@repo/backend";
import { auth } from "@repo/auth";

const __FP_SIG = "FP-20251231-AG-API-ADMIN-USERS|HASH-PLACEHOLDER";

/**
 * POST /api/admin/users
 *
 * Creates a new user in the system. Handles both 'student' and 'staff' types.
 *
 * - Authenticates the request session.
 * - Delegates to `studentService` or `adminService` based on `type`.
 * - Returns the created user profile or explicit error messages.
 *
 * @param req - NextRequest containing JSON body { type: 'student'|'staff', data: ... }
 * @returns NextResponse with created user DTO or error
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, data } = body;

    let result;

    if (type === "student") {
      result = await studentService.createStudent(data);
    } else if (type === "staff") {
      result = await adminService.createStaff(data);
    } else {
      return NextResponse.json(
        { error: "Invalid user type. Must be 'student' or 'staff'." },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/users
 *
 * Retrieves a paginated list of users. Currently supports filtering for students.
 *
 * - Authenticates the request session.
 * - Parses query parameters for pagination (page, limit), sorting, and filters (search, degreeProgramId).
 * - Delegates to the appropriate service based on `type`.
 *
 * @param req - NextRequest with URL search params
 * @returns NextResponse with paginated list or error
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || undefined;
    const degreeProgramId = searchParams.get("degreeProgramId")
      ? Number(searchParams.get("degreeProgramId"))
      : undefined;

    let result;

    if (type === "student") {
      result = await studentService.getPaginatedStudents({
        page,
        limit,
        search,
        degreeProgramId,
      });
    } else if (type === "staff") {
      result = await adminService.getPaginatedStaff({
        page,
        limit,
        query: search,
      });
    } else {
      // Default to returning list of all users from Identity Provider could be an option,
      // but for this portal, we likely want application specific views.
      return NextResponse.json(
        { error: "Invalid or missing 'type' parameter" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
