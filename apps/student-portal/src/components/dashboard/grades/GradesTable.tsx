// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-J5K6L7
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:25:00Z

"use client";

const __FP_SIG = "FP-20251223-US-J5K6L7|HASH-PLACEHOLDER";

import {
  Zap,
  Monitor,
  Calculator,
  History,
  BookOpen,
  Code,
  Database,
  BrainCircuit,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Pagination from "../Pagination";

interface GradeItem {
  courseCode: string;
  courseName: string;
  credits: number;
  type: string;
  grade: string;
}

interface GradesTableProps {
  grades: GradeItem[];
  gpa: number;
}

const getIcon = (code: string) => {
  if (code.startsWith("CS")) return Monitor;
  if (code.startsWith("EE")) return Zap;
  if (code.startsWith("MAT")) return Calculator;
  if (code.startsWith("ART")) return History;
  return BookOpen;
};

const getColor = (grade: string) => {
  if (grade.startsWith("A")) return "green";
  if (grade.startsWith("B")) return "yellow";
  if (grade.startsWith("C")) return "orange";
  return "red";
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

export default function GradesTable({ grades, gpa }: GradesTableProps) {
  if (grades.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-gray-500">
          No grades found for the selected filter.
        </p>
      </div>
    );
  }

  const colorMap = {
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-600 dark:text-purple-400",
    },
    orange: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-600 dark:text-orange-400",
    },
    pink: {
      bg: "bg-pink-100 dark:bg-pink-900/30",
      text: "text-pink-600 dark:text-pink-400",
    },
    // Fallbacks or extra colors
    green: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400",
    },
    yellow: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-600 dark:text-yellow-400",
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
    },
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(grades.length / itemsPerPage);

  const paginatedGrades = grades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="grid grid-cols-12 gap-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        <div className="col-span-8 md:col-span-6">Course Name</div>
        <div className="col-span-2 md:col-span-2 text-center hidden md:block">
          Credits
        </div>
        <div className="col-span-2 md:col-span-2 text-center hidden md:block">
          Type
        </div>
        <div className="col-span-4 md:col-span-2 text-right md:text-center">
          Grade
        </div>
      </div>
      <motion.div
        className="divide-y divide-gray-100 dark:divide-gray-700"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {paginatedGrades.map((grade, index) => {
            const Icon = getIcon(grade.courseCode);
            // Cycle through main colors for icons
            const colorKeys: (keyof typeof colorMap)[] = [
              "blue",
              "purple",
              "orange",
              "pink",
            ];
            const colorKey = colorKeys[index % 4];
            const iconStyles = colorMap[colorKey];

            // Determine grade badge color
            const gradeColorKey = getColor(
              grade.grade
            ) as keyof typeof colorMap;
            const gradeStyles = colorMap[gradeColorKey] || colorMap.blue;

            return (
              <motion.div
                key={`${grade.courseCode}-${index}`}
                layout
                variants={itemVariants}
                className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-default"
                whileHover={{
                  scale: 1.01,
                  backgroundColor: "rgba(249, 250, 251, 0.5)",
                }}
              >
                <div className="col-span-8 md:col-span-6 flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconStyles.bg} ${iconStyles.text}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {grade.courseName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {grade.courseCode}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 md:col-span-2 text-center text-sm text-gray-600 dark:text-gray-300 hidden md:block">
                  {grade.credits.toFixed(1)}
                </div>
                <div className="col-span-2 md:col-span-2 text-center text-sm hidden md:block">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {grade.type}
                  </span>
                </div>
                <div className="col-span-4 md:col-span-2 flex justify-end md:justify-center">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${gradeStyles.bg} ${gradeStyles.text}`}
                  >
                    {grade.grade}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400 gap-4">
          <span>
            GPA for this selection:{" "}
            <strong className="text-gray-900 dark:text-white">
              {gpa.toFixed(2)}
            </strong>
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">
              Showing{" "}
              {Math.min(
                itemsPerPage,
                grades.length - (currentPage - 1) * itemsPerPage
              )}{" "}
              of {grades.length} courses
            </span>
            <div className="-mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
