"use client";

// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-ADMIN-STUDENTS-TABLE
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T10:44:09+05:30

const __FP_SIG = "FP-20260101-ADMIN-STUDENTS-TABLE|HASH-PLACEHOLDER";

import { motion } from "framer-motion";
import { Pagination } from "@repo/ui";
import { StudentProfileDTO } from "@repo/backend";
import Link from "next/link";
import { Eye, Edit, Trash2 } from "lucide-react";

/**
 * StudentsTable
 *
 * Purpose:
 * - Displays a paginated list of student records in a tabular format.
 * - Provides quick actions for viewing and editing individual student profiles.
 *
 * Responsibilities:
 * - Rendering student data including name, ID, degree, level, and GPA.
 * - Handling empty states when no students match the search criteria.
 * - Integrating with the `Pagination` component for server-side navigation.
 * - Implementing row hover effects and entrance animations for better UX.
 */

interface StudentsTableProps {
  students: StudentProfileDTO[];
  total: number;
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  onEdit: (student: StudentProfileDTO) => void;
  onDelete: (student: StudentProfileDTO) => void;
}

export function StudentsTable({
  students,
  total,
  currentPage,
  totalPages,
  baseUrl,
  onEdit,
  onDelete,
}: StudentsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200"
    >
      {/* Table Header / Summary section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Search Results
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {students.length} of {total} students
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Student ID</th>
              <th className="px-6 py-4">Degree Program</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">GPA</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Inline Comment: Render empty state if no students are returned from the API */}
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center">
                  No students found matching your criteria.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {student.fullName}
                    <div className="text-xs text-gray-500 font-normal">
                      {student.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono">{student.student_id}</td>
                  <td className="px-6 py-4">{student.degreeProgram}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                      Level {student.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {student.gpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* View Action - Navigates to student detail page */}
                      <Link
                        href={`/students/${student.id}`}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      {/* Edit Action - Triggers the parent's edit handler */}
                      <button
                        onClick={() => onEdit(student)}
                        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      {/* Delete Action - Destructive operation */}
                      {/* Inline Comment: Triggers confirmation modal via parent handler */}
                      <button
                        onClick={() => onDelete(student)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-1"
                        aria-label={`Delete ${student.fullName}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {/* Inline Comment: Uses the shared Pagination component for consistent navigation across the portal */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={baseUrl}
        />
      </div>
    </motion.div>
  );
}
