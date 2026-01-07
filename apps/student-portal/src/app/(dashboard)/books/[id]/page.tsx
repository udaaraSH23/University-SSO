// Author: System
// Project: University-Portal
// FP-ID: FP-20251225-SP-482910
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T10:55:00Z

import { auth } from "@repo/auth";
import { bookReader } from "@repo/backend";
import { MoveLeft, BookOpen, LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import BookDetailView from "../../../../components/dashboard/books/BookDetailView";
import { api } from "../../../../lib/api";

const __FP_SIG = "FP-20251225-SP-482910|HASH-PLACEHOLDER";

/**
 * Server Component: Book Details Page
 *
 * Fetches and displays detailed information for a specific book.
 * Checks for user authentication before data retrieval.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.params - Route parameters.
 * @param {string} props.params.id - The ID of the book to retrieve.
 */
export default async function BookDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const { id } = await params;
  let book;
  let error;

  try {
    book = await api.execute(() => bookReader.getBookDetails(id));
  } catch (err: any) {
    if (err?.code === "BOOK_NOT_FOUND") {
      // Handled below by checking if book is undefined/null
    } else {
      error = "Failed to load book details.";
    }
  }

  if (!book || error) {
    return (
      <div className="p-8 text-center text-gray-500">
        <h1 className="text-xl font-bold mb-4">{error || "Book Not Found"}</h1>
        <Link href="/books" className="text-primary hover:underline">
          Return to Books
        </Link>
      </div>
    );
  }

  return <BookDetailView book={book} />;
}
