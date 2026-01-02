"use client";

import { motion } from "framer-motion";
import { Trash2, Edit2 } from "lucide-react";

export interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  marks?: number; // Optional now, or removed
}

interface StudentGradesTableProps {
  data?: StudentGrade[];
  onEdit: (grade: StudentGrade) => void;
  onDelete?: (grade: StudentGrade) => void;
}

export function StudentGradesTable({
  data = [],
  onEdit,
  onDelete,
}: StudentGradesTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4">Student ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4 text-center">Grade</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No students enrolled yet.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs">
                    {item.studentId}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {item.studentName}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block w-8 text-center py-0.5 rounded font-bold ${
                        !item.grade
                          ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
                          : item.grade.startsWith("A")
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : item.grade.startsWith("B")
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : item.grade.startsWith("C")
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {item.grade || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit Grade"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
