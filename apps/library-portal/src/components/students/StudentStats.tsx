"use client";

import { Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface StudentStatsProps {
  stats: {
    totalStudents: number;
    registeredStudents: number;
  };
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
 * Displays statistical overview of student registrations in the library.
 *
 * @param {object} props - Component props
 * @param {object} props.stats - Statistical data
 * @param {number} props.stats.totalStudents - Total number of students in the university
 * @param {number} props.stats.registeredStudents - Number of students registered for library services
 */
export default function StudentStats({ stats }: StudentStatsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Total Students */}
      <motion.div
        variants={item}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Total Students
          </h2>
          <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {stats.totalStudents}
          </div>
        </div>
        <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Users className="w-6 h-6" />
        </div>
      </motion.div>

      {/* Registered Students */}
      <motion.div
        variants={item}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Registered Students
          </h2>
          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.registeredStudents}
          </div>
        </div>
        <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-6 h-6" />
        </div>
      </motion.div>
    </motion.div>
  );
}
