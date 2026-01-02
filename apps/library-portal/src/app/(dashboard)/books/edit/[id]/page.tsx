import { DashboardHeader } from "@repo/ui";
import BookForm from "../../../../../components/books/BookForm";
import { bookManager } from "@repo/backend";
import { notFound } from "next/navigation";

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

  const book = await bookManager.getBookById(bookId);

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
