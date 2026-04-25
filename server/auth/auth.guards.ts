/**
 * Auth guards - server-side authentication guard utilities
 *
 * Provides functions to protect routes and procedures using the Auth.js session.
 * These guards check whether a user is authenticated and extract session context.
 */

import { auth } from "./auth.config"

/**
 * Session context shape exposed to oRPC procedures
 */
export interface SessionContext {
  id: string
  email: string
  name: string | null
}

/**
 * Gets the current session context
 * @returns The session user or null if not authenticated
 */
export async function getSessionContext(): Promise<SessionContext | null> {
  const session = await auth()
  if (!session?.user) {
    return null
  }
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  }
}

/**
 * Guard: Ensures the request is authenticated
 * @returns The session user
 * @throws Error if no valid session exists
 */
export async function requireAuth(): Promise<SessionContext> {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Authentication required")
  }
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  }
}

/**
 * Guard: Gets the current session user if authenticated, null otherwise
 * @returns The session user or null
 */
export async function getOptionalAuth(): Promise<SessionContext | null> {
  return getSessionContext()
}

/**
 * Check if the current request is authenticated
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth()
  return !!session?.user
}