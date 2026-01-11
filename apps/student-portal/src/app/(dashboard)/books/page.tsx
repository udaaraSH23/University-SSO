// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-BOOKS-PAGE
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T10:55:00Z

import { auth } from "@repo/auth";
import {
  studentService,
  bookReader,
  BookDTO,
  BorrowedBookDTO,
} from "@repo/backend";
import { api } from "../../../lib/api";

import BooksSearch from "../../../components/dashboard/books/BooksSearch";
import BorrowedBooksTable from "../../../components/dashboard/books/BorrowedBooksTable";
import PendingBooksTable from "../../../components/dashboard/books/PendingBooksTable";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Pagination, DashboardHeader } from "@repo/ui";

const __FP_SIG = "FP-20251223-US-BOOKS-PAGE|HASH-PLACEHOLDER";

/**
 * Server Component: Books Page
 *
 * Displays the library books dashboard, acting as a central hub for library interactions.
 *
 * Capabilities:
 * 1. Search: Queries the library catalog if a `query` param is present.
 * 2. Overview: If no search is active, displays the user's personal library status (borrowed/pending).
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.searchParams - URL search parameters used for search queries and pagination state.
 */
export default async function BooksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  const email = session.user.email;
  const { query: queryParam } = await searchParams;
  const query = typeof queryParam === "string" ? queryParam : undefined;

  let profile;
  try {
    profile = await api.execute(() => studentService.getProfile(email));
  } catch (error) {
    console.error("Failed to fetch profile", error);
    return <div>Error loading profile.</div>;
  }

  let borrowedBooks: BorrowedBookDTO[] = [];
  let pendingBooks: BorrowedBookDTO[] = []; // Mocking pending books
  let searchResults: BookDTO[] = [];
  let paginationMeta = { page: 1, totalPages: 1 };

  try {
    if (query) {
      // Search Mode:
      // When a query exists, we switch context to "Library Catalog Search"
      // avoiding personal book fetches to keep the view focused and performant.
      const { page: pageParam } = await searchParams;
      const page = Number(pageParam) || 1;
      const result = await api.execute(() =>
        bookReader.searchBooks(query, page, 10)
      );
      searchResults = result.data;
      paginationMeta = {
        page: result.meta.page,
        totalPages: result.meta.totalPages,
      };
    } else {
      // Dashboard Mode:
      // No query implies the user wants to see their own status.
      // We fetch all records and filter client-side (or in-controller) for categorization.

      // 1. Fetch Student Profile to get ID (and ensures student exists)
      // Using default service call without complex filters for now
      // profile = await api.execute(() => studentService.getProfile(email)); // Profile already fetched above

      // 2. Fetch All Borrowed Books
      // We fetch all records and filter client-side (or in-controller) for categorization.
      if (profile) {
        const allBooks = await api.execute(() =>
          studentService.getBorrowedBooks(email)
        );

        // Separating books based on user requirements
        // Pending: Borrowed, Overdue, or not Returned
        pendingBooks = allBooks.filter((b) => {
          const s = b.status?.toLowerCase();
          return s === "borrowed" || s === "overdue";
        });

        // My Borrowed Books: History of returned books
        borrowedBooks = allBooks.filter((b) => {
          const s = b.status?.toLowerCase();
          return s === "returned";
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch books:", err);
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Page Header */}
      <DashboardHeader
        title="Books"
        description="View your books"
        breadcrumb={[{ label: "Books" }]}
      />

      <BooksSearch />

      {query ? (
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center">
            <span className="w-1.5 h-6 bg-primary rounded-full mr-3"></span>
            Search Results for &quot;{query}&quot;
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.length > 0 ? (
              searchResults.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex gap-4 group"
                >
                  <div className="h-24 w-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:scale-105 transition-transform">
                    {book.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <BookOpen />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {book.author}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          book.isAvailable
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {book.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 col-span-2">No books found.</p>
            )}
          </div>
          {paginationMeta.totalPages > 1 && (
            <Pagination
              currentPage={paginationMeta.page}
              totalPages={paginationMeta.totalPages}
              basePath="/books"
            />
          )}
        </section>
      ) : profile.isLibraryRegistered ? (
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center">
              <span className="w-1.5 h-6 bg-primary rounded-full mr-3"></span>
              Pending Books
            </h2>
            <PendingBooksTable books={pendingBooks} />
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center">
              <span className="w-1.5 h-6 bg-green-500 rounded-full mr-3"></span>
              My Borrowed Books
            </h2>
            <BorrowedBooksTable books={borrowedBooks} />
          </section>
        </div>
      ) : (
        <div className="mt-8 p-8 bg-surface-light dark:bg-surface-dark border border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Library Registration Required
          </h3>
          <p className="text-gray-500 max-w-sm mt-2">
            You need to complete your library registration to view your
            borrowing history and pending requests. Search is still available.
          </p>
        </div>
      )}
    </div>
  );
}
