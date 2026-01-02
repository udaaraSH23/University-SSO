// Author: Udara Shanuka
// Project: University-Portal
// generated: 2025-12-25T15:06:00Z
// Description: Prisma Client singleton configuration for Next.js

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Ensure strict singleton pattern to avoid multiple instances during hot-reloading in development
const prisma = (globalThis.prismaGlobal ??
  prismaClientSingleton()) as unknown as PrismaClient;

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// Explicitly export PrismaClient class and types to avoid "export *" errors with CommonJS
export { PrismaClient } from "@prisma/client";
export type * from "@prisma/client";
