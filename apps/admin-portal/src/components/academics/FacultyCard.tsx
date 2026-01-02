"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";

export interface FacultyCardProps {
  id: number;
  name: string;
  description?: string;
  departmentCount?: number;
  color?: string; // e.g. "bg-blue-500"
  onEdit?: () => void;
  onDelete?: () => void;
}

export function FacultyCard({
  id,
  name,
  description,
  departmentCount = 0,
  color = "bg-blue-600",
  onEdit,
  onDelete,
}: FacultyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all duration-200"
    >
      <div className={`h-2 ${color}`} />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Link
              href={`/academics/faculties/${id}`}
              className="block group/link"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors">
                {name}
              </h3>
            </Link>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        {description && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Departments
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {departmentCount}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit?.();
            }}
            className="flex-1 py-2 px-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-medium transition-colors"
          >
            Edit
          </button>
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className="py-2 px-4 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-sm font-medium transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
