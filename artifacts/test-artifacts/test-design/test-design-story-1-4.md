# Test Design — Story 1.4: Setup oRPC API Foundation

**Generated:** 2026-04-25
**Test Architect:** Murat
**Story:** 1.4 Setup oRPC API Foundation
**Status:** Executable

---

## 1. Risk Assessment

### 1.1 Risk Matrix

| Risk ID | Risk Description | Likelihood | Impact | Severity | Mitigation |
|--------|------------------|-----------|--------|---------|------------|
| R1 | Route handler fails to handle all HTTP methods | High | High | 🔴 Critical | Test each HTTP method (GET, POST, PUT, PATCH, DELETE) |
| R2 | Middleware chain missing or ineffective | High | High | 🔴 Critical | Verify traceId propagation, auth checks, error mapping |
| R3 | Protected procedure doesn't enforce authentication | Critical | Critical | 🔴 Critical | Test protected endpoint without auth header |
| R4 | Error contract format incorrect | Medium | High | 🔴 High | Validate error response structure |
| R5 | traceId not included in responses | Medium | Medium | 🟡 Medium | Verify traceId in success and error responses |
| R6 | Client configuration fails in browser/server | Medium | Medium | 🟡 Medium | Test both client and server-side calls |
| R7 | Type safety broken at boundary | Low | High | 🟡 Medium | Verify TypeScript compilation |

### 1.2 Risk Prioritization

**Focus Areas (Critical + High):**
1. HTTP method handling (R1)
2. Protected procedure auth enforcement (R3)
3. Middleware chain effectiveness (R2)

---

## 2. Test Strategy

### 2.1 Test Levels

| Level | Focus | Tools |
|-------|-------|-------|
| Unit | Router procedure definitions, schema validation | Vitest |
| Integration | oRPC route handler, middleware chain | Vitest + supertest |
| API/E2E | Full HTTP requests, auth enforcement | Playwright |

### 2.2 Coverage Approach

**Risk-Based Testing:**
- Depth scales with impact
- Test critical paths first (protected procedures, error handling)
- Verify traceId across all layers
- API tests are first-class, not just UI support

---

## 3. Test Cases

### 3.1 AC1 — oRPC Route Setup

| Test ID | Description | Method | Priority | Risk Coverage |
|--------|------------|--------|---------|-------------|
| TC-AC1.1 | Route accepts GET request to /rpc/health | GET | P0 | R1 |
| TC-AC1.2 | Route accepts POST request to /rpc/health | POST | P0 | R1 |
| TC-AC1.3 | Route accepts PUT request to /rpc | PUT | P1 | R1 |
| TC-AC1.4 | Route accepts PATCH request to /rpc | PATCH | P1 | R1 |
| TC-AC1.5 | Route accepts DELETE request to /rpc | DELETE | P1 | R1 |
| TC-AC1.6 | Route returns 404 for unmatched path | GET | P1 | R1 |

### 3.2 AC2 — Middleware Chain Configuration

| Test ID | Description | Method | Priority | Risk Coverage |
|--------|------------|--------|---------|-------------|
| TC-AC2.1 | Trace middleware generates traceId | GET | P0 | R5 |
| TC-AC2.2 | traceId included in response headers | GET | P0 | R5 |
| TC-AC2.3 | traceId included in response body (when applicable) | GET | P0 | R5 |
| TC-AC2.4 | Auth middleware rejects unauthenticated request to protected procedure | GET | P0 | R2, R3 |
| TC-AC2.5 | Auth middleware accepts authenticated request | GET | P0 | R2 |
| TC-AC2.6 | Error middleware maps errors to contract format | GET | P0 | R4 |

### 3.3 AC3 — API Verification

| Test ID | Description | Method | Priority | Risk Coverage |
|--------|------------|--------|---------|-------------|
| TC-AC3.1 | Health endpoint returns {status: "ok"} | POST | P0 | - |
| TC-AC3.2 | Health endpoint returns timestamp | POST | P0 | - |
| TC-AC3.3 | Protected procedure executes with valid auth | POST | P0 | R3 |
| TC-AC3.4 | Protected procedure returns UNAUTHORIZED error without auth | GET | P0 | R3 |
| TC-AC3.5 | Error response includes code, message, traceId | GET | P0 | R4 |
| TC-AC3.6 | TypeScript compiles without errors | Build | P0 | R7 |

---

## 4. Test Execution Plan

### 4.1 Execution Order

```
Phase 1: Build Verification (P0)
├── pnpm build
├── pnpm lint
└── pnpm type-check

Phase 2: Unit Tests (P0)
├── tc-router-schema-validation
└── tc-context-factory

Phase 3: Integration Tests (P0)
├── tc-ac1-http-methods
├── tc-ac2-middleware-chain
└── tc-ac3-api-verification

Phase 4: E2E Tests (P1)
└── tc-full-http-flow
```

### 4.2 Expected Artifacts

| Artifact | Location | Type |
|----------|----------|------|
| Test spec | `tests/unit/orpc/router.test.ts` | Vitest |
| Integration spec | `tests/integration/orpc/route.test.ts` | Vitest |
| E2E spec | `tests/e2e/orpc-api.spec.ts` | Playwright |
| Test summary | `artifacts/test-artifacts/test-summary-story-1-4.md` | Markdown |

---

## 5. Coverage Summary

| AC | Test Coverage | Priority |
|----|-------------|---------|
| AC1 (Route Setup) | 6 test cases | P0-P1 |
| AC2 (Middleware) | 6 test cases | P0 |
| AC3 (Verification) | 6 test cases | P0 |

**Total:** 18 test cases
**Priority P0:** 14 test cases
**Priority P1:** 4 test cases

---

## 6. Dependencies

### 6.1 Required Tools

- Vitest (already configured)
- Playwright (already configured)
- supertest (dev dependency for integration tests)

### 6.2 Pre-Conditions

- oRPC dependencies installed (@orpc/server, @orpc/client, zod)
- Route handler created at app/rpc/[[...rest]]/route.ts
- Router defined at server/orpc/router.ts

---

## 7. DoD Criteria

- [ ] All P0 test cases pass
- [ ] TypeScript compiles without errors
- [ ] Lint passes
- [ ] traceId present in all responses
- [ ] Protected procedure rejects unauthenticated requests
- [ ] Error contract follows architecture format

---

## Confidence Score

**Test Design Confidence:** 95%

**Rationale:**
- Story scope is well-defined with clear ACs
- Implementation exists and is accessible
- Risk assessment based on actual code behavior
- Test cases directly map to acceptance criteria

**Factors**
- ✅ Clear ACs from story
- ✅ Implementation context available
- ✅ Risk-based prioritization applied
- ⚠️ Trace middleware currently inline (not separate file) - adjust test accordingly