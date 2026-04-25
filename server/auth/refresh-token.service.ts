/**
 * Refresh token service - manages refresh token lifecycle
 *
 * Handles creation, validation, rotation, and revocation of refresh tokens.
 * Tokens are hashed before storage using SHA-256 for security.
 */

import { createHash, randomBytes } from "node:crypto"

import { prisma } from "@/server/db/prisma"

const REFRESH_TOKEN_MAX_AGE_DAYS = 30

/**
 * Creates a hash of a token using SHA-256
 * @param token - The raw refresh token
 * @returns The hashed token
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

/**
 * Generates a cryptographically secure random token
 * @returns A secure random token string
 */
export function generateRefreshToken(): string {
  return randomBytes(64).toString("base64url")
}

/**
 * Creates a new refresh token for a user
 * @param userId - The user's UUID
 * @returns The created refresh token record
 */
export async function createRefreshToken(userId: string): Promise<{
  uuid: string
  tokenHash: string
  expiresAt: Date
}> {
  const token = generateRefreshToken()
  const tokenHash = hashToken(token)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_MAX_AGE_DAYS)

  const refreshToken = await prisma.refreshToken.create({
    data: {
      userUuid: userId,
      tokenHash,
      expiresAt,
    },
  })

  // Return the token value (not hash) along with the record
  // The token value is only available at creation time
  return {
    uuid: refreshToken.uuid,
    tokenHash,
    expiresAt,
  }
}

/**
 * Validates a refresh token
 * @param token - The raw refresh token to validate
 * @returns The refresh token record if valid, null otherwise
 */
export async function validateRefreshToken(token: string): Promise<{
  uuid: string
  userUuid: string
  expiresAt: Date
} | null> {
  const tokenHash = hashToken(token)

  const refreshToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  })

  if (!refreshToken) {
    return null
  }

  if (refreshToken.expiresAt < new Date()) {
    // Token expired - clean it up
    await prisma.refreshToken.delete({
      where: { uuid: refreshToken.uuid },
    })
    return null
  }

  return {
    uuid: refreshToken.uuid,
    userUuid: refreshToken.userUuid,
    expiresAt: refreshToken.expiresAt,
  }
}

/**
 * Invalidates a specific refresh token
 * @param tokenId - The refresh token UUID to invalidate
 */
export async function invalidateRefreshToken(tokenId: string): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { uuid: tokenId },
  })
}

/**
 * Invalidates all refresh tokens for a user (used on sign-out)
 * @param userId - The user's UUID
 */
export async function invalidateAllUserRefreshTokens(userId: string): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { userUuid: userId },
  })
}

/**
 * Counts active refresh tokens for a user
 * @param userId - The user's UUID
 * @returns The number of active refresh tokens
 */
export async function countUserRefreshTokens(userId: string): Promise<number> {
  return prisma.refreshToken.count({
    where: {
      userUuid: userId,
      expiresAt: { gt: new Date() },
    },
  })
}