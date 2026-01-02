"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback, useState, useTransition } from "react";
import { Search, Plus, MoreVertical } from "lucide-react";
import { Pagination } from "@repo/ui";
import { motion, AnimatePresence } from "framer-motion";

interface BookData {
  id: number;
  title: string;
  author: string;
  isbn: string;
  isAvailable: boolean;
  coverImage?: string;
  year: number;
}

interface BooksTableProps {
  books: BookData[];
  totalPages: number;
  currentPage: number;
}

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
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

/**
 * A comprehensive table component for managing the library's book inventory.
 * Supports searching via server-side logic and pagination.
 *
 * @param {object} props - Component props
 * @param {BookData[]} props.books - List of books to display
 * @param {number} props.totalPages - Total number of pages for pagination
 * @param {number} props.currentPage - Current active page
 */
export default function BooksTable({
  books,
  totalPages,
  currentPage,
}: BooksTableProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const [text, setText] = useState(searchParams.get("query")?.toString() || "");

  /**
   * Updates the URL search parameters to trigger a server re-render.
   * Debouncing should inevitably normally be handled if this was auto-search,
   * but button-trigger makes it safe.
   *
   * @param {string} term - The search query string
   */
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const onSearchClick = () => {
    handleSearch(text);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(text);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex-1 flex w-full md:max-w-xl gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                className={`w-5 h-5 text-gray-400 ${
                  isPending ? "animate-pulse" : ""
                }`}
              />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm shadow-sm"
              placeholder="Search by name, ISBN or author..."
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
          <button
            onClick={onSearchClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md shadow-indigo-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            Search
          </button>
        </div>
        <Link
          href="/books/add"
          className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md shadow-indigo-500/20 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Books
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  ISBN
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Author
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32"
                >
                  Action
                </th>
              </tr>
            </thead>
            <motion.tbody
              className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <AnimatePresence mode="popLayout">
                {books.length === 0 ? (
                  <motion.tr
                    key="no-data"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      No books found.
                    </td>
                  </motion.tr>
                ) : (
                  books.map((book) => (
                    <motion.tr
                      key={book.id}
                      variants={rowVariants}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      whileHover={{
                        backgroundColor: "rgba(249, 250, 251, 0.5)",
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        <Link
                          href={`/books/${book.id}`}
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          {book.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {book.isbn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {book.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            book.isAvailable
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {book.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        <Link
                          href={`/books/edit/${book.id}`}
                          className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                        >
                          Edit
                        </Link>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1.5 rounded transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/books"
      />
    </div>
  );
}
