// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-ADMIN1
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-30T18:31:05+05:30

const __FP_SIG = "FP-20251230-US-ADMIN1|HASH-PLACEHOLDER";

import DashboardShell from "../../components/dashboard/DashboardShell";
import { auth } from "@repo/auth";
import { redirect } from "next/navigation";
import { adminService } from "@repo/backend";
import { api } from "../../lib/api";

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

  let user = {
    name: session.user.name || "Administrator",
    course: "University Admin",
    image: session.user.image || undefined,
  };

  let apiError: string | undefined;

  try {
    const profile = await api.execute(() =>
      adminService.getProfile(session.user.email!)
    );
    user = {
      ...user,
      name: profile.fullName,
      course: profile.staffType, // Mapping staffType to subtitle
    };
  } catch (error: any) {
    console.error("Failed to fetch admin profile:", error);
    apiError = error.message;
  }

  return (
    <DashboardShell user={user} apiError={apiError}>
      {children}
    </DashboardShell>
  );
}
