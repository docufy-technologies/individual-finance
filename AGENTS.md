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
- React Compiler enabled

## Available Commands

| Command             | Description               |
| ------------------- | ------------------------- |
| `pnpm dev`          | Start development server  |
| `pnpm build`        | Build for production      |
| `pnpm start`        | Start production server   |
| `pnpm lint`         | Run Biome linter          |
| `pnpm format`       | Format code with Biome    |
| `pnpm format:check` | Check code formatting     |
| `pnpm type-check`   | Run TypeScript type check |
| `pnpm test`         | Run Vitest tests          |
| `pnpm test:watch`   | Run tests in watch mode   |
| `pnpm test:e2e`     | Run Playwright E2E tests  |

## Directory Structure

```
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
│   ├── ledger-entry/
│   ├── obligation/
│   └── goal/
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

## Special Instructions

### Package Manager

- **Use pnpm only** - npm and yarn are explicitly disallowed
- Use `pnpm add` for dependencies
- Use `pnpm remove` to remove dependencies

### Code Style

- **Linting:** Biome (`pnpm lint`)
- **Formatting:** Biome (`pnpm format`)
- Run both `pnpm lint` and `pnpm format` before committing
- Always include .route with method and description for oRPC route handlers for better OpenAPI generation and documentation.
- Always include .output with expected output type for oRPC route handlers to ensure consistent API contracts and better type safety across client/server boundaries.

### Commenting

- Use JSDoc style comments for all functions/methods, especially in service layer
- Include `@param` and `@returns` annotations
- Use double slash syntax for inline comments, but keep them concise and relevant, DON'T USE `/* */` block comments for single line comments
- Avoid redundant comments that restate what the code does; focus on explaining why, not what
- For complex business rules, include a brief example in the comment to illustrate the rule in practice

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
- Run `pnpm test` and `pnpm test:e2e` before pushing

### Environment Variables

- Required: `DATABASE_URL`, `AUTH_SECRET`
- Copy `.env.example` to `.env` for local development
- Never commit secrets to repository

### File Size Limits

- **No file should exceed 220 lines of code**
- If a file approaches this limit, split into multiple smaller files and import between them
- For `app/` routes: create new page components in the same directory instead of adding to existing files
- This applies to both `.ts/.tsx` source files and route handlers

### File Naming Guidelines

- Do not create files that matches with stories name. Example:
  - Wrong: `story-1-2-environment-config.specs.ts`
  - Correct: `environment-config.specs.ts`

### Component Guidelines

- Prefer using shadcn/ui components for consistency, but create custom components in `components/` when needed, install any shadcn components via `pnpm shadcn@latest add <component-name>` for new components.
- If no dedicated components are found in shadcn library, create custom components via `magic mcp` for spinning up creating a modern component.
