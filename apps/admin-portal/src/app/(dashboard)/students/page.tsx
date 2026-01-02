// Author: Antigravity
// Project: University-Portal
// FP-ID: FP-20260101-ADMIN-STUDENTS-PAGE
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T10:37:51+05:30

const __FP_SIG = "FP-20260101-ADMIN-STUDENTS-PAGE|HASH-PLACEHOLDER";

import { getStudentsAction } from "@/actions/student.actions";
import { getFacultiesAction } from "@/actions/academics.actions";
import { getAcademicYearsAction } from "@/actions/offering.actions";
import { StudentListContainer } from "@/components/students/StudentListContainer";

/**
 * StudentsPage
 *
 * Purpose:
 * - Serves as the main entry point for the Students management section in the Admin Dashboard.
 * - Handles server-side data fetching for student records based on search filters and pagination.
 *
 * Responsibilities:
 * - Parsing URL search parameters to construct filter objects.
 * - Calling the backend action `getStudentsAction` to retrieve data.
 * - Handling loading and error states during data fetching.
 * - Rendering the `StudentListContainer` with the fetched data.
 */

interface PageProps {
  searchParams: Promise<{
    query?: string;
    level?: string;
    faculty?: string;
    department?: string;
    academicYear?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function StudentsPage({ searchParams }: PageProps) {
  // Resolve search parameters from the promise
  const params = await searchParams;

  // Fetch faculties and academic years for filtering
  const [facultiesRes, academicYearsRes] = await Promise.all([
    getFacultiesAction(),
    getAcademicYearsAction(),
  ]);

  // Construct the filters object from URL parameters
  // Inline Comment: We parse string parameters to numbers where necessary and provide defaults.
  const filters = {
    query: params.query,
    level: params.level ? parseInt(params.level) : undefined,
    facultyId: params.faculty ? parseInt(params.faculty) : undefined,
    // Inline Comment: Map 'department' param to 'departmentId' expected by the action
    departmentId: params.department ? parseInt(params.department) : undefined,
    academicYear: params.academicYear,
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 10,
  };

  // Fetch student data from the server action
  // Inline Comment: This action encapsulates the business logic for retrieving students from the database.
  const response = await getStudentsAction(filters);

  // Error Handling Boundary
  // Inline Comment: If the action fails or returns no data, we display a user-friendly error message.
  if (!response.success || !response.data) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg">
        Error loading students: {response.error || "Unknown error"}
      </div>
    );
  }

  // Destructure the successful response data
  const { students, total, page, totalPages } = response.data;

  // Render the Container Component
  // Inline Comment: Pass the fetched data to the presentation component `StudentListContainer`.
  return (
    <div className="flex flex-col">
      <StudentListContainer
        students={students}
        total={total}
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/students"
        faculties={facultiesRes?.success ? facultiesRes.data ?? [] : []}
        academicYears={
          academicYearsRes?.success ? academicYearsRes.data ?? [] : []
        }
      />
    </div>
  );
}
