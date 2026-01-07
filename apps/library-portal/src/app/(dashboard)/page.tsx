// Author: Antigravity
// Project: University-Portal
// FP-ID: FP-20251225-AG-LIB-PAGE
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T13:30:00Z

import { DashboardHeader } from "@repo/ui";
import LibraryStats from "../../components/dashboard/LibraryStats";
import OverdueAlert from "../../components/dashboard/OverdueAlert";
import LoanReturnSection from "../../components/dashboard/LoanReturnSection";
import BookAvailability from "../../components/dashboard/BookAvailability";

export const __FP_SIG = "FP-20251225-AG-LIB-PAGE|HASH-PLACEHOLDER";

import { lendingService } from "@repo/backend";
import { api } from "../../lib/api";

export const dynamic = "force-dynamic";

/**
 * Main dashboard page for the Library Portal.
 * Aggregates stats, overdue alerts, and quick actions for loan/return.
 * Fetches data server-side to ensure real-time status visibility.
 */
export default async function LibraryDashboardPage() {
  const stats = await api.execute(() =>
    lendingService.getLibraryDashboardStats()
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <DashboardHeader
        title="Dashboard Overview"
        description="Manage library assets and student loans."
        showHomeIcon={false}
      />

      {/* Stats Section */}
      <LibraryStats
        availableBooks={stats.availableBooks}
        borrowedBooks={stats.borrowedBooks}
        totalBooks={stats.totalBooks}
        totalStudents={stats.totalStudents}
      />

      {/* Overdue Alert Section */}
      <OverdueAlert overdueCount={stats.overdueBooks} />

      {/* Loan / Return Section */}
      <LoanReturnSection />

      {/* Check Availability Section */}
      <BookAvailability />
    </div>
  );
}
