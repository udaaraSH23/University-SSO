"use client";

// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-ADMIN-STUDENT-LIST-CONTAINER
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T10:43:05+05:30

const __FP_SIG = "FP-20260101-ADMIN-STUDENT-LIST-CONTAINER|HASH-PLACEHOLDER";

import { useState } from "react";
import { DashboardHeader, SlideOver, Modal } from "@repo/ui";
import { Plus } from "lucide-react";
import { StudentsTable } from "./StudentsTable";
import { StudentFilters } from "./StudentFilters";
import { StudentForm } from "@/components/forms/StudentForm";
import {
  updateStudentAction,
  deleteStudentAction,
} from "@/actions/student.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StudentProfileDTO, FacultyDTO, StudentCreateDTO } from "@repo/backend";

/**
 * StudentListContainer
 *
 * Purpose:
 * - Orchestrates the student management interface, including the listing table, filters, and add/edit forms.
 * - Manages the state for modal (SlideOver) visibility and the selected student for editing.
 *
 * Responsibilities:
 * - Providing a unified layout for the students section.
 * - Handling student creation via API routes and updates via server actions.
 * - Managing UI feedback (toasts) and synchronization with the server (router.refresh).
 */

interface StudentListContainerProps {
  students: StudentProfileDTO[];
  total: number;
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  faculties: FacultyDTO[];
  academicYears: string[];
}

export function StudentListContainer({
  students,
  total,
  currentPage,
  totalPages,
  baseUrl,
  faculties,
  academicYears,
}: StudentListContainerProps) {
  // State for managing the SlideOver form visibility
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  // State for tracking which student is being edited (null = creation mode)
  const [editingStudent, setEditingStudent] =
    useState<StudentProfileDTO | null>(null);

  // State for delete confirmation
  const [studentToDelete, setStudentToDelete] =
    useState<StudentProfileDTO | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const router = useRouter();

  /**
   * handleOpenAdd
   *
   * Purpose:
   * - Resets the editing state and opens the SlideOver to show a blank registration form.
   */
  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsSlideOverOpen(true);
  };

  /**
   * handleEdit
   *
   * Purpose:
   * - Sets the target student for editing and opens the SlideOver.
   */
  const handleEdit = (student: StudentProfileDTO) => {
    setEditingStudent(student);
    setIsSlideOverOpen(true);
  };

  /**
   * handleDelete
   *
   * Purpose:
   * - Opens the delete confirmation modal for the selected student.
   */
  const handleDelete = (student: StudentProfileDTO) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  /**
   * confirmDelete
   *
   * Purpose:
   * - Executes the delete action and updates the UI.
   */
  const confirmDelete = async () => {
    if (!studentToDelete) return;

    const result = await deleteStudentAction(studentToDelete.id);
    if (result.success) {
      toast.success("Student deleted successfully");
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete student");
    }
  };

  /**
   * handleClose
   *
   * Purpose:
   * - Closes the SlideOver and resets the editing state to prevent data leakage between sessions.
   */
  const handleClose = () => {
    setIsSlideOverOpen(false);
    setEditingStudent(null);
  };

  /**
   * handleSubmit
   *
   * Purpose:
   * - Handles both creation and update logic depending on whether `editingStudent` is set.
   * - Uses server actions for updates and an internal API route for creation (WSO2 integration).
   */
  const handleSubmit = async (data: StudentCreateDTO) => {
    let result;
    if (editingStudent) {
      // Inline Comment: Update existing student profile using Server Action
      result = await updateStudentAction(editingStudent.id, {
        fullName: data.fullName,
        degreeProgramId: data.degreeProgramId,
        currentAcademicYear: data.currentAcademicYear,
        level: data.level,
      });

      if (result.success) {
        toast.success("Student updated successfully");
        handleClose();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update student");
      }
    } else {
      // Inline Comment: Create new student via API Route to handle WSO2 Identity Server sync
      try {
        const response = await fetch("/api/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "student",
            data: {
              username: data.username,
              email: data.email,
              studentId: data.studentId,
              fullName: data.fullName,
              degreeProgramId: data.degreeProgramId,
              currentAcademicYear: data.currentAcademicYear,
              level: data.level,
            },
          }),
        });

        const responseData = await response.json();

        if (response.ok) {
          toast.success("Student created successfully");
          handleClose();
          router.refresh();
        } else {
          toast.error(responseData.error || "Failed to create student");
        }
      } catch (_error) {
        toast.error("An error occurred while creating the student");
      }
    }
  };

  return (
    <>
      {/* Page Header with Action Button */}
      <DashboardHeader
        title="Students"
        description="Manage student records and admissions."
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Students", href: "/students" },
        ]}
      >
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </DashboardHeader>

      {/* Main Content Area: Filters followed by Table */}
      <div className="mt-6 flex flex-col gap-6">
        <StudentFilters faculties={faculties} academicYears={academicYears} />
        <StudentsTable
          students={students}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={baseUrl}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* SlideOver Drawer for Forms */}
      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={handleClose}
        title={editingStudent ? "Edit Student" : "Add New Student"}
        description={
          editingStudent
            ? "Update student profile details."
            : "Register a new student in the system."
        }
      >
        <StudentForm
          initialData={
            editingStudent
              ? {
                  // Inline Comment: Fallback username extraction from email if DTO doesn't provide it
                  username: editingStudent.email.split("@")[0],
                  email: editingStudent.email,
                  fullName: editingStudent.fullName,
                  studentId: editingStudent.student_id,
                  degreeProgramId: editingStudent.degreeProgramId,
                  currentAcademicYear: editingStudent.currentAcademicYear,
                  level: editingStudent.level,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isEdit={!!editingStudent}
        />
      </SlideOver>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Student"
        description="Are you sure you want to delete this student?"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            <strong>Warning:</strong> This action cannot be undone. It will
            permanently delete the student&apos;s profile, course enrollments,
            grade history, and their{" "}
            <strong>WSO2 Identity Server account</strong>.
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Delete Student
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
