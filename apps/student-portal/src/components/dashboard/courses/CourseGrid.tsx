// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251225-US-COURSE-GRID
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:25:00Z

"use client";

const __FP_SIG = "FP-20251225-US-COURSE-GRID|HASH-PLACEHOLDER";

/**
 * CourseGrid
 * The main content area of the courses page.
 * Groups course cards by academic term (Year/Semester).
 * Manages layout responsiveness and staggered animations.
 *
 * Usage:
 *     <CourseGrid courses={courses} />
 */

import { motion } from "framer-motion";
import CourseCard from "./CourseCard";
import { CourseDTO } from "@repo/backend";

// Staggered animation container for the grid
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface CourseGridProps {
  courses: CourseDTO[];
}

/**
 * Grid layout component for courses.
 * Groups courses by semester sections.
 */
export default function CourseGrid({ courses }: CourseGridProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface-light dark:bg-surface-dark rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No courses found
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  // Group courses by "Year - Semester"
  // Logic: Courses are often queried as a flat list. We group them client-side
  // to provide a structured, term-by-term view which is more mental-model friendly for students.
  const groupedCourses = courses.reduce((acc, course) => {
    // Format: "3rd Year — 2nd Semester"
    // Helper to add ordinal suffix (1st, 2nd, 3rd)
    const ordinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    // Check if year is a number or string number
    const yearNum = course.level; // course.level is already a number
    const yearDisplay = ordinal(yearNum);

    const semDisplay =
      course.semester === 9 ? "Summer" : ordinal(course.semester);

    const key = `${yearDisplay} Year — ${semDisplay} Semester`;

    if (!acc[key]) acc[key] = [];
    acc[key].push(course);
    return acc;
  }, {} as Record<string, CourseDTO[]>);

  // Sort keys to show latest first (assuming higher year/sem is later)
  // We want students to see their most recent/advanced courses at the top.
  const sortedKeys = Object.keys(groupedCourses).sort().reverse();

  // Color mapping logic:
  // Assigns colors cyclically based on courseId to ensure visual variety without randomizing on every render.
  const colors: ("blue" | "purple" | "emerald" | "orange")[] = [
    "blue",
    "purple",
    "emerald",
    "orange",
  ];

  return (
    <motion.div
      key={sortedKeys.join("-") + courses.length}
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      {sortedKeys.map((sectionTitle) => (
        <section key={sectionTitle}>
          <div className="flex items-center mb-6">
            <div className="h-6 w-1 bg-primary rounded-full mr-3"></div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {sectionTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {groupedCourses[sectionTitle].map((course, index) => (
              <CourseCard
                key={course.enrollmentId || `${course.courseId}-${index}`}
                code={course.code}
                title={course.name}
                instructor="Prof. N/A" // Instructor not in DTO yet
                color={colors[course.courseId % 4]}
                iconName="code" // Ignored by CourseCard currently
                semester={course.semester}
              />
            ))}
          </div>
        </section>
      ))}
    </motion.div>
  );
}
