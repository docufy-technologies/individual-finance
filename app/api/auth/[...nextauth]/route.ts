/**
 * Auth.js route handler
 *
 * Handles all NextAuth.js requests: sign in, sign out, session, and token refresh.
 * Route: app/api/auth/[...nextauth]/route.ts
 */

import { handlers } from "@/server/auth/auth.config"

/**
 * GET handler - retrieves the current session
 * POST handler - handles sign in, sign out, and token refresh
 */
export const { GET, POST } = handlers