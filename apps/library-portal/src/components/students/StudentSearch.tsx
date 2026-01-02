"use client";

import { Search } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";

/**
 * Search component for finding students in the library system.
 * Updates URL search parameters to drive the parent page's data fetching.
 */
export default function StudentSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [text, setText] = useState(searchParams.get("query")?.toString() || "");

  /**
   * Updates the URL with the search query.
   *
   * @param {string} term - The search term
   */
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const onSearchClick = () => {
    handleSearch(text);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(text);
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Manage Students
      </h2>
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white placeholder-gray-400 transition-shadow"
            placeholder="Enter Student No, Name or Email"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <button
          onClick={onSearchClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-colors flex items-center justify-center"
        >
          Search
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 italic">
        Use the search bar to find, add, or remove student records.
      </p>
    </section>
  );
}
