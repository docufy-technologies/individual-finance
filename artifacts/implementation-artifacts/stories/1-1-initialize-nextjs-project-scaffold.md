# Story 1.1: Initialize Next.js Project Scaffold

Status: review

## Story

As a developer,
I want to initialize the Next.js project with the specified starter configuration,
so that the codebase has a standardized foundation ready for feature development.

## Acceptance Criteria

AC1: Project Initialization with create-next-app

- Given I have pnpm installed and no existing project files,
- When I run `pnpm create next-app@latest individual-finance --typescript --tailwind --biome --app --import-alias "@/*" --use-pnpm`
- Then a new Next.js project is created with TypeScript, Tailwind, Biome, and App Router enabled
- And the import alias "@/*" is configured for clean imports
- And I update biome.json schema version to match project's @biomejs/biome version

AC2: Directory Structure Verification

- Given the project is initialized,
- When I verify the directory structure matches architecture specifications
- Then I see app/, features/, entities/, components/, shared/, server/, prisma/ directories at root level (no src/ folder)

AC3: shadcn/ui Initialization

- Given the project is initialized,
- When I run `pnpx shadcn@latest init -b base --preset=maia` to initialize shadcn/ui
- Then shadcn/ui is initialized with the base preset
- And shadcn components are available in components/ui/

AC4: Design Token Configuration

- Given shadcn is initialized,
- When I update the color variables in app/globals.css according to the design tokens (primary #2563EB, secondary #60A5FA, accent #14B8A6, surface #F8FAFC, text #0F172A)
- Then the shadcn theme colors are updated to match the project's Calm Trust Blue design system

AC5: Development Server Verification

- Given the starter is created,
- When I run the development server and access the root page
- Then the application loads without errors

## Tasks / Subtasks

- [x] Task 1: Initialize Next.js project with create-next-app (AC1)
  - [x] Subtask 1.1: Run create-next-app with specified flags
  - [x] Subtask 1.2: Configure import alias in tsconfig.json
  - [x] Subtask 1.3: Verify biome.json schema version matches installed biome version

- [x] Task 2: Restructure directory layout (AC2)
  - [x] Subtask 2.1: Create features/, entities/, components/, shared/, server/, prisma/ directories
  - [x] Subtask 2.2: Move default content from app/ appropriately
  - [x] Subtask 2.3: Remove src/ folder if present (use root-level structure)

- [x] Task 3: Initialize shadcn/ui (AC3)
  - [x] Subtask 3.1: Run shadcn init command
  - [x] Subtask 3.2: Verify components/ui/ directory exists

- [x] Task 4: Configure Calm Trust Blue design tokens (AC4)
  - [x] Subtask 4.1: Update CSS variables in app/globals.css
  - [x] Subtask 4.2: Verify theme colors applied correctly

- [x] Task 5: Verify development server (AC5)
  - [x] Subtask 5.1: Run pnpm dev server
  - [x] Subtask 5.2: Verify app loads in browser without errors

## Dev Notes

### Technology Stack Requirements

The following technology stack must be used as specified in the architecture:

- **Framework**: Next.js with App Router (NOT Pages Router)
- **Package Manager**: Enforce pnpm and pnpx throughout the project (no npm/yarn)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting/Formatting**: Biome (NOT ESLint/Prettier)
- **UI Components**: shadcn/ui (NOT plain Tailwind or custom components)
- **Database ORM**: Prisma (configured in Story 1.3)
- **Authentication**: Auth.js (configured in Story 1.5)
- **API Layer**: oRPC (configured in Story 1.4)

### Project Structure Requirements

The project must follow the root-level directory structure (NO src/ folder):

```
individual-finance/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   └── ui/                 # shadcn/ui components
├── features/               # Feature-based modules
├── entities/               # Domain entities and types
├── shared/                # Shared utilities, constants
├── server/                # Server-side code (api, db)
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── package.json
├── pnpm-workspace.yaml
├── next.config.(js|ts)
├── tailwind.config.ts
├── biome.json
└── tsconfig.json
```

### Import Alias Configuration

The @/* import alias must be configured for clean imports:

- tsconfig.json: `"@/*": ["./*"]`
- This allows imports like `import { Button } from "@/components/ui/button"`

### Biome Configuration Requirements

Use the Biome configuration specified in epics.md. Key requirements:

- Schema version must match installed @biomejs/biome version
- Formatter indentWidth: 2, indentStyle: space
- Linter rules: recommended + strict unused variable checks
- JavaScript quoteStyle: double
- Tailwind directives enabled for CSS parsing

### shadcn/ui Initialization

- Command: `pnpx shadcn@latest init -b base --preset=maia`
- This initializes with base preset (minimal configuration)
- Components will be installed individually as needed in later stories
- This is DIFFERENT from using the default shadcn init (which assumes Next.js boilerplate)

### Design Token Requirements (Calm Trust Blue Theme)

The following colors must be configured in app/globals.css:

| Token        | Hex Code   | Usage                    |
|--------------|------------|--------------------------|
| primary      | #2563EB    | Main brand blue           |
| secondary    | #60A5FA    | Lighter blue variant     |
| accent       | #14B8A6   | Teal accent               |
| surface      | #F8FAFC   | Background               |
| text         | #0F172A   | Primary text (dark)      |

Additional typography tokens:

- Headings: Sora font family
- Body: Manrope font family
- Numbers/Monospace: IBM Plex Mono font family
- Tailwind Typography package for article prose

### Environment Variables

By the end of this story, ensure the following files exist:

- .env (template with required variables)
- .env.example (documented template)
- DATABASE_URL placeholder (will be configured in Story 1.3)

### Testing Standards

For this story's verification:

- Manual verification: Run `pnpm dev` and verify app loads
- No automated tests needed yet (testing framework comes in later epics)
- Type checking: Run `pnpm type-check` or ensure `pnpm build` passes type checks

## Project Structure Notes

### Alignment with Architecture

The directory structure follows the architecture's specification:

- Root-level folders (no src/ wrapping) as per epics.md requirements
- Separation of concerns: features/, entities/, components/, shared/, server/, prisma/
- Each folder has clear purpose aligned with the architecture document

### Naming Conventions

- Database: snake_case, plural (users, group_members, ledger_entries)
- Primary keys: uuid (UUID type)
- Foreign keys: <entity>_uuid (user_uuid, goal_uuid)
- API: camelCase in contracts, imperative verbs
- Components: PascalCase (Button, Card, etc.)

## References

- Architecture: artifacts/planning-artifacts/architecture.md
- Epic Requirements: artifacts/planning-artifacts/epics.md#Story-1.1-Initialize-Next.js-Project-Scaffold
- PRD: artifacts/planning-artifacts/prd.md
- shadcn/ui Documentation: https://ui.shadcn.com/

## Dev Agent Record

### Agent Model Used

- OpenCode with Claude model (or equivalent)

### Implementation Plan

1. Created Next.js 16.2.4 project with TypeScript, Tailwind CSS 4, Biome, and App Router
2. Moved project files from subfolder to root level (no src/ folder)
3. Created required directory structure: features/, entities/, components/ui/, shared/, server/, prisma/
4. Installed shadcn/ui dependencies and initialized with base preset
5. Applied Calm Trust Blue design tokens (primary #2563EB, accent #14B8A6) to globals.css
6. Created .gitignore for Biome and .env.example template

### Debug Log

- N/A - First story in the project

### Completion Notes

1. Project initialized with create-next-app using pnpm
2. Import alias "@/*" configured in tsconfig.json
3. Biome configuration uses schema version 2.2.0 (matches installed @biomejs/biome 2.2.0)
4. Directory structure verified: app/, features/, entities/, components/ui/, shared/, server/, prisma/ at root level
5. shadcn/ui initialized with base preset, button component installed
6. Design tokens applied: primary (#2563EB), secondary (#60A5FA), accent (#14B8A6), surface (#F8FAFC)
7. Development server verified: build passes, lint passes

### File List

Files created/modified:

```
individual-finance/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css (modified with Calm Trust Blue tokens)
├── components/
│   └── ui/
│       └── button.tsx
├── features/
├── entities/
├── shared/
├── server/
├── prisma/
├── lib/
│   └── utils.ts
├── public/
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tailwind.config.ts (created by shadcn)
├── biome.json
├── tsconfig.json
├── postcss.config.mjs
├── components.json
├── .gitignore
└── .env.example
```

## Questions for Future Development

1. Should we create a custom font loading utility for Sora/Manrope/IBM Plex Mono?
2. How do we want to structure the features/ directory for the different epics?
3. Should we set up any CI/CD configuration now or defer to later?