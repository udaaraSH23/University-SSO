// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-ADMIN-PAGE-STUDENT-DETAIL
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T12:00:17+05:30

const __FP_SIG = "FP-20260101-ADMIN-PAGE-STUDENT-DETAIL|HASH-PLACEHOLDER";

import { getStudentByIdAction } from "@/actions/student.actions";
import { StudentDetailView } from "@/components/students/StudentDetailView";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * StudentDetailPage
 *
 * Purpose:
 * - Server component responsible for fetching and displaying detailed information about a specific student.
 * - Acts as the data loader for the `StudentDetailView` client component.
 *
 * Responsibilities:
 * - Parsing the `id` from the route parameters.
 * - Fetching student data (profile, enrollments, etc.) using `getStudentByIdAction`.
 * - Handling `404` errors for invalid IDs or non-existent students.
 * - Rendering error states if data fetching fails.
 */
export default async function StudentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const studentId = parseInt(id);

  // Inline Comment: validate that ID is a number, otherwise 404
  if (isNaN(studentId)) {
    return notFound();
  }

  const response = await getStudentByIdAction(studentId);

  if (!response.success || !response.data) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg">
        Error loading student details: {response.error || "Unknown error"}
      </div>
    );
  }

  return <StudentDetailView data={response.data} />;
}
