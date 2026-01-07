"use client";

// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-ADMIN3
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-30T18:33:55+05:30

const __FP_SIG = "FP-20251230-US-ADMIN3|HASH-PLACEHOLDER";

import { DashboardShell as GenericDashboardShell, SidebarItem } from "@repo/ui";
import {
  LayoutDashboard,
  Users,
  Library,
  Shield,
  GraduationCap,
} from "lucide-react";

import { toast } from "sonner";
import { useEffect } from "react";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    course: string; // Changed from course? to course to match student portal
    image?: string;
  };
  apiError?: string;
}

/**
 * Dashboard Shell
 *
 * The main shell component for the admin dashboard.
 * It wraps the generic dashboard shell from the UI library and provides
 * admin-specific sidebar items and configuration.
 *
 * @param {DashboardShellProps} props - Component properties.
 * @param {React.ReactNode} props.children - Child components to render within the content area.
 * @param {Object} props.user - User information for the sidebar profile.
 * @param {string} props.apiError - Optional error message to display.
 */
export default function DashboardShell({
  children,
  user,
  apiError,
}: DashboardShellProps) {
  useEffect(() => {
    if (apiError) {
      toast.error(apiError);
    }
  }, [apiError]);
  const sidebarItems: SidebarItem[] = [
    {
      label: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      label: "Students",
      href: "/students",
      icon: <Users className="w-5 h-5" />,
      exact: true,
    },
    {
      label: "Academics",
      href: "/academics",
      icon: <Library className="w-5 h-5" />,
      exact: true,
      subItems: [
        {
          label: "Faculties",
          href: "/academics/faculties",
          icon: <Library className="w-4 h-4" />,
        },
        {
          label: "Departments",
          href: "/academics/departments",
          icon: <Library className="w-4 h-4" />,
        },
        {
          label: "Degrees",
          href: "/academics/degrees",
          icon: <Library className="w-4 h-4" />,
        },
        {
          label: "Courses",
          href: "/academics/courses",
          icon: <Library className="w-4 h-4" />,
        },
      ],
    },
    {
      label: "Grades & Offerings",
      href: "/grades-offerings",
      icon: <GraduationCap className="w-5 h-5" />,
      exact: true,
    },
    {
      label: "Identity & Access",
      href: "/identity",
      icon: <Shield className="w-5 h-5" />,
      exact: true,
    },
  ];

  return (
    <GenericDashboardShell
      user={user}
      sidebarItems={sidebarItems}
      portalTitle="UniAdmin"
      subtitle="Administrator"
    >
      {children}
    </GenericDashboardShell>
  );
}
