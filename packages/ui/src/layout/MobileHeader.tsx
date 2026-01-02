// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251226-US-SHARED-MOBILE-HEADER
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:45:00Z

"use client";

import { Menu } from "lucide-react";
import { ReactNode } from "react";

const __FP_SIG = "FP-20251225-AG-SHARED-MOBILE-HEADER|HASH-PLACEHOLDER";

export interface MobileHeaderProps {
  /** Callback function triggered when the hamburger menu is clicked */
  onMenuClick: () => void;
  /** Optional logo or brand element to display on the left */
  logo?: ReactNode;
  /** Optional custom class name */
  className?: string;
}

/**
 * Mobile-specific header component.
 * Displays a hamburger menu and optional logo.
 * Hidden on desktop (md:hidden).
 *
 * @param {MobileHeaderProps} props - Component properties
 */
export function MobileHeader({
  onMenuClick,
  logo,
  className = "",
}: MobileHeaderProps) {
  return (
    <header
      className={`md:hidden fixed top-0 w-full z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 pl-6 flex justify-between items-center shadow-sm ${className}`}
    >
      <div className="flex items-center space-x-2">{logo}</div>
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100"
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}
