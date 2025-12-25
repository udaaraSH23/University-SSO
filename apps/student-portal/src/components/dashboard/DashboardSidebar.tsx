// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-A1B2C3
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:15:00Z

"use client";

/**
 * DashboardSidebar
 * The primary navigation sidebar for the student portal.
 * Displays user profile summary and navigation links.
 * Responsive: Hidden on mobile by default, toggled via props.
 *
 * Usage:
 *     <DashboardSidebar isOpen={true} />
 */

import Link from "next/link";
import {
  LayoutDashboard,
  Library,
  ChartBar,
  BookOpen,
  User,
  UserCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { LogoutButton } from "@repo/ui";
import { usePathname } from "next/navigation";

const __FP_SIG = "FP-20251223-US-A1B2C3|HASH-PLACEHOLDER";

interface DashboardSidebarProps {
  /** Controls visibility of the sidebar on mobile devices */
  isOpen: boolean;
  /** User profile information */
  user: {
    name: string;
    course: string;
  };
  /** Number of specific pending items */
  pendingBooksCount?: number;
}

/**
 * Sidebar navigation component.
 * Uses strict positioning for mobile responsive behavior.
 *
 * @param {DashboardSidebarProps} props - Component properties
 */
export default function DashboardSidebar({
  isOpen,
  user,
  pendingBooksCount,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg md:shadow-none transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
      id="sidebar"
    >
      <div className="flex flex-col items-center justify-center pt-10 pb-8 px-6 border-b border-gray-200 dark:border-gray-700">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4 shadow-inner relative overflow-hidden cursor-pointer"
        >
          <UserCircle className="w-16 h-16 text-gray-400 dark:text-gray-500" />
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {user.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {user.course}
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <NavItem
          href="/"
          icon={<LayoutDashboard className="w-5 h-5 mr-3" />}
          label="Dashboard"
          active={pathname === "/"}
        />
        <NavItem
          href="/courses"
          icon={<Library className="w-5 h-5 mr-3" />}
          label="Courses"
          active={pathname === "/courses"}
        />
        <NavItem
          href="/grades"
          icon={<ChartBar className="w-5 h-5 mr-3" />}
          label="Grades"
          active={pathname === "/grades"}
        />
        <NavItem
          href="/books"
          icon={<BookOpen className="w-5 h-5 mr-3" />}
          label="Books"
          active={pathname.startsWith("/books")}
          badge={
            pendingBooksCount && pendingBooksCount > 0
              ? pendingBooksCount.toString()
              : undefined
          }
        />
        <NavItem
          href="/profile"
          icon={<User className="w-5 h-5 mr-3" />}
          label="Profile"
          active={pathname === "/profile"}
        />
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 md:hidden">
        <LogoutButton />
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
}

/**
 * Individual navigation item used in the sidebar.
 * Handles styling for active state and optional badge display.
 *
 * @param {NavItemProps} props - Component properties
 */
function NavItem({ href, icon, label, active, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${
        active
          ? "bg-blue-500/10 text-blue-500"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500 dark:hover:text-blue-500"
      }`}
    >
      {icon}
      {label}
      {badge && (
        <span className="ml-auto bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}
