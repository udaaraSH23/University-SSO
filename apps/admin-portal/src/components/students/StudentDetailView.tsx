"use client";

// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-ADMIN-STUDENT-DETAIL-VIEW
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T10:39:49+05:30

const __FP_SIG = "FP-20260101-ADMIN-STUDENT-DETAIL-VIEW|HASH-PLACEHOLDER";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  BookOpen,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";
import Link from "next/link";
import { StudentDetailDTO } from "@repo/backend";
import { SlideOver, useDeleteConfirmation } from "@repo/ui";
import {
  EnrollmentForm,
  EnrollmentFormData,
} from "@/components/forms/EnrollmentForm";
import {
  enrollStudentAction,
  updateStudentEnrollmentAction,
  deleteStudentEnrollmentAction,
} from "@/actions/offering.actions";
import {
  updateStudentAction,
  deleteStudentAction,
} from "@/actions/student.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StudentForm } from "@/components/forms/StudentForm";
import { StudentCreateDTO } from "@repo/backend";

/**
 * StudentDetailView
 *
 * Purpose:
 * - Provides a detailed view of a student's profile and academic record.
 * - Displays personal information, degree details, and a history of course enrollments and grades.
 *
 * Responsibilities:
 * - Rendering the student's profile summary (Name, ID, Email, GPA, etc.).
 * - Visualizing course enrollment history in a tabular format.
 * - Providing navigation back to the student list.
 * - Implementing entrance animations for a polish UI experience.
 */

interface StudentDetailViewProps {
  data: StudentDetailDTO;
}

export function StudentDetailView({ data }: StudentDetailViewProps) {
  // Destructure profile and enrollment data for easier access
  const { profile, enrollments } = data;
  const [isEnrollFormOpen, setIsEnrollFormOpen] = useState(false);
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<
    | (EnrollmentFormData & {
        enrollmentId?: number;
        courseName?: string;
        courseCode?: string;
      })
    | undefined
  >(undefined);
  const router = useRouter();
  const { confirmDelete } = useDeleteConfirmation();

  // Filter State
  const [levelFilter, setLevelFilter] = useState<number | undefined>(undefined);
  const [semesterFilter, setSemesterFilter] = useState<number | undefined>(
    undefined
  );

  const handleEnroll = async (formData: EnrollmentFormData) => {
    let result;
    if (editingEnrollment?.enrollmentId) {
      // We need an update action. Assuming updateStudentEnrollmentAction exists or we fallback to enroll if it handles updates (usually separates).
      // Based on imports, I added updateStudentEnrollmentAction.
      result = await updateStudentEnrollmentAction(
        editingEnrollment.enrollmentId,
        {
          grade: formData.grade,
        }
      );
    } else {
      result = await enrollStudentAction({
        offeringId: formData.offeringId,
        studentId: profile.student_id,
        grade: formData.grade,
      });
    }

    if (result.success) {
      toast.success(
        editingEnrollment
          ? "Enrollment updated"
          : "Student enrolled successfully"
      );
      setIsEnrollFormOpen(false);
      setEditingEnrollment(undefined);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to process enrollment");
    }
  };

  const handleDelete = (enrollmentId: number) => {
    confirmDelete({
      title: "Delete Record",
      description:
        "Are you sure you want to remove this course record? This cannot be undone.",
      onConfirm: async () => {
        const result = await deleteStudentEnrollmentAction(enrollmentId);
        if (result.success) {
          toast.success("Record deleted");
          router.refresh();
        } else {
          toast.error("Failed to delete record");
        }
      },
    });
  };

  const handleStudentUpdate = async (data: StudentCreateDTO) => {
    // Adapter to match what updateStudentAction expects vs what StudentForm gives
    // StudentForm gives StudentCreateDTO
    const result = await updateStudentAction(profile.id, {
      fullName: data.fullName,
      degreeProgramId: data.degreeProgramId,
      currentAcademicYear: data.currentAcademicYear,
      level: data.level,
    });

    if (result.success) {
      toast.success("Student updated successfully");
      setIsStudentFormOpen(false);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update student");
    }
  };

  const handleDeleteStudent = () => {
    confirmDelete({
      title: "Delete Student",
      description:
        "Are you sure you want to delete this student? This action cannot be undone and will remove all associated data.",
      onConfirm: async () => {
        const result = await deleteStudentAction(profile.id);
        if (result.success) {
          toast.success("Student deleted");
          router.push("/students");
        } else {
          toast.error("Failed to delete student");
        }
      },
    });
  };

  // Filter Logic
  const filteredEnrollments = enrollments.filter((enr) => {
    const matchesLevel = levelFilter ? enr.level === levelFilter : true;
    const matchesSemester = semesterFilter
      ? Number(enr.semester) === semesterFilter
      : true;
    return matchesLevel && matchesSemester;
  });

  return (
    <div className="space-y-6">
      {/* Header section with back navigation */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <Link
            href="/students"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500"
            aria-label="Back to students list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Student Profile
          </h1>
        </div>
        {/* 'Add Course + Grade' button removed from here */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card - Left Column (Main Stats) */}
        {/* Inline Comment: Uses Framer Motion for a subtle entry animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            {/* User Avatar Placeholder */}
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <User className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {profile.fullName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile.student_id}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setIsStudentFormOpen(true)}
                  className="p-1 px-3 text-xs border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleDeleteStudent}
                  className="p-1 px-3 text-xs border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {/* Contact & Academic Metadata */}
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              <span>{profile.degreeProgram}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>
                Level {profile.level} • {profile.currentAcademicYear}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Star className="w-4 h-4 text-yellow-500 shadow-sm" />
              <span className="font-semibold px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-md">
                GPA: {profile.gpa.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Enrollments & Grades - Right Column (Details) */}
        {/* Inline Comment: Staggered animation for visual hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-wrap gap-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Course Enrollments & Grades
              </h3>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={levelFilter || ""}
                  onChange={(e) =>
                    setLevelFilter(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none"
                >
                  <option value="">All Levels</option>
                  <option value="1">Level 1</option>
                  <option value="2">Level 2</option>
                  <option value="3">Level 3</option>
                  <option value="4">Level 4</option>
                </select>
                <select
                  value={semesterFilter || ""}
                  onChange={(e) =>
                    setSemesterFilter(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none"
                >
                  <option value="">All Semesters</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Semester</th>
                    <th className="px-6 py-4">Credits</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4 w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {enrollments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center">
                        No enrollments found for this student.
                      </td>
                    </tr>
                  ) : (
                    filteredEnrollments.map((enr, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {enr.name}
                          </div>
                          <div className="text-xs text-gray-500 font-normal">
                            {enr.code}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          Semester {enr.semester} • {enr.academicYear}
                        </td>
                        <td className="px-6 py-4">{enr.credits}</td>
                        <td className="px-6 py-4">
                          {/* Inline Comment: Badge coloring based on grade availability */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              enr.grade
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {enr.grade || "PENDING"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingEnrollment({
                                  enrollmentId: enr.enrollmentId,
                                  offeringId: enr.offeringId,
                                  grade: enr.grade || "",
                                });
                                setIsEnrollFormOpen(true);
                              }}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(enr.enrollmentId)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
              <button
                onClick={() => {
                  setEditingEnrollment(undefined);
                  setIsEnrollFormOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add New Record
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <SlideOver
        isOpen={isEnrollFormOpen}
        onClose={() => setIsEnrollFormOpen(false)}
        title={editingEnrollment ? "Edit Enrollment" : "Add Course & Grade"}
        description={
          editingEnrollment
            ? "Update the grade for this course enrollment."
            : "Enroll the student in a course offering and assign a grade."
        }
      >
        <EnrollmentForm
          onSubmit={handleEnroll}
          onCancel={() => setIsEnrollFormOpen(false)}
          degreeProgramId={profile.degreeProgramId}
          initialData={editingEnrollment}
          isEdit={!!editingEnrollment}
        />
      </SlideOver>

      <SlideOver
        isOpen={isStudentFormOpen}
        onClose={() => setIsStudentFormOpen(false)}
        title="Edit Student Profile"
        description="Update the student's personal and academic information."
      >
        <StudentForm
          onSubmit={handleStudentUpdate}
          onCancel={() => setIsStudentFormOpen(false)}
          initialData={{
            username: profile.email.split("@")[0],
            email: profile.email,
            fullName: profile.fullName,
            studentId: profile.student_id,
            degreeProgramId: profile.degreeProgramId,
            currentAcademicYear: profile.currentAcademicYear,
            level: profile.level,
          }}
          isEdit={true}
        />
      </SlideOver>
    </div>
  );
}
