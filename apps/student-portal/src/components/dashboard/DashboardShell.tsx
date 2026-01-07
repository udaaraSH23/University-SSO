// Author: Antigravity
// Project: University-Portal
// FP-ID: FP-20251225-AG-STUDENT-SHELL
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T17:00:00Z

"use client";

import { DashboardShell as GenericDashboardShell, SidebarItem } from "@repo/ui";
import {
  LayoutDashboard,
  Library,
  ChartBar,
  BookOpen,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const __FP_SIG = "FP-20251225-AG-STUDENT-SHELL|HASH-PLACEHOLDER";

interface DashboardShellProps {
  /** The content to be rendered within the dashboard layout */
  children: React.ReactNode;
  /** User profile for the sidebar */
  user: {
    name: string;
    course: string;
    image?: string;
  };
  pendingBooksCount?: number;
  apiError?: string;
}

/**
 * Main layout shell for the Student Portal dashboard.
 * Uses the generic DashboardShell from @repo/ui.
 *
 * @param {DashboardShellProps} props - Component properties
 */
export default function DashboardShell({
  children,
  user,
  pendingBooksCount,
  apiError,
}: DashboardShellProps) {
  useEffect(() => {
    if (apiError) {
      toast.error(apiError);
    }
  }, [apiError]);
  // Use pathname only if we needed custom logic, but PortalSidebar handles basic active state.
  // If generic PortalSidebar needs help with 'startsWith' vs 'exact', we configure it here.

  const sidebarItems: SidebarItem[] = [
    {
      href: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      href: "/courses",
      label: "Courses",
      icon: <Library className="w-5 h-5" />,
      exact: true,
    },
    {
      href: "/grades",
      label: "Grades",
      icon: <ChartBar className="w-5 h-5" />,
      exact: true,
    },
    {
      href: "/books",
      label: "Books",
      icon: <BookOpen className="w-5 h-5" />,
      exact: false, // Matches /books, /books/123, etc.
      badge:
        pendingBooksCount && pendingBooksCount > 0
          ? pendingBooksCount
          : undefined,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <User className="w-5 h-5" />,
      exact: true,
    },
  ];

  return (
    <GenericDashboardShell
      user={user}
      sidebarItems={sidebarItems}
      portalTitle="Student Portal"
      subtitle="Welcome"
    >
      {children}
    </GenericDashboardShell>
  );
}
