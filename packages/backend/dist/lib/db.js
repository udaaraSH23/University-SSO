"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@repo/database");
const prismaClientSingleton = () => {
    return new database_1.PrismaClient();
};
const prisma = (_a = globalThis.prismaGlobal) !== null && _a !== void 0 ? _a : prismaClientSingleton();
exports.default = prisma;
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = prisma;
