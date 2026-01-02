// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251226-US-STUDENT-STATSCARD
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T23:00:00Z

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const __FP_SIG = "FP-20251226-US-STUDENT-STATSCARD|HASH-PLACEHOLDER";

export interface StatsCardProps {
  /** Title of the statistic */
  title: string;
  /** Value to display */
  value: string | number;
  /** Icon to display */
  icon: ReactNode;
  /** Color theme for the icon background */
  color: "blue" | "purple" | "green" | "emerald" | "amber" | "red" | "indigo";
  /** Optional trend or description */
  description?: string;
  /** Animation variants */
  variants?: {
    hidden: { opacity: number; y: number };
    show: { opacity: number; y: number };
  };
}

const defaultItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/**
 * Shared dashboard statistics card.
 * Displays a value, title, and icon with a colored background.
 *
 * @param {StatsCardProps} props - Component properties
 */
export function StatsCard({
  title,
  value,
  icon,
  color,
  description,
  variants,
}: StatsCardProps) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-500" },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-400",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-400",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-400",
    },
    red: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-500" },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      text: "text-indigo-600 dark:text-indigo-400",
    },
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      variants={variants || defaultItemVariants}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4 w-full justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-16 h-16 rounded-full ${selectedColor.bg} flex items-center justify-center flex-shrink-0`}
          >
            <span className={selectedColor.text}>{icon}</span>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {value}
            </h3>
            {description && (
              <p className="text-xs text-gray-400 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
