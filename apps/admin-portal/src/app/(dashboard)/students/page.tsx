// Author: Antigravity
// Project: University-Portal
// FP-ID: FP-20260101-ADMIN-STUDENTS-PAGE
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T10:37:51+05:30

const __FP_SIG = "FP-20260101-ADMIN-STUDENTS-PAGE|HASH-PLACEHOLDER";

import {
  studentService,
  organizationService,
  offeringService,
} from "@repo/backend";
import { api } from "@/lib/api";
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
 * - Calling the backend services directly via `api.execute` to retrieve data.
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

  let faculties: any[] = [];
  let academicYears: any[] = [];
  let studentsData: any = { students: [], total: 0, page: 1, totalPages: 1 };
  let errorMsg = "";

  try {
    // Fetch faculties and academic years for filtering
    const [facultiesRes, academicYearsRes] = await api.execute(() =>
      Promise.all([
        organizationService.getFaculties(),
        offeringService.getAcademicYears(),
      ])
    );
    faculties = facultiesRes;
    academicYears = academicYearsRes;

    // Construct the filters object from URL parameters
    const filters = {
      query: params.query,
      level: params.level ? parseInt(params.level) : undefined,
      facultyId: params.faculty ? parseInt(params.faculty) : undefined,
      departmentId: params.department ? parseInt(params.department) : undefined,
      academicYear: params.academicYear,
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 10,
    };

    // Fetch student data
    studentsData = await api.execute(() =>
      studentService.getPaginatedStudents(filters)
    );
  } catch (error: any) {
    console.error("Data fetching error:", error);
    errorMsg = error.message || "Failed to load data";
  }

  // Error Handling Boundary
  if (errorMsg) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg">
        Error loading students: {errorMsg}
      </div>
    );
  }

  const { students, total, page, totalPages } = studentsData;

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
        faculties={faculties}
        academicYears={academicYears}
      />
    </div>
  );
}
