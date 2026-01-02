import BookDetailView from "../../../../components/books/BookDetailView";
import { getBookDetailsAction } from "../../../../actions/book.actions";
import { notFound } from "next/navigation";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idString } = await params;
  const id = parseInt(idString);
  if (isNaN(id)) return notFound();

  const book = await getBookDetailsAction(id);

  if (!book) {
    return notFound();
  }

  return <BookDetailView book={book} />;
}
