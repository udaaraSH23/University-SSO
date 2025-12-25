// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251225-US-COURSE-FILTER
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:25:00Z

"use client";

const __FP_SIG = "FP-20251225-US-COURSE-FILTER|HASH-PLACEHOLDER";

/**
 * CourseFilter
 * A sub-header component that provides filtering controls for the course list.
 * Allows filtering by Year and Semester.
 *
 * Usage:
 *     <CourseFilter />
 */

import { Calendar, CalendarRange, ChevronDown, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { motion } from "framer-motion";

/**
 * Filter controls for the courses page.
 * Uses URL search params to manage filter state.
 */
export default function CourseFilter() {
  // Initialize router and search parameters hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Initialize local filter states (year and semester) from the current URL search parameters
  const [year, setYear] = useState(searchParams.get("year") || "all");
  const [semester, setSemester] = useState(
    searchParams.get("semester") || "all"
  );

  // Sync state with URL changes (e.g., on Reset or manual navigation)
  useEffect(() => {
    setYear(searchParams.get("year") || "all");
    setSemester(searchParams.get("semester") || "all");
  }, [searchParams]);

  const handleApply = () => {
    const params = new URLSearchParams();
    if (year !== "all") params.set("year", year);
    if (semester !== "all") params.set("semester", semester);

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setYear("all");
    setSemester("all");
    startTransition(() => {
      router.push("?");
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div className="flex flex-col sm:flex-row gap-5 flex-1">
          <div className="w-full sm:w-64">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Year
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white dark:focus:ring-blue-500/20 dark:focus:border-blue-500 cursor-pointer appearance-none transition-all shadow-sm"
              >
                <option value="all">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="w-full sm:w-64">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Semester
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarRange className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white dark:focus:ring-blue-500/20 dark:focus:border-blue-500 cursor-pointer appearance-none transition-all shadow-sm"
              >
                <option value="all">All Semesters</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleReset}
            className="flex-1 md:flex-none px-4 py-2.5 text-sm font-medium text-gray-600 cursor-pointer dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            disabled={isPending}
            className="flex-1 md:flex-none px-6 py-2.5 text-sm font-medium text-gray-600 cursor-pointer dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Filter className="w-5 h-5" />
            )}
            Apply
          </button>
        </div>
      </div>
    </motion.div>
  );
}
