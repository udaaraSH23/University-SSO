"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Something went wrong!
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {error.message || "An unexpected error occurred."}
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
