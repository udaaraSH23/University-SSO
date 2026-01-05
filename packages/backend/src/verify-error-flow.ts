import { studentService } from "./modules/student/student.service";
import { DomainError } from "./errors";

async function run() {
  try {
    console.log("Attempting to get profile for non-existent student...");
    await studentService.getProfile("non-existent@example.com");
  } catch (err) {
    if (err instanceof DomainError) {
      console.log("SUCCESS: Caught DomainError!");
      console.log("Code:", err.code);
      console.log("Message:", err.message);
      console.log("Status:", err.statusCode);
    } else {
      console.log("FAILURE: Caught unexpected error:", err);
    }
  }
}

run().catch(console.error);
