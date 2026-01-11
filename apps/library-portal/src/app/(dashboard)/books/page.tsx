// Author: Antigravity
// Project: University-Portal
// FP-ID: FP-20251225-AG-LIB-BOOKS
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T14:15:00Z

import { DashboardHeader } from "@repo/ui";
import { lendingService, bookReader } from "@repo/backend";
import { api } from "../../../lib/api";
import BookStats from "../../../components/books/BookStats";
import BooksTable from "../../../components/books/BooksTable";

export const __FP_SIG = "FP-20251225-AG-LIB-BOOKS|HASH-PLACEHOLDER";
export const dynamic = "force-dynamic";

/**
 * Books management page.
 * Displays book statistics and a searchable, paginated table of inventory.
 *
 * @param {object} props - Page props
 * @param {Promise<{page?: string, query?: string}>} props.searchParams - URL search parameters
 */
export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const resolvedSearchParams = await searchParams; // Await the promise
  const page = Number(resolvedSearchParams.page) || 1;
  const query = resolvedSearchParams.query || "";
  const limit = 10;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let stats: any = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let booksResult: any = { data: [], meta: { totalPages: 1, page: 1 } };

  try {
    const [fetchedStats, fetchedBooks] = await api.execute(() =>
      Promise.all([
        lendingService.getLibraryDashboardStats(),
        bookReader.searchBooks(query, page, limit),
      ])
    );
    stats = fetchedStats;
    booksResult = fetchedBooks;
  } catch (error) {
    console.error("Failed to fetch books data:", error);
    // UI will render with empty/default data, Toast handles notification via API Client
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <DashboardHeader
        title="Books Management"
        description="Manage library inventory and borrowing status."
        breadcrumb={[{ label: "Books" }]}
      />

      {/* Stats Section */}
      <BookStats stats={stats} />

      {/* Main Content Area */}
      <BooksTable
        books={booksResult.data}
        totalPages={booksResult.meta.totalPages}
        currentPage={booksResult.meta.page}
      />
    </div>
  );
}
