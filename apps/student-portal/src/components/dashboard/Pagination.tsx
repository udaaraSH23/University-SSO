// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251225-US-PAGINATION
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:15:00Z

"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

const __FP_SIG = "FP-20251225-US-PAGINATION|HASH-PLACEHOLDER";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  basePath?: string; // If provided, uses Link for navigation
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  basePath,
}: PaginationProps) {
  const searchParams = useSearchParams();

  // Helper to generate URL for server-side pagination
  const getPageUrl = (page: number) => {
    if (!basePath) return "#";
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${basePath}?${params.toString()}`;
  };

  const isClientMode = !basePath;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {/* Previous Button */}
      {isClientMode ? (
        <button
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      ) : (
        <Link
          href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
          aria-disabled={currentPage === 1}
          className={`p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
            currentPage === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // Logic to show limited page numbers can be added here if needed
          // For now, simple list
          const isActive = page === currentPage;
          const styleClass = `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? "bg-primary text-white"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`;

          if (isClientMode) {
            return (
              <button
                key={page}
                onClick={() => onPageChange?.(page)}
                className={styleClass}
              >
                {page}
              </button>
            );
          } else {
            return (
              <Link key={page} href={getPageUrl(page)} className={styleClass}>
                {page}
              </Link>
            );
          }
        })}
      </div>

      {/* Next Button */}
      {isClientMode ? (
        <button
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <Link
          href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
          aria-disabled={currentPage === totalPages}
          className={`p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
            currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
          }`}
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
