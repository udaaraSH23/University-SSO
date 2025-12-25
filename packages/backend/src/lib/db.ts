// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251223-US-LIB-DB
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-23T09:20:00Z

import { PrismaClient } from "@repo/database";

const __FP_SIG = "FP-20251223-US-LIB-DB|HASH-PLACEHOLDER";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
