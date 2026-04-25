# Story 1.4: Setup oRPC API Foundation

Status: ready-for-dev

## Story

As a developer,
I want to set up the oRPC API route and middleware foundation with authentication,
so that the application has a typed, contract-driven API surface with protected procedures for business logic.

## Acceptance Criteria

AC1: oRPC Route Setup

- Given the project requires oRPC for API design,
- When I create the API route at `app/api/orpc/route.ts` following the latest oRPC documentation,
- Then oRPC handles all requests to `/api/orpc` with typed procedure contracts,
- And the route handler is configured with proper HTTP method support (GET, POST, PUT, PATCH, DELETE).

AC2: Middleware Chain Configuration

- Given the oRPC route is created,
- When I configure the middleware chain (trace, auth, error handling) and protected procedures,
- Then every API request receives a traceId correlation identifier,
- And errors are mapped to typed error contracts with code, message, traceId, and details,
- And publicProcedure is available for unauthenticated operations,
- And protectedProcedure enforces authentication by checking session/user context,
- And unauthorized requests to protected procedures are rejected with UNAUTHORIZED error.

AC3: API Verification

- Given the middleware is configured,
- When I make a test request to the oRPC endpoint,
- Then the response follows the architecture's error contract format,
- And the traceId is included in all responses (success and error),
- And protected procedures require valid authentication to execute.

## Tasks / Subtasks

- [ ] Task 1: Install and configure oRPC for this project (AC1)
  - [ ] Subtask 1.1: Add oRPC dependencies using pnpm
  - [ ] Subtask 1.2: Review architecture's oRPC patterns and folder structure requirements
  - [ ] Subtask 1.3: Create the oRPC router structure in `server/orpc/router.ts`

- [ ] Task 2: Create the oRPC API route handler (AC1)
  - [ ] Subtask 2.1: Create `app/api/orpc/route.ts` with proper HTTP method handling
  - [ ] Subtask 2.2: Configure oRPC with the router and context
  - [ ] Subtask 2.3: Export the oRPC handler for the Next.js App Router

- [ ] Task 3: Implement middleware chain (AC2)
  - [ ] Subtask 3.1: Create trace middleware for correlation ID propagation (`server/orpc/middleware/trace.middleware.ts`)
  - [ ] Subtask 3.2: Create auth middleware for session validation (`server/orpc/middleware/auth.middleware.ts`)
  - [ ] Subtask 3.3: Create error mapping middleware (`server/orpc/middleware/error-map.middleware.ts`)
  - [ ] Subtask 3.4: Wire middleware chain into the oRPC router

- [ ] Task 4: Define public and protected procedure factories (AC2)
  - [ ] Subtask 4.1: Create publicProcedure for unauthenticated operations
  - [ ] Subtask 4.2: Create protectedProcedure that checks session/user context
  - [ ] Subtask 4.3: Implement UNAUTHORIZED error rejection for protected procedures

- [ ] Task 5: Create typed error contract format (AC2, AC3)
  - [ ] Subtask 5.1: Define error contract type with code, message, traceId, details
  - [ ] Subtask 5.2: Create error mapping from domain errors to contract format
  - [ ] Subtask 5.3: Ensure all errors include traceId

- [ ] Task 6: Add health check or test procedure (AC3)
  - [ ] Subtask 6.1: Add a simple test procedure to verify oRPC is working
  - [ ] Subtask 6.2: Verify traceId appears in all responses
  - [ ] Subtask 6.3: Test that protectedProcedure rejects unauthenticated requests

- [ ] Task 7: Run repo quality checks
  - [ ] Subtask 7.1: Run `pnpm lint` and fix any issues
  - [ ] Subtask 7.2: Run `pnpm type-check` and fix any issues

## Dev Notes

### Scope Guardrails

- This story is only for oRPC foundation, route setup, middleware configuration, and procedure factories.
- Do not implement domain-specific procedures, repositories, or business logic beyond a simple test procedure.
- Do not create Auth.js integration yet (that's Story 1.5).
- Do not create PBAC permission checks yet (that's later epics).
- Keep this story focused on the API infrastructure foundation only.

### Source of Truth Hierarchy

Use this precedence when artifacts disagree:

1. `artifacts/planning-artifacts/architecture.md` for API patterns, middleware structure, and oRPC configuration
2. `artifacts/planning-artifacts/epics.md` for story framing and acceptance criteria
3. `artifacts/planning-artifacts/prd.md` for security and API constraints
4. oRPC official documentation via Context7 for current library patterns

### oRPC Configuration Guardrails

- Architecture requires oRPC for type-safe API contracts.
- The API surface boundary is the router in `server/orpc/router.ts`.
- All business logic must stay in `server/domains/*`, not in the API layer.
- Use current oRPC patterns (check Context7 for latest API).

### Middleware Requirements

The middleware chain must include:

1. **Trace middleware**: Generate or propagate traceId correlation identifier for every request
2. **Auth middleware**: Check session context for protected procedures
3. **Error map middleware**: Transform domain errors to typed contract format

### Error Contract Format

Follow the architecture's error contract:

```typescript
interface ErrorContract {
  code: string;      // e.g., "UNAUTHORIZED", "VALIDATION_ERROR", "INTERNAL_ERROR"
  message: string;   // Human-readable error message
  traceId: string;   // Correlation ID for debugging
  details?: unknown; // Additional error context
}
```

### Protected Procedure Behavior

- protectedProcedure must check for valid session/user context
- If no valid session, reject with UNAUTHORIZED error code
- Include traceId in the error response

### Required File Targets

Create or modify only the files needed for this story:

```text
app/api/orpc/
└── route.ts                 # oRPC route handler

server/orpc/
├── router.ts                # Main oRPC router with procedures
├── context.ts               # Context factory for oRPC
├── contracts/               # Type contracts (if needed)
└── middleware/
    ├── trace.middleware.ts       # TraceId correlation
    ├── auth.middleware.ts        # Auth validation
    └── error-map.middleware.ts   # Error mapping

shared/
└── errors/
    ├── error-codes.ts            # Error code constants
    └── to-client-error.ts        # Error transformation

package.json                   # Add oRPC dependencies if needed
```

### Previous Story Intelligence

Story 1.3 established the Prisma foundation and database connection. Build on that pattern:

- Environment validation is already in `shared/config/env.ts`
- Tests were added in `tests/unit/` for env and Prisma
- The repo follows a pattern of creating dedicated entry points (e.g., `server/db/prisma.ts`)
- Follow the same pattern for oRPC: create `server/orpc/` as the dedicated API entry point

**Important:** Do not import or use `server/db/prisma.ts` in the oRPC setup yet. The oRPC foundation story should only establish the API infrastructure. Domain data access comes in later stories.

### Architecture Compliance

- Business logic stays in `server/domains/*`
- API layer (oRPC) only handles contract validation, middleware, and procedure routing
- Repository pattern for data access, not direct Prisma usage in route handlers
- Prepare `server/orpc/` as the API boundary entry point for later domain integration

### Verification Commands

At implementation time, verify with:

- `pnpm dev` to start the server
- Test oRPC endpoint with curl or a tool like Postman
- Verify traceId in response headers and body
- Test protectedProcedure rejection
- `pnpm lint`
- `pnpm type-check`

## Project Structure Notes

### Alignment with Existing Story Style

- Keep the artifact in `artifacts/implementation-artifacts/stories/`
- Match the existing story format: acceptance criteria first, then tasks, dev notes, references, and dev agent record

### Current Repo State Relevant to This Story

- `app/api/` exists but no oRPC route yet
- `server/` directory exists with `db/prisma.ts` from Story 1.3
- `shared/config/env.ts` exists with validation patterns
- `shared/errors/` directory exists or should be created
- `package.json` has existing dependencies, add oRPC packages

## References

- `artifacts/planning-artifacts/epics.md` — Story 1.4: Setup oRPC API Foundation
- `artifacts/planning-artifacts/architecture.md` — API Architecture, Middleware Chain, oRPC Patterns
- `artifacts/planning-artifacts/prd.md` — Security requirements, error handling, traceId requirements
- `artifacts/implementation-artifacts/stories/1-3-setup-prisma-schema-and-database-connection.md` — Previous story establishing the data layer pattern
- oRPC docs via Context7 — current guidance for oRPC setup, middleware, and procedure factories
- `app/api/auth/[...nextauth]/route.ts` — Will be needed for auth middleware in later story, but pattern can be reviewed for reference

## Dev Agent Record

### Agent Model Used

[To be filled by developer]

### Debug Log References

[To be filled by developer during implementation]

### Completion Notes List

[To be filled by developer after implementation]

### File List

[To be filled by developer after implementation - list all created/modified files]

### Change Log

[To be updated by developer with implementation date and notes]