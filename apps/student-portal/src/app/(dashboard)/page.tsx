// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-Y5Z6A7
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-23T00:30:00Z

/**
 * DashboardPage
 * The main landing page for the student dashboard.
 * Aggregates key widgets: StatsCards, CourseList, and BookList.
 */

import StatsCards from "../../components/dashboard/StatsCards";
import CourseList from "../../components/dashboard/CourseList";
import BookList from "../../components/dashboard/BookList";
import { auth } from "@repo/auth";
import { dashboardService } from "@repo/backend";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@repo/ui";
import { createLogger } from "@repo/logger";

const logger = createLogger({ service: "student-portal" });

const __FP_SIG = "FP-20251223-US-Y5Z6A7|HASH-PLACEHOLDER";

/**
 * Main Dashboard View.
 *
 * This Server Component aggregates data from multiple sources (profile, courses, books)
 * to provide a unified snapshot of the student's academic standing.
 *
 * It acts as a data composition layer, transforming raw backend DTOs into
 * specific formats required by the UI widgets (StatsCards, CourseList).
 */
export default async function DashboardPage() {
  const session = await auth();
  logger.info("Dashboard page loaded");
  logger.debug({ session: session?.user?.email }, "Dashboard session context");

  if (!session?.user?.email) {
    return null;
  }

  const email = session.user.email;

  // Parallel data fetching via the dashboard service to minimize waterfall requests
  const { profile, courses, grades, books } =
    await dashboardService.getDashboardData(email);

  // Derived Stats Calculations
  const gpa = profile?.gpa || 0.0;

  // Calculate pending books count locally to avoid a separate Count API call.
  // "Pending" includes books that are strictly borrowed or Overdue.
  const pendingBooksCount = books
    ? books.filter((b) => {
        const s = b.status?.toLowerCase();
        return s === "borrowed" || s === "overdue";
      }).length
    : 0;

  // Aggregating total credits from all enrolled courses.
  const creditsEarned = courses
    ? courses.reduce((acc, course) => acc + (course.credits || 0), 0)
    : 0;

  // Transform Data for Components
  const currentLevel = profile?.level || 1;

  // 1. Filter by Current Study Year
  // We only show courses relevant to what the student is studying *now*.
  const yearCourses = courses
    ? courses.filter((c) => c.level === currentLevel)
    : [];

  // 2. Determine Logic for Semester (Prioritize 2 over 1)
  // If a student is enrolled in Semester 2 courses, we assume Semester 1 is completed or less relevant.
  // This logic automatically switches the dashboard view as the academic year progresses.
  const hasSemester2 = yearCourses.some((c) => c.semester === 2);
  const targetSemester = hasSemester2 ? 2 : 1;

  // 3. Final Filter
  const currentCourses = yearCourses.filter(
    (c) => c.semester === targetSemester
  );

  // Map to UI-specific shape, assigning consistent colors based on ID for visual stability
  const courseList = currentCourses.map((c) => ({
    code: c.code,
    name: c.name,
    description: c.description,
    credits: c.credits,
    color: ["blue", "purple", "green", "red"][c.courseId % 4],
  }));

  // Limit books on the dashboard to the most relevant ones (first 5)
  // to avoid cluttering the main view. Full list is available on /books.
  const bookList = books
    ? books
        .filter((b) => {
          const s = b.status?.toLowerCase();
          return s === "borrowed" || s === "overdue";
        })
        .map((b) => ({
          title: b.title,
          author: b.author,
          dueDate: b.dueDate,
          status: b.status,
        }))
    : [];

  return (
    <>
      {/* Page Header with Breadcrumbs */}
      <DashboardHeader
        title="Dashboard"
        description="Your dashboard provides a quick overview of your academic and library activities."
        showHomeIcon={true}
        breadcrumb={[{ label: "Dashboard" }]}
      />

      <StatsCards
        gpa={gpa}
        booksBorrowed={pendingBooksCount}
        creditsEarned={creditsEarned}
      />
      <CourseList
        courses={courseList}
        year={currentLevel.toString()}
        semester={targetSemester}
      />
      <BookList
        books={bookList.slice(0, 5)}
        isLibraryRegistered={profile?.isLibraryRegistered ?? false}
      />
    </>
  );
}
