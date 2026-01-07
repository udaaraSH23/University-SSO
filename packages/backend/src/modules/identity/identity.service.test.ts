import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { identityService } from "./identity.service";
import { DomainError, ERROR_CODES } from "../../errors";

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe("IdentityService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default token mock
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "mock-token" }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Actually fetchMock is reused, just clear mocks
    global.fetch = fetchMock;
  });

  describe("createUser", () => {
    const mockUser = {
      userName: "newuser",
      emails: [{ value: "new@example.com", primary: true }],
      name: { givenName: "New", familyName: "User" },
    };

    it("should create user and return ID", async () => {
      // Mock createUser response (subsequent call after token)
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "wso2-id-1" }),
      });

      const result = await identityService.createUser(mockUser);

      expect(fetchMock).toHaveBeenCalledTimes(2); // Token + Create
      expect(result).toBe("wso2-id-1");
    });

    it("should throw IDENTITY_CREATION_FAILED if WSO2 fails", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        text: async () => "User already exists",
        status: 409,
      });

      await expect(identityService.createUser(mockUser)).rejects.toThrow(
        DomainError
      );

      // Re-setup mocks for explicit assertion
      vi.clearAllMocks();
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "mock-token" }),
      });
      fetchMock.mockResolvedValueOnce({
        ok: false,
        text: async () => "User already exists",
        status: 409,
      });

      try {
        await identityService.createUser(mockUser);
      } catch (error: any) {
        expect(error.code).toBe(ERROR_CODES.IDENTITY_CREATION_FAILED);
        expect(error.statusCode).toBe(409);
      }
    });
  });
});
