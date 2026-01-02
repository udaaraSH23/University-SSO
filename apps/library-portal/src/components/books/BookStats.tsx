"use client";

import { LibraryDashboardStats } from "@repo/backend";
import { Book, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface BookStatsProps {
  stats: LibraryDashboardStats;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/**
 * Component for displaying book-related statistics in the books dashboard.
 * Shows detailed breakdown of inventory status (Total, Borrowed, Available, Overdue).
 *
 * @param {object} props - Component props
 * @param {LibraryDashboardStats} props.stats - Statistical data from backend
 */
export default function BookStats({ stats }: BookStatsProps) {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {/* All Books */}
      <motion.div
        variants={item}
        className="flex flex-col items-start w-full text-left bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-indigo-600 dark:border-indigo-500 shadow-lg shadow-indigo-500/10 transition-all transform hover:scale-[1.02] cursor-pointer"
      >
        <div className="flex items-center gap-2 mb-2">
          <Book className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            All books
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {stats.totalBooks}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {stats.uniqueBooks} Unique Titles
          </p>
        </div>
      </motion.div>

      {/* Borrowed */}
      <motion.div
        variants={item}
        className="flex flex-col items-start w-full text-left bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all transform hover:-translate-y-0.5 group cursor-pointer"
      >
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Borrowed
          </p>
        </div>
        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
          {stats.borrowedBooks}
        </p>
      </motion.div>

      {/* Available */}
      <motion.div
        variants={item}
        className="flex flex-col items-start w-full text-left bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all transform hover:-translate-y-0.5 group cursor-pointer"
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            Available
          </p>
        </div>
        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
          {stats.availableBooks}
        </p>
      </motion.div>

      {/* Overdue */}
      <motion.div
        variants={item}
        className="flex flex-col items-start w-full text-left bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all transform hover:-translate-y-0.5 group cursor-pointer"
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            Overdue
          </p>
        </div>
        <p className="text-2xl font-bold text-rose-500 dark:text-rose-400 mt-2">
          {stats.overdueBooks}
        </p>
      </motion.div>
    </motion.section>
  );
}
