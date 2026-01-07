import { courseService } from "./modules/academics/services/course.service";
import { offeringService } from "./modules/academics/services/offering.service";
import { programService } from "./modules/academics/services/program.service";
import { DomainError } from "./errors";

async function verify() {
  console.log("Verifying Academics Module Error Handling...");
  let errors = 0;

  // 1. Verify CourseService
  try {
    console.log("Testing CourseService.getCourse(999999)...");
    await courseService.getCourse(999999);
  } catch (e: any) {
    if (e instanceof DomainError && e.code === "COURSE_NOT_FOUND") {
      console.log("✅ CourseService throws DomainError with COURSE_NOT_FOUND");
    } else {
      console.error("❌ CourseService failed:", e);
      errors++;
    }
  }

  // 2. Verify OfferingService
  try {
    console.log("Testing OfferingService.getCourseOfferingById(999999)...");
    await offeringService.getCourseOfferingById(999999);
  } catch (e: any) {
    if (e instanceof DomainError && e.code === "OFFERING_NOT_FOUND") {
      console.log(
        "✅ OfferingService throws DomainError with OFFERING_NOT_FOUND"
      );
    } else {
      console.error("❌ OfferingService failed:", e);
      errors++;
    }
  }

  // 3. Verify ProgramService
  try {
    console.log("Testing ProgramService.getDegreeProgram(999999)...");
    await programService.getDegreeProgram(999999);
  } catch (e: any) {
    if (e instanceof DomainError && e.code === "DEGREE_PROGRAM_NOT_FOUND") {
      console.log(
        "✅ ProgramService throws DomainError with DEGREE_PROGRAM_NOT_FOUND"
      );
    } else {
      console.error("❌ ProgramService failed:", e);
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
