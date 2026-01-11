// Author: Antigravity
// Project: University-Portal
// FP-ID: FP-20251225-AG-LIB-STUDENTS
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T14:40:00Z

import { DashboardHeader } from "@repo/ui";
import {
  lendingService,
  StudentLibraryProfile,
  BorrowRecordWithBook,
} from "@repo/backend";
import { api } from "../../../lib/api";
import StudentStats from "../../../components/students/StudentStats";
import StudentSearch from "../../../components/students/StudentSearch";
import StudentDetails from "../../../components/students/StudentDetails";
import StudentHistoryTable from "../../../components/students/StudentHistoryTable";
import { toggleStudentRegistrationAction } from "../../actions";

export const __FP_SIG = "FP-20251225-AG-LIB-STUDENTS|HASH-PLACEHOLDER";
export const dynamic = "force-dynamic";

/**
 * Students management page.
 * Allows searching for students, viewing details/history, and toggling registration.
 *
 * @param {object} props - Page props
 * @param {Promise<{query?: string, page?: string}>} props.searchParams - Search params for filtering students
 */
export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const resolvedSearchParams = await searchParams; // Await the promise
  const query = resolvedSearchParams.query || "";
  const page = Number(resolvedSearchParams.page) || 1;
  const LIMIT = 5; // Minimum 5 as requested

  let stats: { totalStudents: number; registeredStudents: number } = {
    totalStudents: 0,
    registeredStudents: 0,
  };
  let matchingStudents: StudentLibraryProfile[] = [];
  let selectedStudent: StudentLibraryProfile | null = null;
  let history: { history: BorrowRecordWithBook[]; total: number } = {
    history: [],
    total: 0,
  };

  try {
    // Parallel fetch for stats and potentially search if query exists
    const statsPromise = api.execute(() =>
      lendingService.getStudentLibraryStats()
    );
    let searchPromise: Promise<StudentLibraryProfile[]> | null = null;

    if (query) {
      searchPromise = api.execute(() =>
        lendingService.searchStudentsForLibrary(query)
      );
    }

    const [statsResult, searchResult] = await Promise.all([
      statsPromise,
      searchPromise || Promise.resolve([]),
    ]);

    stats = statsResult;
    matchingStudents = searchResult;
    if (query && searchResult) {
      matchingStudents = searchResult;
      if (matchingStudents.length > 0 && matchingStudents[0]) {
        selectedStudent = matchingStudents[0];
        // Fetch history for selected student securely
        try {
          history = await api.execute(() =>
            lendingService.getStudentBorrowHistory(
              selectedStudent!.studentId,
              page,
              LIMIT
            )
          );
        } catch (histError) {
          console.error("Failed to fetch student history", histError);
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch student data", error);
    // UI handles empty states gracefully
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <DashboardHeader
        title="Students"
        description="Manage student records and library activities"
        breadcrumb={[{ label: "Students" }]}
      />

      {/* Stats Section */}
      <StudentStats stats={stats} />

      {/* Manage Students Search Section */}
      <StudentSearch />

      {/* Search Results / Details */}
      {query && (
        <>
          {!selectedStudent ? (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg">
              No students found matching &quot;{query}&quot;
            </div>
          ) : (
            <>
              <StudentDetails
                student={selectedStudent}
                onToggleRegistration={toggleStudentRegistrationAction}
              />

              {/* History Section - Only if student found */}
              <StudentHistoryTable
                history={history.history}
                total={history.total}
                currentPage={page}
                limit={LIMIT}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
