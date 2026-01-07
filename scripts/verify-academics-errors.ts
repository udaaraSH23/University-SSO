import { courseService } from "../packages/backend/src/modules/academics/services/course.service";
import { offeringService } from "../packages/backend/src/modules/academics/services/offering.service";
import { programService } from "../packages/backend/src/modules/academics/services/program.service";
import { DomainError, RepositoryError } from "../packages/backend/src/errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verify() {
  console.log("Verifying Academics Module Error Handling...");

  // 1. Test Course Not Found -> DomainError
  console.log("\n--- Test 1: Update non-existent course ---");
  try {
    await courseService.updateCourse(999999, { name: "Ghost Course" });
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

  // 2. Test Offering Not Found -> DomainError
  console.log("\n--- Test 2: Get non-existent offering ---");
  try {
    await offeringService.getCourseOfferingById(999999);
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

  // 3. Test Program Not Found -> DomainError
  console.log("\n--- Test 3: Get non-existent program ---");
  try {
    await programService.getDegreeProgram(999999);
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
