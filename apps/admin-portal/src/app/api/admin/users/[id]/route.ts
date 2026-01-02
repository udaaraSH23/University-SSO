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
      // For this task, let's keep it consistent
      return NextResponse.json({ error: "Not implemented" }, { status: 501 });
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

    if (provider === "wso2") {
      await identityService.deleteUser(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Specify provider=wso2 to delete from IDP directly" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
}
