// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251230-US-SERVICE-ACADEMICS
// Generated: 2025-12-30

/**
 * @deprecated This service is deprecated and has been split into:
 * - OrganizationService (Faculties, Departments)
 * - ProgramService (Degree Programs)
 * - CourseService (Academic Courses)
 * - OfferingService (Course Offerings, Enrollments)
 *
 * Please use the new services directly.
 */
import { BaseService } from "../../common/services/base.service";
import { organizationService } from "./services/organization.service";
import { programService } from "./services/program.service";
import { courseService } from "./services/course.service";
import { offeringService } from "./services/offering.service";

export class AcademicsService extends BaseService {
  constructor() {
    super("backend-academics-service");
  }
}

export const academicsService = new AcademicsService();
