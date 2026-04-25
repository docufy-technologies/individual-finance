import 'server-only'

import { headers } from 'next/headers'
import { createRouterClient } from '@orpc/server'
import { router } from '../server/orpc/router'

/**
 * Server-side oRPC client
 * Used for SSR to reduce HTTP requests and improve latency
 * This file is server-only and should not be imported in client components
 */
globalThis.$client = createRouterClient(router, {
  context: async () => ({
    headers: await headers(),
  }),
})