/**
 * Session utilities - helper functions for session management
 *
 * Re-exports session-related utilities and provides type-safe session helpers.
 */

export type { SessionContext } from "./auth.guards"
export { getSessionContext, requireAuth, getOptionalAuth, isAuthenticated } from "./auth.guards"