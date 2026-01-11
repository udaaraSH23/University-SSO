import { DashboardHeader } from "@repo/ui";
import BookForm from "../../../../../components/books/BookForm";
import { bookManager, BookDTO } from "@repo/backend";
import { notFound } from "next/navigation";
import { api } from "../../../../../lib/api";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookId = parseInt(id);

  if (isNaN(bookId)) {
    notFound();
  }

  let book: BookDTO | null = null;
  try {
    const rawBook = await api.execute(() => bookManager.getBookById(bookId));
    if (rawBook) {
      book = {
        ...rawBook,
        description: rawBook.description || undefined,
        publisher: rawBook.publisher || undefined,
        coverUrl: rawBook.coverUrl || undefined,
        genre: rawBook.genre || undefined,
        language: rawBook.language || "English",
        isAvailable: rawBook.available_copies > 0,
      } as BookDTO;
    }
  } catch (error) {
    console.error("Failed to fetch book for editing:", error);
  }

  if (!book) {
    notFound();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
      <DashboardHeader
        title="Edit Book"
        description={`Edit details for ${book.title}.`}
        breadcrumb={[
          { label: "Books", href: "/books" },
          { label: "Edit Book" },
        ]}
      />

      <BookForm initialData={book} isEdit={true} />
    </div>
  );
}
