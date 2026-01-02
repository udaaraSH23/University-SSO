"use server";

import {
  studentService,
  StudentFiltersDTO,
  StudentCreateDTO,
  StudentUpdateDTO,
} from "@repo/backend";
import { revalidatePath } from "next/cache";

export async function getStudentsAction(filters: StudentFiltersDTO) {
  try {
    const data = await studentService.getPaginatedStudents(filters);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getStudentByIdAction(id: number) {
  try {
    const data = await studentService.getStudentDetailById(id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createStudentAction(data: StudentCreateDTO) {
  try {
    const student = await studentService.createStudent(data);
    revalidatePath("/students");
    return { success: true, data: student };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateStudentAction(id: number, data: StudentUpdateDTO) {
  try {
    const student = await studentService.updateStudent(id, data);
    revalidatePath("/students");
    revalidatePath(`/students/${id}`);
    return { success: true, data: student };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteStudentAction(id: number) {
  try {
    await studentService.deleteStudent(id);
    revalidatePath("/students");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
