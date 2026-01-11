// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251225-US-BOOK-DETAIL
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:20:00Z

"use client";

const __FP_SIG = "FP-20251225-US-BOOK-DETAIL|HASH-PLACEHOLDER";

import { MoveLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

interface BookDetails {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  year: number;
  description: string;
  coverImage?: string;
  isAvailable: boolean;
}

interface BookDetailViewProps {
  book: BookDetails;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // Stagger children animations to create a fluid, cascading entrance effect
      // rather than all elements appearing at once, which can feel jarring.
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    // Use spring physics for a more natural, "weighty" feel compared to linear easing
    transition: { type: "spring" as const, stiffness: 50 },
  },
};

/**
 * Detailed view for a single book.
 *
 * Design:
 * - Uses a split-layout (Image Left, Details Right) standard in e-commerce/library apps for clarity.
 * - Heavily animated using Framer Motion to maintain the premium feel of the dashboard.
 * - Includes direct navigation back to the library to prevent user entrapment.
 */
export default function BookDetailView({ book }: BookDetailViewProps) {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex justify-between items-center mb-8 px-8 pt-6"
      >
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-1">
            <Home className="w-4 h-4" />
            <span>/</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Books
            </span>
            <span>/</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {book.title}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white pt-4">
            Book Details
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            View your academic performance history.
          </span>
        </div>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-8 max-w-5xl mx-auto w-full"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <Link
            href="/books"
            className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors group"
          >
            <MoveLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Library
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200"
        >
          <div className="flex flex-col md:flex-row">
            {/* Cover Image Section */}
            <div className="md:w-1/3 bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring" as const }}
                className="w-40 h-60 bg-gradient-to-br from-indigo-500 to-purple-600 rounded shadow-xl flex flex-col items-center justify-center text-white relative transform transition hover:scale-105 duration-300"
              >
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover rounded shadow-xl"
                  />
                ) : (
                  <>
                    <BookOpen className="w-12 h-12 mb-2 opacity-80" />
                    <div className="absolute bottom-4 left-0 w-full px-4">
                      <div className="h-2 w-full bg-white/20 rounded mb-1"></div>
                      <div className="h-2 w-2/3 bg-white/20 rounded"></div>
                    </div>
                  </>
                )}
              </motion.div>
            </div>

            {/* Details Section */}
            <div className="md:w-2/3 p-8 md:p-12 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <motion.h2
                    variants={itemVariants}
                    className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
                  >
                    {book.title}
                  </motion.h2>
                  <motion.p
                    variants={itemVariants}
                    className="text-lg text-slate-500 dark:text-slate-400"
                  >
                    {book.author}
                  </motion.p>
                </div>
                <motion.div
                  variants={itemVariants}
                  className={`flex items-center px-4 py-2 rounded-full ${
                    book.isAvailable
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full mr-2 ${
                      book.isAvailable
                        ? "bg-green-500 animate-pulse"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <span className="font-semibold text-sm">
                    {book.isAvailable ? "Available" : "Checked Out"}
                  </span>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mt-4">
                <motion.div variants={itemVariants}>
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    Author Name
                  </h3>
                  <p className="text-slate-800 dark:text-slate-200 font-medium text-lg">
                    {book.author}
                  </p>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    ISBN
                  </h3>
                  <p className="text-slate-800 dark:text-slate-200 font-medium text-lg font-mono">
                    {book.isbn}
                  </p>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    Publisher
                  </h3>
                  <p className="text-slate-800 dark:text-slate-200 font-medium text-lg">
                    {book.publisher}
                  </p>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    Publication Year
                  </h3>
                  <p className="text-slate-800 dark:text-slate-200 font-medium text-lg">
                    {book.year}
                  </p>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="col-span-1 sm:col-span-2 mt-4 pt-6 border-t border-slate-100 dark:border-slate-700"
                >
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-2">
                    Description
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {book.description}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
