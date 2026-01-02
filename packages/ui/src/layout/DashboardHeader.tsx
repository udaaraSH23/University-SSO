// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251226-US-SHARED-UI
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:45:00Z

"use client";

import { Home } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

const __FP_SIG = "FP-20251225-AG-SHARED-UI|HASH-PLACEHOLDER";

export interface DashboardHeaderProps {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** Breadcrumb elements or path */
  breadcrumb?: { label: string; href?: string }[];
  /** Right-side actions (buttons, toggles) */
  children?: ReactNode;
  /** Whether to show the home icon in breadcrumbs */
  showHomeIcon?: boolean;
}

/**
 * Shared dashboard header component.
 * Displays title, description, breadcrumbs, and action buttons.
 *
 * @param {DashboardHeaderProps} props - Component properties
 */
export function DashboardHeader({
  title,
  description,
  breadcrumb,
  children,
  showHomeIcon = true,
}: DashboardHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-6"
    >
      <div>
        {(breadcrumb || showHomeIcon) && (
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-1">
            {showHomeIcon && <Home className="w-4 h-4" />}
            {breadcrumb &&
              breadcrumb.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span>/</span>
                  <span
                    className={
                      index === breadcrumb.length - 1
                        ? "font-medium text-gray-900 dark:text-white"
                        : ""
                    }
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            {!breadcrumb && showHomeIcon && (
              <>
                <span>/</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {title}
                </span>
              </>
            )}
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white pt-2">
          {title}
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400 block mt-1">
          {description}
        </span>
      </div>

      {children && <div className="flex items-center gap-4">{children}</div>}
    </motion.header>
  );
}
