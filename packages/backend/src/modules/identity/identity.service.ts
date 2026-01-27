// Author: Udara Shanuka (Modified by System)
// Project: University-Portal
// FP-ID: FP-20260105-AG-SERVICE-IDENTITY-V2
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-05T13:10:00Z

import { createLogger } from "@repo/logger";
import {
  IIdentityService,
  WSO2UserCreateDTO,
  WSO2UserUpdateDTO,
} from "./identity.interface";
import { DomainError, ERROR_CODES, RepositoryError } from "../../errors";

const __FP_SIG = "FP-20260105-AG-SERVICE-IDENTITY-V2|HASH-PLACEHOLDER";

const logger = createLogger({ service: "backend-identity-service" });

/**
 * Service: Identity Management (WSO2 IS Wrapper)
 *
 * Handles all interactions with WSO2 Identity Server via SCIM2 and internal APIs.
 * Responsible for user creation, group assignment, profile updates, and invitation generation.
 */
export class IdentityService implements IIdentityService {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string;

  constructor() {
    this.baseUrl =
      process.env.WSO2_BASE_URL || "https://wso2is.com/t/uniportal.com";
    this.clientId = process.env.WSO2_CLIENT_ID || "";
    this.clientSecret = process.env.WSO2_CLIENT_SECRET || "";
    this.tokenUrl =
      process.env.WSO2_TOKEN_URL || `${this.baseUrl}/oauth2/token`;
  }

  /**
   * Retrieves a client credentials access token for WSO2 Management APIs.
   *
   * @returns Promise<string> - The access token
   * @throws AppError if authentication fails
   */
  private async getManagementToken(): Promise<string> {
    logger.debug("Fetching WSO2 management token");
    try {
      const response = await fetch(this.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          scope:
            "internal_offline_invite internal_group_mgt_view internal_group_mgt_update internal_user_mgt_create internal_user_mgt_delete internal_user_mgt_update internal_user_mgt_list internal_user_mgt_view",
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error({ error }, "Failed to fetch WSO2 token");
        throw new DomainError(
          "Failed to authenticate with Identity Server",
          ERROR_CODES.IDENTITY_SERVER_ERROR,
          500
        );
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      logger.error({ error }, "Error in getManagementToken");
      throw new RepositoryError(
        "Failed to connect to Identity Server",
        ERROR_CODES.IDENTITY_SERVER_ERROR
      );
    }
  }

  /**
   * Creates a new user in WSO2 Identity Server via SCIM2.
   *
   * @param data - User creation data (username, email, name)
   * @returns Promise<string> - The created WSO2 User ID
   * @throws AppError if user creation fails
   */
  async createUser(data: WSO2UserCreateDTO): Promise<string> {
    logger.debug({ userName: data.userName }, "Creating user in WSO2");
    try {
      const token = await this.getManagementToken();

      const scimData = {
        schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
        userName: data.userName,
        emails: data.emails, // e.g., [{ value: "user@example.com", primary: true }]
        name: data.name, // { givenName: "First", familyName: "Last" }
        "urn:scim:wso2:schema": {
          askPassword: true, // Always invite user to set their own password
        },
      };

      const response = await fetch(`${this.baseUrl}/scim2/Users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/scim+json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scimData),
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error({ error }, "Failed to create WSO2 user");
        throw new DomainError(
          "Failed to create user in Identity Server",
          ERROR_CODES.IDENTITY_CREATION_FAILED,
          response.status
        );
      }

      const result = await response.json();
      return result.id;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      logger.error({ error }, "Error in createUser");
      throw new RepositoryError(
        "Failed to create user in Identity Server",
        ERROR_CODES.IDENTITY_SERVER_ERROR
      );
    }
  }

  /**
   * Assigns a user to a specific group (role) in WSO2.
   *
   * @param userId - The WSO2 User ID
   * @param groupName - The name of the group to assign (e.g., 'ROLE_STUDENT')
   * @param username - The display name or username of the user
   * @throws AppError if group is not found or assignment fails
   */
  async addUserToGroup(
    userId: string,
    groupName: string,
    username?: string
  ): Promise<void> {
    logger.debug({ userId, groupName }, "Adding user to group in WSO2");
    try {
      const token = await this.getManagementToken();

      // First find the group ID
      const groupResponse = await fetch(
        `${this.baseUrl}/scim2/Groups?filter=displayName eq ${groupName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const groups = await groupResponse.json();
      logger.debug({ groups }, "WSO2 Group Data");
      const groupId = groups.Resources?.[0]?.id;

      if (!groupId) {
        logger.error({ groupName }, "Group not found in WSO2");
        throw new DomainError(
          `Group ${groupName} not found in Identity Server`,
          ERROR_CODES.RESOURCE_NOT_FOUND,
          404
        );
      }

      const memberValue: any = { value: userId };
      if (username) {
        memberValue.display = username;
      }

      const patchData = {
        schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
        Operations: [
          {
            op: "add",
            path: "members",
            value: [memberValue],
          },
        ],
      };

      logger.debug({ patchData }, "WSO2 Patch Data");

      const response = await fetch(`${this.baseUrl}/scim2/Groups/${groupId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/scim+json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patchData),
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error({ error }, "Failed to add user to group");
        throw new DomainError(
          "Failed to assign role in Identity Server",
          ERROR_CODES.IDENTITY_SERVER_ERROR,
          response.status
        );
      }
    } catch (error) {
      if (error instanceof DomainError) throw error;
      logger.error({ error }, "Error in addUserToGroup");
      throw new RepositoryError(
        "Failed to assign group in Identity Server",
        ERROR_CODES.IDENTITY_SERVER_ERROR
      );
    }
  }

  /**
   * Generates an offline invitation link for a user.
   *
   * @param email - The email of the user to invite
   * @returns Promise<string> - The invitation URL
   * @throws AppError if link generation fails
   */
  async generateInviteLink(email: string): Promise<string> {
    logger.debug({ email }, "Generating invite link in WSO2");
    try {
      const token = await this.getManagementToken();

      const response = await fetch(
        `${this.baseUrl}/o/api/users/v1/offline-invite-link/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        logger.error({ error }, "Failed to generate invite link");
        throw new DomainError(
          "Failed to generate invitation in Identity Server",
          ERROR_CODES.IDENTITY_SERVER_ERROR,
          response.status
        );
      }

      const result = await response.json();
      return result.inviteLink || "";
    } catch (error) {
      if (error instanceof DomainError) throw error;
      logger.error({ error }, "Error in generateInviteLink");
      throw new RepositoryError(
        "Failed to generate invite link",
        ERROR_CODES.IDENTITY_SERVER_ERROR
      );
    }
  }

  /**
   * Updates an existing user's profile in WSO2.
   *
   * @param id - The WSO2 User ID
   * @param data - Data to update (e.g., name)
   * @throws AppError if update fails
   */
  async updateUser(id: string, data: WSO2UserUpdateDTO): Promise<void> {
    logger.debug({ id }, "Updating user in WSO2");
    try {
      const token = await this.getManagementToken();

      const patchData = {
        schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
        Operations: [
          {
            op: "replace",
            value: {
              name: data.name,
            },
          },
        ],
      };

      const response = await fetch(`${this.baseUrl}/scim2/Users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/scim+json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patchData),
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error({ error }, "Failed to update WSO2 user");
        throw new DomainError(
          "Failed to update user in Identity Server",
          ERROR_CODES.IDENTITY_SERVER_ERROR,
          response.status
        );
      }
    } catch (error) {
      if (error instanceof DomainError) throw error;
      logger.error({ error }, "Error in updateUser");
      throw new RepositoryError(
        "Failed to update user in Identity Server",
        ERROR_CODES.IDENTITY_SERVER_ERROR
      );
    }
  }
  /**
   * Deletes a user from WSO2 Identity Server.
   *
   * @param id - The WSO2 User ID
   * @throws AppError if deletion fails
   */
  async deleteUser(id: string): Promise<void> {
    logger.debug({ id }, "Deleting user from WSO2");
    try {
      const token = await this.getManagementToken();
      const response = await fetch(`${this.baseUrl}/scim2/Users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 404) {
        const error = await response.text();
        logger.error({ error }, "Failed to delete WSO2 user");
        throw new DomainError(
          "Failed to delete user in Identity Server",
          ERROR_CODES.IDENTITY_SERVER_ERROR,
          response.status
        );
      }
    } catch (error) {
      if (error instanceof DomainError) throw error;
      logger.error({ error }, "Error in deleteUser");
      throw new RepositoryError(
        "Failed to delete user in Identity Server",
        ERROR_CODES.IDENTITY_SERVER_ERROR
      );
    }
  }

  /**
   * Retrieves a list of groups from WSO2 Identity Server.
   *
   * @returns Promise<any[]> - List of groups
   * @throws AppError if fetch fails
   */
  async getGroups(): Promise<any[]> {
    logger.debug("Fetching groups from WSO2");
    try {
      const token = await this.getManagementToken();
      const response = await fetch(`${this.baseUrl}/scim2/Groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error({ error }, "Failed to fetch groups from WSO2");
        throw new DomainError(
          "Failed to fetch groups",
          ERROR_CODES.IDENTITY_SERVER_ERROR,
          response.status
        );
      }

      const data = await response.json();
      return data.Resources || [];
    } catch (error) {
      if (error instanceof DomainError) throw error;
      logger.error({ error }, "Error in getGroups");
      throw new RepositoryError(
        "Failed to fetch groups from Identity Server",
        ERROR_CODES.IDENTITY_SERVER_ERROR
      );
    }
  }
}

export const identityService = new IdentityService();
