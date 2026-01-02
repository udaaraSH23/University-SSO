// Author: Antigravity
// Project: University-Portal
// FP-ID: FP-20251225-AG-LIB-ALERT
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T15:30:00Z

"use client";

import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export const __FP_SIG = "FP-20251225-AG-LIB-ALERT|HASH-PLACEHOLDER";

/**
 * Alert banner for displaying urgent attention items.
 * Renders only if there are overdue books requiring action.
 *
 * @param {object} props - Component props
 * @param {number} props.overdueCount - The number of books currently overdue
 */
export default function OverdueAlert({
  overdueCount,
}: {
  overdueCount: number;
}) {
  // Hide component entirely if no overdue items exist to reduce noise
  if (overdueCount === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
    >
      <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between md:justify-start md:gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-500 w-6 h-6" />
            <h3 className="font-semibold text-red-700 dark:text-red-400">
              Overdue Books
            </h3>
          </div>
          <span className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 text-xs font-bold px-2 py-1 rounded">
            {overdueCount} Pending
          </span>
        </div>
        <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end md:gap-4">
          <p className="text-sm text-red-600/80 dark:text-red-400/80">
            Action required immediately
          </p>
          <button className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:underline">
            See more
          </button>
        </div>
      </div>
    </motion.section>
  );
}
