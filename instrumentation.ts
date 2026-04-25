/**
 * Instrumentation for Next.js
 * Registers server-side oRPC client for SSR optimization
 */

export async function register() {
  await import('./lib/orpc.server')
}