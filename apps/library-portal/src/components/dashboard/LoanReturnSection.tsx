// Author: Antigravity
// Project: University-Portal
// FP-ID: FP-20251225-AG-LIB-LOAN
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T15:30:00Z

"use client";

import { useState, useTransition } from "react";
import {
  RefreshCw,
  Search,
  Upload,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { loanBookAction, returnBookAction } from "../../app/actions";
import { motion } from "framer-motion";

export const __FP_SIG = "FP-20251225-AG-LIB-LOAN|HASH-PLACEHOLDER";

/**
 * Component handling the loan execution and return process for books.
 * Optimized for quick actions by library staff using Student ID and ISBN.
 * Uses optimistic updates or transitions to ensure UI responsiveness.
 */
export default function LoanReturnSection() {
  const [studentId, setStudentId] = useState("");
  const [isbn, setIsbn] = useState("");
  const [studentName, setStudentName] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  /**
   * Processes the loan of a book to a student.
   * Validates input existence before calling the server action.
   */
  const handleLoan = async () => {
    setMessage(null);
    if (!studentId || !isbn) {
      setMessage({ type: "error", text: "Please enter Student No and ISBN" });
      return;
    }

    // Wrap in transition to handle server action pending state
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("studentId", studentId);
        formData.append("isbn", isbn);
        await loanBookAction(formData);

        setMessage({ type: "success", text: "Book loaned successfully" });
        // Optional: clear ISBN but keep Student ID for multiple loans
        setIsbn("");
      } catch (e: any) {
        setMessage({ type: "error", text: e.message || "Failed to loan book" });
      }
    });
  };

  /**
   * Processes the return of a book from a student.
   * Updates the inventory system to mark the copy as available.
   */
  const handleReturn = async () => {
    setMessage(null);
    if (!studentId || !isbn) {
      setMessage({ type: "error", text: "Please enter Student No and ISBN" });
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("studentId", studentId);
        formData.append("isbn", isbn);
        await returnBookAction(formData);

        setMessage({ type: "success", text: "Book returned successfully" });
        setIsbn("");
      } catch (e: any) {
        setMessage({
          type: "error",
          text: e.message || "Failed to return book",
        });
      }
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <RefreshCw className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Loan / Return Books
        </h2>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border border-green-200 dark:border-green-800"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Student Name
          </label>
          <input
            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 shadow-sm h-11 px-3"
            type="text"
            placeholder="Optional Display Check"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Student No.
          </label>
          <input
            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 shadow-sm h-11 px-3"
            type="text"
            placeholder="e.g. STU123456"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ISBN
          </label>
          <div className="flex gap-2">
            <input
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 shadow-sm h-11 px-3"
              type="text"
              placeholder="e.g. 978-3-16-148410-0"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
            <button className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500 dark:text-gray-300">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex gap-4 justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
        <button
          onClick={handleReturn}
          disabled={isPending}
          className={`bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm flex items-center gap-2 ${
            isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
          {isPending ? "Processing..." : "Return"}
        </button>
        <button
          onClick={handleLoan}
          disabled={isPending}
          className={`bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2 ${
            isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Upload className="w-4 h-4" />
          {isPending ? "Processing..." : "Loan Book"}
        </button>
      </div>
    </motion.section>
  );
}
