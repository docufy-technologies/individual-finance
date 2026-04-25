/**
 * Unit tests for refresh token service
 *
 * Tests token generation, hashing, validation, and lifecycle management.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { hashToken, generateRefreshToken } from "@/server/auth/refresh-token.service"

describe("Refresh Token Service", () => {
  describe("generateRefreshToken", () => {
    it("should generate a token with sufficient length", () => {
      const token = generateRefreshToken()

      // 64 bytes base64url encoded = ~86 characters minimum
      expect(token.length).toBeGreaterThanOrEqual(80)
    })

    it("should generate unique tokens each time", () => {
      const token1 = generateRefreshToken()
      const token2 = generateRefreshToken()

      expect(token1).not.toEqual(token2)
    })

    it("should only contain base64url safe characters", () => {
      const token = generateRefreshToken()

      // base64url uses A-Z, a-z, 0-9, -, _
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/)
    })
  })

  describe("hashToken", () => {
    it("should produce consistent hashes for the same input", () => {
      const token = "test-token-123"
      const hash1 = hashToken(token)
      const hash2 = hashToken(token)

      expect(hash1).toEqual(hash2)
    })

    it("should produce different hashes for different inputs", () => {
      const hash1 = hashToken("token-1")
      const hash2 = hashToken("token-2")

      expect(hash1).not.toEqual(hash2)
    })

    it("should produce a 64-character hex string (SHA-256)", () => {
      const token = generateRefreshToken()
      const hash = hashToken(token)

      expect(hash).toMatch(/^[a-f0-9]{64}$/)
    })
  })

  describe("Prisma integration (mocked)", () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it("should create refresh token with correct structure", async () => {
      const mockPrisma = {
        refreshToken: {
          create: vi.fn().mockResolvedValue({
            uuid: "token-uuid-1",
            userUuid: "user-1",
            tokenHash: "hash-value",
            expiresAt: new Date(),
          }),
        },
      }

      vi.doMock("@/server/db/prisma", () => ({ prisma: mockPrisma }))

      const { createRefreshToken } = await import("@/server/auth/refresh-token.service")
      const result = await createRefreshToken("user-1")

      expect(result).toHaveProperty("uuid")
      expect(result).toHaveProperty("tokenHash")
      expect(result).toHaveProperty("expiresAt")
      expect(result.expiresAt).toBeInstanceOf(Date)
    })

    it("should validate refresh token and return user data", async () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      const mockPrisma = {
        refreshToken: {
          findUnique: vi.fn().mockResolvedValue({
            uuid: "token-uuid-1",
            userUuid: "user-1",
            tokenHash: "hash-value",
            expiresAt: futureDate,
          }),
          delete: vi.fn(),
        },
      }

      vi.doMock("@/server/db/prisma", () => ({ prisma: mockPrisma }))

      const { validateRefreshToken } = await import("@/server/auth/refresh-token.service")
      const result = await validateRefreshToken("test-token")

      expect(result).toEqual({
        uuid: "token-uuid-1",
        userUuid: "user-1",
        expiresAt: futureDate,
      })
    })

    it("should return null for non-existent token", async () => {
      const mockPrisma = {
        refreshToken: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      }

      vi.doMock("@/server/db/prisma", () => ({ prisma: mockPrisma }))

      const { validateRefreshToken } = await import("@/server/auth/refresh-token.service")
      const result = await validateRefreshToken("invalid-token")

      expect(result).toBeNull()
    })

    it("should delete expired token and return null", async () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)

      const mockPrisma = {
        refreshToken: {
          findUnique: vi.fn().mockResolvedValue({
            uuid: "token-uuid-1",
            userUuid: "user-1",
            tokenHash: "hash-value",
            expiresAt: pastDate,
          }),
          delete: vi.fn(),
        },
      }

      vi.doMock("@/server/db/prisma", () => ({ prisma: mockPrisma }))

      const { validateRefreshToken } = await import("@/server/auth/refresh-token.service")
      const result = await validateRefreshToken("expired-token")

      expect(result).toBeNull()
      expect(mockPrisma.refreshToken.delete).toHaveBeenCalledWith({
        where: { uuid: "token-uuid-1" },
      })
    })
  })
})