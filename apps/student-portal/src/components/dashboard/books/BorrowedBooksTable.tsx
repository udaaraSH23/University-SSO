// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-BOOKS-BORROWED
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:20:00Z

"use client";

const __FP_SIG = "FP-20251223-US-BOOKS-BORROWED|HASH-PLACEHOLDER";

import { CheckCircle } from "lucide-react";
import { BorrowedBookDTO } from "@repo/backend";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Pagination } from "@repo/ui";

interface BorrowedBooksTableProps {
  books: BorrowedBookDTO[];
}

const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(date))
    .replace(/-/g, ".");
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

export default function BorrowedBooksTable({ books }: BorrowedBooksTableProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        You haven't borrowed any books yet.
      </div>
    );
  }

  const [selectedMonth, setSelectedMonth] = useState<string>("All");

  // Extract unique months from borrowed books
  const availableMonths = Array.from(
    new Set(
      books.map((book) => {
        const date = new Date(book.borrowDate);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      })
    )
  ).sort((a, b) => b.localeCompare(a)); // Sort descending (newest first)

  // Filter books based on selected month
  const filteredBooks =
    selectedMonth === "All"
      ? books
      : books.filter((book) => {
          const date = new Date(book.borrowDate);
          const monthKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          return monthKey === selectedMonth;
        });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // Reset page when filter changes
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  };

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <select
          value={selectedMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
          className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option
            value="All"
            className="text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          >
            All Months
          </option>
          {availableMonths.map((month) => {
            const [year, monthNum] = month.split("-");
            const date = new Date(parseInt(year), parseInt(monthNum) - 1);
            const label = date.toLocaleString("default", {
              month: "long",
              year: "numeric",
            });
            return (
              <option
                key={month}
                value={month}
                className="text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              >
                {label}
              </option>
            );
          })}
        </select>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700/50">
        <div className="grid grid-cols-12 gap-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div className="col-span-6">Name</div>
          <div className="col-span-3">Borrowed Date</div>
          <div className="col-span-3">Return Date</div>
        </div>
        <motion.div
          className="divide-y divide-gray-100 dark:divide-gray-700"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {paginatedBooks.length > 0 ? (
              paginatedBooks.map((book) => {
                return (
                  <motion.div
                    key={book.recordId}
                    layout
                    variants={rowVariants}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-default"
                    whileHover={{
                      scale: 1.005,
                      backgroundColor: "rgba(249, 250, 251, 0.5)",
                    }}
                  >
                    <div className="col-span-6">
                      <Link
                        href={`/books/${book.bookId}`}
                        className="flex items-center group cursor-pointer"
                      >
                        <div className="flex-shrink-0 h-10 w-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="ml-4 truncate">
                          <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                            {book.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {book.author}
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-span-3 text-sm text-gray-900 dark:text-gray-300">
                      {formatDate(book.borrowDate)}
                    </div>
                    <div className="col-span-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {book.returnDate
                        ? formatDate(book.returnDate)
                        : "Not Returned"}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No books found for the selected month.
              </div>
            )}
          </AnimatePresence>
        </motion.div>
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700/50 flex justify-center -mt-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
