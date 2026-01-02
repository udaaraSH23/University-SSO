// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251226-US-UI-SIDEBAR
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:45:00Z

"use client";

const __FP_SIG = "FP-20251226-US-UI-SIDEBAR|HASH-PLACEHOLDER";

import { usePathname } from "next/navigation";
import { Sidebar, SidebarProps } from "./Sidebar";
import { NavItem } from "./NavItem";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Interface: SidebarItem
 * Represents a single navigation link within the sidebar.
 */
export interface SidebarItem {
  href: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
  badge?: string | number;
  subItems?: SidebarItem[];
}

/**
 * Props: PortalSidebar
 * Extends standard SidebarProps to include specific navigation items.
 */
export interface PortalSidebarProps extends Omit<SidebarProps, "children"> {
  items: SidebarItem[];
  pendingBooksCount?: number;
}

/**
 * Component: PortalSidebar
 *
 * A specialized wrapper around the generic Sidebar component.
 * Renders a list of navigation items with active state handling and animations.
 *
 * @param {PortalSidebarProps} props - Component props including items list
 */
export function PortalSidebar({ items, ...props }: PortalSidebarProps) {
  const pathname = usePathname();

  const isActive = (item: SidebarItem) => {
    if (item.exact === false) {
      return pathname.startsWith(item.href);
    }
    return pathname === item.href;
  };

  return (
    <Sidebar {...props}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {items.map((item) => (
          <motion.div
            key={item.href}
            variants={{
              hidden: { opacity: 0, x: -20 },
              show: { opacity: 1, x: 0 },
            }}
          >
            <NavItem
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={isActive(item)}
              badge={item.badge}
              subItems={item.subItems}
            />
          </motion.div>
        ))}
      </motion.div>
    </Sidebar>
  );
}
