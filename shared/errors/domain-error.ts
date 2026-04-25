/**
 * Domain error class
 * Internal error representation for service layer
 */

export interface DomainErrorParams {
  code: string
  message: string
  public?: boolean
  cause?: Error
}

/**
 * Domain error for business logic
 * Translated to error contract at API layer
 */
export class DomainError extends Error {
  public readonly code: string
  public readonly public: boolean
  public readonly cause?: Error

  constructor(params: DomainErrorParams) {
    super(params.message, { cause: params.cause })
    this.name = 'DomainError'
    this.code = params.code
    this.public = params.public ?? true
    this.cause = params.cause
  }
}

/**
 * Create a domain error
 */
export function domainError(params: DomainErrorParams): DomainError {
  return new DomainError(params)
}

/**
 * Predefined error factories
 */
export const UNAUTHORIZED = (message = 'Authentication required') =>
  domainError({ code: 'UNAUTHORIZED', message })

export const NOT_FOUND = (message = 'Resource not found') =>
  domainError({ code: 'NOT_FOUND', message })

export const VALIDATION_ERROR = (message = 'Validation failed') =>
  domainError({ code: 'VALIDATION_ERROR', message })

export const INTERNAL_ERROR = (message = 'Internal server error') =>
  domainError({ code: 'INTERNAL_ERROR', message, public: false })