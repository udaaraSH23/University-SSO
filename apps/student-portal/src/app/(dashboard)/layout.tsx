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
import { studentService } from "@repo/backend";
import { redirect } from "next/navigation";

const __FP_SIG = "FP-20251223-US-V2W3X4|HASH-PLACEHOLDER";

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

  if (!session || !session.user || !session.user.email) {
    return null; // or redirect, guarded by middleware
  }

  const profile = await studentService.getProfile(session.user.email);
  const borrowedBooks = await studentService.getBorrowedBooks(
    session.user.email
  );
  const pendingBooksCount = borrowedBooks.filter((b) => {
    const s = b.status?.toLowerCase();
    return s === "borrowed" || s === "overdue";
  }).length;

  const user = {
    name: profile?.fullName || session.user.name || "Student",
    course: profile?.degreeProgram || "Student Portal",
  };

  return (
    <DashboardShell user={user} pendingBooksCount={pendingBooksCount}>
      {children}
    </DashboardShell>
  );
}
