// Author: System
// Project: University-Portal
// FP-ID: FP-20251225-SP-793842
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T10:55:00Z

import { auth } from "@repo/auth";
import { studentService } from "@repo/backend";
import { redirect } from "next/navigation";
import ProfileView from "../../../components/dashboard/profile/ProfileView";
import { Home } from "lucide-react";

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
      <header className="flex items-center justify-between mb-8 pt-6">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-1">
            <Home className="w-4 h-4" />
            <span>/</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Profile
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white pt-4">
            Profile
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            View your profile information.
          </span>
        </div>
      </header>
      <ProfileView profile={profile} />
    </div>
  );
}
