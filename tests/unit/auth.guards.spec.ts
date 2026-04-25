/**
 * Unit tests for auth guards
 *
 * Tests server-side authentication guard functions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// Mock auth() from auth.config
vi.mock("@/server/auth/auth.config", () => ({
  auth: vi.fn(),
}))

describe("Auth Guards", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("requireAuth", () => {
    it("should return session user when authenticated", async () => {
      const { requireAuth } = await import("@/server/auth/auth.guards")
      const { auth } = await import("@/server/auth/auth.config")

      const mockSession = {
        user: { id: "user-1", email: "test@example.com", name: "Test User" },
      }
      vi.mocked(auth).mockResolvedValue(mockSession)

      const result = await requireAuth()

      expect(result).toEqual({
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
      })
    })

    it("should throw error when not authenticated", async () => {
      const { requireAuth } = await import("@/server/auth/auth.guards")
      const { auth } = await import("@/server/auth/auth.config")

      vi.mocked(auth).mockResolvedValue(null)

      await expect(requireAuth()).rejects.toThrow("Authentication required")
    })

    it("should throw error when session has no user", async () => {
      const { requireAuth } = await import("@/server/auth/auth.guards")
      const { auth } = await import("@/server/auth/auth.config")

      vi.mocked(auth).mockResolvedValue({} as never)

      await expect(requireAuth()).rejects.toThrow("Authentication required")
    })
  })

  describe("getOptionalAuth", () => {
    it("should return session user when authenticated", async () => {
      const { getOptionalAuth } = await import("@/server/auth/auth.guards")
      const { auth } = await import("@/server/auth/auth.config")

      const mockSession = {
        user: { id: "user-1", email: "test@example.com", name: "Test User" },
      }
      vi.mocked(auth).mockResolvedValue(mockSession)

      const result = await getOptionalAuth()

      expect(result).toEqual({
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
      })
    })

    it("should return null when not authenticated", async () => {
      const { getOptionalAuth } = await import("@/server/auth/auth.guards")
      const { auth } = await import("@/server/auth/auth.config")

      vi.mocked(auth).mockResolvedValue(null)

      const result = await getOptionalAuth()

      expect(result).toBeNull()
    })
  })

  describe("isAuthenticated", () => {
    it("should return true when authenticated", async () => {
      const { isAuthenticated } = await import("@/server/auth/auth.guards")
      const { auth } = await import("@/server/auth/auth.config")

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com" },
      })

      const result = await isAuthenticated()

      expect(result).toBe(true)
    })

    it("should return false when not authenticated", async () => {
      const { isAuthenticated } = await import("@/server/auth/auth.guards")
      const { auth } = await import("@/server/auth/auth.config")

      vi.mocked(auth).mockResolvedValue(null)

      const result = await isAuthenticated()

      expect(result).toBe(false)
    })
  })

  describe("getSessionContext", () => {
    it("should return session context when authenticated", async () => {
      const { getSessionContext } = await import("@/server/auth/auth.guards")
      const { auth } = await import("@/server/auth/auth.config")

      vi.mocked(auth).mockResolvedValue({
        user: { id: "user-1", email: "test@example.com", name: "Test" },
      })

      const result = await getSessionContext()

      expect(result).toEqual({
        id: "user-1",
        email: "test@example.com",
        name: "Test",
      })
    })

    it("should return null when no session", async () => {
      const { getSessionContext } = await import("@/server/auth/auth.guards")
      const { auth } = await import("@/server/auth/auth.config")

      vi.mocked(auth).mockResolvedValue(null)

      const result = await getSessionContext()

      expect(result).toBeNull()
    })
  })
})