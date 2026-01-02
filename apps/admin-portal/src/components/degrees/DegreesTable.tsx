"use client";

import { DataTable, Column, PaginationProps } from "@repo/ui";
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

export interface DegreeProgram {
  id: number;
  name: string;
  departmentName: string;
  departmentId: number;
  intakeAcademicYear: string;
}

interface DegreesTableProps {
  data: DegreeProgram[];
  onEdit: (degree: DegreeProgram) => void;
  onDelete: (degree: DegreeProgram) => void;
  pagination?: PaginationProps;
}

export function DegreesTable({
  data,
  onEdit,
  onDelete,
  pagination,
}: DegreesTableProps) {
  const columns: Column<DegreeProgram>[] = [
    {
      header: "Degree Name",
      accessor: "name",
      render: (degree) => (
        <div className="flex flex-col">
          <Link
            href={`/academics/degrees/${degree.id}`}
            className="hover:underline"
          >
            <span className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              {degree.name}
            </span>
          </Link>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: "departmentName",
    },
    {
      header: "Intake Year",
      accessor: "intakeAcademicYear",
    },
  ];

  const renderActions = (degree: DegreeProgram) => (
    <>
      <button
        onClick={() => onEdit(degree)}
        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(degree)}
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
      noDataMessage="No degree programs found."
      pagination={pagination}
    />
  );
}
