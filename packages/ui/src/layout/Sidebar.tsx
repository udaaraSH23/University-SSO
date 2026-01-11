// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251225-US-SHARED-UI
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T13:00:00Z

"use client";

import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import { ReactNode } from "react";

const __FP_SIG = "FP-20251225-AG-SHARED-UI|HASH-PLACEHOLDER";

export interface SidebarProps {
  /** Controls visibility of the sidebar on mobile devices */
  isOpen: boolean;
  /** User profile information to display at the top */
  user?: {
    name: string;
    subtitle?: string;
    image?: string;
  };
  /** Navigation items and other content */
  children: ReactNode;
  /** Optional footer content (e.g., logout button for mobile) */
  footer?: ReactNode;
  /** Optional icon for the user avatar placeholder */
  userIcon?: ReactNode;
}

/**
 * Shared layout sidebar component.
 * responsive: Hidden on mobile by default, toggled via isOpen prop.
 *
 * @param {SidebarProps} props - Component properties
 */
export function Sidebar({
  isOpen,
  user,
  children,
  footer,
  userIcon,
}: SidebarProps) {
  // Variants for sidebar animation
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  // We use a media query check or just rely on the 'md:translate-x-0' equivalent logic.
  // However, framer motion overrides CSS transforms often.
  // The original logic was: mobile -> closed (-100%), open (0%). Desktop -> always 0%.
  // To keep it simple and robust with SSR, we can mix Tailwind and Motion, or use `initial={false}`.

  // Actually, standardizing on Tailwind's class toggling for the "md" breakpoint is safer for responsive heavy lifting,
  // but we can animate the mobile toggle.

  return (
    <>
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        // On desktop (md), we want it fixed open.
        // Framer motion style will override classes.
        // Strategy: Only animate on mobile?
        // Or cleaner: Use the existing class logic but add `layout` prop?
        // Let's stick to the requested "Add Animation".
        // The safest way to animate a responsive sidebar without breaking desktop layout is to conditionally apply variants
        // or ensure the `animate` prop respects the media query (which JS doesn't automatically do without hooks).

        // BETTER APPROACH:
        // Keep the main class structure but use motion for the enter/exit if it was conditional rendering.
        // Since it's always rendered but translated, let's just make the translation smooth via motion
        // BUT strictly for the mobile case.
        // Actually, the user asked for "animation".
        // Let's try `layout` animation or just `transition`.

        className={`fixed inset-y-0 left-0 z-30 w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg md:shadow-none transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        // If we simply add `layout`, framer might try to animate the layout changes.
      >
        {/* Content */}
        {user && (
          <div className="flex flex-col items-center justify-center pt-10 pb-8 px-6 border-b border-gray-200 dark:border-gray-700">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4 shadow-inner relative overflow-hidden cursor-pointer"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                userIcon || (
                  <UserCircle className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                )
              )}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center"
            >
              {user.name}
            </motion.h2>
            {user.subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center"
              >
                {user.subtitle}
              </motion.p>
            )}
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {children}
        </nav>

        {footer && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}
      </motion.div>
    </>
  );
}
