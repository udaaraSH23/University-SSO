import { bookReader } from "@repo/backend";
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

  let book;
  try {
    book = await api.execute(() => bookReader.getBookDetails(idString));
  } catch (error) {
    console.error("Failed to load book:", error);
  }

  if (!book) {
    return notFound();
  }

  return <BookDetailView book={book} />;
}
