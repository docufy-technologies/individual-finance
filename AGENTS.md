# AGENTS.md

Project-specific instructions for AI agents working on Individual Finance.

## Project Context

- **Project Name:** Individual Finance
- **Type:** Full-stack web fintech application (Next.js App Router)
- **Complexity:** High - rule-heavy financial logic, fairness-sensitive group state transitions, non-negotiable explainability/audit constraints

## Technology Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL (Neon) via Prisma
- oRPC for API contracts
- Auth.js (JWT sessions)
- Biome for linting/formatting
- Vitest + Playwright for testing

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run Biome linter |
| `pnpm format` | Format code with Biome |
| `pnpm test` | Run Vitest tests |
| `pnpm test:watch` | Run tests in watch mode |

## Directory Structure

```
individual-finance/
├── app/                  # Next.js App Router pages
│   ├── (auth)/          # Auth pages (sign-in, sign-out)
│   ├── (personal)/      # Personal finance pages
│   ├── (group)/         # Group finance pages
│   └── api/             # API routes (auth, orpc, health)
├── features/            # Feature-sliced UI modules
│   ├── auth/
│   ├── personal-ledger/
│   ├── group-ledger/
│   ├── group-members/
│   ├── obligations/
│   ├── goals/
│   ├── policy-management/
│   └── audit-viewer/
├── entities/            # Core domain models
│   ├── user/
│   ├── group/
│   ├── ledger-entry/
│   ├── obligation/
│   └── goal/
├── components/          # UI components
│   ├── ui/             # shadcn/ui base components
│   ├── forms/          # TanStack Form composites
│   ├── charts/
│   └── feedback/
├── shared/              # Shared utilities
│   ├── config/         # Environment config, constants
│   ├── errors/         # Error catalog
│   ├── lib/            # Money, date, idempotency utilities
│   ├── query/          # TanStack Query keys
│   └── types/
├── server/              # Backend services
│   ├── auth/           # Auth.js config, session, guards
│   ├── orpc/           # oRPC router, context, middleware
│   ├── policies/       # PBAC engine and rules
│   ├── domains/        # Domain services and repositories
│   └── db/             # Prisma client and transactions
├── prisma/              # Database schema and migrations
├── tests/               # Test files
│   ├── e2e/            # Playwright E2E tests
│   └── integration/    # Integration tests
└── docs/                # Documentation
```

## Special Instructions

### Package Manager
- **Use pnpm only** - npm and yarn are explicitly disallowed
- Use `pnpm add` for dependencies
- Use `pnpm remove` to remove dependencies

### Code Style
- **Linting:** Biome (`pnpm lint`)
- **Formatting:** Biome (`pnpm format`)
- Run both before committing

### Naming Conventions

**Database:**
- Tables: `snake_case`, plural (`users`, `group_members`)
- Columns: `snake_case` (`created_at`, `updated_at`)
- Primary keys: `uuid` (UUID type)
- Foreign keys: `<entity>_uuid` (`user_uuid`, `goal_uuid`)

**Code:**
- Variables/functions: `camelCase`
- Types/interfaces/classes/components: `PascalCase`
- Files: `kebab-case.ts` / `kebab-case.tsx`
- Constants: `UPPER_SNAKE_CASE`

### Architecture Rules

1. **Business logic** must stay in `server/domains/*` - never in UI or route handlers
2. **Data access** only through Prisma repositories in `server/domains/*/repository.ts`
3. **PBAC checks** required on every protected action, server-side
4. **Trace ID** must propagate across request -> domain -> persistence -> audit logging
5. **Money values** use floating-point with 2 decimal places + decimal arithmetic utilities (banker's rounding)
6. **No `src/` directory** - root-level folders only
7. **Error handling** - throw domain errors from service layer, map to typed contract at route layer

### Key Patterns

- **API Success:** Direct typed payload from oRPC contract
- **API Failure:** Typed error envelope with `code`, `message`, `traceId`, `details`
- **State Management:** TanStack Query for server state, TanStack Form for forms
- **Dates:** ISO-8601 strings in UTC across API boundaries
- **Audit:** All financial mutations must produce audit events with traceId

### Testing Standards

- Unit/integration tests: co-located as `*.test.ts`
- E2E tests: `tests/e2e/` with Playwright
- Run `pnpm test` before pushing

### Environment Variables

- Required: `DATABASE_URL`, `AUTH_SECRET`
- Copy `.env.example` to `.env` for local development
- Never commit secrets to repository

### File Size Limits

- **No file should exceed 220 lines of code**
- If a file approaches this limit, split into multiple smaller files and import between them
- For `app/` routes: create new page components in the same directory instead of adding to existing files
- This applies to both `.ts/.tsx` source files and route handlers