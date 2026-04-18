# Individual Finance

A personal and group finance management platform built with Next.js, featuring transaction recording, goal tracking, obligation management, and deterministic rule-based financial operations.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL (Neon) with Prisma ORM
- **API:** oRPC for type-safe API contracts
- **Authentication:** Auth.js with JWT sessions
- **Testing:** Vitest (unit/integration) + Playwright (E2E)
- **Linting:** Biome

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run linter
pnpm lint
```

## Project Structure

```
├── app/                 # Next.js App Router pages
├── features/            # Feature-sliced UI modules
├── entities/            # Core domain models
├── components/          # UI components (shadcn/ui)
├── shared/              # Shared utilities, configs, types
├── server/              # oRPC routers, domain services, policies
├── prisma/              # Database schema and migrations
└── tests/               # Test files
```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run Biome linter |
| `pnpm test` | Run Vitest tests |
| `pnpm test:watch` | Run tests in watch mode |

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Auth.js secret key

## License

MIT License - see [LICENSE](LICENSE) file.