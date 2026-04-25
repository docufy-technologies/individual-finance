/**
 * oRPC context type
 * Carries request-scoped data through the middleware chain
 */
export interface ORPCContext {
  /**
   * Trace ID for correlation and debugging
   */
  traceId: string
  /**
   * User session from auth middleware
   */
  user?: {
    id: string
    email: string
  }
  /**
   * Request headers
   */
  headers?: Headers
}

/**
 * Context factory function
 */
export async function createContext(request: Request): Promise<ORPCContext> {
  return {
    traceId: crypto.randomUUID(),
    headers: request.headers,
  }
}