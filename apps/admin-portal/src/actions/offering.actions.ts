"use server";

// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-ACTION-OFFERINGS
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-30T18:53:00+05:30

const __FP_SIG = "FP-20251230-US-ACTION-OFFERINGS|HASH-PLACEHOLDER";

import { offeringService, courseService } from "@repo/backend";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Get Course Offerings
 *
 * Fetches course offerings with pagination and filters.
 */
export async function getCourseOfferingsAction(filters?: {
  academicYear?: string;
  semester?: number;
  level?: number;
  search?: string;
  page?: number;
  limit?: number;
  degreeProgramId?: number;
}) {
  try {
    const result = await offeringService.getCourseOfferings(filters);
    return { success: true, ...result };
  } catch (error) {
    console.error("Failed to fetch course offerings:", error);
    return { success: false, error: "Failed to fetch course offerings" };
  }
}

/**
 * Server Action: Get Academic Years
 *
 * Fetches distinct academic years for filtering.
 */
export async function getAcademicYearsAction() {
  try {
    const years = await offeringService.getAcademicYears();
    return { success: true, data: years };
  } catch (error) {
    console.error("Failed to fetch academic years:", error);
    return { success: false, error: "Failed to fetch academic years" };
  }
}

/**
 * Server Action: Search Courses
 *
 * Searches for courses by name or code.
 */
export async function searchCoursesAction(query: string) {
  try {
    const courses = await courseService.searchCourses(query);
    return { success: true, data: courses };
  } catch (error) {
    console.error("Failed to search courses:", error);
    return { success: false, error: "Failed to search courses" };
  }
}

/**
 * Server Action: Create Course Offering
 */
export async function createCourseOfferingAction(data: {
  courseId: number;
  semester: number;
  academicYear: string;
  level: number;
}) {
  try {
    await offeringService.createCourseOffering(data);
    revalidatePath("/grades-offerings");
    return { success: true };
  } catch (error) {
    console.error("Failed to create offering:", error);
    return { success: false, error: "Failed to create offering" };
  }
}

/**
 * Server Action: Update Course Offering
 */
export async function updateCourseOfferingAction(
  id: number,
  data: {
    semester?: number;
    academicYear?: string;
    level?: number;
  }
) {
  try {
    // Check if update method exists, if not use prisma direct or add to service
    // For now assuming we need to add it to service or use update
    // Let's assume we will add updateCourseOffering to service next.
    await offeringService.updateCourseOffering(id, data);
    revalidatePath("/grades-offerings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update offering:", error);
    return { success: false, error: "Failed to update offering" };
  }
}

export async function deleteCourseOfferingAction(id: number) {
  try {
    await offeringService.deleteCourseOffering(id);
    revalidatePath("/grades-offerings");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete offering:", error);
    return { success: false, error: "Failed to delete offering" };
  }
}

export async function getCourseOfferingByIdAction(id: number) {
  try {
    const offering = await offeringService.getCourseOfferingById(id);
    return { success: true, data: offering };
  } catch (error) {
    console.error("Failed to fetch offering:", error);
    return { success: false, error: "Failed to fetch offering" };
  }
}

export async function enrollStudentAction(data: {
  offeringId: number;
  studentId: string;
  grade: string;
}) {
  try {
    await offeringService.enrollStudent(data);
    revalidatePath(`/grades-offerings/${data.offeringId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to enroll student:", error);
    return { success: false, error: "Failed to enroll student" };
  }
}

export async function deleteEnrollmentAction(enrollmentId: number) {
  try {
    await offeringService.deleteEnrollment(enrollmentId);
    revalidatePath("/grades-offerings/[id]", "page");
    // Note: Dynamic path revalidation can be tricky, might need specific path revalidation in component or exact path here
    return { success: true };
  } catch (error) {
    console.error("Failed to delete enrollment:", error);
    return { success: false, error: "Failed to delete enrollment" };
  }
}

export async function searchStudentsAction(query: string) {
  try {
    const students = await offeringService.searchStudents(query);
    return { success: true, data: students };
  } catch (error) {
    console.error("Failed to search students:", error);
    return { success: false, error: "Failed to search students" };
  }
}
export async function updateStudentEnrollmentAction(
  enrollmentId: number,
  data: {
    grade?: string;
  }
) {
  try {
    await offeringService.updateStudentEnrollment(enrollmentId, data);
    revalidatePath("/students/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to update enrollment:", error);
    return { success: false, error: "Failed to update enrollment" };
  }
}

export async function deleteStudentEnrollmentAction(enrollmentId: number) {
  try {
    await offeringService.deleteStudentEnrollment(enrollmentId);
    revalidatePath("/students/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete enrollment:", error);
    return { success: false, error: "Failed to delete enrollment" };
  }
}
