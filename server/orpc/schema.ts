import { z } from 'zod'

/**
 * Validation schemas for oRPC procedures
 */

// Health check response schema
export const healthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
})

// Protected test response schema
export const testProtectedResponseSchema = z.object({
  message: z.string(),
  timestamp: z.string(),
})

// Error details schema
export const errorDetailsSchema = z.object({
  code: z.string(),
  message: z.string(),
  traceId: z.string(),
  details: z.unknown().optional(),
})

/**
 * Combined schema for oRPC
 * Used for type inference
 */
export const schema = {
  health: {
    output: healthResponseSchema,
  },
  testProtected: {
    output: testProtectedResponseSchema,
  },
} as const

export type Schema = typeof schema