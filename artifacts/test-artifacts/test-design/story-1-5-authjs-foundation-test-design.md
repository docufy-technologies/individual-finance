# Story 1.5 Test Design, Auth.js Authentication Foundation

## Scope

Design a risk-based test architecture for Story 1.5 to verify:

- JWT session setup with access and refresh token separation
- Refresh token lifecycle and rotation
- Auth guards and protected-route behavior
- Sign-in and sign-out user journeys with secure cleanup

Out of scope:

- Registration/profile flows (Epic 2)
- PBAC authorization rules beyond auth guard presence
- Group-scoped auth behavior

## Risk Model (Impact x Likelihood)

| Risk ID | Risk | Impact | Likelihood | Priority | Primary Control |
|---|---|---:|---:|---|---|
| R1 | Refresh token not rotated on refresh | 5 | 3 | P1 | Integration tests on jwt callback update path + DB token invalidation checks |
| R2 | Token revocation fails on sign-out | 5 | 3 | P1 | Integration tests for signOut event + deleteMany on user tokens |
| R3 | Unauthenticated user reaches protected route | 5 | 2 | P1 | E2E proxy redirect tests + route matcher coverage |
| R4 | Invalid credentials still create session | 5 | 2 | P1 | Unit/integration tests around credentials authorize negative paths |
| R5 | Expired refresh token still accepted | 4 | 3 | P1 | Service-level validation tests including expiry cleanup branch |
| R6 | Flaky auth E2E due to UI login dependence | 3 | 4 | P2 | API-first auth setup + Playwright storageState in setup project |
| R7 | Session context shape mismatch in guards | 3 | 3 | P2 | Unit tests for guard return contract and null/error branches |

Risk posture: **P1-heavy story**, security and session-integrity sensitive. Depth should be highest at service/integration level, with minimal but critical E2E.

## Test Architecture

### Layering strategy

- **Unit (55%)**: auth guards and refresh token service pure logic
- **Integration (35%)**: Auth.js callbacks/events + Prisma-backed token lifecycle
- **E2E (10%)**: critical user journeys and protected route redirects

### Why this split

- Most failure modes are deterministic server behaviors and are faster/less flaky below UI.
- E2E is reserved for confidence-critical journey checks only.

## Coverage Matrix by Acceptance Criteria

| AC | Coverage Target | Test Level | Status vs Existing |
|---|---|---|---|
| AC1 JWT config + token separation | Credentials auth success/failure, access token max age, refresh token creation path, secure cookie behavior | Unit + Integration + light E2E | **Partial** |
| AC2 Token refresh + rotation | Expired access leads to refresh flow, old refresh invalidated, new refresh issued | Integration | **Gap (major)** |
| AC3 Auth guards | requireAuth/getOptionalAuth/isAuthenticated behavior and protected route redirect | Unit + E2E | **Mostly covered, redirect gap** |
| AC4 Sign-in/sign-out flows | Valid login persistence, sign-out invalidation and token cleanup | Integration + E2E | **Gap (major)** |

## Proposed Test Suites

## 1) Unit Suite, `tests/unit/auth.guards.spec.ts` (extend)

Add:

1. `getSessionContext` returns null when `session.user` missing fields (defensive branch)
2. `requireAuth` throws consistently with canonical error message
3. Guard contract assertions for exact `SessionContext` shape

## 2) Unit Suite, `tests/unit/refresh-token.service.spec.ts` (extend)

Add:

1. `createRefreshToken` sets expiry close to now + 30 days (time-window assertion)
2. `invalidateRefreshToken` calls deleteMany with token UUID
3. `invalidateAllUserRefreshTokens` calls deleteMany with user UUID
4. `countUserRefreshTokens` filters by user + unexpired records

## 3) Integration Suite, `tests/integration/auth/auth-callbacks.test.ts` (new)

Validate Auth.js callback behavior with mocked provider auth + Prisma test DB:

1. **Sign-in trigger** creates refresh token and sets `token.refreshTokenId`
2. **Update trigger** rotates refresh token, old token invalidated, new token issued
3. `session` callback maps token fields into session context correctly
4. Credentials `authorize` returns null for missing email/password
5. Credentials `authorize` returns null for invalid password

## 4) Integration Suite, `tests/integration/auth/signout-revocation.test.ts` (new)

1. `events.signOut` invalidates all refresh tokens for `token.id`
2. No-op safe behavior when token is absent

## 5) E2E Suite, `tests/e2e/auth-foundation.spec.ts` (new)

Critical journeys only:

1. Unauthenticated navigation to protected route redirects to `/sign-in` with `callbackUrl`
2. Invalid sign-in shows user-safe error and no authenticated session
3. Valid sign-in redirects to callback target and grants access
4. Sign-out invalidates session and protected route access is denied afterward

## Fixture and Data Strategy

- Create deterministic user fixture with seeded password hash.
- Use per-test isolated refresh-token rows and cleanup hooks.
- Prefer API-auth setup for E2E and reuse with Playwright `storageState`.

## Flakiness Controls

- Use role/label-based locators, avoid CSS fragility.
- Avoid arbitrary waits, use web-first assertions.
- Keep one account per worker or reset state between tests.

## Quality Gate Proposal for Story 1.5

Minimum pass criteria:

1. Unit tests for guards and refresh token service pass
2. New integration suites for callback rotation and sign-out revocation pass
3. Auth E2E critical journey suite passes (redirect, sign-in, sign-out)
4. Existing repo gates pass: `pnpm lint`, `pnpm type-check`, `pnpm test`

Release blocker conditions:

- Any failure in rotation/revocation tests (R1/R2)
- Any failure in protected-route redirect test (R3)
- Any flaky test >2% over 30 runs in CI

## Fast Gap Assessment of Current Implementation

Already present:

- Guard unit tests for positive/negative branches
- Refresh token service tests for token generation/hash/validate expiry path

Missing high-risk checks:

- Refresh token rotation verification (AC2)
- Sign-out revocation integration verification (AC4)
- Protected route redirect E2E checks via proxy
- End-to-end sign-in/sign-out flow validation

## Execution Order (Risk-first)

1. Integration tests for callback rotation and sign-out revocation
2. E2E protected-route redirect + sign-in/sign-out critical flow
3. Unit test expansions for service edge branches
4. Stabilization pass for flaky selectors and fixture cleanup

## Sources Used for Design Decisions

- Playwright docs, test isolation and auth state reuse (`storageState`) and API-request-driven auth setup: `/microsoft/playwright`
- Vitest docs, async mocking and mock lifecycle reset/restore practices: `/vitest-dev/vitest`
- Auth.js / NextAuth docs, JWT + session callbacks and JWT session strategy behavior: `/nextauthjs/next-auth`
