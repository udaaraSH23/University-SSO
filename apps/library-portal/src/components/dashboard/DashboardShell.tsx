// Author: Antigravity
// Project: University-Portal
// FP-ID: FP-20251226-AG-LIB-SHELL-REFACTOR
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T10:30:00Z

"use client";

import { DashboardShell as GenericDashboardShell, SidebarItem } from "@repo/ui";
import { LayoutDashboard, BookOpen, Users } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

const __FP_SIG = "FP-20251226-AG-LIB-SHELL-REFACTOR|HASH-PLACEHOLDER";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    role: string;
  };
  apiError?: string;
  logoutBaseUrl?: string;
}

/**
 * Main layout shell for the Library Portal dashboard.
 * Uses the generic DashboardShell from @repo/ui to ensure visual consistency
 * with the Student Portal while providing library-specific navigation.
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - The main content to render
 * @param {object} props.user - User profile information for the sidebar
 * @param {string} props.user.name - Display name of the user
 * @param {string} props.user.role - Role/Title of the user
 * @param {string} props.apiError - Optional error message to display
 */
export default function DashboardShell({
  children,
  user,
  apiError,
  logoutBaseUrl,
}: DashboardShellProps) {
  useEffect(() => {
    if (apiError) {
      toast.error(apiError);
    }
  }, [apiError]);

  const sidebarItems: SidebarItem[] = [
    {
      href: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      href: "/books",
      label: "Books",
      icon: <BookOpen className="w-5 h-5" />,
      exact: false, // Matches /books/*
    },
    {
      href: "/students",
      label: "Students",
      icon: <Users className="w-5 h-5" />,
      exact: false, // Matches /students/*
    },
  ];

  return (
    <GenericDashboardShell
      user={{
        name: user.name,
        course: user.role, // Mapping role to course (subtitle)
      }}
      sidebarItems={sidebarItems}
      portalTitle="Library Portal"
      subtitle="Welcome"
      logoutBaseUrl={logoutBaseUrl}
    >
      {children}
    </GenericDashboardShell>
  );
}
