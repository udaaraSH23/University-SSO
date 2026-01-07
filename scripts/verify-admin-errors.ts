import { adminService } from "../packages/backend/src/modules/admin/admin.service";
import { DomainError } from "../packages/backend/src/errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verify() {
  console.log("Verifying Admin Module Error Handling...");

  // 1. Test Get Profile - Invalid Email
  console.log("\n--- Test 1: Get Profile for non-existent email ---");
  try {
    await adminService.getProfile("ghost.admin@university.com");
    console.error("❌ Failed: Should have thrown error");
  } catch (error) {
    if (error instanceof DomainError) {
      console.log(
        "✅ Caught expected DomainError:",
        error.message,
        "| Code:",
        error.code
      );
    } else {
      console.error("❌ Caught unexpected error type:", error);
    }
  }

  // 2. Test Delete Staff - Invalid ID
  console.log("\n--- Test 2: Delete non-existent staff ---");
  try {
    await adminService.deleteStaff(999999);
    console.error("❌ Failed: Should have thrown error");
  } catch (error) {
    if (error instanceof DomainError) {
      console.log(
        "✅ Caught expected DomainError:",
        error.message,
        "| Code:",
        error.code
      );
    } else {
      console.error("❌ Caught unexpected error type:", error);
    }
  }

  console.log("\n--- Verification Complete ---");
}

verify()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
