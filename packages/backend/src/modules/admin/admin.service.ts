// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251225-AG-SERVICE-ADMIN
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:35:00Z

import prisma from "../../lib/db";
import { AppError } from "../../common/utils/errors/app-error";
import { BaseService } from "../../common/services/base.service";
import { IAdminService } from "./admin.interface";
import { AdminProfileDTO, StaffCreateDTO } from "./admin.dto";
import { identityService } from "../identity/identity.service";

const __FP_SIG = "FP-20251225-AG-SERVICE-ADMIN|HASH-PLACEHOLDER";

/**
 * Service: Admin/Staff Business Logic
 * Handles operations related to admin and staff profiles.
 */
export class AdminService extends BaseService implements IAdminService {
  constructor() {
    super("backend-admin-service");
  }

  /**
   * Retrieves the profile for a staff member/admin.
   *
   * @param email - User's email address
   * @returns Promise<AdminProfileDTO>
   * @throws AppError if profile is not found
   */
  async getProfile(email: string): Promise<AdminProfileDTO> {
    this.logger.debug({ email }, "Fetching admin profile");

    // Find User first to get ID, or join directly if allowed.
    // Schema has 'StaffProfile' linked to 'User' via 'userId'.
    // We can query StaffProfile where User.email = email.

    const profile = await prisma.staffProfile.findFirst({
      where: {
        user: {
          email: email,
        },
      },
      include: {
        user: true,
      },
    });

    if (!profile) {
      this.logger.warn({ email }, "Staff profile not found");
      // Fallback: If user exists but no staff profile, we might return basic user info or throw.
      // For resilience during dev (if seeds are missing), let's check User table.
      const user = await prisma.user.findUnique({ where: { email } });
      if (user && (user.role === "Admin" || user.role === "Librarian")) {
        return {
          id: user.id,
          fullName: user.username, // Fallback name
          email: user.email,
          staffType: user.role,
        };
      }

      throw new AppError("Staff profile not found", 404);
    }

    const result = {
      id: profile.id,
      fullName: profile.fullName,
      email: profile.user.email,
      staffType: profile.staffType,
    };

    this.logger.debug(
      { result, layer: "Service" },
      "[AdminService] getProfile returning"
    );
    return result;
  }
  // =====================================================================================
  /**
   * Creates a new staff member (Admin/Librarian) and registers in Identity Server.
   *
   * @param data - Staff creation data
   * @returns Promise<AdminProfileDTO>
   */
  async createStaff(data: StaffCreateDTO): Promise<AdminProfileDTO> {
    this.logger.debug({ username: data.username }, "Creating new staff member");

    // 1. Create user in WSO2 SCIM2
    const wso2Id = await identityService.createUser({
      userName: data.username,
      emails: [data.email],
      name: {
        givenName: data.fullName.split(" ")[0] || "Staff",
        familyName: data.fullName.split(" ").slice(1).join(" ") || "User",
      },
    });

    // 2. Assign to Group based on role
    const groupName = data.role === "Admin" ? "Admins" : "Librarians";
    await identityService.addUserToGroup(wso2Id, groupName, data.username);

    // 3. Generate invitation
    try {
      await identityService.generateInviteLink(data.email);
    } catch (err) {
      this.logger.warn(
        { err },
        "Failed to generate invite link, but staff created"
      );
    }

    // 4. Save to database
    const profile = await prisma.staffProfile.create({
      data: {
        fullName: data.fullName,
        staffType: data.staffType,
        user: {
          create: {
            username: data.username,
            email: data.email,
            role: data.role,
            wso2_id: wso2Id,
          },
        },
      },
      include: {
        user: true,
      },
    });

    const result = {
      id: profile.id,
      fullName: profile.fullName,
      email: profile.user.email,
      staffType: profile.staffType,
    };

    this.logger.debug({ result }, "Staff member created successfully");
    return result;
  }
  /**
   * Retrieves a paginated list of staff members (admins/librarians).
   *
   * @param filters - Pagination and search filters
   * @returns Promise<PaginatedStaffDTO>
   */
  async getPaginatedStaff(filters: {
    page: number;
    limit: number;
    query?: string;
  }): Promise<import("./admin.dto").PaginatedStaffDTO> {
    const { page, limit, query } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query) {
      where.OR = [
        { fullName: { contains: query } },
        { user: { username: { contains: query } } },
        { user: { email: { contains: query } } },
      ];
    }

    // Default to active staff, or include inactive? For now, fetch all.
    // Filter by role if needed in future (User.role IN ['Admin', 'Librarian'])

    const [total, staffProfiles] = await Promise.all([
      prisma.staffProfile.count({ where }),
      prisma.staffProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const staffDTOs = staffProfiles.map((staff) => ({
      id: staff.id,
      fullName: staff.fullName,
      email: staff.user.email,
      staffType: staff.staffType,
      username: staff.user.username,
      role: staff.user.role,
      status: staff.active ? "Active" : "Inactive",
    }));

    return {
      staff: staffDTOs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const adminService = new AdminService();
