// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251225-US-COURSE-CARD
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:20:00Z

"use client";

const __FP_SIG = "FP-20251225-US-COURSE-CARD|HASH-PLACEHOLDER";

/**
 * CourseCard
 * A component that displays individual course details.
 * Features dynamic styling based on the assigned color prop.
 *
 * Usage:
 *     <CourseCard
 *       code="CS302"
 *       title="Advanced Web Development"
 *       instructor="Prof. Sarah"
 *       color="blue"
 *     />
 */

import { motion } from "framer-motion";
import { Code, Database, FunctionSquare, BrainCircuit } from "lucide-react";

interface CourseCardProps {
  /** The course code (e.g., CS-101) */
  code: string;
  /** The full title of the course */
  title: string;
  /** Name of the instructor */
  instructor: string;
  /** Theme color for the card's branding */
  color: "blue" | "purple" | "emerald" | "orange";
  /** Icon identifier (currently mapped internally by color in this dummy implementation) */
  iconName: string;
  /** The semester the course belongs to */
  semester: number;
}

// Configuration map for dynamic styling based on the 'color' prop
const colorMap = {
  blue: {
    gradient: "from-blue-500 to-indigo-600",
    text: "text-primary",
    groupHover: "group-hover:text-primary",
    icon: Code,
    iconColor: "text-primary",
  },
  purple: {
    gradient: "from-purple-500 to-pink-600",
    text: "text-purple-500",
    groupHover: "group-hover:text-purple-500",
    icon: Database,
    iconColor: "text-purple-500",
  },
  emerald: {
    gradient: "from-emerald-500 to-teal-600",
    text: "text-emerald-500",
    groupHover: "group-hover:text-emerald-500",
    icon: FunctionSquare,
    iconColor: "text-emerald-500",
  },
  orange: {
    gradient: "from-orange-400 to-red-500",
    text: "text-orange-500",
    groupHover: "group-hover:text-orange-500",
    icon: BrainCircuit,
    iconColor: "text-orange-500",
  },
};

// Animation variants for card entrance
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/**
 * Renders a course card with specific coloring and icon.
 *
 * @param {CourseCardProps} props - Component properties
 */
export default function CourseCard({
  code,
  title,
  instructor,
  color,
  semester,
}: CourseCardProps) {
  // Retrieve style configuration based on the passed color prop
  const styles = colorMap[color];
  const Icon = styles.icon;

  return (
    <motion.div
      variants={item}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer flex flex-col h-64"
    >
      <div
        className={`h-24 bg-gradient-to-r ${styles.gradient} relative p-4 flex items-start justify-end`}
      >
        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {code}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1 relative">
        <div className="absolute -top-8 left-5 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <Icon className={`w-6 h-6 ${styles.iconColor}`} />
        </div>
        <h3
          className={`mt-4 text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2 ${styles.groupHover} transition-colors`}
        >
          {title}
        </h3>
        <div className="mt-auto flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {instructor}
          </p>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            Sem {semester}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
