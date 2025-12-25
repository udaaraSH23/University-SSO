// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-BOOKS-SEARCH
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:20:00Z

"use client";

const __FP_SIG = "FP-20251223-US-BOOKS-SEARCH|HASH-PLACEHOLDER";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { motion } from "framer-motion";

export default function BooksSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    router.push(`/books?${params.toString()}`);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row gap-4 max-w-4xl mb-12"
    >
      <div className="relative flex-grow group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-11 pr-4 py-3.5 border-none rounded-lg bg-gray-200/60 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
          placeholder="Search for books by title, author, or ISBN..."
        />
      </div>
      <button
        type="submit"
        className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3.5 px-8 rounded-lg transition-colors shadow-sm whitespace-nowrap"
      >
        Search in Library
      </button>
    </motion.form>
  );
}
