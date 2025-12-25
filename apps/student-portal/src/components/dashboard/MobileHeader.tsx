// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-P6Q7R8
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:15:00Z

/**
 * MobileHeader
 * The header component displayed only on mobile viewports.
 * Contains the application brand/logo and the hamburger menu trigger.
 *
 * Usage:
 *     <MobileHeader onMenuClick={handleMenuToggle} />
 */

import { Menu, School } from "lucide-react";

const __FP_SIG = "FP-20251223-US-P6Q7R8|HASH-PLACEHOLDER";

interface MobileHeaderProps {
  /** Callback function triggered when the hamburger menu is clicked */
  onMenuClick: () => void;
}

/**
 * Mobile-specific header component.
 *
 * @param {MobileHeaderProps} props - Component properties
 */
export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="md:hidden fixed top-0 w-full z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 pl-6 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-2">
        <School className="text-blue-500 w-8 h-8" />
      </div>
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100"
        id="mobile-menu-btn"
      >
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}
