// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-M3N4O5
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:15:00Z

"use client";

/**
 * BookList
 * A widget displaying pending or borrowed library books.
 * Visualizes books with icons and due dates.
 *
 * Usage:
 *     <BookList />
 */

import { Book, Bookmark, BookOpen, Library, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const __FP_SIG = "FP-20251223-US-M3N4O5|HASH-PLACEHOLDER";

// Animation container variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation item variants (scale up)
const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

/**
 * Component listing library books.
 */
interface BookListProps {
  books: Array<{
    title: string;
    author: string;
    dueDate: Date;
    status: string;
  }>;
}

/**
 * Component listing library books.
 */
export default function BookList({ books }: BookListProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="space-y-6 mt-10"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Pending Books
        </h2>
      </div>
      {books.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
          No pending books.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {books.map((book, index) => {
            // Simple logic to format due date string for demo
            const diffDays = Math.ceil(
              (new Date(book.dueDate).getTime() - new Date().getTime()) /
                (1000 * 3600 * 24)
            );
            const dueText =
              diffDays < 0
                ? "Overdue"
                : diffDays === 0
                ? "Due Today"
                : `Due in ${diffDays} Days`;
            const dueClass =
              diffDays < 3
                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
            const Icon = index % 2 === 0 ? Book : BookOpen;
            const color = index % 2 === 0 ? "red" : "blue";

            return (
              <BookItem
                key={index}
                title={book.title}
                author={book.author}
                icon={
                  <Icon
                    className={`text-${color}-300 dark:text-${color}-800 w-8 h-8 group-hover:scale-110 transition-transform duration-300`}
                  />
                }
                bgClass={`bg-${color}-50 dark:bg-${color}-900/10`}
                dueText={dueText}
                dueClass={dueClass}
              />
            );
          })}
        </div>
      )}
      <div className="flex justify-center mt-6">
        <Link
          href="/books"
          className="text-sm font-medium text-primary hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full"
        >
          View All Books <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

interface BookItemProps {
  title: string;
  author: string;
  icon: React.ReactNode;
  bgClass: string;
  dueText: string;
  dueClass: string;
}

function BookItem({
  title,
  author,
  icon,
  bgClass,
  dueText,
  dueClass,
}: BookItemProps) {
  return (
    <motion.div
      variants={item}
      className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
    >
      <div
        className={`aspect-[3/4] ${bgClass} rounded-lg mb-2 flex items-center justify-center relative overflow-hidden`}
      >
        {icon}
      </div>
      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
        {author}
      </p>
      <div className="mt-auto pt-3">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-md ${dueClass}`}
        >
          {dueText}
        </span>
      </div>
    </motion.div>
  );
}
