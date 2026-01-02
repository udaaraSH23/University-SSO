"use client";

import { Pagination } from "@repo/ui";
import { BorrowRecord } from "@repo/database";
import { motion, AnimatePresence } from "framer-motion";

interface StudentHistoryTableProps {
  history: BorrowRecord[];
  total: number;
  currentPage: number;
  limit: number;
}

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Displays the historical record of books borrowed by a student.
 *
 * @param {object} props - Component props
 * @param {BorrowRecord[]} props.history - List of past borrow records
 * @param {number} props.total - Total number of historical records for pagination
 * @param {number} props.currentPage - Current page number
 * @param {number} props.limit - Items per page
 */
export default function StudentHistoryTable({
  history,
  total,
  currentPage,
  limit,
}: StudentHistoryTableProps) {
  const totalPages = Math.ceil(total / limit);

  return (
    <section>
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Previously Borrowed Books (History)
        </h2>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Book Name</th>
                <th className="px-6 py-4">Borrowed Date</th>
                <th className="px-6 py-4">Returned Date</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <motion.tbody
              className="divide-y divide-gray-100 dark:divide-gray-700"
              variants={tableVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="wait">
                {history.length === 0 ? (
                  <motion.tr
                    key="no-data"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No history found.
                    </td>
                  </motion.tr>
                ) : (
                  history.map((record) => (
                    <motion.tr
                      key={record.id}
                      variants={rowVariants}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                      whileHover={{
                        scale: 1.002,
                        backgroundColor: "rgba(249, 250, 251, 0.5)",
                      }}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {(record as any).book?.title || "Unknown Book"}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {new Date(record.borrow_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {record.return_date
                          ? new Date(record.return_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.status === "RETURNED"
                              ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              : "bg-indigo-100 text-indigo-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/students" // This assumes the page is /students. Parameters like query will be preserved by Pagination component logic if implemented correctly or we might need to be careful.
          // The shared Pagination component I recall uses `searchParams.toString()` and updates `page`.
          // So queries will be preserved.
        />
      </div>
    </section>
  );
}
