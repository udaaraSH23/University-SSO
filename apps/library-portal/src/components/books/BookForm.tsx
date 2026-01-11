"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBookSchema, CreateBookInput, BookDTO } from "@repo/backend";
import { createBookAction, updateBookAction } from "../../actions/book.actions";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

interface BookFormProps {
  initialData?: BookDTO;
  isEdit?: boolean;
}

export default function BookForm({
  initialData,
  isEdit = false,
}: BookFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBookInput>({
    resolver: zodResolver(CreateBookSchema),
    defaultValues: initialData || {
      title: "",
      author: "",
      isbn: "",
      total_copies: 1,
      year: new Date().getFullYear(),
      language: "English",
    },
  });

  const onSubmit = (data: CreateBookInput) => {
    setError(null);
    startTransition(async () => {
      let result;
      if (isEdit && initialData?.id) {
        result = await updateBookAction(initialData.id, data);
      } else {
        result = await createBookAction(data);
      }

      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              {...register("title")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter book title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title.message}</p>
            )}
          </div>

          {/* Author */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Author
            </label>
            <input
              {...register("author")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter author name"
            />
            {errors.author && (
              <p className="text-red-500 text-xs">{errors.author.message}</p>
            )}
          </div>

          {/* ISBN */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ISBN
            </label>
            <input
              {...register("isbn")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter ISBN"
            />
            {errors.isbn && (
              <p className="text-red-500 text-xs">{errors.isbn.message}</p>
            )}
          </div>

          {/* Publisher */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Publisher (Optional)
            </label>
            <input
              {...register("publisher")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter publisher"
            />
            {errors.publisher && (
              <p className="text-red-500 text-xs">{errors.publisher.message}</p>
            )}
          </div>

          {/* Year */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Year
            </label>
            <input
              type="number"
              {...register("year", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="YYYY"
            />
            {errors.year && (
              <p className="text-red-500 text-xs">{errors.year.message}</p>
            )}
          </div>

          {/* Total Copies */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Copies
            </label>
            <input
              type="number"
              {...register("total_copies", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="1"
            />
            {errors.total_copies && (
              <p className="text-red-500 text-xs">
                {errors.total_copies.message}
              </p>
            )}
          </div>

          {/* Available Copies (Only for Edit) */}
          {isEdit && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Available Copies
              </label>
              <input
                type="number"
                {...register("available_copies", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="1"
              />
              {errors.available_copies && (
                <p className="text-red-500 text-xs">
                  {errors.available_copies.message}
                </p>
              )}
            </div>
          )}

          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Language
            </label>
            <input
              {...register("language")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.language && (
              <p className="text-red-500 text-xs">{errors.language.message}</p>
            )}
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Genre (Optional)
            </label>
            <input
              {...register("genre")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Fiction, Science"
            />
            {errors.genre && (
              <p className="text-red-500 text-xs">{errors.genre.message}</p>
            )}
          </div>

          {/* Cover URL */}
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cover Image URL (Optional)
            </label>
            <input
              {...register("coverUrl")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://..."
            />
            {errors.coverUrl && (
              <p className="text-red-500 text-xs">{errors.coverUrl.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description (Optional)
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter book description..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Update Book" : "Add Book"}
          </button>
        </div>
      </form>
    </div>
  );
}
