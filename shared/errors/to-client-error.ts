/**
 * Error transformation utilities
 * Converts domain errors to typed error contract format
 */

import { ERROR_CODES } from './error-codes'
import { DomainError, domainError } from './domain-error'

/**
 * Error contract for API responses
 * Follows architecture error contract format
 */
export interface ErrorContract {
  code: string
  message: string
  traceId: string
  details?: unknown
}

/**
 * Convert domain error to error contract
 * @param error - Domain error
 * @param traceId - Correlation ID
 */
export function toErrorContract(error: DomainError, traceId: string): ErrorContract {
  return {
    code: error.code,
    message: error.public ? error.message : ERROR_CODES.INTERNAL_ERROR,
    traceId,
    details: error.public ? undefined : { cause: error.cause?.message },
  }
}

/**
 * Convert domain error params to error contract
 * @param params - Domain error parameters
 * @param traceId - Correlation ID
 */
export function toClientError(
  params: Parameters<typeof domainError>[0],
  traceId: string,
): ErrorContract {
  const error = domainError(params)
  return toErrorContract(error, traceId)
}

/**
 * Check if error is a domain error
 */
export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError
}