"use server";

import {
  organizationService,
  programService,
  courseService,
} from "@repo/backend";
import { revalidatePath } from "next/cache";

// ===========================================================================
// Faculty Actions
// ===========================================================================

export async function getFacultiesAction() {
  try {
    const data = await organizationService.getFaculties();
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch faculties:", error);
    return { success: false, error: "Failed to fetch faculties" };
  }
}

export async function getFacultyByIdAction(id: number) {
  try {
    const data = await organizationService.getFaculty(id);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch faculty:", error);
    return { success: false, error: "Failed to fetch faculty" };
  }
}

export async function createFacultyAction(data: {
  name: string;
  description?: string;
}) {
  try {
    await organizationService.createFaculty(data);
    revalidatePath("/academics/faculties");
    return { success: true };
  } catch (error) {
    console.error("Failed to create faculty:", error);
    return { success: false, error: "Failed to create faculty" };
  }
}

export async function updateFacultyAction(
  id: number,
  data: { name?: string; description?: string }
) {
  try {
    await organizationService.updateFaculty(id, data);
    revalidatePath("/academics/faculties");
    revalidatePath(`/academics/faculties/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update faculty:", error);
    return { success: false, error: "Failed to update faculty" };
  }
}

export async function deleteFacultyAction(id: number) {
  try {
    await organizationService.deleteFaculty(id);
    revalidatePath("/academics/faculties");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete faculty:", error);
    return { success: false, error: "Failed to delete faculty" };
  }
}

// ===========================================================================
// Department Actions
// ===========================================================================

export async function getDepartmentsAction(facultyId?: number) {
  try {
    const data = await organizationService.getDepartments(facultyId);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return { success: false, error: "Failed to fetch departments" };
  }
}

export async function getDepartmentByIdAction(id: number) {
  try {
    const data = await organizationService.getDepartment(id);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch department:", error);
    return { success: false, error: "Failed to fetch department" };
  }
}

export async function createDepartmentAction(data: {
  facultyId: number;
  name: string;
}) {
  try {
    await organizationService.createDepartment(data);
    revalidatePath("/academics/departments");
    return { success: true };
  } catch (error) {
    console.error("Failed to create department:", error);
    return { success: false, error: "Failed to create department" };
  }
}

export async function updateDepartmentAction(
  id: number,
  data: { name?: string; facultyId?: number }
) {
  try {
    await organizationService.updateDepartment(id, data);
    revalidatePath("/academics/departments");
    revalidatePath(`/academics/departments/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update department:", error);
    return { success: false, error: "Failed to update department" };
  }
}

export async function deleteDepartmentAction(id: number) {
  try {
    await organizationService.deleteDepartment(id);
    revalidatePath("/academics/departments");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete department:", error);
    return { success: false, error: "Failed to delete department" };
  }
}

// ===========================================================================
// Degree Program Actions
// ===========================================================================

export async function getDegreeProgramsAction(
  departmentId?: number,
  page: number = 1,
  intakeYear?: string
) {
  try {
    const { data, total } = await programService.getDegreePrograms(
      departmentId,
      page,
      10, // Limit
      intakeYear
    );
    return { success: true, data, total };
  } catch (error) {
    console.error("Failed to fetch degree programs:", error);
    return { success: false, error: "Failed to fetch degree programs" };
  }
}

export async function getDegreeProgramByIdAction(id: number) {
  try {
    const data = await programService.getDegreeProgram(id);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch degree program:", error);
    return { success: false, error: "Failed to fetch degree program" };
  }
}

export async function createDegreeProgramAction(data: {
  departmentId: number;
  name: string;
  intakeAcademicYear: string;
}) {
  try {
    await programService.createDegreeProgram(data);
    revalidatePath("/academics/degrees");
    return { success: true };
  } catch (error) {
    console.error("Failed to create degree program:", error);
    return { success: false, error: "Failed to create degree program" };
  }
}

export async function updateDegreeProgramAction(
  id: number,
  data: {
    name?: string;
    departmentId?: number;
    intakeAcademicYear?: string;
  }
) {
  try {
    await programService.updateDegreeProgram(id, data);
    revalidatePath("/academics/degrees");
    revalidatePath(`/academics/degrees/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update degree program:", error);
    return { success: false, error: "Failed to update degree program" };
  }
}

export async function deleteDegreeProgramAction(id: number) {
  try {
    await programService.deleteDegreeProgram(id);
    revalidatePath("/academics/degrees");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete degree program:", error);
    return { success: false, error: "Failed to delete degree program" };
  }
}

// ===========================================================================
// Course Actions
// ===========================================================================

export async function getCoursesAction(
  departmentId?: number,
  page: number = 1
) {
  try {
    const { data, total } = await courseService.getCourses(departmentId, page);
    return { success: true, data, total };
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return { success: false, error: "Failed to fetch courses" };
  }
}

export async function getCourseByIdAction(id: number) {
  try {
    const data = await courseService.getCourse(id);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return { success: false, error: "Failed to fetch course" };
  }
}

export async function createCourseAction(data: {
  departmentId: number;
  code: string;
  name: string;
  credits: number;
  description?: string;
}) {
  try {
    await courseService.createCourse(data);
    revalidatePath("/academics/courses");
    return { success: true };
  } catch (error) {
    console.error("Failed to create course:", error);
    return { success: false, error: "Failed to create course" };
  }
}

export async function updateCourseAction(
  id: number,
  data: {
    departmentId?: number;
    code?: string;
    name?: string;
    credits?: number;
    description?: string;
  }
) {
  try {
    await courseService.updateCourse(id, data);
    revalidatePath("/academics/courses");
    // revalidatePath(`/academics/courses/${id}`); // Course detail page might not exist yet
    return { success: true };
  } catch (error) {
    console.error("Failed to update course:", error);
    return { success: false, error: "Failed to update course" };
  }
}

export async function deleteCourseAction(id: number) {
  try {
    await courseService.deleteCourse(id);
    revalidatePath("/academics/courses");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete course:", error);
    return { success: false, error: "Failed to delete course" };
  }
}
