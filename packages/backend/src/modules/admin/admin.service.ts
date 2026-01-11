// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251225-AG-SERVICE-ADMIN
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-26T22:35:00Z

import prisma from "../../lib/db";
import { BaseService } from "../../common/services/base.service";
import { IAdminService } from "./admin.interface";
import { AdminProfileDTO, StaffCreateDTO, StaffUpdateDTO } from "./admin.dto";
import { identityService } from "../identity/identity.service";
import { DomainError, ERROR_CODES, RepositoryError } from "../../errors";

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

    try {
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

        throw new DomainError(
          "Staff profile not found",
          ERROR_CODES.RESOURCE_NOT_FOUND,
          404
        );
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
    } catch (err) {
      if (err instanceof DomainError) throw err;
      throw new RepositoryError(
        "Failed to fetch admin profile",
        ERROR_CODES.DB_FAILURE
      );
    }
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
    try {
      // 1. Create user in WSO2 SCIM2
      const wso2Id = await identityService.createUser({
        userName: data.username,
        emails: [{ value: data.email, primary: true }],
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
    } catch (err) {
      if (err instanceof DomainError) throw err;
      throw new RepositoryError(
        "Failed to create staff member",
        ERROR_CODES.DB_FAILURE
      );
    }
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
    this.logger.debug({ page, limit, query }, "Fetching paginated staff");
    try {
      const skip = (page - 1) * limit;

      const where: any = {};

      if (query) {
        where.OR = [
          { fullName: { contains: query } },
          { user: { username: { contains: query } } },
          { user: { email: { contains: query } } },
        ];
      }

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

      const staffDTOs = staffProfiles.map((staff: any) => ({
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
    } catch (err) {
      throw new RepositoryError(
        "Failed to fetch staff list",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Updates an existing staff member (Admin/Librarian) and syncs with WSO2.
   *
   * @param id - Staff Profile ID
   * @param data - Update data
   * @returns Promise<AdminProfileDTO>
   */
  async updateStaff(
    id: number,
    data: StaffUpdateDTO
  ): Promise<AdminProfileDTO> {
    this.logger.debug({ id }, "Updating staff profile");
    try {
      // 1. Fetch current profile
      const current = await prisma.staffProfile.findUnique({
        where: { id },
        include: { user: true },
      });
      if (!current) {
        throw new DomainError(
          "Staff profile not found",
          ERROR_CODES.RESOURCE_NOT_FOUND,
          404
        );
      }

      // 2. Update local DB
      const updated = await prisma.staffProfile.update({
        where: { id },
        data: {
          fullName: data.fullName,
          staffType: data.staffType,
        },
        include: { user: true },
      });

      // 3. Sync name changes to WSO2
      if (data.fullName && data.fullName !== current.fullName) {
        try {
          await identityService.updateUser(current.user.wso2_id, {
            name: {
              givenName: data.fullName.split(" ")[0] || "",
              familyName:
                data.fullName.split(" ").slice(1).join(" ") || "Staff",
            },
          });
        } catch (err) {
          this.logger.warn(
            { err },
            "Failed to sync name change to Identity Server"
          );
        }
      }

      return {
        id: updated.id,
        fullName: updated.fullName,
        email: updated.user.email,
        staffType: updated.staffType,
      };
    } catch (err) {
      if (err instanceof DomainError) throw err;
      throw new RepositoryError(
        "Failed to update staff profile",
        ERROR_CODES.DB_FAILURE
      );
    }
  }

  /**
   * Deletes a staff member, their user account, and WSO2 account.
   *
   * @param id - Staff Profile ID
   */
  async deleteStaff(id: number): Promise<void> {
    this.logger.warn({ id }, "Deleting staff member");

    try {
      // 1. Fetch profile to get WSO2 ID
      const profile = await prisma.staffProfile.findUnique({
        where: { id },
        include: { user: true },
      });
      if (!profile) {
        throw new DomainError(
          "Staff profile not found",
          ERROR_CODES.RESOURCE_NOT_FOUND,
          404
        );
      }

      // 2. Delete from WSO2
      try {
        if (profile.user.wso2_id) {
          await identityService.deleteUser(profile.user.wso2_id);
        }
      } catch (error) {
        this.logger.error(
          { error, wso2_id: profile.user.wso2_id },
          "Failed to delete user from WSO2, proceeding with local delete"
        );
      }

      // 3. Delete from Local Database
      // Using transaction to ensure clean delete of profile and user
      await prisma.$transaction(async (tx: any) => {
        await tx.staffProfile.delete({ where: { id } });
        await tx.user.delete({ where: { id: profile.userId } });
      });
    } catch (err) {
      if (err instanceof DomainError) throw err;
      throw new RepositoryError(
        "Failed to delete staff member",
        ERROR_CODES.DB_FAILURE
      );
    }
  }
}

export const adminService = new AdminService();
