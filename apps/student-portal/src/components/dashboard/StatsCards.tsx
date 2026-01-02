// Author: Udara Shanuka (Refactored by Antigravity)
// Project: University-Portal
// FP-ID: FP-20251223-US-G7H8I9
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:15:00Z (Refactored 2025-12-25)

"use client";

import { Award, BookOpen, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { StatsCard } from "./StatsCard";

const __FP_SIG = "FP-20251223-US-G7H8I9|HASH-PLACEHOLDER";

// Animation container variants for staggering children animations
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Dashboard widget showing a grid of statistical cards.
 */
interface StatsCardsProps {
  gpa: number;
  booksBorrowed: number;
  creditsEarned: number;
}

/**
 * Dashboard widget showing a grid of statistical cards.
 */
export default function StatsCards({
  gpa,
  booksBorrowed,
  creditsEarned,
}: StatsCardsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
    >
      <StatsCard
        title="Current GPA"
        value={gpa}
        icon={<Award className="w-8 h-8" />}
        color="blue"
      />
      <StatsCard
        title="Pending Books"
        value={booksBorrowed}
        icon={<BookOpen className="w-8 h-8" />}
        color="purple"
      />
      <StatsCard
        title="Credits Earned"
        value={creditsEarned}
        icon={<GraduationCap className="w-8 h-8" />}
        color="green"
      />
    </motion.div>
  );
}
