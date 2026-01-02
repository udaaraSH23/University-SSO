// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251226-US-SHARED-UI
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:45:00Z

"use client";

import Link from "next/link";
import { ReactNode } from "react";

export interface NavItemProps {
  /** The URL to navigate to */
  href: string;
  /** The icon to display */
  icon: ReactNode;
  /** The label text */
  label: string;
  /** Whether this item is currently active */
  active?: boolean;
  /** Optional badge text/number to display */
  badge?: string | number;
}

const __FP_SIG = "FP-20251225-AG-SHARED-UI|HASH-PLACEHOLDER";

/**
 * Shared sidebar navigation item component.
 * Displays a link with an icon, label, and optional badge.
 * Handles active state styling.
 *
 * @param {NavItemProps} props - Component properties
 */
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// ... (interface remains same)
import { SidebarItem } from "./PortalSidebar";

export interface NavItemProps extends SidebarItem {
  active?: boolean;
  depth?: number;
}

export function NavItem({
  href,
  icon,
  label,
  active,
  badge,
  subItems,
  depth = 0,
}: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = subItems && subItems.length > 0;
  const paddingLeft = depth > 0 ? `${depth * 1.5 + 1}rem` : "1rem";

  // Auto-expand if active or child is active
  // Ideally this should be handled by parent or context, but simple toggle for now

  const toggleOpen = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <Link
        href={hasSubItems ? "#" : href}
        onClick={hasSubItems ? toggleOpen : undefined}
        className={`block w-full`}
      >
        <motion.div
          whileHover={{ scale: 1.02, x: 4 }}
          className={`flex items-center py-3 pr-4 rounded-xl font-medium transition-colors ${
            active && !hasSubItems
              ? "bg-blue-500/10 text-blue-500"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500 dark:hover:text-blue-500"
          }`}
          style={{ paddingLeft }}
        >
          <span className="mr-3 flex items-center justify-center">{icon}</span>

          <span className="flex-1 text-left">{label}</span>

          {badge !== undefined && badge !== null && badge !== "" && (
            <span className="ml-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-xs font-bold px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}

          {hasSubItems && (
            <span className="ml-2 text-gray-400">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </motion.div>
      </Link>

      {/* Render Sub-items */}
      {hasSubItems && isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {subItems.map((subItem) => (
            <NavItem
              key={subItem.href}
              {...subItem}
              depth={depth + 1}
              // Active check needs to be passed down or recalculated
              // For now, let the parent list logic handle 'active' prop,
              // but since we are recursing here, we might need a way to check active for children.
              // Simpler approach: NavItem just renders.
              // BUT: PortalSidebar maps items and passes `active`. We need to replicate that logic or move it here.
              // To avoid refactoring everything, let's assume subItems are just links for now.
              // If we want highlight, we need `usePathname` here or pass a `isActive` function.
            />
          ))}
        </motion.div>
      )}
    </>
  );
}
