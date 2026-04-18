# Story 1.2: Configure Development Environment and Tools

Status: in-review

## Story

As a developer,
I want to configure the development environment with proper tooling, linting, and type checking,
so that code quality is enforced consistently across all development.

## Acceptance Criteria

AC1: Biome Configuration with Project Coding Standards

- Given the project scaffold exists,
- When I configure Biome with the project's coding standards
- Then Biome runs successfully on `pnpm lint` and formats code on save
- And TypeScript strict mode is enabled and all type checks pass

AC2: Environment Variable Templates and Validation Logic

- Given the environment is configured,
- When I create environment variable templates and validation logic
- Then the application validates required environment variables at startup
- And missing required variables cause fast failure with clear error messages
- And DATABASE_URL is recognized as the database connection string (already exists in .env)

AC3: Development Server Startup Validation

- Given the environment is validated,
- When I attempt to start the development server without required env vars
- Then the server fails immediately with descriptive error listing missing variables
- And the server starts successfully when all required variables are provided

## Tasks / Subtasks

- [ ] Task 1: Configure Biome with project coding standards (AC1)
  - [ ] Subtask 1.1: Verify/update biome.json matches @biomejs/biome version
  - [ ] Subtask 1.2: Configure linter rules (recommended + strict unused variable checks)
  - [ ] Subtask 1.3: Configure formatter rules (indentWidth: 2, indentStyle: space)
  - [ ] Subtask 1.4: Enable organizeImports action on save
  - [ ] Subtask 1.5: Add npm scripts for lint and format commands
  - [ ] Subtask 1.6: Verify TypeScript strict mode enabled in tsconfig.json

- [ ] Task 2: Create environment variable templates and validation (AC2)
  - [ ] Subtask 2.1: Create .env.example with documented variables
  - [ ] Subtask 2.2: Create shared/config/env.ts for environment validation
  - [ ] Subtask 2.3: Implement strict validation with fail-fast on missing required vars
  - [ ] Subtask 2.4: Define DATABASE_URL and AUTH_SECRET as required variables

- [ ] Task 3: Validate development server startup behavior (AC3)
  - [ ] Subtask 3.1: Test server starts successfully with valid env vars
  - [ ] Subtask 3.2: Test server fails fast with descriptive error when missing env vars

## Dev Notes

### Technology Stack Requirements

The following must be configured as specified in the architecture:

- **Linting/Formatting**: Biome (NOT ESLint/Prettier)
- **Package Manager**: pnpm (npm and yarn explicitly disallowed)
- **TypeScript**: Strict mode enabled
- **Validation**: Environment variable validation at startup (fail-fast pattern)

### Architecture Pattern: Environment Validation

The environment validation must follow the architecture's strict env schema validation:

1. All required environment variables must be validated at application startup
2. Missing required variables cause immediate failure with clear error messages
3. DATABASE_URL is the primary database connection string
4. AUTH_SECRET is required for Auth.js session handling

This pattern is documented in the architecture as:
> **Environment Strategy:** Strict env schema validation at startup, fail fast on invalid/missing config

### Configuration Files to Create/Modify

Create the following files following the project structure:

```
shared/
├── config/
│   ├── env.ts           # Environment variable validation
│   ├── constants.ts     # Project constants (if needed)
│   └── feature-flags.ts # Feature flags (if needed)
```

### Environment Variable Specification

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string (Neon) | postgresql://user:pass@host:5432/db |
| AUTH_SECRET | Secret for Auth.js JWT signing | random-32-char-string |

Optional environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| LOG_LEVEL | Logging level | info |

### Biome Configuration Requirements

Use the Biome configuration from epics.md:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.0/schema.json",
  "vcs": {
    "enabled": false,
    "clientKind": "git",
    "useIgnoreFile": false
  },
  "files": {
    "ignoreUnknown": false,
    "includes": [
      "**/*.{ts,tsx,js,jsx,html,json,css}",
      "index.html",
      "vite.config.ts",
      "tsconfig*.json"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedFunctionParameters": "error",
        "noUnusedImports": "error",
        "noUnusedVariables": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"
    }
  }
}
```

Note: Schema version 2.2.0 matches installed @biomejs/biome version.

### Package.json Scripts to Add/Update

Add these scripts to package.json:

```json
{
  "scripts": {
    "lint": "biome lint .",
    "format": "biome format . --write",
    "format:check": "biome format .",
    "type-check": "tsc --noEmit"
  }
}
```

### TypeScript Configuration Requirements

Ensure tsconfig.json has strict mode enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Project Structure Requirements

The project must maintain the root-level directory structure (NO src/ folder):

```
individual-finance/
├── shared/
│   └── config/
│       ├── env.ts          # NEW - Environment validation
│       ├── constants.ts    # NEW - Project constants
│       └── feature-flags.ts # NEW - Feature flags
├── biome.json              # UPDATE if needed
├── tsconfig.json          # UPDATE for strict mode
├── package.json           # UPDATE with new scripts
└── .env.example            # UPDATE with all variables
```

### Previous Story Context

Story 1.1 (Initialize Next.js Project Scaffold) was completed with the following key outcomes:

- Next.js 16.2.4 project initialized with TypeScript, Tailwind CSS 4, Biome, and App Router
- Root-level directory structure created: app/, features/, entities/, components/ui/, shared/, server/, prisma/
- shadcn/ui initialized with base preset, button component installed
- Calm Trust Blue design tokens applied (primary #2563EB, accent #14B8A6)
- Biome configuration uses schema version 2.2.0 (matches installed @biomejs/biome 2.2.0)

This story (1.2) builds on that foundation by:
1. Finalizing Biome configuration with strict linting rules
2. Adding environment variable validation logic
3. Creating npm scripts for lint/format/type-check commands

### Testing Standards

For this story's verification:

- Run `pnpm lint` - should pass without errors
- Run `pnpm format:check` - should pass without needing changes
- Run `pnpm type-check` - should pass with strict mode
- Test dev server starts with valid env vars
- Test dev server fails with descriptive error when env vars missing

## Project Structure Notes

### Alignment with Architecture

The directory structure follows the architecture's specification:

- Root-level folders (no src/ wrapping) as per epics.md requirements
- shared/config/ directory for centralized configuration management
- Environment validation at startup as fail-fast pattern per architecture

### Naming Conventions

- Files: `kebab-case.ts` (env.ts, constants.ts, feature-flags.ts)
- Functions/variables: `camelCase`
- Types: `PascalCase`

### Configuration Management

All configuration files should be:
- Version controlled (no secrets in committed files)
- Documented in .env.example
- Validated at application startup

## References

- Architecture: artifacts/planning-artifacts/architecture.md (Section: Environment Strategy)
- Epic Requirements: artifacts/planning-artifacts/epics.md#Story-1.2-Configure-Development-Environment-and-Tools
- Previous Story: artifacts/implementation-artifacts/stories/1-1-initialize-nextjs-project-scaffold.md
- Biome Documentation: https://biomejs.dev/

## Dev Agent Record

### Agent Model Used

- OpenCode with Claude model (or equivalent)

### Implementation Plan

1. Verify/update biome.json schema version to 2.2.0
2. Add linter rules for unused variables
3. Create shared/config/env.ts with validation logic
4. Update package.json with lint/format/type-check scripts
5. Enable TypeScript strict mode in tsconfig.json
6. Update .env.example with all required variables
7. Verify all quality checks pass

### Debug Log References

N/A - No previous implementation of this story

### Completion Notes

Will be populated after story implementation

### File List

Files to create:

```
shared/
└── config/
    ├── env.ts              # NEW - Environment variable validation
    ├── constants.ts        # NEW - Project constants
    └── feature-flags.ts   # NEW - Feature flags
```

Files to modify:

```
package.json               # ADD: lint, format, type-check scripts
tsconfig.json             # UPDATE: enable strict mode
.env.example              # UPDATE: add AUTH_SECRET
biome.json                # UPDATE: ensure schema version 2.2.0
```

## Questions for Future Development

1. Should we add a pre-commit hook for lint/format checks?
2. Do we need to configure IDE-specific settings (e.g., VS Code)?
3. Should we add any additional environment-specific configurations (dev/staging/prod)?