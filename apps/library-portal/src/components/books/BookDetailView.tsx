"use client";

import { MoveLeft, BookOpen, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { BorrowRecord, StudentProfile } from "@repo/database";
import Image from "next/image";

interface BookDetails {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  year: number;
  description: string | null;
  coverUrl: string | null;
  available_copies: number;
  total_copies: number;
  active: (BorrowRecord & { studentProfile: StudentProfile })[];
  history: (BorrowRecord & { studentProfile: StudentProfile })[];
}

interface BookDetailViewProps {
  book: BookDetails;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
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
    transition: { type: "spring" as const, stiffness: 50 },
  },
};

export default function BookDetailView({ book }: BookDetailViewProps) {
  const isAvailable = book.available_copies > 0;

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
            View book information and borrowing history.
          </span>
        </div>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-8 max-w-6xl mx-auto w-full"
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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8"
        >
          <div className="flex flex-col md:flex-row">
            {/* Cover Image Section */}
            <div className="md:w-1/3 bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-48 h-72 bg-gradient-to-br from-indigo-500 to-purple-600 rounded shadow-xl flex flex-col items-center justify-center text-white relative transform transition hover:scale-105 duration-300"
              >
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover rounded shadow-xl"
                  />
                ) : (
                  <>
                    <BookOpen className="w-16 h-16 mb-2 opacity-80" />
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
                    isAvailable
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full mr-2 ${
                      isAvailable ? "bg-green-500 animate-pulse" : "bg-red-500"
                    }`}
                  ></span>
                  <span className="font-semibold text-sm">
                    {isAvailable ? "Available" : "Stock Empty"}
                  </span>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mt-4">
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
                    {book.publisher || "N/A"}
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
                <motion.div variants={itemVariants}>
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-1">
                    Copies
                  </h3>
                  <p className="text-slate-800 dark:text-slate-200 font-medium text-lg">
                    {book.available_copies} / {book.total_copies}
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
                    {book.description || "No description available."}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Borrowing Info Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Loans */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Current Borrowers
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              {book.active && book.active.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="px-6 py-3 font-medium">Student</th>
                        <th className="px-6 py-3 font-medium">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {book.active.map((record) => (
                        <tr
                          key={record.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
                        >
                          <td className="px-6 py-3">
                            <div className="font-medium text-slate-900 dark:text-white">
                              {record.studentProfile.full_name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {record.studentProfile.student_id}
                            </div>
                          </td>
                          <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                            {new Date(record.due_date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No active loans.
                </div>
              )}
            </div>
          </motion.div>

          {/* Borrow History */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Borrow History (Recent)
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              {book.history && book.history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
                      <tr>
                        <th className="px-6 py-3 font-medium">Student</th>
                        <th className="px-6 py-3 font-medium">Returned On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {book.history.map((record) => (
                        <tr
                          key={record.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
                        >
                          <td className="px-6 py-3">
                            <div className="font-medium text-slate-900 dark:text-white">
                              {record.studentProfile.full_name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {record.studentProfile.student_id}
                            </div>
                          </td>
                          <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                            {record.return_date
                              ? new Date(
                                  record.return_date
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No borrow history available.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
