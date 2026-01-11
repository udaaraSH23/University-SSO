// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-COURSES-PAGE
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:00:00Z

import { DashboardHeader } from "@repo/ui";
import CourseGrid from "../../../components/dashboard/courses/CourseGrid";
import CourseFilter from "../../../components/dashboard/courses/CourseFilter";
import { auth } from "@repo/auth";
import { api } from "../../../lib/api";
import { studentService, CourseDTO } from "@repo/backend";
import { redirect } from "next/navigation";

const __FP_SIG = "FP-20251223-US-COURSES-PAGE|HASH-PLACEHOLDER";

/**
 * Server Component: Courses Page
 *
 * This component renders the main courses overview for the student dashboard.
 * It is responsible for:
 * 1. Authenticating the user session.
 * 2. Parsing URL search params for filtering (year, semester).
 * 3. Fetching course data from the backend `studentService`.
 * 4. Handling errors gracefully (e.g., profile not found).
 * 5. Rendering the layout with breadcrumbs, filters, and the course grid.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.searchParams - Search parameters associated with the current URL.
 * @returns {JSX.Element} The rendered Courses page.
 */
export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  // Verify user authentication session

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const email = session.user.email;
  const semester = searchParams.semester
    ? parseInt(searchParams.semester as string)
    : undefined;
  const year = searchParams.year as string | undefined; // Assuming year filter is string "2024-2025" or level "1"

  let courses: CourseDTO[] = [];
  let error = null;

  try {
    // 3. Fetching course data from the backend `studentService`
    // We pass filters from searchParams to the service
    courses = await api.execute(() =>
      studentService.getCourses(email, {
        semester,
        year,
      })
    );
  } catch (err) {
    console.error("Failed to fetch courses:", err);
    // 4. Handling errors gracefully
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorObj = err as any;
    if (errorObj?.code === "STUDENT_NOT_FOUND") {
      error = "Profile not found. Please contact support.";
    } else {
      error =
        errorObj?.message || "Failed to load courses. Please try again later.";
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page Header with Breadcrumbs */}
      <DashboardHeader
        title="Courses"
        description="Your courses provide a quick overview of your academic activities."
        breadcrumb={[{ label: "Courses" }]}
      />

      <div className="max-w-7xl mx-auto w-full">
        {/* Filtering Options (Year, Semester) */}
        <CourseFilter />

        {/* Main Grid of Course Cards */}
        <CourseGrid courses={courses} />
      </div>
    </div>
  );
}
