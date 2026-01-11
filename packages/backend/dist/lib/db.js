// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-LIB-DB
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:35:00Z
import prisma from "@repo/database";
const __FP_SIG = "FP-20251223-US-LIB-DB|HASH-PLACEHOLDER";
/**
 * Database client wrapper.
 * Re-exports the singleton Prisma client from @repo/database.
 * This ensures the backend uses the same connection pool instance.
 *
 * @returns {typeof prisma} The PrismaClient instance
 */
export const getDb = () => {
    return prisma;
};
export default prisma;
