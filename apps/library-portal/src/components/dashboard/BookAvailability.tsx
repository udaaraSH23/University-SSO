// Author: Antigravity
// Project: University-Portal
// FP-ID: FP-20251225-AG-LIB-BOOKS
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T15:30:00Z

"use client";

import { CheckCircle, Search, Calendar } from "lucide-react";
import { useState } from "react";
import { searchBooksAction } from "../../app/actions";
import { motion, AnimatePresence } from "framer-motion";

export const __FP_SIG = "FP-20251225-AG-LIB-BOOKS|HASH-PLACEHOLDER";

/**
 * Component for searching and checking the real-time availability of books.
 * Allows library staff to query books by name or ISBN and see status,
 * available copies, and return dates if checked out.
 */
export default function BookAvailability() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]); // TODO: Define strict type for Book Search Result
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  /**
   * Executed when the user submits the search form.
   * Calls the server action `searchBooksAction` to fetch matching books.
   */
  const handleSearch = async () => {
    // Prevent empty queries to avoid unnecessary server load
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await searchBooksAction(query);
      setResults(data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }} // Slight delay for stagger effect relative to first card
      className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
          <CheckCircle className="text-teal-600 dark:text-teal-400 w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Check Book Availability
        </h2>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow">
          <label className="sr-only">Book Identifier</label>
          <input
            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-teal-500 focus:border-teal-500 shadow-sm h-12 px-3"
            placeholder="Enter Book Name or ISBN"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-teal-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-md flex items-center justify-center gap-2 h-12 disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Check Status
            </>
          )}
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {searched && results.length === 0 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-gray-500 dark:text-gray-400 text-center py-4"
            >
              No books found matching &quot;{query}&quot;
            </motion.p>
          )}

          {results.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-dashed border-gray-300 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-1">
                  Book Details
                </p>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {book.author}
                </p>
                <div
                  className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    book.availableCopies > 0
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      book.availableCopies > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  {book.availableCopies > 0
                    ? `${book.availableCopies} Available`
                    : "Out of Stock"}
                </div>
              </div>

              {book.availableCopies === 0 && book.nextReturnDate && (
                <>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-1">
                      Expected Return
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(book.nextReturnDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-1">
                      Borrowed By
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                        {book.borrowedBy?.charAt(0) || "?"}
                      </div>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {book.borrowedBy || "Unknown"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
