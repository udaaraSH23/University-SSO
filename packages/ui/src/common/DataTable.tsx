"use client";

import { Pagination, PaginationProps } from "./Pagination";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-UI-DATA-TABLE
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T12:25:10+05:30

const __FP_SIG = "FP-20260101-UI-DATA-TABLE|HASH-PLACEHOLDER";

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((item: T) => ReactNode);
  className?: string;
  render?: (item: T) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => ReactNode;
  noDataMessage?: string;
  isLoading?: boolean;
  pagination?: PaginationProps;
}

/**
 * DataTable Component
 *
 * Purpose:
 * - A reusable, consistent table component for displaying data lists.
 * - Supports custom columns, actions, loading states, and empty states.
 *
 * Responsibilities:
 * - Rendering table headers and rows based on configuration.
 * - Handling loading and empty data scenarios gracefully.
 */
export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  actions,
  noDataMessage = "No data found.",
  isLoading = false,
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 ${col.className || ""}`}
                  >
                    {col.header}
                  </th>
                ))}
                {actions && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500 animate-pulse"
                  >
                    Loading data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {noDataMessage}
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {columns.map((col, index) => {
                      let content: ReactNode;
                      if (col.render) {
                        content = col.render(item);
                      } else if (typeof col.accessor === "function") {
                        content = col.accessor(item);
                      } else if (col.accessor) {
                        content = item[col.accessor] as unknown as ReactNode;
                      }

                      return (
                        <td
                          key={index}
                          className={`px-6 py-4 ${col.className || ""}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                    {actions && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {actions(item)}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {pagination && <Pagination {...pagination} />}
    </div>
  );
}
