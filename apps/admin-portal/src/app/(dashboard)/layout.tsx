// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-ADMIN1
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-30T18:31:05+05:30

const __FP_SIG = "FP-20251230-US-ADMIN1|HASH-PLACEHOLDER";

import DashboardShell from "../../components/dashboard/DashboardShell";
import { auth } from "@repo/auth";
import { redirect } from "next/navigation";

/**
 * Dashboard Layout
 *
 * Layout wrapper for the admin dashboard.
 * Enforces authentication and provides the dashboard shell structure.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components to render within the shell.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const user = {
    name: session.user.name || "Administrator",
    course: "University Admin",
    image: session.user.image || undefined,
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
