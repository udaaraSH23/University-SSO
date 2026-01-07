// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-ADMIN-PAGE-STUDENT-DETAIL
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T12:00:17+05:30

const __FP_SIG = "FP-20260101-ADMIN-PAGE-STUDENT-DETAIL|HASH-PLACEHOLDER";

import { StudentDetailView } from "@/components/students/StudentDetailView";
import { notFound } from "next/navigation";
import { studentService } from "@repo/backend";
import { api } from "@/lib/api";

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
 * - Fetching student data (profile, enrollments, etc.) using `studentService` directly via `api.execute`.
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

  let studentData;
  try {
    studentData = await api.execute(() =>
      studentService.getStudentDetailById(studentId)
    );
  } catch (error) {
    console.error("Failed to fetch student details:", error);
  }

  if (!studentData) {
    return notFound();
  }

  return <StudentDetailView data={studentData} />;
}
