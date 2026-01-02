// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-ADMIN-ACADEMICS-ROOT
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T12:10:12+05:30

const __FP_SIG = "FP-20260101-ADMIN-ACADEMICS-ROOT|HASH-PLACEHOLDER";

import { redirect } from "next/navigation";

/**
 * AcademicsPage
 *
 * Purpose:
 * - Serves as the root route for the Academics module.
 *
 * Responsibilities:
 * - Automatically redirects users to the `Faculties` view as the default entry point.
 */
export default function AcademicsPage() {
  redirect("/academics/faculties");
}
