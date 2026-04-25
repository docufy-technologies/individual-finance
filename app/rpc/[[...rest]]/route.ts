import { RPCHandler } from '@orpc/server/fetch'
import { router } from '@/server/orpc/router'
import { createContext } from '@/server/orpc/context'

const handler = new RPCHandler(router)

/**
 * Handle incoming oRPC requests
 * @param request - The incoming request
 * @returns Response with oRPC result or error
 */
async function handleRequest(request: Request): Promise<Response> {
  const { response, matched } = await handler.handle(request, {
    prefix: '/rpc',
    context: await createContext(request),
  })

  if (!matched) {
    return new Response('Not found', { status: 404 })
  }

  return response ?? new Response('Internal error', { status: 500 })
}

// Export HTTP methods for App Router
export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest