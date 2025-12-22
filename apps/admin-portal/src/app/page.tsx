// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-H4I5J6
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T17:15:00Z

"use client";

const __FP_SIG = "FP-20251222-US-H4I5J6|HASH-PLACEHOLDER";
import { motion } from "framer-motion";

import { LogoutButton } from "@repo/ui";

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 gap-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex h-40 w-40 items-center justify-center rounded-2xl bg-red-600 shadow-xl"
      >
        <span className="text-xl font-bold text-white">Admin Portal</span>
      </motion.div>
      <LogoutButton />
    </div>
  );
}
