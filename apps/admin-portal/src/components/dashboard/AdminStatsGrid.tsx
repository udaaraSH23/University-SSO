"use client";

// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251231-US-ADMIN-STATS
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-31T19:33:00+05:30

const __FP_SIG = "FP-20251231-US-ADMIN-STATS|HASH-PLACEHOLDER";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, BookOpen, Building2, UserCheck } from "lucide-react";
// import { useEffect, useState } from "react";
// import { getAdminMetricsAction } from "../../actions/dashboard.actions";

export interface AdminStats {
  totalStudents: number;
  totalCourses: number;
  totalDepartments: number;
  totalFaculties: number;
}

interface AdminStatsGridProps {
  stats: AdminStats;
}

/**
 * AdminStatsGrid Component
 * ========================
 * This component displays the high-level statistics of the University Portal.
 * It serves as the primary visual indicator of the system's status on the dashboard.
 *
 * Features:
 * - Accepts data via props (Server Component -> Client Component).
 * - Staggered entrance animations for visual appeal.
 * - Responsive grid layout (1 col mobile -> 4 cols large (desktop)).
 * - Deep links to specific management modules.
 */
export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  // Data fetching handled by parent Server Component

  // Configuration for the statistics cards
  // Maps the raw data to visual properties (icon, color, label)
  const statItems = [
    {
      name: "All Students",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      color: "bg-indigo-100 dark:bg-indigo-900/30",
      textColor: "text-indigo-600 dark:text-indigo-400",
      action: "View all students",
      href: "/students", // Links to Student Management
    },
    {
      name: "All Courses",
      value: stats.totalCourses.toLocaleString(),
      icon: BookOpen,
      color: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-600 dark:text-green-400",
      action: "View catalog",
      href: "/academics/courses", // Links to Course Catalog
    },
    {
      name: "Departments",
      value: stats.totalDepartments.toLocaleString(),
      icon: Building2,
      color: "bg-orange-100 dark:bg-orange-900/30",
      textColor: "text-orange-600 dark:text-orange-400",
      action: "Manage depts",
      href: "/academics/departments", // Links to Departments
    },
    {
      name: "Active Faculties",
      value: stats.totalFaculties.toLocaleString(),
      icon: UserCheck,
      color: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-600 dark:text-purple-400",
      action: "View roster",
      href: "/academics/faculties", // Links to Faculty Management
    },
  ];

  // Animation Variants for Framer Motion

  // Container: Orchestrates the staggered entrance of cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Item: Individual card entrance animation (slide up + fade in)
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
    >
      {statItems.map((stat) => (
        <motion.div
          key={stat.name}
          variants={item}
          whileHover={{ y: -5 }} // Subtle lift effect on hover
          className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          {/* Card Body: Icon and Value */}
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Card Footer: Action Link */}
          <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3">
            <div className="text-sm">
              <Link
                href={stat.href}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
              >
                {stat.action}{" "}
                <span className="ml-1" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
