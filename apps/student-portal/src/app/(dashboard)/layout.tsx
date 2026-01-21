// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-V2W3X4
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-23T00:30:00Z

/**
 * DashboardLayout
 * The root layout for the dashboard section of the application.
 * Wraps all dashboard pages with the DashboardShell to provide consistent navigation and structure.
 *
 * Usage:
 *     Provided automatically by Next.js routing for (dashboard) group.
 */

import DashboardShell from "../../components/dashboard/DashboardShell";
import { auth } from "@repo/auth";
import {
  studentService,
  StudentProfileDTO,
  BorrowedBookDTO,
} from "@repo/backend";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";

// const __FP_SIG = "FP-20251223-US-V2W3X4|HASH-PLACEHOLDER";

/**
 * Layout wrapper for dashboard routes.
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child pages/components
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  let profile: StudentProfileDTO | null = null;
  let borrowedBooks: BorrowedBookDTO[] = [];
  let apiError: string | undefined;

  try {
    [profile, borrowedBooks] = await Promise.all([
      api.execute(() => studentService.getProfile(session.user.email!)),
      api.execute(() => studentService.getBorrowedBooks(session.user.email!)),
    ]);
  } catch (error) {
    console.error("[DashboardLayout] Data Fetch Error:", error);
    // ApiClient ensures 'error.message' is safe for users
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiError = (error as any).message;
  }

  const pendingBooksCount = borrowedBooks.filter((b) => {
    const s = b.status?.toLowerCase();
    return s === "borrowed" || s === "overdue";
  }).length;

  const user = {
    name: profile?.fullName || session.user.name || "Student",
    course: profile?.degreeProgram || "Student Portal",
  };

  return (
    <DashboardShell
      user={user}
      pendingBooksCount={pendingBooksCount}
      apiError={apiError}
      logoutBaseUrl={process.env.NEXT_PUBLIC_WSO2_LOGOUT_URL}
    >
      {children}
    </DashboardShell>
  );
}
