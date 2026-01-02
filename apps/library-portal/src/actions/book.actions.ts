"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  bookManager,
  lendingService,
  CreateBookSchema,
  UpdateBookSchema,
  CreateBookInput,
  UpdateBookInput,
  bookReader,
} from "@repo/backend";

export async function createBookAction(data: CreateBookInput) {
  const result = CreateBookSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid input data" };
  }

  try {
    await bookManager.createBook(result.data);
  } catch (error) {
    console.error("Failed to create book:", error);
    return { error: "Failed to create book" };
  }

  revalidatePath("/books");
  redirect("/books");
}

export async function updateBookAction(id: number, data: UpdateBookInput) {
  const result = UpdateBookSchema.safeParse(data);

  if (!result.success) {
    return { error: "Invalid input data" };
  }

  try {
    await bookManager.updateBook(id, result.data);
  } catch (error) {
    console.error("Failed to update book:", error);
    return { error: "Failed to update book" };
  }

  revalidatePath("/books");
  redirect("/books");
}

export async function getBookDetailsAction(id: number) {
  try {
    // bookReader.getBookDetails returns BookDTO which might be slightly different structure
    // than raw Book. Let's check if we can use it.
    // The previous code expected Book | null.
    // getBookDetails throws if not found.
    // We'll wrap in try/catch (already done) and return null if error.

    // Using bookReader.getBookDetails which takes string ID.
    const book = await bookReader.getBookDetails(id.toString());

    const borrowHistory = await lendingService.getBookBorrowHistory(id);

    return {
      ...book,
      ...borrowHistory,
    };
  } catch (error) {
    console.error("Failed to fetch book details:", error);
    return null;
  }
}
