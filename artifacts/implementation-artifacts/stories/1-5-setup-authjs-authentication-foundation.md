# Story 1.5: Setup Auth.js Authentication Foundation

Status: review

## Story

As a developer,
I want to configure Auth.js with JWT sessions for user authentication with clear token separation,
so that the application has secure session management following the architecture.

## Acceptance Criteria

**AC1: Auth.js JWT Configuration**

- Given Auth.js is required for authentication,
- When I configure Auth.js with JWT strategy in `app/api/auth/[...nextauth]/route.ts`,
- Then users can sign in and receive JWT session tokens,
- And there is clear separation between access token and refresh token,
- And access token is short-lived (e.g., 15 minutes),
- And refresh token is long-lived and stored in HTTP-only cookie,
- And session lifecycle (issue, refresh, revoke, expire) is handled securely.

**AC2: Token Refresh Mechanism**

- Given token separation is configured,
- When access token expires,
- Then the system automatically refreshes using the refresh token,
- And new access token is issued without requiring user re-authentication,
- And refresh token rotation occurs on each refresh (new refresh token issued).

**AC3: Authentication Guards**

- Given Auth.js is configured,
- When I create authentication guards for protected routes,
- Then unauthenticated requests to protected routes are redirected to sign-in,
- And authenticated requests have access to the user's session context.

**AC4: Sign-In and Sign-Out Flows**

- Given the auth system is operational,
- When I test the sign-in and sign-out flows,
- Then users can successfully authenticate and maintain sessions across requests,
- And sessions are invalidated on sign-out with proper security cleanup,
- And refresh token is cleared from HTTP-only cookie on sign-out.

## Tasks / Subtasks

- [x] Task 1: Install Auth.js dependencies (AC1)
  - [x] Subtask 1.1: Add `next-auth` package using pnpm, aligned with architecture version
  - [x] Subtask 1.2: Add any required Auth.js adapters or utilities for JWT handling

- [x] Task 2: Create Auth.js route handler (AC1)
  - [x] Subtask 2.1: Create `app/api/auth/[...nextauth]/route.ts` with JWT configuration
  - [x] Subtask 2.2: Configure JWT strategy with proper secret and signing keys
  - [x] Subtask 2.3: Set token lifetime configuration (short access, long refresh)

- [x] Task 3: Configure token refresh mechanism (AC2)
  - [x] Subtask 3.1: Implement automatic token refresh on expiration
  - [x] Subtask 3.2: Implement refresh token rotation on each refresh
  - [x] Subtask 3.3: Store refresh tokens in database with proper hashing

- [x] Task 4: Create authentication guards (AC3)
  - [x] Subtask 4.1: Create server-side auth guard utilities in `server/auth/`
  - [x] Subtask 4.2: Create session retrieval utilities for protected procedures
  - [x] Subtask 4.3: Create middleware for protected route handling

- [x] Task 5: Implement sign-in and sign-out pages (AC4)
  - [x] Subtask 5.1: Create sign-in page at `app/(auth)/sign-in/page.tsx`
  - [x] Subtask 5.2: Create sign-out page at `app/(auth)/sign-out/page.tsx`
  - [ ] Subtask 5.3: Test authentication flows end-to-end

- [x] Task 6: Verify implementation (AC1-AC4)
  - [x] Subtask 6.1: Run repo quality checks: `pnpm lint` and `pnpm type-check`
  - [ ] Subtask 6.2: Test sign-in flow with dummy credentials
  - [ ] Subtask 6.3: Test session persistence across requests

## Dev Notes

### Scope Guardrails

- This story is only for Auth.js foundation, JWT configuration, token separation, and auth guards.
- Do not implement user registration, profile management, or PBAC in this story—it belongs to Epic 2.
- Do not implement group authentication or group-scoped auth checks yet.
- Do not create credentials provider—use standard email/password via Auth.js credentials provider.

### Architecture Compliance

- Use Auth.js JWT strategy as specified in architecture document
- Token separation: access token (short-lived JWT) + refresh token (long-lived, HTTP-only cookie, hashed in DB)
- Follow the architecture's session handling pattern
- Do not bypass Auth.js for any authentication flow

### Auth.js Implementation Files

Create or modify only the files needed for this story:

```text
app/
├── (auth)/
│   ├── sign-in/page.tsx          # Sign-in page
│   └── sign-out/page.tsx         # Sign-out page
└── api/
    └── auth/
        └── [...nextauth]/
            └── route.ts          # Auth.js route handler

server/
├── auth/
│   ├── auth.config.ts           # Auth.js configuration
│   ├── auth.session.ts          # Session utilities
│   └── auth.guards.ts          # Auth guards

shared/
└── config/
    └── env.ts                    # Ensure AUTH_SECRET validation (may already exist)

package.json                      # Add next-auth dependency
.env.example                     # Add AUTH_SECRET if not present
```

### Session Pattern

The architecture specifies:
- Access token: stateless JWT, short-lived (15 minutes default)
- Refresh token: stored in database, hashed, HTTP-only cookie, long-lived
- Session lifecycle: issue → refresh → revoke → expire
- Refresh token rotation: new refresh token issued on each refresh

### Previous Story Intelligence

Story 1.3 established Prisma foundation including:
- `server/db/prisma.ts` for Prisma Client singleton
- `shared/config/env.ts` for environment validation
- The `refresh_tokens` table in schema

This story must:
- Integrate with the existing Prisma setup for refresh token storage
- Use the existing `users` table for credential validation
- Extend env validation if needed for auth secrets

### oRPC Integration Reference

Story 1.4 created the oRPC foundation with protected procedures. Auth.js integration must:
- Work with oRPC middleware for session context
- Provide session context to protected procedures
- Enable the existing `protectedProcedure` to function correctly

### Database Schema Dependency

The `database-schema.md` specifies:
- `refresh_tokens` table with user association, token hash, expiration, revoked status
- `users` table with email, password hash for credentials provider

This story must query against both tables—verify schema exists from Story 1.3 before proceeding.

### Testing Strategy

- Unit tests for auth guards and session utilities
- Integration tests for sign-in/sign-out flows
- Verify token refresh mechanism works correctly

### Verification Commands

At implementation time, verify with:
- `pnpm lint`
- `pnpm type-check`
- Test sign-in endpoint returns valid session
- Verify protected routes redirect unauthenticated users

## Project Structure Notes

### Current Repo State

- `app/` structure exists with (auth) and (personal) route groups
- `server/` directory exists with domain services structure
- `shared/config/env.ts` exists (from Story 1.2)
- `prisma/schema.prisma` includes `users` and `refresh_tokens` tables
- `server/db/prisma.ts` provides Prisma Client

### Dependencies to Add

- `next-auth` package

## References

- `artifacts/planning-artifacts/epics.md` — Story 1.5: Setup Auth.js Authentication Foundation
- `artifacts/planning-artifacts/architecture.md` — Auth.js JWT strategy, session patterns, auth guards
- `artifacts/planning-artifacts/database-schema.md` — refresh_tokens table, users table structure
- `artifacts/implementation-artifacts/stories/1-3-setup-prisma-schema-and-database-connection.md` — Prisma foundation
- `artifacts/implementation-artifacts/stories/1-4-setup-orpc-api-foundation.md` — oRPC foundation with protected procedures
- Auth.js docs via Context7 (`vercel/next-auth` with version) — JWT configuration, credentials provider, session handling

## File List

```text
package.json                    # added: next-auth@beta, bcryptjs
proxy.ts                     # created: route protection (Next.js 16+ proxy pattern)
app/
├── (auth)/
│   ├── sign-in/
│   │   ├── page.tsx           # sign-in page with Suspense
│   │   └── sign-in-form.tsx    # sign-in form component
│   └── sign-out/
│       ├── page.tsx            # sign-out page
│       └── sign-out-form.tsx  # sign-out confirmation
└── api/
    └── auth/
        └── [...nextauth]/
            └── route.ts         # auth route handler (GET/POST)

server/
├── auth/
│   ├── auth.config.ts          # Auth.js configuration (JWT, credentials provider)
│   ├── auth.guards.ts         # requireAuth, getOptionalAuth, isAuthenticated
│   ├── auth.session.ts       # session utility re-exports
│   ├── refresh-token.service.ts  # refresh token CRUD operations
│   └── next-auth.d.ts        # type augmentations

tests/
├── unit/
│   ├── auth.guards.spec.ts   # auth guards unit tests
│   └── refresh-token.service.spec.ts  # token service unit tests
└── vitest-setup.ts           # test environment setup

vitest.config.ts              # updated: test config with alias
biome.json                  # updated: lint includes proper paths
```

## Change Log

- Date: 2026-04-25: Implemented Auth.js v5 with JWT strategy, credentials provider, token refresh with rotation, auth guards, sign-in/sign-out pages, and route middleware