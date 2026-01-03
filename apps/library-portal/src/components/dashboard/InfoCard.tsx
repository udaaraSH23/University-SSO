"use client";

// Author: Antigravity
// Project: University-Portal
// FP-ID: FP-20260102-AG-LIB-INFOCARD
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-02T23:00:00+05:30

const __FP_SIG = "FP-20260102-AG-LIB-INFOCARD|HASH-PLACEHOLDER";

import React from "react";

interface InfoCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?:
    | "blue"
    | "amber"
    | "emerald"
    | "purple"
    | "indigo"
    | "rose"
    | "cyan"
    | "orange";
  className?: string;
}

/**
 * InfoCard
 *
 * Purpose:
 * - Display a statistic or metric with an icon and value.
 * - Local component for Library Portal dashboard.
 *
 * Responsibilities:
 * - Render title, value, and icon with theme awareness.
 * - Support distinct color variants for visual differentiation.
 */
export const InfoCard = ({
  title,
  value,
  icon,
  color = "blue",
  className = "",
}: InfoCardProps) => {
  const colorVariants: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
    cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400",
    orange:
      "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  };

  const selectedColor = colorVariants[color] || colorVariants.blue;

  return (
    <div
      className={`p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-lg ${selectedColor}`}>{icon}</div>
      </div>
    </div>
  );
};
