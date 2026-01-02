"use client";

// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-ADMIN-COURSES-TABLE
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T12:29:01+05:30

const __FP_SIG = "FP-20260101-ADMIN-COURSES-TABLE|HASH-PLACEHOLDER";

import { DataTable, Column, PaginationProps } from "@repo/ui";
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

export interface Course {
  id: number;
  name: string;
  code: string;
  departmentName: string;
  departmentId: number;
  credits: number;
  description?: string;
}

interface CoursesTableProps {
  data: Course[];
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  pagination?: PaginationProps;
}

/**
 * CoursesTable Component
 *
 * Purpose:
 * - Displays a list of academic courses.
 * - Used in course management and degree detail views.
 *
 * Responsibilities:
 * - Renders course columns including code, name, credits, and department.
 * - Handles edit and delete actions.
 */
export function CoursesTable({
  data,
  onEdit,
  onDelete,
  pagination,
}: CoursesTableProps) {
  const columns: Column<Course>[] = [
    {
      header: "Course Code",
      accessor: "code",
      className:
        "w-32 font-medium text-gray-900 dark:text-white font-mono text-xs",
    },
    {
      header: "Course Name",
      accessor: "name",
      render: (course) => (
        <div className="flex flex-col">
          <Link
            href={`/academics/courses/${course.id}`}
            className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
          >
            {course.name}
          </Link>
        </div>
      ),
    },
    {
      header: "Credits",
      accessor: "credits",
      className: "w-24 text-center font-mono",
    },
    {
      header: "Department",
      accessor: "departmentName",
    },
  ];

  const renderActions = (course: Course) => (
    <>
      <button
        onClick={() => onEdit(course)}
        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(course)}
        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      actions={renderActions}
      noDataMessage="No courses found."
      pagination={pagination}
    />
  );
}
