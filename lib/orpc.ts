import type { RouterClient } from '@orpc/server'
import { RPCLink } from '@orpc/client/fetch'
import { createORPCClient } from '@orpc/client'
import { router } from '../server/orpc/router'

declare global {
  var $client: RouterClient<typeof router> | undefined
}

const link = new RPCLink({
  url: () => {
    if (typeof window === 'undefined') {
      throw new Error('RPCLink is not allowed on the server side.')
    }
    return `${window.location.origin}/rpc`
  },
  headers: async () => {
    if (typeof window !== 'undefined') {
      return {}
    }
    // Server-side: use headers from next/headers
    const { headers } = await import('next/headers')
    return (await headers()) as Headers
  },
})

/**
 * Client-side oRPC client
 * Works in browser environment
 * Falls back to server-side client if available
 */
export const oRPCClient: RouterClient<typeof router> =
  globalThis.$client ?? createORPCClient(link)