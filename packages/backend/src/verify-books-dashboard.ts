import { bookReader } from "./modules/book/book.service";
import { dashboardService } from "./modules/dashboard/dashboard.service";
import { DomainError } from "./errors";

async function verify() {
  console.log("Verifying Books and Dashboard Modules Error Handling...");
  let errors = 0;

  // 1. Verify BookReader
  try {
    console.log("Testing BookReader.getBookDetails('999999')...");
    await bookReader.getBookDetails("999999");
  } catch (e: any) {
    if (e instanceof DomainError && e.code === "BOOK_NOT_FOUND") {
      console.log("✅ BookReader throws DomainError with BOOK_NOT_FOUND");
    } else {
      console.error("❌ BookReader failed:", e);
      errors++;
    }
  }

  // 2. Verify BookReader Validation
  try {
    console.log("Testing BookReader.getBookDetails('invalid')...");
    await bookReader.getBookDetails("invalid");
  } catch (e: any) {
    if (e instanceof DomainError && e.code === "VALIDATION_ERROR") {
      console.log("✅ BookReader throws DomainError with VALIDATION_ERROR");
    } else {
      console.error("❌ BookReader validation failed:", e);
      errors++;
    }
  }

  // 3. Verify DashboardService
  try {
    console.log(
      "Testing DashboardService.getDashboardData('nonexistent@example.com')..."
    );
    await dashboardService.getDashboardData("nonexistent@example.com");
  } catch (e: any) {
    // Note: DashboardService calls handleError, which might not throw purely if logic catches it,
    // but in BaseService it usually throws. The original code threw AppError.
    // We expect DomainError with STUDENT_NOT_FOUND
    if (e instanceof DomainError && e.code === "STUDENT_NOT_FOUND") {
      console.log(
        "✅ DashboardService throws DomainError with STUDENT_NOT_FOUND"
      );
    } else {
      console.error("❌ DashboardService failed:", e);
      errors++;
    }
  }

  if (errors === 0) {
    console.log("\nAll verifications passed!");
    process.exit(0);
  } else {
    console.error(`\n${errors} verifications failed.`);
    process.exit(1);
  }
}

verify().catch(console.error);
