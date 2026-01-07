import { apiClient } from "../packages/api-client/src/client";
import { CreateBookSchema } from "../packages/backend/src/modules/book/book.schema";
import { bookReader } from "../packages/backend/src/modules/book/book.service";
import { ApiClientError } from "../packages/api-client/src/errors";

async function runVerification() {
  console.log("Running Book Module Error Handling Verification...");

  // Test 1: Client Validation
  console.log("\n1. Testing Client Validation (Zod)...");
  try {
    const invalidData = { title: "" }; // Missing required fields
    apiClient.validate(CreateBookSchema, invalidData);
    console.error("❌ Validation mismatch: Should have failed");
  } catch (error) {
    if (error instanceof ApiClientError && error.code === "VALIDATION_ERROR") {
      console.log("✅ Client Validation caught successfully");
    } else {
      console.error("❌ Unexpected error type for validation:", error);
    }
  }

  // Test 2: Domain Error (Book Not Found)
  console.log("\n2. Testing Domain Error (Book Not Found)...");
  try {
    await apiClient.execute(() => bookReader.getBookDetails("999999"));
    console.error("❌ Domain mismatch: Should have failed");
  } catch (error) {
    if (error instanceof ApiClientError && error.code === "BOOK_NOT_FOUND") {
      console.log(
        "✅ Domain Error (Book Not Found) caught and mapped successfully"
      );
      console.log("   Message:", error.message);
    } else {
      console.error("❌ Unexpected error type for domain error:", error);
    }
  }

  // Test 3: Domain Error (Invalid ID Format)
  console.log("\n3. Testing Domain Error (Invalid ID Format)...");
  try {
    await apiClient.execute(() => bookReader.getBookDetails("invalid-id"));
    console.error("❌ Domain mismatch: Should have failed");
  } catch (error) {
    if (error instanceof ApiClientError && error.code === "VALIDATION_ERROR") {
      console.log(
        "✅ Domain Error (Invalid ID) caught and mapped successfully"
      );
      console.log("   Message:", error.message);
    } else {
      console.error("❌ Unexpected error type for invalid ID:", error);
    }
  }

  console.log("\nVerification Complete.");
}

runVerification().catch(console.error);
