"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CourseOfferingDTO } from "@repo/backend";

// Extended interface for UI display
export interface CourseOffering extends CourseOfferingDTO {}

interface CourseOfferingsTableProps {
  offerings: CourseOffering[];
  onEdit: (offering: CourseOffering) => void;
  onDelete: (offering: CourseOffering) => void;
}

export function CourseOfferingsTable({
  offerings,
  onEdit,
  onDelete,
}: CourseOfferingsTableProps) {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Semester</th>
              <th className="px-6 py-4">Academic Year</th>
              <th className="px-6 py-4 text-center">Enrolled</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {offerings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No course offerings found. Create one to get started.
                </td>
              </tr>
            ) : (
              offerings.map((offering) => (
                <motion.tr
                  key={offering.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <Link
                        href={`/grades-offerings/${offering.id}`}
                        className="hover:underline"
                      >
                        <span className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                          {offering.courseName}
                        </span>
                      </Link>
                      <span className="text-xs text-gray-500 font-mono">
                        {offering.courseCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Level {offering.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 dark:text-white">
                      Semester {offering.semester}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {offering.academicYear}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {offering.enrolledCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/grades-offerings/${offering.id}`}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onEdit(offering)}
                        className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Edit Offering"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(offering)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Offering"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
