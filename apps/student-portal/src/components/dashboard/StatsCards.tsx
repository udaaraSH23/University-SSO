// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-G7H8I9
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:15:00Z

"use client";

/**
 * StatsCards
 * A widget displaying key academic statistics (GPA, Books, Credits) in a grid layout.
 * Uses Framer Motion for entrance animations.
 *
 * Usage:
 *     <StatsCards />
 */

import Link from "next/link";
import { Award, BookOpen, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const __FP_SIG = "FP-20251223-US-G7H8I9|HASH-PLACEHOLDER";

// Animation container variants for staggering children animations
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation item variants for slide-up effect
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/**
 * Dashboard widget showing a grid of statistical cards.
 */
interface StatsCardsProps {
  gpa: number;
  booksBorrowed: number;
  creditsEarned: number;
}

/**
 * Dashboard widget showing a grid of statistical cards.
 */
export default function StatsCards({
  gpa,
  booksBorrowed,
  creditsEarned,
}: StatsCardsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
    >
      <motion.div
        variants={item}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-4"
      >
        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
          <Award className="text-blue-500 w-8 h-8" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Current GPA
          </p>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {gpa}
          </h3>
        </div>
      </motion.div>
      <motion.div
        variants={item}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-4"
      >
        <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
          <BookOpen className="text-purple-600 w-8 h-8" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Pending Books
          </p>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {booksBorrowed}
          </h3>
        </div>
      </motion.div>
      <motion.div
        variants={item}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-4"
      >
        <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="text-green-600 w-8 h-8" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Credits Earned
          </p>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {creditsEarned}
          </h3>
        </div>
      </motion.div>
    </motion.div>
  );
}
