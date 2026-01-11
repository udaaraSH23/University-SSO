import { bookReader, lendingService } from "@repo/backend";
import { notFound } from "next/navigation";
import { api } from "../../../../lib/api";
import BookDetailView from "../../../../components/books/BookDetailView";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  if (isNaN(id)) return notFound();

  let bookDetails;
  try {
    const book = await api.execute(() => bookReader.getBookDetails(idString));
    if (!book) return notFound();

    const borrowData = await api.execute(() =>
      lendingService.getBookBorrowHistory(id)
    );
    bookDetails = {
      ...book,
      ...borrowData,
    };
  } catch (error) {
    console.error("Failed to load book:", error);
    return notFound();
  }

  return <BookDetailView book={bookDetails} />;
}
