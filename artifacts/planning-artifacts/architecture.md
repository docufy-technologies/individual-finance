---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
  - 7
  - 8
inputDocuments:
  - /home/ratul/CodeBase/individual-finance/artifacts/planning-artifacts/prd.md
  - /home/ratul/CodeBase/individual-finance/artifacts/planning-artifacts/ux-design-specification.md
  - /home/ratul/CodeBase/individual-finance/resources/project-brief-first-draft.md
workflowType: 'architecture'
project_name: 'Individual Finance'
user_name: 'Ratul'
date: '2026-04-17'
lastStep: 8
status: 'complete'
completedAt: '2026-04-17'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**  
The requirement set defines a dual-domain finance platform with strict bounded contexts: Personal Finance and Group Finance. Core capabilities include transaction recording, obligation lifecycle management, role-governed group actions, deterministic allocation logic, reserve and goal implementation mechanics, and support-grade dispute reconstruction. Architecturally, this implies domain-isolated ledgers, explicit policy enforcement boundaries, and a deterministic rule execution layer that always emits explanation traces.

**Non-Functional Requirements:**  
The strongest architectural drivers are deterministic outputs, atomic money-impacting operations, immutable auditability, and end-to-end traceability with correlation IDs across client and server. Performance targets (rule p95 <= 300ms, ledger/update p95 <= 800ms), reliability targets (99.5% MVP), and security requirements (TLS, encryption at rest, server-side PBAC) require disciplined service boundaries, transaction design, and observability from day one.

**Scale & Complexity:**  
This project sits at high complexity due to rule-heavy financial logic, fairness-sensitive group state transitions, and non-negotiable explainability/audit constraints.

- Primary domain: Full-stack web fintech (transactional + rules engine)
- Complexity level: High
- Estimated architectural components: 10-14 core components (identity/access, personal ledger, group ledger, rule engine, obligations, goals/reserve, explainability, audit/events, observability/tracing, API/BFF, UI app, reporting/support surfaces)

### Technical Constraints & Dependencies

- **Package Manager:** pnpm and pnpx only - npm and yarn are explicitly disallowed throughout the project
- Deterministic calculation must be guaranteed across environments.
- Monetary values must use floating-point numbers with up to 2 decimal places.
- Money-impacting write paths require atomic consistency across ledger, balances, obligations, reserves, and goal progress.
- PBAC must be enforced at API boundary and service layer for all protected actions.
- Explainability payload generation is mandatory for all balance-impacting group outcomes.
- Precision handling: use banker's rounding (round-half-to-even) for calculations, store values with maximum 2 decimal places, and apply decimal truncation at persistence boundaries to avoid floating-point accumulation errors.

### Group Finance Mechanics

**Available Group Funds Formula:**
- `available_group_funds = total_member_deposits - total_reserved_for_goals - total_withdrawn`
- Where `total_withdrawn` is the gross withdrawal amount (including any borrowed amounts from over-withdrawal)
- Note: `goal_implementation_total` is NOT part of the available group funds calculation

**Withdrawal vs Borrowing Semantics:**
- **Withdrawal**: Using your own contributed money from net balance
- **Over-withdrawal**: Withdrawing more than your contribution, triggering proportional borrowing from members with positive net balance
- The system allows over-withdrawal when requested amount is within available group funds
- Over-withdrawal excess is allocated as borrowing proportionally to eligible positive net-balance members

**Net Balance Formula:**
- `net_balance = total_deposits - total_withdrawals - borrowing_allocations + returned_withdrawals`

**Lending Capacity:**
- `lending_capacity = net_balance - reserved_money`
- Used for proportional borrowing allocation calculation

**Goal Implementation Flow:**
- Reserves block money from withdrawal (contribute to goal tracking)
- Reserve events pull progress bar UP (money saved/collected for goal)
- Implementation events pull progress bar DOWN (money spent on goal)
- **Goal implementation can ONLY happen from reserved money**
- Implementation from members' positive net balances is deprecated
- If no reserved money exists, implementation is blocked
- If actual implementation amount is less than the reserved amount, excess is automatically unblocked and becomes available for withdrawal

**Admin Reserve from Members' Net Balance:**
- Admin can create reservation for goals by reserving money from members' positive net balances
- Reservation is based on each member's lending capacity (net balance - reserved money)
- Amount is reserved proportionally from each member's lending capacity
- Each member's reservation is capped at their individual lending capacity
- If a member's lending capacity is less than their proportional share, remaining amount is redistributed proportionally among members with remaining capacity

**Single-Source Implementation Rule:**
- Admin chooses reserve source at implementation time:
  1. Reserve from members' positive net balances (proportional allocation)
  2. Consume from goal reserve
- One implementation record uses exactly one source—mixing both sources in a single implementation is not allowed

- No external banking/payment integrations in MVP, which simplifies external dependencies but increases importance of internal consistency and reconciliation logic.

### Cross-Cutting Concerns Identified

- Authorization and policy governance (PBAC + admin controls)
- Auditability and immutable event history
- End-to-end traceability with correlation IDs
- Deterministic rule execution and replay testing
- Data integrity and transactional consistency
- Explainability UX contract between backend rule outputs and frontend display
- Observability and alerting for trace gaps and rule-path failures
- Accessibility and mobile-first interaction reliability for critical financial actions
- **Logging:** All events must be logged with timestamps in format `[timestamp] [log level] function name, variable changed its value`
- **is_viable field:** All group-related entities include an `is_viable` field (true by default) used to exclude removed members from financial calculations

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application, optimized for mobile-first UX, deterministic financial workflows, and auditable backend behavior.

### Starter Options Considered

1. create-next-app (official Next.js starter)
- Strong fit for App Router + Vercel deployment
- Clean baseline for integrating oRPC, Auth.js, shadcn, Prisma/Neon, and Playwright
- Supports Biome at bootstrap time

2. Opinionated full-stack starters
- Can accelerate setup
- Risk: extra opinions that don't match the chosen oRPC + Prisma/Neon layering

### Selected Starter: create-next-app (Next.js App Router)

**Rationale for Selection:**
Best alignment with your choices:
- Next.js App Router
- oRPC as business logic/API boundary
- PostgreSQL (Neon) as canonical persistence
- Prisma as ORM
- Auth.js acceptable for auth flows
- Vercel deployment
- Biome as the linter/formatter baseline

**Initialization Command:**

```bash
pnpm create next-app@latest individual-finance --typescript --tailwind --biome --app --import-alias "@/*" --use-pnpm
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript-first Next.js app with App Router conventions.

**Styling Solution:**
Tailwind CSS + shadcn/ui component model.
Magic MCP is the default component sourcing path for building/adapting UI components.

**Build Tooling:**
Next.js build pipeline (Turbopack in dev by default), Vercel-friendly deployment path.

**Testing Framework:**
Playwright for E2E and critical journey validation.

**Code Organization:**
No `src/` directory. Root-level `app/`, `components/`, `lib/`, and domain folders.

**Development Experience:**
Biome as primary linter/formatter (systemwide preference aligned), plus Next.js DX defaults.

### Stack Constraint Note

- PostgreSQL (Neon) is the single source of truth for finance-domain data.
- Business logic is handled in the oRPC service layer (not in UI, not in route handlers).
- Finance domain duplication across multiple databases is explicitly disallowed.

**Note:** Project initialization with these settings should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Canonical persistence: PostgreSQL on Neon
- ORM: Prisma
- Domain/business logic boundary: oRPC service layer (server-owned)
- Authentication strategy: Auth.js with JWT sessions
- Authorization model: strict PBAC for group-scoped actions
- API contract: oRPC-first with generated OpenAPI
- Idempotency requirement: mandatory idempotency key for money-impacting mutations
- CI/CD gate policy: migration review required, quality gates enforced

**Important Decisions (Shape Architecture):**
- Error contract standardization with typed domain codes and trace IDs
- Rate limiting with global + endpoint-specific policies
- Frontend rendering strategy using Server Components by default
- Feature-sliced frontend architecture with shared shadcn-based design layer
- Observability baseline with structured logs, traceability, and alerting
- Strict startup env validation (fail fast)

**Deferred Decisions (Post-MVP):**
- Optional external API facade for partner/integration use-cases (REST gateway if needed)
- Advanced risk engines beyond baseline IP/device checks
- Additional analytics-heavy event streaming infrastructure

### Data Architecture

- **Canonical Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Data Ownership:** All finance-domain entities are canonical in Postgres
- **Money Representation:** Floating-point with up to 2 decimal places, using precise arithmetic utilities for calculations
- **Consistency Boundary:** Transactional write boundaries for ledger, balances, obligations, reserve states, and goal progress
- **Migration Strategy:** Prisma Migrate with manual review gates in CI/CD
- **Connection Strategy:**
  - `DATABASE_URL` for runtime pooled connections
  - `DIRECT_URL` for Prisma CLI and migration operations
- **Convex Status:** Removed from core architecture

**Version baseline checked:**
- Prisma `7.7.0`

### Authentication & Security

- **Authentication:** Auth.js with JWT session strategy
- **Authorization:** Strict PBAC enforced server-side in oRPC policy evaluators
  - Policy-based access controls are configurable from group settings
  - Policies specify which members can perform specific actions (e.g., reserve for goal, implement goal)
  - Admin-only restricted actions include: goal implementation, permission changes
  - All policy changes produce audit events
- **Sensitive Endpoint Protection:** Rate limiting plus IP/device risk checks
- **Audit Policy:** Immutable append-only audit logging for finance and security events
- **Security Boundary Rule:** Client-side checks are UX only, authorization decisions are server-authoritative

**Version baseline checked:**
- next-auth package line `4.24.14` (Auth.js ecosystem)

### API & Communication Patterns

- **API Style:** oRPC-first internal API
- **API Documentation:** OpenAPI generated from oRPC contracts
- **Error Contract:** Typed domain error codes + user-safe messages + trace ID
- **Rate Limiting:** Global baseline + stricter endpoint policies for finance mutations
- **Idempotency:** Required `idempotency_key` for critical money write endpoints
- **Traceability:** Every financial mutation path must include correlation/trace identifiers

**Version baseline checked:**
- @orpc/server `1.13.14`

### Frontend Architecture

- **State Management:** Mixed model
  - Server-state and cache via TanStack Query
  - Scoped client state where interaction requires it
- **Forms:** TanStack Form + Zod schema validation
- **Component Architecture:** Feature-sliced modules + shared shadcn/ui-based design system
- **Rendering Strategy:** Server Components by default, Client Components only where interaction requires
- **Performance Strategy:** Targeted optimization approach, no lazy-heavy-by-default policy
  - Bundle and route optimization where measurable value exists
  - Preserve UX clarity for critical financial flows

**Version baseline checked:**
- @tanstack/react-query `5.99.0`
- @tanstack/react-form `1.29.0`
- zod `4.3.6`

### Infrastructure & Deployment

- **Deployment Model:** Vercel for Next.js/oRPC + Neon for PostgreSQL
- **CI/CD Quality Gates:** Required
  - Biome
  - Typecheck
  - Unit/integration test gates
  - Playwright critical-journey E2E gates
  - Migration review/approval gate
- **Environment Strategy:** Strict env schema validation at startup, fail fast on invalid/missing config
- **Observability:** Structured logs + trace IDs + domain event audit views + alerting
- **Secrets Management:** Platform-managed secrets only, no production secrets from committed files

**Version baseline checked:**
- next `16.2.4`
- @playwright/test `1.59.1`
- @biomejs/biome `2.4.12`

### Decision Impact Analysis

**Implementation Sequence:**
1. Bootstrap Next.js project with agreed starter parameters
2. Establish environment schema validation and secrets setup
3. Implement Prisma schema and migration workflow on Neon
4. Implement oRPC contract and domain service boundaries
5. Add Auth.js JWT auth and PBAC policy engine
6. Add idempotency and error-contract middleware
7. Implement audit logging and trace propagation
8. Build feature-sliced frontend shell and shared shadcn system
9. Implement critical money flows with TanStack Query/Form + Zod
10. Enforce CI/CD gates including Playwright critical journeys

**Cross-Component Dependencies:**
- PBAC depends on authenticated identity context and policy store readiness
- Idempotency and transactional integrity depend on finalized data model and service orchestration
- Explainability, auditability, and support diagnostics depend on end-to-end trace propagation
- Frontend confidence UX depends on stable typed error contracts from API/domain layers

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
18 areas where AI agents could make different choices and break consistency.

### Naming Patterns

**Database Naming Conventions:**
- Tables: `snake_case`, plural (`users`, `group_members`, `group_deposits`)
- Columns: `snake_case` (`created_at`, `updated_at`, `group_uuid`)
- Primary keys: `uuid` (UUID type field, standardized name across all domain tables)
- Foreign keys: `<entity>_uuid` (`user_uuid`, `goal_uuid`)
- Index names: plain field name(s) with purpose comment (e.g., `user_uuid` for filtering, `email` for unique lookup)
- Unique constraints: inline with column definition (no separate naming convention needed)

**API Naming Conventions (oRPC procedures):**
- Procedure groups by domain: `auth.*`, `group.*`, `ledger.*`, `goal.*`, `obligation.*`
- Procedure verbs: imperative action style (`group.create`, `ledger.recordExpense`, `goal.implement`)
- Idempotent write endpoints must accept `idempotencyKey`
- Pagination params: `cursor`, `limit`
- Filter params: camelCase in API contract, mapped explicitly in persistence layer

**Code Naming Conventions:**
- TypeScript variables/functions: `camelCase`
- Types/interfaces/classes/components: `PascalCase`
- Files: `kebab-case.ts` / `kebab-case.tsx`
- React components: `PascalCase` export from `kebab-case.tsx` file
- Constants: `UPPER_SNAKE_CASE`

### Structure Patterns

**Project Organization:**
- Feature-sliced organization:
  - `app/` (routes)
  - `features/` (domain UI and hooks)
  - `entities/` (core domain models/ui primitives)
  - `shared/` (ui, lib, config, utils)
  - `server/` (oRPC routers, domain services, repositories, policies)
  - `prisma/` (schema + migrations)
- Tests:
  - Unit/integration co-located as `*.test.ts`
  - E2E under `tests/e2e/` (Playwright)
- Do not use `src/` directory.

**File Structure Patterns:**
- Validation schemas near domain services (`*.schema.ts`)
- Policy logic in `server/policies/*`
- DB access in repository layer only, never directly from route handlers/components
- Shared error catalog in one location (`shared/errors/*`)

### Format Patterns

**API Response Formats:**
- Success: direct typed payload from oRPC contract
- Failure: typed error envelope with:
  - `code` (domain code)
  - `message` (safe user-facing)
  - `traceId`
  - `details` (optional, non-sensitive)
- No ad hoc response wrappers per endpoint.

**Data Exchange Formats:**
- Dates/times: ISO-8601 strings in UTC across API boundaries
- Monetary values: floating-point with up to 2 decimal places (use decimal arithmetic utilities for calculations)
- IDs: opaque UUID strings
- Nullability explicit in schema, no ambiguous missing-vs-null behavior

### Communication Patterns

**Event System Patterns:**
- Domain events named: `<domain>.<action>.v1` (`ledger.deposit.recorded.v1`, `goal.implementation.recorded.v1`)
- Event payload shape:
  - `eventId`, `eventType`, `occurredAt`, `actorUuid`, `traceId`, `data`
- Version events on breaking payload changes only.
- Event type names aligned to renamed tables: e.g., `OVER_WITHDRAWAL_BORROWING`, `OVER_WITHDRAWAL_SETTLEMENT`, `GOAL_RESERVE`, `GOAL_IMPLEMENT`

**State Management Patterns:**
- Server state via TanStack Query
- Forms via TanStack Form + Zod
- Client state only for local UI/session interaction concerns
- Query keys centralized (`shared/query-keys.ts`)
- Mutations must invalidate/refetch deterministic query key sets

### Process Patterns

**Error Handling Patterns:**
- Domain errors thrown from service layer only
- Route/procedure layer maps errors to standard typed contract
- Never leak stack traces/internal SQL details to client
- Every error log includes `traceId`, actor context, and action context

**Loading State Patterns:**
- Standard states: `idle | pending | success | error`
- Financial mutation UIs must show explicit pending/confirmed states
- Disable duplicate submit during pending, enforce idempotency key anyway
- Retry only for safe/idempotent operations

### Enforcement Guidelines

**All AI Agents MUST:**
- Keep business logic in oRPC service layer, not UI and not ad hoc DB calls
- Use Prisma repository boundary for data access
- Apply PBAC checks on every protected action server-side
- Include traceId propagation across request -> domain -> persistence -> audit logging
- Use floating-point with 2 decimal places for money fields (use decimal arithmetic utilities to handle precision correctly)

**Pattern Enforcement:**
- CI checks: Biome, typecheck, tests, Playwright critical journeys
- PR checklist includes architecture conformance section
- Pattern violations tracked as architecture debt with explicit owner

### Pattern Examples

**Good Examples:**
- `server/services/ledger/record-expense.service.ts` validates input with Zod, checks PBAC, writes transactional records, emits audit event with traceId.
- `features/group-obligations/api/use-settle-obligation.ts` uses TanStack Query mutation with idempotency key and typed error handling.

**Anti-Patterns:**
- Direct Prisma calls from React components
- Mixing snake_case and camelCase inconsistently in persistence layer
- Returning raw database errors to clients
- Using naive floating-point arithmetic for money (must use decimal utilities with banker's rounding)
- Skipping traceId in logs for financial mutations
- Mixing withdrawal and borrowing semantics (withdrawing your own money vs borrowing from others)
- Breaking single-source implementation rule (using both net balance and goal reserve in one implementation)
- Treating reserve and implementation as the same thing (reserve = money saved, implementation = money spent)

## Project Structure & Boundaries

### Complete Project Directory Structure

```txt
individual-finance/
├── README.md
├── AGENTS.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tsconfig.json
├── biome.json
├── postcss.config.mjs
├── playwright.config.ts
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── quality-gates.yml
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   └── sign-out/page.tsx
│   ├── (personal)/
│   │   ├── dashboard/page.tsx
│   │   ├── transactions/page.tsx
│   │   └── goals/page.tsx
│   ├── (group)/
│   │   ├── [groupUuid]/page.tsx
│   │   ├── [groupUuid]/obligations/page.tsx
│   │   ├── [groupUuid]/goals/page.tsx
│   │   ├── [groupUuid]/settings/page.tsx
│   │   └── [groupUuid]/invite/[invitationCode]/page.tsx  # Email link landing for group join
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── orpc/route.ts
│       └── health/route.ts
├── features/
│   ├── auth/
│   ├── personal-ledger/
│   ├── group-ledger/
│   ├── group-members/           # Member invitation, join via email link
│   ├── obligations/
│   ├── goals/
│   ├── policy-management/       # PBAC policy configuration from group settings
│   └── audit-viewer/
├── entities/
│   ├── user/
│   ├── group/
│   ├── ledger-entry/          # Sub-divided into incomes, expenses, deposits, withdrawals per schema
│   ├── obligation/            # Over-withdrawal borrowings and settlements per schema
│   └── goal/                 # Personal and group goals with reservations/implementations per schema
├── components/
│   ├── ui/                # shadcn base components
│   ├── forms/             # TanStack Form composites
│   ├── charts/
│   └── feedback/
├── shared/
│   ├── config/
│   │   ├── env.ts
│   │   ├── constants.ts
│   │   └── feature-flags.ts
│   ├── errors/
│   │   ├── error-codes.ts
│   │   ├── domain-error.ts
│   │   └── to-client-error.ts
│   ├── lib/
│   │   ├── money.ts
│   │   ├── date.ts
│   │   ├── idempotency.ts
│   │   └── trace.ts
│   ├── query/
│   │   └── query-keys.ts
│   └── types/
├── server/
│   ├── auth/
│   │   ├── auth.config.ts
│   │   ├── auth.session.ts
│   │   └── auth.guards.ts
│   ├── orpc/
│   │   ├── router.ts
│   │   ├── context.ts
│   │   ├── middleware/
│   │   │   ├── trace.middleware.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   ├── idempotency.middleware.ts
│   │   │   └── error-map.middleware.ts
│   │   └── contracts/
│   ├── policies/
│   │   ├── pbac-engine.ts
│   │   ├── policy-rules.ts
│   │   └── permission-checks.ts
│   ├── domains/
│   │   ├── user/
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── user.schema.ts
│   │   │   └── user.events.ts
│   │   ├── group/
│   │   │   ├── group.service.ts
│   │   │   ├── group.repository.ts
│   │   │   ├── group.schema.ts
│   │   │   ├── invitation.service.ts      # Email invitation link generation and validation
│   │   │   ├── invitation.repository.ts
│   │   │   └── invitation.schema.ts
│   │   ├── personal-ledger/
│   │   ├── group-ledger/
│   │   ├── obligations/
│   │   ├── goals/
│   │   ├── audit/
│   │   └── settlement/
│   └── db/
│       ├── prisma.ts
│       └── transaction.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   └── assets/
├── tests/
│   ├── e2e/
│   │   ├── personal-flow.spec.ts
│   │   ├── group-emergency-withdraw.spec.ts
│   │   ├── goal-implementation.spec.ts
│   │   └── dispute-trace.spec.ts
│   ├── integration/
│   │   ├── orpc/
│   │   ├── policies/
│   │   └── domains/
│   └── fixtures/
└── docs/
    ├── architecture/
    ├── api/
    └── runbooks/
```

### Architectural Boundaries

**API Boundaries:**
- `app/api/orpc/route.ts` is the only business API ingress.
- `app/api/auth/*` handles authentication only.
- No direct DB access from route handlers, all flow goes through domain services.

**Component Boundaries:**
- `features/*` orchestrates UI behavior by business feature.
- `entities/*` contains reusable domain presentation units.
- `components/ui/*` is shadcn-based design system primitives only.

**Service Boundaries:**
- Domain logic is in `server/domains/*`.
- Authorization is centralized in `server/policies/*`.
- Cross-domain orchestration must happen through explicit service calls, never implicit DB coupling.

**Data Boundaries:**
- Canonical persistence only via Prisma repositories.
- Primary key naming: `uuid` (UUID type).
- Foreign key naming: `<entity>_uuid`.
- Financial mutations must use transactional boundaries.

### Requirements to Structure Mapping

**Feature/Epic Mapping:**
- Personal finance flows -> `features/personal-ledger` + `server/domains/personal-ledger`
- Group finance flows -> `features/group-ledger` + `server/domains/group-ledger`
- Member invitation via email link -> `features/group-members` + `server/domains/group/invitation.service.ts`
- Obligation lifecycle -> `features/obligations` + `server/domains/obligations`
- Goal implementation -> `features/goals` + `server/domains/goals`
- Dispute explainability/audit -> `features/audit-viewer` + `server/domains/audit`

**Cross-Cutting Concerns:**
- Auth -> `server/auth` + `app/api/auth`
- PBAC -> `server/policies`
- Idempotency -> `server/orpc/middleware/idempotency.middleware.ts`
- Observability/trace -> `shared/lib/trace.ts` + `server/orpc/middleware/trace.middleware.ts`
- Error contract -> `shared/errors/*` + `error-map.middleware.ts`

### Integration Points

**Internal Communication:**
- UI -> oRPC contracts -> domain services -> repositories -> Postgres (Neon)
- Middleware chain enforces trace, auth, PBAC, rate limit, idempotency

**External Integrations:**
- Neon Postgres via Prisma
- Auth providers via Auth.js
- Vercel runtime/platform services

**Data Flow:**
- Request enters oRPC route
- Context + trace injected
- Auth/PBAC evaluated
- Domain service executes transaction + audit append
- Typed response/error with traceId returned

### File Organization Patterns

**Configuration Files:**
- Root config files only (`biome.json`, `playwright.config.ts`, `next.config.ts`)
- Environment schema validated in `shared/config/env.ts`

**Source Organization:**
- Domain-first backend: `server/domains/*`
- Feature-first frontend: `features/*`
- Shared primitives in `shared/*`

**Test Organization:**
- Critical user journeys in `tests/e2e`
- Domain and policy integration tests in `tests/integration`
- Co-located unit tests near source files

**Asset Organization:**
- Static assets in `public/assets`
- Design-system-led UI assets through `components/ui`

### Development Workflow Integration

**Development Server Structure:**
- Next.js app router for UI
- Single oRPC route for API surface
- Prisma and env validated at startup

**Build Process Structure:**
- Biome + typecheck + tests as quality gates
- Playwright critical journeys as release gate

**Deployment Structure:**
- Vercel deploy for app/runtime
- Neon managed Postgres
- Migration approval required before production apply

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All core decisions are compatible:
- Next.js App Router + oRPC + Prisma + Neon + Auth.js JWT + Playwright + Biome fit together cleanly.
- Domain-first backend and feature-first frontend are aligned with your consistency rules.
- The UUID naming policy (`uuid`, `<entity>_uuid`) is consistently reflected in patterns and boundaries.

**Pattern Consistency:**
Implementation patterns support architecture decisions:
- Business logic is correctly constrained to oRPC domain services.
- Data access is consistently constrained to Prisma repositories.
- Error, trace, idempotency, and PBAC patterns align with security and audit requirements.

**Structure Alignment:**
Project structure supports all architecture choices:
- Single business ingress (`app/api/orpc/route.ts`) enforces contract discipline.
- `server/domains/*` and `server/policies/*` cleanly separate business rules and authorization.
- Test layout supports both integration confidence and critical-journey E2E quality gates.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
All major capabilities have explicit structural homes:
- Personal finance, group finance, obligations, goals, audit/dispute, and policy governance mapped.

**Functional Requirements Coverage:**
All key FR categories are architecturally covered:
- Ledger operations, obligation lifecycle, goal implementation, explainability, PBAC enforcement, and auditability.
- Member invitation via email link (unregistered users guided through account creation before group join)
- Policy-based access control configuration in group settings specifying which members can perform which actions
- Withdrawal vs borrowing semantics: withdrawal uses own contribution, over-withdrawal triggers proportional borrowing from positive net-balance members
- Goal lifecycle: reserves block withdrawal (progress bar up), implementation spends money (progress bar down)
- Single-source implementation: admin chooses one source per implementation (never mixed)
- Excess unblocking: unspent reserve amounts automatically become available for withdrawal

**Non-Functional Requirements Coverage:**
NFR coverage is strong:
- Determinism and transactional integrity: covered by service + repository + transaction boundary rules.
- Security: covered by JWT auth, PBAC, sensitive endpoint protection, and immutable audit logs.
- Performance and reliability: supported by targeted optimization, CI gates, and operational observability.
- Traceability: covered by traceId propagation and typed error contracts.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical decisions are explicit, version-pinned where needed, and implementation-actionable.

**Structure Completeness:**
Directory tree, boundaries, and integration points are concrete enough for agent execution.

**Pattern Completeness:**
Conflict-prone areas are addressed:
- Naming
- Structure
- Format
- Communication
- Error/loading/process behavior

### Gap Analysis Results

**Critical Gaps:** None identified.

**Important Gaps (non-blocking):**
1. Explicit transaction strategy documentation for multi-write finance operations (recommend one shared transaction helper contract).
2. Formal idempotency-key storage retention policy (window/TTL and replay behavior).
3. PBAC policy change governance (versioning + rollback semantics).

**Nice-to-Have Gaps:**
1. Architecture decision records (ADRs) per major decision for long-term evolution.
2. Operational runbooks for incident response in financial inconsistency scenarios.

### Validation Issues Addressed

- Primary key naming convention updated to `uuid` as requested.
- Foreign key naming aligned to `<entity>_uuid`.
- Convex removed from canonical data architecture and replaced by Neon + Prisma as source of truth.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Clear domain boundaries and service ownership
- Strong consistency model for financial operations
- High traceability and auditability baseline
- Implementation patterns that reduce multi-agent drift

**Areas for Future Enhancement:**
- Formal ADR process
- Expanded runbooks and SLO-driven operational policies
- Optional external API facade if partner integrations emerge

### Implementation Handoff

**AI Agent Guidelines:**
- Follow architectural decisions exactly as documented.
- Keep business logic inside `server/domains/*`.
- Use Prisma repositories for all data persistence.
- Enforce PBAC and idempotency on all protected financial mutations.
- Propagate and log traceId end-to-end.

**First Implementation Priority:**
Initialize the project scaffold with the selected starter command and establish:
1) env schema validation,
2) Prisma schema + migration pipeline,
3) oRPC route/context/middleware skeleton.
