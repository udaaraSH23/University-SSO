// Author: Antigravity
// Project: University-Portal
// FP-ID: FP-20251225-AG-LIB-STATS
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T15:30:00Z

"use client";

import { InfoCard } from "./InfoCard";
import { Library, LogOut, Users } from "lucide-react";
import { motion } from "framer-motion";

export const __FP_SIG = "FP-20251225-AG-LIB-STATS|HASH-PLACEHOLDER";

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
 * Displays key statistical metrics for the library dashboard.
 * visualizes data using InfoCards with distinct color coding.
 *
 * @param {object} props - Component props
 * @param {number} props.availableBooks - Count of books currently on shelf
 * @param {number} props.borrowedBooks - Count of books currently checked out
 * @param {number} props.totalBooks - Total inventory count
 * @param {number} props.totalStudents - Count of registered student members
 */
export default function LibraryStats({
  availableBooks,
  borrowedBooks,
  totalBooks,
  totalStudents,
}: {
  availableBooks: number;
  borrowedBooks: number;
  totalBooks: number;
  totalStudents: number;
}) {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
    >
      <motion.div variants={item}>
        <InfoCard
          title="Available Books"
          value={availableBooks.toString()}
          icon={<Library className="w-6 h-6" />}
          color="blue"
        />
      </motion.div>
      <motion.div variants={item}>
        <InfoCard
          title="Borrowed Books"
          value={borrowedBooks.toString()}
          icon={<LogOut className="w-6 h-6 rotate-180" />}
          color="amber"
        />
      </motion.div>
      <motion.div variants={item}>
        <InfoCard
          title="Total Books"
          value={totalBooks.toString()}
          icon={<Library className="w-6 h-6" />}
          color="emerald"
        />
      </motion.div>
      <motion.div variants={item}>
        <InfoCard
          title="Total Students"
          value={totalStudents.toString()}
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
      </motion.div>
    </motion.section>
  );
}
