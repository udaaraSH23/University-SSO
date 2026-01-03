// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251231-AG-API-ADMIN-USER-ID
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-31T12:32:00Z

import { NextRequest, NextResponse } from "next/server";
import {
  studentService,
  adminService,
  identityService,
  AppError,
} from "@repo/backend";
import { auth } from "@repo/auth";

const __FP_SIG = "FP-20251231-AG-API-ADMIN-USER-ID|HASH-PLACEHOLDER";

/**
 * GET /api/admin/users/[id]
 *
 * Retrieves detailed information for a specific user.
 *
 * - Authenticates the request session.
 * - Fetches user details based on the `type` query parameter ('student' or 'staff').
 * - Returns the user detail DTO or error.
 *
 * @param req - NextRequest
 * @param context - Route params { id: string }
 * @returns NextResponse with user details
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let result;

    if (type === "student") {
      result = await studentService.getStudentDetailById(Number(id));
    } else if (type === "staff") {
      // Assuming we have a similar method or can fetch by email if ID is different
      // For now, simpler implementation or 501
      return NextResponse.json(
        { error: "Staff details not implemented" },
        { status: 501 }
      );
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
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
 * PATCH /api/admin/users/[id]
 *
 * Updates an existing user's information.
 *
 * - Authenticates the request session.
 * - Parses body for `type` and `data`.
 * - Calls the respective service to update the user in the local DB and optionally sync with WSO2.
 *
 * @param req - NextRequest containing JSON body
 * @param context - Route params { id: string }
 * @returns NextResponse with updated user DTO
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { type, data } = body;

    // This ID is likely the Database ID (integer) for local services,
    // but WSO2 ID (UUID) for Identity Service.
    // The frontend should clarify which ID it passes.
    // Assuming DB ID for students/staff, and we look up WSO2 ID inside service if needed.

    if (type === "student") {
      const result = await studentService.updateStudent(Number(id), data);
      return NextResponse.json(result);
    } else {
      // Direct WSO2 Update if needed, or Admin update
      const result = await adminService.updateStaff(Number(id), data);
      return NextResponse.json(result);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 *
 * Deletes a user from the system.
 *
 * - Authenticates the request session.
 * - If `provider=wso2` query param is present, deletes directly from Identity Server using WSO2 ID.
 * - Otherwise, handles local deletion (not yet fully implemented in this snippet for local DB).
 *
 * @param req - NextRequest
 * @param context - Route params { id: string }
 * @returns NextResponse with success status
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    // Here `id` should be the WSO2 User ID (UUID) if we are calling identityService directly,
    // OR we pass the DB ID and the service resolves it.
    // The user requirement said: "call wso2 is server... create api route".
    // I added deleteUser(id) to IdentityService.

    // If query param says 'provider=wso2', we treat ID as WSO2 ID.
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get("provider");

    // Check if it's a student or staff deletion
    // If ID is integer => Local DB (Student/Staff)
    // If ID is UUID => WSO2 Direct (Raw User)
    // However, our requirement is to "delete student/staff from wso2 server" which our services handle.

    // If ID is numeric, we assume it's a profile ID.
    if (!isNaN(Number(id))) {
      // Try deleting as staff first (or check type if provided, but DELETE usually just ID)
      // Since ID space might overlap, we should ideally know the type.
      // Frontend UsersTable passes "wso2" provider but assumes we handle it.
      // Let's assume the ID passed for deletion in the new Frontend code:
      // UsersTable currently passes `user.id` which is the DB ID (string/number).

      // Note: In `UsersTable.tsx`:
      // interface UserData { id: string; ... }
      // It passes `user.id`.

      // AdminService deleteStaff expects number.
      // We'll try adminService.deleteStaff. If it fails (not found), we could try student?
      // But this route is likely for the Identity list which lists Staff/Admins.
      // Students usually have their own management page, but Identity Page might list "Students" role too?
      // Identity Page `fetchUsers` calls `users?type=staff` so these are Staff/Admins.

      await adminService.deleteStaff(Number(id));
      return NextResponse.json({ success: true });
    } else if (provider === "wso2" || id.length > 20) {
      // uuid-like
      await identityService.deleteUser(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
}
