import { execSync } from "child_process";
import path from "path";
import prisma from "@repo/database";

// Use a test database file
const testDbPath = path.resolve(__dirname, "../../database/test.db");
process.env.DATABASE_URL = `file:${testDbPath}`;

async function resetDb() {
  try {
    // Disable FK checks to allow truncation
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);

    const tablenames = await prisma.$queryRaw<
      Array<{ name: string }>
    >`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations';`;
    const tables = tablenames
      .map(({ name }) => name)
      .filter((name) => name !== "_prisma_migrations")
      .map((name) => `"${name}"`);

    for (const table of tables) {
      await prisma.$executeRawUnsafe(`DELETE FROM ${table};`);
    }

    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);
  } catch (error) {
    console.error("Failed to reset DB:", error);
  }
}

beforeAll(async () => {
  // Push schema to test database
  const dbPackagePath = path.resolve(__dirname, "../../database");

  console.log("Setting up test database...");

  try {
    execSync(
      `npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss`,
      {
        cwd: dbPackagePath,
        env: { ...process.env, DATABASE_URL: `file:${testDbPath}` },
        stdio: "ignore",
      }
    );
  } catch (e) {
    console.error("Failed to push schema:", e);
    throw e;
  }

  // Ensure we start with a clean slate
  await resetDb();
});

afterAll(async () => {
  // Cleanup after tests
  await resetDb();
  await prisma.$disconnect();
});
