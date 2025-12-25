// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-F2G3H4
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:25:00Z

"use client";

const __FP_SIG = "FP-20251223-US-F2G3H4|HASH-PLACEHOLDER";

import { Filter, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { motion } from "framer-motion";

/**
 * GradesFilter Component
 *
 * Provides a UI for students to filter their grades by Year and Semester.
 *
 * Why Server-Side Filtering (via URL)?
 * - Maintains state in the URL (`?year=1&semester=2`) so users can share or bookmark the filtered view.
 * - Allows the Server Component (`page.tsx`) to read these params and perform the filtering logic/fetching
 *   without requiring complex client-side state management or API refetching chains.
 */
export default function GradesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize local state from URL params to keep UI in sync with the current URL
  const [year, setYear] = useState(searchParams.get("year") || "all");
  const [semester, setSemester] = useState(
    searchParams.get("semester") || "all"
  );
  const [isPending, setIsPending] = useState(false);

  /**
   * Applies the selected filters by pushing a new URL.
   * This triggers the Server Component to re-render with the new parameters.
   */
  const handleApply = () => {
    setIsPending(true);
    const params = new URLSearchParams();

    // Only set params if they are not the default "all" value to keep URL clean
    if (year !== "all") params.set("year", year);
    if (semester !== "all") params.set("semester", semester);

    router.push(`?${params.toString()}`);
    // Note: isPending will be reset when the router navigation completes/component rehydrates,
    // or we can manually reset it if we want immediate feedback control.
    setIsPending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="flex-1 md:flex-none md:w-48">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="year"
          >
            Year
          </label>
          <div className="relative">
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition-shadow appearance-none"
            >
              <option value="all">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="flex-1 md:flex-none md:w-48">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            htmlFor="semester"
          >
            Semester
          </label>
          <div className="relative">
            <select
              id="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition-shadow appearance-none"
            >
              <option value="all">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="flex-none">
          <button
            onClick={handleApply}
            disabled={isPending}
            className="flex-1 md:flex-none px-6 py-2.5 text-sm font-medium text-gray-600 cursor-pointer dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            type="button"
          >
            {isPending ? (
              <span className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Filter className="w-4 h-4 mr-2" />
            )}
            Filter Grades
          </button>
        </div>
      </div>
    </motion.div>
  );
}
