import { os } from '@orpc/server'

/**
 * Simple health check procedure - public
 */
export const health = os
.route({method:'GET', description: 'Health check endpoint'})
.handler(async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
})

/**
 * Protected test - checks for authorization header
 */
export const testProtected = os
  .use(async ({ context }, input, next) => {
    const headers = context as unknown as { headers?: Headers }
    const auth = headers.headers?.get('authorization')
    if (!auth) {
      const { ORPCError } = await import('@orpc/server')
      throw new ORPCError('UNAUTHORIZED', {
        message: 'Authentication required',
      })
    }
    return next({ context })
  })
  .handler(async () => {
    return {
      message: 'Protected procedure executed successfully',
      timestamp: new Date().toISOString(),
    }
  })

/**
 * Main router
 */
export const router = {
  health,
  testProtected,
}