"use client";

import { DataTable, Column } from "@repo/ui";
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface Department {
  id: number;
  name: string;
  facultyName: string;
  facultyId: number;
}

interface DepartmentsTableProps {
  data: Department[];
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

export function DepartmentsTable({
  data,
  onEdit,
  onDelete,
}: DepartmentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);
  const columns: Column<Department>[] = [
    {
      header: "Department Name",
      accessor: "name",
      render: (dept) => (
        <div className="flex flex-col">
          <Link
            href={`/academics/departments/${dept.id}`}
            className="hover:underline"
          >
            <span className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              {dept.name}
            </span>
          </Link>
        </div>
      ),
    },
    {
      header: "Faculty",
      accessor: "facultyName",
    },
  ];

  const renderActions = (dept: Department) => (
    <>
      <button
        onClick={() => onEdit(dept)}
        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(dept)}
        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );

  return (
    <DataTable
      data={paginatedData}
      columns={columns}
      actions={renderActions}
      noDataMessage="No departments found."
      pagination={{
        currentPage,
        totalPages,
        onPageChange: setCurrentPage,
      }}
    />
  );
}
