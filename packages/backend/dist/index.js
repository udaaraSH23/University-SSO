// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-PKG-INDEX
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:35:00Z
const __FP_SIG = "FP-20251223-US-PKG-INDEX|HASH-PLACEHOLDER";
/**
 * Main Entry Point
 *
 * Exports all public modules, services, and types for the backend package.
 * Serves as the centralized interface for consumers (e.g., library-portal, student-portal).
 */
export * from "./modules/student/student.dto";
export * from "./modules/student/student.repository";
export * from "./modules/book/book.repository";
export * from "./modules/student/student.service";
export * from "./modules/book/book.service";
export * from "./modules/admin/admin.service";
export * from "./modules/student/student.interface";
export * from "./modules/book/book.interface";
export * from "./modules/dashboard/dashboard.interface";
export * from "./modules/dashboard/dashboard.service";
export * from "./common/utils/errors/app-error";
export * from "./modules/book/book.schema";
export * from "./modules/lending/lending.interface";
export * from "./modules/lending/lending.service";
// Academics & Admin Dashboard
export * from "./modules/academics/academics.dto";
export * from "./modules/academics/academics.service";
export * from "./modules/academics/services/organization.service";
export * from "./modules/academics/services/program.service";
export * from "./modules/academics/services/course.service";
export * from "./modules/academics/services/offering.service";
export * from "./modules/dashboard/admin-dashboard.dto";
export * from "./modules/dashboard/admin-dashboard.service";
export * from "./modules/identity/identity.service";
export * from "./modules/identity/identity.interface";
export * from "./modules/admin/admin.dto";
export * from "./modules/admin/admin.interface";
