// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251220-US-k1l2m3
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T17:20:00Z

import { handlers } from "@repo/auth";

/**
 * Signature constant for fingerprinting.
 */
const __FP_SIG = "FP-20251220-US-k1l2m3|HASH-PLACEHOLDER";

/**
 * Authentication API Handlers.
 *
 * Exports the GET and POST handlers necessary for NextAuth to function.
 * These are imported from the shared @repo/auth package.
 */
export const { GET, POST } = handlers;
