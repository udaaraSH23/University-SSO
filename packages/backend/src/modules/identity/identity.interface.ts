// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251231-AG-INTERFACE-IDENTITY
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-31T12:24:00Z

const __FP_SIG = "FP-20251231-AG-INTERFACE-IDENTITY|HASH-PLACEHOLDER";

/**
 * DTO for creating a user in WSO2 Identity Server.
 * Follows SCIM 2.0 User schema structure.
 */
export interface WSO2UserCreateDTO {
  userName: string;
  emails: string[];
  name: {
    givenName: string;
    familyName: string;
  };
}

/**
 * DTO for updating a user in WSO2 Identity Server.
 * Partial update structure for SCIM 2.0 PATCH operations.
 */
export interface WSO2UserUpdateDTO {
  name?: {
    givenName?: string;
    familyName?: string;
  };
}

/**
 * Interface for Identity Service.
 * Defines the contract for interacting with the Identity Provider (WSO2 IS).
 */
export interface IIdentityService {
  /**
   * Creates a new user in the Identity Provider.
   * @param data - User creation payload
   * @returns The unique ID of the created user (WSO2 ID)
   */
  createUser(data: WSO2UserCreateDTO): Promise<string>;

  /**
   * Assigns a user to a specific role/group.
   * @param userId - The unique WSO2 user ID
   * @param groupName - The name of the group/role (e.g., 'ROLE_STUDENT')
   * @param username - The display name or username of the user (optional but recommended for WSO2)
   */
  addUserToGroup(
    userId: string,
    groupName: string,
    username?: string
  ): Promise<void>;

  /**
   * Generates an offline invitation link for onboarding.
   * @param email - The email address to send the invite to
   * @returns The generated invitation URL
   */
  generateInviteLink(email: string): Promise<string>;

  /**
   * Updates user details in the Identity Provider.
   * @param id - The unique WSO2 user ID
   * @param data - Partial data to update
   */
  updateUser(id: string, data: WSO2UserUpdateDTO): Promise<void>;

  /**
   * Deletes a user from the Identity Provider.
   * @param id - The unique WSO2 user ID
   */
  deleteUser(id: string): Promise<void>;

  /**
   * Retrieves all available groups/roles from the Identity Provider.
   * @returns List of groups
   */
  getGroups(): Promise<any[]>;
}
