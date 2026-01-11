"use client";

import { ReactNode } from "react";
import { Filter } from "lucide-react";
import { motion } from "framer-motion";

export interface FilterWrapperProps {
  title?: string;
  children?: ReactNode; // Advanced filters (Bottom row)
  searchNode?: ReactNode; // Search input (Top row)
  resourceCount?: number;
  actions?: ReactNode; // Search button & other actions (Top row)
}

/**
 * FilterWrapper
 *
 * Purpose:
 * - Admin Portal specific filter wrapper.
 * - 2-row layout:
 *   - Top: Title | Search Input + Actions
 *   - Bottom: Filters
 */
export function FilterWrapper({
  title = "Search Filters",
  children,
  searchNode,
  resourceCount,
  actions,
}: FilterWrapperProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors mb-6 overflow-hidden"
    >
      {/* Top Row: Title & Search/Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4">
        {/* Title & Count */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium whitespace-nowrap">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">{title}</span>
          </div>
          {resourceCount !== undefined && (
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
              {resourceCount}
            </span>
          )}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {searchNode && (
            <div className="flex-1 md:flex-none min-w-[250px]">
              {searchNode}
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>

      {/* Bottom Row: Filters */}
      {children && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {children}
          </div>
        </div>
      )}
    </motion.section>
  );
}
