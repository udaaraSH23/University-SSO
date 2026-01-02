import { DashboardHeader } from "@repo/ui";
import BookForm from "../../../../components/books/BookForm";

export default function AddBookPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
      <DashboardHeader
        title="Add New Book"
        description="Add a new book to the library inventory."
        breadcrumb={[{ label: "Books", href: "/books" }, { label: "Add Book" }]}
      />

      <BookForm />
    </div>
  );
}
