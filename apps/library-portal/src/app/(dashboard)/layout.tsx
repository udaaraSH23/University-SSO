// Author: Antigravity
// Project: University-Portal
// FP-ID: FP-20251225-AG-LIB-LAYOUT
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T13:30:00Z

// Author: Antigravity

import DashboardShell from "../../components/dashboard/DashboardShell";
import { auth } from "@repo/auth";
import { adminService } from "@repo/backend";
import { redirect } from "next/navigation";

const __FP_SIG = "FP-20251225-AG-LIB-LAYOUT|HASH-PLACEHOLDER";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/login");
  }

  // Fetch admin/staff profile
  let user = {
    name: session.user.name || "Admin",
    role: "Library Manager",
  };

  try {
    const profile = await adminService.getProfile(session.user.email);
    user = {
      name: profile.fullName,
      role: profile.staffType,
    };
  } catch (error) {
    console.error("Failed to fetch admin profile:", error);
    // Fallback usage is already set
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
