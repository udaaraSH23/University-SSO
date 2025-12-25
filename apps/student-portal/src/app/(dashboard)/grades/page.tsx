// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-M8N9O0
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T10:55:00Z

import { Home, LogOut } from "lucide-react";
import GradesFilter from "../../../components/dashboard/grades/GradesFilter";
import GradesTable from "../../../components/dashboard/grades/GradesTable";
import { auth } from "@repo/auth";
import { studentService, GradeDTO } from "@repo/backend";
import { redirect } from "next/navigation";
import { LogoutButton } from "@repo/ui";

const __FP_SIG = "FP-20251223-US-M8N9O0|HASH-PLACEHOLDER";

// Helper function to convert Letter Grade to Grade Points
/**
 * Converts a letter grade to its corresponding point value for GPA calculation.
 *
 * @param {string} grade - The letter grade (e.g., "A+", "B").
 * @returns {number} The numeric grade point value (0.0 - 4.0). Returns 0.0 for invalid/failing grades.
 */
const getGradePoints = (grade: string): number => {
  const map: Record<string, number> = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    E: 0.0,
    F: 0.0,
  };
  return map[grade] || 0.0;
};

/**
 * Server Component: Grades Page
 *
 * This component operates as a Server Component to fetch and render grade data directly.
 * It reads filtering parameters (year, semester) from the URL query string, allowing
 * users to bookmark or share specific views of their academic record.
 *
 * Functionality:
 * 1. Authenticates the user session.
 * 2. Fetches all grades for the logged-in student.
 * 3. Filters grades in-memory based on URL params (simplifies backend queries).
 * 4. Calculates the weighted GPA dynamically for the currently viewed set of grades.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.searchParams - Read-only URL search parameters used for filtering.
 */
export default async function GradesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();

  // Redirect to sign-in if no active session is found to protect private academic data.
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const email = session.user.email;
  // Await searchParams as per Next.js 15+ requirements for async access
  const { year: yearParam, semester: semesterParam } = await searchParams;

  // Parse filters: 'all' is treated as undefined to fetch/show everything
  const yearLevel =
    typeof yearParam === "string" && yearParam !== "all"
      ? parseInt(yearParam)
      : undefined;
  const semester =
    typeof semesterParam === "string" && semesterParam !== "all"
      ? parseInt(semesterParam)
      : undefined;

  let grades: GradeDTO[] = [];
  try {
    // Fetch complete grade history first, then filter.
    // This reduces the number of specialized API endpoints needed for simple filtering.
    const allGrades = await studentService.getGrades(email);
    grades = allGrades.filter((g) => {
      let match = true;
      if (yearLevel && g.yearLevelTaken !== yearLevel) match = false;
      if (semester && g.semester !== semester) match = false;
      return match;
    });
  } catch (err) {
    console.error("Failed to fetch grades:", err);
    // TODO: Implement a user-facing error state or boundary
  }

  // Calculate Weighted GPA: (Sum of (Grade Point * Credits)) / (Total Credits)
  // This is calculated on the fly to reflect the current filtered view (e.g., GPA for Year 1 only).
  let totalPoints = 0;
  let totalCredits = 0;

  grades.forEach((g) => {
    // Only count courses with valid letter grades towards GPA.
    // "N/A" or pending grades are excluded from the calculation.
    if (g.grade && g.grade !== "N/A") {
      const points = getGradePoints(g.grade);
      totalPoints += points * g.credits;
      totalCredits += g.credits;
    }
  });

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0.0;

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <header className="flex items-center justify-between mb-8 pt-6">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-1">
            <Home className="w-4 h-4" />
            <span>/</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Grades
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white pt-4">
            Grades
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            View your academic performance history.
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto w-full">
        <GradesFilter />

        <GradesTable grades={grades} gpa={gpa} />

        <div className="mt-12 text-center text-sm text-gray-400 pb-8">
          © 2023 University Portal System. All rights reserved.
        </div>
      </div>
    </div>
  );
}
