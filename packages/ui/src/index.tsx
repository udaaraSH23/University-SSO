// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251222-US-M3N4O5
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T16:58:00Z

const __FP_SIG = "FP-20251222-US-M3N4O5|HASH-PLACEHOLDER";

// ==========================================
// Authentication Components
// ==========================================
// Used in: apps/student-portal, apps/library-portal, apps/admin-portal
// Purpose: Handling login, logout, and auth error flows via WSO2 IS.
export * from "./auth/LoginButton";
export * from "./auth/LogoutButton";
export * from "./auth/RoleRedirectCard";
export * from "./auth/AuthErrorCard";

// ==========================================
// Common UI Components
// ==========================================
// Used in: Various dashboards and pages across the monorepo.
// Purpose: Reusable elements like cards, themes, and pagination controls.
export * from "./common/ThemeToggle";
export * from "./common/ThemeProvider";
// StatsCard: Used in Student Portal (Icon Left layout)
// InfoCard: Used in Library Portal (Icon Right layout)

export * from "./common/Pagination";
export * from "./common/SlideOver";
export * from "./common/Modal";
export * from "./common/DeleteConfirmationModal";
export * from "./common/DeleteConfirmationContext";
export * from "./common/DataTable";

// ==========================================
// Layout Components
// ==========================================
// Used in: apps/student-portal, apps/library-portal
// Purpose: Scaffolding the main dashboard structure including sidebars and headers.
export * from "./layout/NavItem";
export * from "./layout/Sidebar";
export * from "./layout/DashboardHeader"; // Page-level header
export * from "./layout/MobileHeader";
export * from "./layout/DashboardFooter";
export * from "./layout/DashboardShell"; // Main layout wrapper
export * from "./layout/DashboardTopBar";

export * from "./layout/PortalSidebar"; // Configurable sidebar wrapper
