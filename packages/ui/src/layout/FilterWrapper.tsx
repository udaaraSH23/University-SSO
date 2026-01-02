"use client";

// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-UI-FILTER-WRAPPER
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T14:45:00+05:30

const __FP_SIG = "FP-20260101-UI-FILTER-WRAPPER|HASH-PLACEHOLDER";

import { ReactNode } from "react";
import { Filter, Search, X } from "lucide-react";
import { motion } from "framer-motion";

/**
 * FilterWrapperProps
 */
export interface FilterWrapperProps {
  title?: string;
  children?: ReactNode; // Advanced filters
  searchNode?: ReactNode; // The search input component
  onSearch?: () => void;
  onClear?: () => void;
  resourceCount?: number;
  actions?: ReactNode;
}

/**
 * FilterWrapper
 *
 * Purpose:
 * - A compact, single-row bar for searching and filtering resources.
 * - Non-collapsible: content flows naturally.
 */
export function FilterWrapper({
  title = "Search Filters",
  children,
  searchNode,
  onSearch,
  onClear,
  resourceCount,
  actions,
}: FilterWrapperProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors mb-6 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center p-3 gap-4">
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

        {/* Filters & Search Container - Flex Wrap for responsiveness */}
        <div className="flex flex-1 flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Render custom filters first if user prefers filters on left, or search on left. 
               User requested: "filter button search bar and search button should in same row"
               Let's put filters (children) then Search.
           */}

          {children && (
            <div className="flex items-center gap-3 flex-wrap">{children}</div>
          )}

          {/* Search Node */}
          {searchNode && (
            <div className="min-w-[200px] flex-1 md:flex-none">
              {searchNode}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onSearch && (
              <button
                onClick={onSearch}
                className="p-2bg-blue-600 hover:bg-blue-700 text-white bg-blue-600 rounded-lg transition-colors shadow-sm"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {onClear && (
              <button
                onClick={onClear}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Clear Filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Legacy Footer Actions support */}
      {!children && !searchNode && actions && (
        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
          {actions}
        </div>
      )}
    </motion.section>
  );
}
