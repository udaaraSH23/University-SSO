// Author: System
// Project: University-Portal
// FP-ID: FP-20251225-SP-793842
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T10:55:00Z

import { auth } from "@repo/auth";
import { studentService } from "@repo/backend";
import { redirect } from "next/navigation";
import ProfileView from "../../../components/dashboard/profile/ProfileView";
import { DashboardHeader } from "@repo/ui";

const __FP_SIG = "FP-20251225-SP-793842|HASH-PLACEHOLDER";

/**
 * Server Component: Profile Page
 *
 * Displays the student's full profile information.
 * Uses the ProfileView component to render the details.
 */
export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const profile = await studentService.getProfile(session.user.email);

  return (
    <div className="min-h-screen pb-12">
      <DashboardHeader
        title="Profile"
        description="View your profile information."
        breadcrumb={[{ label: "Profile" }]}
      />
      <ProfileView profile={profile} />
    </div>
  );
}
