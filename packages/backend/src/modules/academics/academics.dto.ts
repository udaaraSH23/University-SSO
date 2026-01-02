// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-DTO-ACADEMICS
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-30T18:43:00+05:30

const __FP_SIG = "FP-20251230-US-DTO-ACADEMICS|HASH-PLACEHOLDER";

export interface FacultyDTO {
  id: number;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  departmentCount?: number;
}

export interface DepartmentDTO {
  id: number;
  facultyId: number;
  name: string;
  facultyName?: string;
}

export interface DegreeProgramDTO {
  id: number;
  departmentId: number;
  name: string;
  intakeAcademicYear: string;
  departmentName?: string;
}

export interface AcademicCourseDTO {
  id: number;
  departmentId: number;
  code: string;
  name: string;
  credits: number;
  description?: string | null;
  departmentName?: string;
}

export interface CourseOfferingDTO {
  id: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  academicYear: string;
  semester: number;
  level: number;
  instructor?: string; // Not in schema, but useful for UI
  maxCapacity?: number; // Not in schema
  enrolledCount?: number;
}
