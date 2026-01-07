import { lendingService } from "../packages/backend/src/modules/lending/lending.service";
import { DomainError } from "../packages/backend/src/errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verify() {
  console.log("Verifying Lending Module Error Handling...");

  // 1. Test Issue Book - Invalid Student -> Student Not Found / Domain Error
  console.log("\n--- Test 1: Issue book to non-existent student ---");
  try {
    await lendingService.issueBook("ST-INVALID-999", 999999);
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

  // 2. Test Return Book - Invalid IDs
  console.log("\n--- Test 2: Return book with invalid IDs ---");
  try {
    // Assuming invalid record ID
    await lendingService.returnBook(999999);
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
