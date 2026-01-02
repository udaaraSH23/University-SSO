// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-J0K1L2
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:15:00Z

"use client";

/**
 * CourseList
 * A widget displaying a list of current semester courses.
 * Uses Framer Motion for list item animations.
 *
 * Usage:
 *     <CourseList />
 */

import { motion } from "framer-motion";
import { useState } from "react";
import { Pagination } from "@repo/ui";

const __FP_SIG = "FP-20251223-US-J0K1L2|HASH-PLACEHOLDER";

// Animation container variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation item variants (slide in from left)
const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

/**
 * Component listing current courses.
 */
interface CourseListProps {
  courses: Array<{
    code: string;
    name: string;
    description: string;
    credits: number;
    color: string;
  }>;
  year: string;
  semester: number;
}

/**
 * Component listing current courses.
 */
export default function CourseList({
  courses,
  year,
  semester,
}: CourseListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  const paginatedCourses = courses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        Current Courses (Year {year} • Semester {semester})
      </h2>
      {courses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
          No courses currently enrolled.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paginatedCourses.map((course, index) => (
              <CourseItem
                key={index}
                code={course.code}
                name={course.name}
                details={`${course.description} • ${course.credits} Credits`}
                badgeClass={`bg-${course.color}-100 dark:bg-${course.color}-900 text-${course.color}-700 dark:text-${course.color}-300`}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </motion.div>
  );
}

interface CourseItemProps {
  code: string;
  name: string;
  details: string;
  badgeClass: string;
}

function CourseItem({ code, name, details, badgeClass }: CourseItemProps) {
  return (
    <motion.div
      variants={item}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-center"
    >
      <div>
        <span
          className={`${badgeClass} text-xs font-bold px-2 py-1 rounded uppercase tracking-wide`}
        >
          {code}
        </span>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-2">
          {name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {details}
        </p>
      </div>
    </motion.div>
  );
}
