# Story 1.3: Setup Prisma Schema and Database Connection

Status: in-progress

## Story

As a developer,
I want to set up Prisma with the database schema and Neon connection,
so that the application has a reliable data persistence layer following the architecture's data model.

## Acceptance Criteria

AC1: Prisma + Neon connection configuration

- Given the project requires PostgreSQL on Neon,
- When Prisma is configured with `DATABASE_URL` for runtime access and `DIRECT_URL` for CLI and migration access,
- Then Prisma Client connects successfully to the Neon database,
- And Prisma CLI commands can run migrations against the direct connection,
- And the repo exposes a repeatable Prisma workflow via `pnpm prisma ...` commands.

AC2: Initial canonical Prisma schema

- Given Prisma is installed and configured,
- When I create the initial Prisma schema,
- Then it reflects the canonical data model from `artifacts/planning-artifacts/database-schema.md`,
- And it includes the required finance, auth, membership, invitation, permission, goal, borrowing, settlement, and audit entities,
- And table names use `snake_case` plural naming,
- And primary keys use `uuid`, foreign keys use `<entity>_uuid`,
- And money fields use Prisma `Decimal` mapped to 2-decimal database precision.

AC3: Initial migration and verification

- Given the schema is defined,
- When I run the initial migration,
- Then the migration creates the database tables in Neon,
- And Prisma Client is generated successfully,
- And I can inspect the schema with Prisma Studio,
- And the implementation documents the commands needed for future migrations and local verification.

## Tasks / Subtasks

- [x] Task 1: Install and wire Prisma for this repo (AC1)
  - [x] Subtask 1.1: Add `prisma` and `@prisma/client` using pnpm, aligned with the architecture baseline for Prisma 7
  - [x] Subtask 1.2: Update `.env.example` to include `DIRECT_URL` alongside `DATABASE_URL` and `AUTH_SECRET`
  - [x] Subtask 1.3: Extend `shared/config/env.ts` so startup validation covers `DIRECT_URL` without regressing existing env validation behavior
  - [x] Subtask 1.4: Create `prisma.config.ts` so Prisma CLI uses the direct connection for migrations and admin operations
  - [x] Subtask 1.5: Add or document Prisma commands needed for generate, migrate, and studio workflows

- [x] Task 2: Create the canonical Prisma schema in `prisma/schema.prisma` (AC2)
  - [x] Subtask 2.1: Define the PostgreSQL datasource and Prisma client generator using current Prisma 7 conventions
  - [x] Subtask 2.2: Model the identity and membership tables: `users`, `refresh_tokens`, `groups`, `group_members`, `group_member_permissions`, `group_invitations`
  - [x] Subtask 2.3: Model the personal finance tables: `personal_incomes`, `personal_expenses`, `personal_goals`, `personal_goal_reservations`, `personal_goal_implementations`, `personal_loans`, `personal_loan_repayments`, `personal_lends`, `personal_lend_repayments`
  - [x] Subtask 2.4: Model the group finance tables: `group_deposits`, `group_withdrawals`, `group_goals`, `group_goal_reservations`, `group_goal_implementations`
  - [x] Subtask 2.5: Model the obligation and audit tables: `over_withdrawal_borrowings`, `over_withdrawal_settlements`, `audit_events`
  - [x] Subtask 2.6: Apply required relations, unique constraints, indexes, defaults, `is_viable` flags, and timestamp fields from the canonical schema doc
  - [x] Subtask 2.7: Use explicit Prisma mapping where needed so code stays idiomatic while persisted table and column names remain architecture-compliant

- [x] Task 3: Add the shared database connection entry point (AC1, AC3)
  - [x] Subtask 3.1: Create `server/db/prisma.ts` with a safe Prisma Client singleton pattern for Next.js server usage
  - [x] Subtask 3.2: Ensure the connection layer is ready for later repository-only data access, not direct use from UI or route handlers

- [ ] Task 4: Run the initial migration and verify the developer workflow (AC3)
  - [x] Subtask 4.1: Create the initial migration with a clear name such as `init`
  - [x] Subtask 4.2: Confirm Prisma Client generation succeeds after migration
  - [x] Subtask 4.3: Verify Prisma Studio can open against the configured database
  - [x] Subtask 4.4: Run repo quality checks impacted by the changes, at minimum `pnpm lint` and `pnpm type-check`

## Dev Notes

### Scope Guardrails

- This story is only for Prisma foundation, schema definition, migration setup, and DB connection wiring.
- Do not implement domain repositories, business logic, auth flows, oRPC procedures, or seed data beyond what is strictly required for Prisma to function.
- Do not create later stories automatically.

### Source of Truth Hierarchy

Use this precedence when artifacts disagree:

1. `artifacts/planning-artifacts/database-schema.md` for the canonical table set and field-level structure
2. `artifacts/planning-artifacts/architecture.md` for connection strategy, folder boundaries, and backend patterns
3. `artifacts/planning-artifacts/epics.md` for story framing and acceptance criteria
4. `artifacts/planning-artifacts/prd.md` and `artifacts/planning-artifacts/ux-design-specification.md` for product constraints that affect persistence choices

Important: the epic's entity list is incomplete compared with the finalized schema document. The implementation must follow the canonical schema document and include additional required tables such as `group_member_permissions`, `group_invitations`, `personal_loans`, `personal_loan_repayments`, `personal_lends`, `personal_lend_repayments`, and `audit_events`.

### Prisma / Neon Guardrails

- Architecture requires PostgreSQL on Neon with Prisma as the only ORM.
- Runtime app queries must use `DATABASE_URL`.
- Prisma CLI and migration operations must use `DIRECT_URL`.
- Current Prisma docs for Prisma 7 show CLI connection configuration through `prisma.config.ts`, so implementation should follow that current pattern instead of relying on outdated `directUrl` schema configuration.
- Keep the schema and config aligned with current Prisma 7 behavior during implementation.

### Money and Precision Rules

- Persist money fields as Prisma `Decimal` mapped to database precision that supports exactly 2 decimal places, typically `DECIMAL(19,2)`.
- Do not model persisted money as floating JS `number` columns.
- App-level calculations still must follow the project's banker's-rounding and decimal-utility rules defined by architecture, even if those utilities are completed in later stories.

### Naming and Schema Rules

- Tables: `snake_case`, plural
- Columns: `snake_case`
- Primary key field name: `uuid`
- Foreign key field names: `<entity>_uuid`
- Timestamps: use `created_at` and `updated_at` where the canonical schema calls for them
- Include `is_viable` on the entities required by the schema and PRD
- Preserve explicit indexes and unique constraints from `database-schema.md`

### Required File Targets

Create or modify only the files needed for this story:

```text
prisma/
├── schema.prisma
├── migrations/
└── seed.ts                     # only if needed as a minimal placeholder

prisma.config.ts               # Prisma 7 CLI configuration
server/db/prisma.ts            # Prisma Client singleton
shared/config/env.ts           # add DIRECT_URL validation
.env.example                   # add DIRECT_URL example
package.json                   # Prisma dependency and workflow updates if needed
```

### Canonical Entity Coverage

The Prisma schema must cover these tables from the finalized schema artifact:

- `users`
- `refresh_tokens`
- `groups`
- `group_members`
- `group_member_permissions`
- `group_invitations`
- `personal_incomes`
- `personal_expenses`
- `personal_goals`
- `personal_goal_reservations`
- `personal_goal_implementations`
- `personal_loans`
- `personal_loan_repayments`
- `personal_lends`
- `personal_lend_repayments`
- `group_deposits`
- `group_withdrawals`
- `group_goals`
- `group_goal_reservations`
- `group_goal_implementations`
- `over_withdrawal_borrowings`
- `over_withdrawal_settlements`
- `audit_events`

### Previous Story Intelligence

Story 1.2 already established env validation and quality-check scripts. Build on that work, do not replace it.

- `shared/config/env.ts` currently validates `DATABASE_URL` and `AUTH_SECRET`
- This story must extend that validation for `DIRECT_URL`
- The repo currently has no Prisma files yet, so this story should create the first Prisma foundation cleanly
- Recent commit history shows environment validation was centralized already, so reuse that pattern instead of inventing a second config path

### Architecture Compliance

- Keep business logic out of Prisma setup files
- DB access must ultimately go through repository files under `server/domains/*`, but that repository work is not part of this story
- Prepare `server/db/prisma.ts` as the shared low-level client entry point for later repository usage
- Do not access Prisma directly from React components or route handlers

### Verification Commands

At implementation time, the dev agent should verify with the repo's real commands, including:

- `pnpm prisma generate`
- `pnpm prisma migrate dev --name init`
- `pnpm prisma studio`
- `pnpm lint`
- `pnpm type-check`

If package scripts are added instead of raw `pnpm prisma ...` usage, keep them additive and document the exact commands in the story completion notes.

## Project Structure Notes

### Alignment with Existing Story Style

- Keep the artifact in `artifacts/implementation-artifacts/stories/`
- Match the existing story format used by Story 1.2: acceptance criteria first, then tasks, dev notes, references, and dev agent record

### Current Repo State Relevant to This Story

- `shared/config/env.ts` exists and must be updated, not replaced
- `.env.example` exists and currently lacks `DIRECT_URL`
- `package.json` already includes lint, format, type-check, and test commands
- `prisma/` is currently empty or missing files, so this story will establish that structure for the first time

## References

- `artifacts/planning-artifacts/epics.md` — Story 1.3: Setup Prisma Schema and Database Connection
- `artifacts/planning-artifacts/database-schema.md` — canonical database schema and table definitions
- `artifacts/planning-artifacts/architecture.md` — Data Architecture, Connection Strategy, Project Structure & Boundaries
- `artifacts/planning-artifacts/prd.md` — technical constraints, auditability, invariants, and transactional consistency requirements
- `artifacts/planning-artifacts/ux-design-specification.md` — monetary precision and display constraints that affect persistence decisions
- `artifacts/implementation-artifacts/stories/1-2-configure-development-environment-and-tools.md` — existing env-validation and repo-tooling baseline
- Prisma docs via Context7 (`/prisma/web`) — current guidance for Prisma 7 connection config, `prisma.config.ts`, `migrate dev`, and Studio

## Dev Agent Record

### Agent Model Used

OpenCode gpt-5.4

### Debug Log References

- `pnpm add @prisma/client@^7.6.0`
- `pnpm add -D prisma@^7.6.0`
- `pnpm add dotenv@^17.2.3`
- `pnpm add @prisma/adapter-pg@^7.8.0 pg@^8.16.3`
- `pnpm prisma validate`
- `pnpm prisma generate`
- `pnpm prisma migrate dev --name init` (blocked by Neon connectivity)
- `pnpm prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script`
- `pnpm prisma studio`
- `pnpm test`
- `pnpm lint`
- `pnpm type-check`

### Completion Notes List

- Added Prisma 7 repo wiring with `pnpm prisma`, `DIRECT_URL` validation, and `prisma.config.ts` CLI configuration.
- Implemented the canonical Prisma schema from `artifacts/planning-artifacts/database-schema.md` and added the shared Prisma singleton entry point in `server/db/prisma.ts` using the Prisma PostgreSQL adapter.
- Added schema/workflow verification coverage in `tests/unit/env-validation.spec.ts` and `tests/unit/prisma-setup.spec.ts`.
- Created a checked-in initial migration at `prisma/migrations/20260424124800_init/migration.sql` from the canonical schema.
- Blocker: `pnpm prisma migrate dev --name init` could not reach the configured Neon host (`P1001`), so DB table creation in Neon could not be verified from this environment.

### File List

- `.env.example`
- `artifacts/implementation-artifacts/sprint-status.yaml`
- `artifacts/implementation-artifacts/stories/1-3-setup-prisma-schema-and-database-connection.md`
- `package.json`
- `pnpm-lock.yaml`
- `prisma.config.ts`
- `prisma/migrations/20260424124800_init/migration.sql`
- `prisma/migrations/migration_lock.toml`
- `prisma/schema.prisma`
- `server/db/prisma.ts`
- `shared/config/env.ts`
- `tests/unit/env-validation.spec.ts`
- `tests/unit/prisma-setup.spec.ts`

### Change Log

- 2026-04-24: Implemented Prisma foundation, canonical schema, local initial migration artifact, and repo verification workflow. Neon migration apply remains blocked by database connectivity.
