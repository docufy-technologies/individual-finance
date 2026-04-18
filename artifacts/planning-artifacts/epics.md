---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
inputDocuments:
  - /home/ratul/CodeBase/individual-finance/artifacts/planning-artifacts/prd.md
  - /home/ratul/CodeBase/individual-finance/artifacts/planning-artifacts/architecture.md
  - /home/ratul/CodeBase/individual-finance/artifacts/planning-artifacts/ux-design-specification.md
---

# Individual Finance - Epic Breakdown

## Global Rules

**Logging Requirement:**
All events must be logged with timestamps. Example format: `[timestamp] [log level] function addPersonalBorrowing, variable ___ changed its value to ___`
This includes:
- Variable value changes
- Function calls
- API calls
- All other events with timestamps

## Overview

This document provides the complete epic and story breakdown for Individual Finance, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**FR1-FR7: Identity, Membership, and Access Governance**

FR1: Users can create and access authenticated accounts.
FR2: Users can create groups and join groups through permissioned membership.
FR3: Group admins can assign and revoke admin roles.
FR4: Group admins can add and remove group members via email invitation links. Admins can search by email and send invitation links. If the invitee has no existing account, the link guides them through account creation before joining the group.
FR5: Group administrators can configure policy-based access controls from group settings, which specifies which members can perform specific actions (e.g., reserve for goal, implement goal).
FR6: The system can enforce policy-based access checks for every group-scoped action.
FR7: The system can restrict admin-only actions (goal implementation and permission changes) to authorized users.

**FR8-FR16: Personal Finance Management**

FR8: Users can record income entries with categories.
FR9: Users can record expense entries with categories.
FR10: Users can create and manage personal savings records tied to goals.
FR11: Users can create personal goals with deadlines and target amounts.
FR12: Users can create loan records with optional interest values.
FR13: Users can record loan repayments against active loans.
FR14: Users can create lend records for money provided to others.
FR15: Users can record money received against active lend records.
FR16: Users can manage category definitions for income, expense, and goal types.

**FR17-FR22: Group Ledger and Money Movement**

FR17: Group members can record deposit transactions in group context.
FR18: Group members can request and record withdrawals in group context.
FR19: The system can compute and expose current available group funds.
FR20: The system can maintain strict logical and operational separation between personal and group finance records.
FR21: The system can maintain an optional transaction reference for all money-related records.
FR22: The system can support both cash and non-cash money movements without requiring transaction references.

**FR23-FR30: Group Borrowing, Settlement, and Balance Rules**

FR23: The system can allow over-withdrawal when requested amount is within available group funds.
FR24: The system can treat over-withdrawal excess as borrowing from users with positive net balances.
FR25: The system can allocate borrowing proportionally to eligible positive net-balance members.
FR26: The system can maintain borrowing obligations for users who over-withdraw.
FR27: The system can enforce settlement prerequisites before new deposits when defined policy requires it.
FR28: The system can enforce return-before-deposit sequencing for users with unresolved withdrawal obligations.
FR29: The system can calculate and expose each member's net balance state.
FR30: The system can apply eligibility rules based on positive or negative net balance states.

**FR31-FR42: Goals, Reserve Management, and Progress Tracking**

FR31: Group admins can create group goals with target amounts.
FR32: The system can initialize newly created goals with implemented progress equal to zero.
FR33: The system can display goal progress as implemented amount versus target amount.
FR34: Users can reserve money for a specific goal only when at least one goal exists. Reserving blocks the reserved amount from withdrawal and contributes to goal tracking.
FR35: Group admins can record goal implementation only when at least one goal exists.
FR36: The system can require goal selection during implementation recording.
FR37: During implementation, admins can choose reserve source from either members' positive net-balance reserve allocation or goal reserve. One implementation record uses exactly one source—mixing both sources in a single implementation is not allowed.
FR38: The system can update member available net balances when implementation reserves are sourced from member net balances.
FR39: The system can update selected goal progress after each implementation event.
FR40: The system can maintain and expose total reserved-for-goals state.
FR41: The system can enforce and expose available group funds state derived from deposits and reserves.
FR42: The system can require goal existence before reserve or implementation actions.

**FR43-FR48: Explainability, Timeline, and Supportability**

FR43: The system can provide explainable "why this happened" outputs for all balance-impacting group-rule outcomes.
FR44: The system can expose rule-applied context for allocation, obligation, and reserve outcomes.
FR45: Users can view obligation timeline states for current and upcoming commitments.
FR46: Support/admin reviewers can access chronological event views for dispute investigation.
FR47: The system can provide traceable state transition history for money-impacting operations.
FR48: The system can surface chronological goal progress timeline updates tied to implementation events. Reserve events pull the progress bar upwards (money collected/saved), while implementation events pull the progress bar downwards (money spent).

**FR49-FR53: Auditability and Operational Traceability**

FR49: The system can generate auditable event logs for every financial state change.
FR50: The system can capture client-side and server-side logs for each function or method call in critical flows.
FR51: The system can record step-level success/failure status for traceable execution paths.
FR52: The system can associate logs across layers using correlation identifiers.
FR53: Authorized reviewers can retrieve logs and event trails for troubleshooting and verification.

### NonFunctional Requirements

**Performance**

NFR1: Group-rule computation operations must complete within p95 300ms under normal load.
NFR2: Ledger write plus derived state updates must complete within p95 800ms.
NFR3: Primary user actions (deposit, withdrawal, reserve, implementation record, repayment) must provide user-visible completion feedback within 2 seconds for successful operations.
NFR4: Goal progress and available group funds values must reflect committed updates immediately after transaction completion.

**Security**

NFR5: All data in transit must be encrypted using TLS.
NFR6: Sensitive stored data must be encrypted at rest.
NFR7: PBAC enforcement must be applied server-side for every group-scoped protected action.
NFR8: Unauthorized protected actions must be denied with auditable reason codes.
NFR9: Security-relevant events (authentication, policy changes, admin actions) must be logged and queryable by authorized reviewers.
NFR10: Session management must support secure authentication lifecycle (issue, refresh, revoke, expire).

**Reliability and Consistency**

NFR11: The system must preserve deterministic rule behavior, identical inputs produce identical outputs.
NFR12: Money-impacting operations must be atomic across ledger, balance, reserve, obligation, and goal progress updates.
NFR13: System must maintain the group invariant: available_group_funds = total_member_deposits - total_reserved_for_goals - total_withdrawn
NFR14: On partial failure during money-impacting operations, the system must prevent partial committed financial state.
NFR15: Production availability target is 99.5% for MVP and 99.9% post-MVP.

**Scalability**

NFR16: System must support growth from MVP traffic to at least 10x transaction volume without architectural redesign.
NFR17: Performance degradation under 10x load must remain within agreed operational thresholds (no critical rule-path timeout or deterministic mismatch).
NFR18: Logging and audit storage must scale with full trace retention requirements without blocking transaction processing.

**Accessibility**

NFR19: Core user workflows must be operable via keyboard navigation.
NFR20: Essential UI elements must maintain sufficient text and background contrast for readability.
NFR21: Key status and action feedback must be perceivable without relying only on color.
NFR22: Form controls and interactive elements must expose accessible labels for assistive technologies.

**Observability and Traceability**

NFR23: System must log client-side and server-side function/method calls for critical financial workflows.
NFR24: Each traced operation must include step-level success/failure state, timestamp, actor context, and correlation ID.
NFR25: End-to-end trace reconstruction must be possible for every financial event path.
NFR26: Explainability payloads for group outcomes must be retained and retrievable for support and audit use.
NFR27: Missing-trace events in critical flows must trigger operational alerting.

### Additional Requirements (from Architecture)

**Starter Template**

- Use create-next-app with Next.js App Router as project initialization
- Command: pnpm create next-app@latest individual-finance --typescript --tailwind --biome --app --import-alias "@/*" --use-pnpm
- Package Manager: Enforce pnpm and pnpx throughout the project (no npm/yarn)
- Biome Configuration: Use the following sample configuration (update schema version to match project biome version):
```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.9/schema.json",
  "vcs": {
    "enabled": false,
    "clientKind": "git",
    "useIgnoreFile": false
  },
  "files": {
    "ignoreUnknown": false,
    "includes": [
      "src/**/*.{ts,tsx,js,jsx,html,json,css}",
      "index.html",
      "vite.config.ts",
      "tsconfig*.json",
      "!**/src/route-tree.gen.ts",
      "!dist",
      "!node_modules"
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
        "noUnusedVariables": "error",
        "noUnusedLabels": "error",
        "noUnusedPrivateClassMembers": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"
    }
  },
  "css": {
    "parser": {
      "tailwindDirectives": true
    }
  },
  "assist": {
    "enabled": true,
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

**Technology Stack**

- PostgreSQL on Neon with Prisma ORM
- Auth.js with JWT sessions for authentication
- oRPC for API design and business logic boundary
- Tailwind CSS + shadcn/ui for styling
- Playwright for E2E testing
- Biome for linting and formatting

**Technical Requirements**

- Money representation: Floating-point with up to 2 decimal places (use decimal arithmetic utilities for precision in calculations)
- Transactional consistency: Atomic boundaries for all money-impacting operations
- PBAC enforcement: Server-side for every group-scoped protected action
- Idempotency: Required idempotency_key for critical money write endpoints
- Traceability: Every financial mutation path must include correlation/trace identifiers
- Environment: Strict env schema validation at startup, fail fast on invalid/missing config

**Naming Conventions**

- Database: snake_case, plural (users, group_members, ledger_entries)
- Primary keys: uuid (UUID type)
- Foreign keys: <entity>_uuid (user_uuid, goal_uuid)
- API: camelCase in contracts, imperative verbs (group.create, ledger.recordExpense)

### UX Design Requirements

**Design System**

- Use shadcn/ui component library as foundation
- Apply project design tokens (Calm Trust Blue theme: primary #2563EB, accent #14B8A6)
- Typography: Sora (headings), Manrope (body), IBM Plex Mono (numbers), Tailwind Typography package for headings (h1-h6) and paragraphs (p)
- Mobile-first responsive breakpoints: Tailwind default (sm 640px, md 768px, lg 1024px)

**Accessibility**

- WCAG 2.2 AA compliance
- 44x44px minimum touch targets
- Keyboard navigation for all critical flows
- Non-color status indicators (icons + text)

**Custom Components to Build**
UX-DR1: ScenarioLauncher - fast entry point for common personal/group actions with states (default, focused, loading, disabled)
UX-DR2: ImpactPreviewCard - explain before/after impact before confirmation with states (computing, ready, changed-input, error)
UX-DR3: ObligationCommandCenter - show current/upcoming/overdue obligations with fast settle actions with states (filtered views, empty, overdue emphasis, settled confirmation)
UX-DR4: ExplainabilityDrawer - show deterministic "why this happened" traces with states (collapsed, expanded, loading trace, missing-trace warning)
UX-DR5: NextStepRecommendationPanel - always-visible guidance for immediate user continuation with states (single action, multiple actions, no action)
UX-DR6: PermissionGuardAction - render admin-only actions with reasoned denial messaging with states (allowed, denied with reason code, policy-updated)

**Interaction Patterns**

- Scenario-first entry points for all flows
- Pre-confirmation impact preview mandatory for money-affecting actions
- Clear next-step guidance after every completed flow
- Consistent state feedback: idle, pending, success, denied, error

**Empty, Loading, and Error Patterns**

- Empty states are actionable, never dead ends
- Loading states provide progress reassurance
- Error states include reason code + recovery action

## Epic List

### Epic 1: Project Foundation & Infrastructure Setup
This epic establishes the foundational infrastructure, tooling, and architectural patterns required before any feature development can begin. It includes project initialization, database setup, API foundation, and development environment configuration.
**FRs covered:** Technical infrastructure (not user-facing) - Stories 1.1-1.5

### Epic 2: Authentication & User Management
This epic covers all authentication flows, user account creation, session management with secure token handling (access/refresh token separation), and profile management.
**FRs covered:** FR1 (authenticated accounts), FR2 (groups), FR3 (admin roles), FR4 (invitations)

### Epic 3: Personal Finance Management
This epic covers all personal finance functionality: income/expense tracking with categories, savings goals, loans (borrowed), lending (lent to others), and progress visualization with charts.
**FRs covered:** FR8-FR16 (income, expense, goals, loans, lending, categories)

### Epic 4: Group Finance Management
This epic covers all group financial functionality: group creation, member invitations, deposits, withdrawals, goal creation, member-initiated reserves, admin reserves from members' net balance, goal implementation from reserved money, and goal completion.
**FRs covered:** FR17-FR22 (deposits, withdrawals, available funds), FR31-FR42 (goals, reserves, implementation)

### Epic 5: Deterministic Rule Engine
This epic covers the core rule engine that enforces fairness, settlement constraints, and eligibility rules for group finance. All rule outcomes must be deterministic and explainable.
**FRs covered:** FR23-FR30 (over-withdrawal, borrowing allocation, settlement, net balance, lending capacity)

### Epic 6: Explainability, Audit & Observability
This epic covers all features related to explaining rule outcomes, audit trails, system observability with correlation IDs, and goal progress timeline.
**FRs covered:** FR43-FR53 (explainability, timeline, audit, logging)

### Epic 7: UX Design System & UI Components
This epic covers the implementation of the design system, custom domain components, and accessibility requirements.
**FRs covered:** UX Design Requirements (design system, custom components, accessibility)

**Note:** Epic 4 includes Story 4.7 for admin reserve from members' net balance (in addition to member-initiated reserves and goal implementation)

---

## Epic 1: Project Foundation and Infrastructure Setup

This epic establishes the foundational infrastructure, tooling, and architectural patterns required before any feature development can begin. It includes project initialization, database setup, API foundation, and development environment configuration.

### Story 1.1: Initialize Next.js Project Scaffold

As a developer,
I want to initialize the Next.js project with the specified starter configuration,
So that the codebase has a standardized foundation ready for feature development.

**Acceptance Criteria:**

**Given** I have pnpm installed and no existing project files,
**When** I run `pnpm create next-app@latest individual-finance --typescript --tailwind --biome --app --import-alias "@/*" --use-pnpm`
**Then** a new Next.js project is created with TypeScript, Tailwind, Biome, and App Router enabled
**And** the import alias "@/*" is configured for clean imports
**And** I update biome.json schema version to match project's @biomejs/biome version

**Given** the project is initialized,
**When** I verify the directory structure matches architecture specifications
**Then** I see app/, features/, entities/, components/, shared/, server/, prisma/ directories at root level (no src/ folder)

**Given** the project is initialized,
**When** I run `pnpx shadcn@latest init -b base --preset=maia` to initialize shadcn/ui
**Then** shadcn/ui is initialized with the base preset
**And** shadcn components are available in components/ui/

**Given** shadcn is initialized,
**When** I update the color variables in app/globals.css according to the design tokens (primary #2563EB, secondary #60A5FA, accent #14B8A6, surface #F8FAFC, text #0F172A)
**Then** the shadcn theme colors are updated to match the project's Calm Trust Blue design system

**Given** the starter is created,
**When** I run the development server and access the root page
**Then** the application loads without errors

---

### Story 1.2: Configure Development Environment and Tools

As a developer,
I want to configure the development environment with proper tooling, linting, and type checking,
So that code quality is enforced consistently across all development.

**Acceptance Criteria:**

**Given** the project scaffold exists,
**When** I configure Biome with the project's coding standards
**Then** Biome runs successfully on `pnpm lint` and formats code on save
**And** TypeScript strict mode is enabled and all type checks pass

**Given** the environment is configured,
**When** I create environment variable templates and validation logic
**Then** the application validates required environment variables at startup
**And** missing required variables cause fast failure with clear error messages
**And** DATABASE_URL is recognized as the database connection string (already exists in .env)

**Given** the environment is validated,
**When** I attempt to start the development server without required env vars
**Then** the server fails immediately with descriptive error listing missing variables
**And** the server starts successfully when all required variables are provided

---

### Story 1.3: Setup Prisma Schema and Database Connection

As a developer,
I want to set up Prisma with the database schema and Neon connection,
So that the application has a reliable data persistence layer following the architecture's data model.

**Acceptance Criteria:**

**Given** the project requires PostgreSQL on Neon,
**When** I configure Prisma with DATABASE_URL and DIRECT_URL environment variables
**Then** Prisma client connects successfully to the Neon database
**And** migrations can be run via `pnpm prisma migrate`

**Given** Prisma is configured,
**When** I create the initial schema with all required entities (User, Group, GroupMember, LedgerEntry, Obligation, Goal)
**Then** the schema follows naming conventions: snake_case tables, uuid primary keys, <entity>_uuid foreign keys
**And** money fields use floating-point (Decimal) type supporting up to 2 decimal places

**Given** the schema is defined,
**When** I run the initial migration
**Then** the database tables are created in the Neon database
**And** I can verify the schema via `pnpm prisma studio`

---

### Story 1.4: Setup oRPC API Foundation

As a developer,
I want to set up the oRPC API route and middleware foundation with authentication,
So that the application has a typed, contract-driven API surface with protected procedures for business logic.

**Acceptance Criteria:**

**Given** the project requires oRPC for API design,
**When** I create the API route at app/api/orpc/route.ts following the latest oRPC documentation
**Then** oRPC handles all requests to /api/orpc with typed procedure contracts
**And** the route handler is configured with proper HTTP method support (GET, POST, PUT, PATCH, DELETE)

**Given** the oRPC route is created,
**When** I configure the middleware chain (trace, auth, error handling) and protected procedures
**Then** every API request receives a traceId correlation identifier
**And** errors are mapped to typed error contracts with code, message, traceId, and details
**And** publicProcedure is available for unauthenticated operations
**And** protectedProcedure enforces authentication by checking session/user context
**And** unauthorized requests to protected procedures are rejected with UNAUTHORIZED error

**Given** the middleware is configured,
**When** I make a test request to the oRPC endpoint
**Then** the response follows the architecture's error contract format
**And** the traceId is included in all responses (success and error)
**And** protected procedures require valid authentication to execute

---

### Story 1.5: Setup Auth.js Authentication Foundation

As a developer,
I want to configure Auth.js with JWT sessions for user authentication with clear token separation,
So that the application has secure session management following the architecture.

**Acceptance Criteria:**

**Given** Auth.js is required for authentication,
**When** I configure Auth.js with JWT strategy in app/api/auth/[...nextauth]/route.ts
**Then** users can sign in and receive JWT session tokens
**And** there is clear separation between access token and refresh token
**And** access token is short-lived (e.g., 15 minutes)
**And** refresh token is long-lived and stored in HTTP-only cookie
**And** session lifecycle (issue, refresh, revoke, expire) is handled securely

**Given** token separation is configured,
**When** access token expires
**Then** the system automatically refreshes using the refresh token
**And** new access token is issued without requiring user re-authentication
**And** refresh token rotation occurs on each refresh (new refresh token issued)

**Given** Auth.js is configured,
**When** I create authentication guards for protected routes
**Then** unauthenticated requests to protected routes are redirected to sign-in
**And** authenticated requests have access to the user's session context

**Given** the auth system is operational,
**When** I test the sign-in and sign-out flows
**Then** users can successfully authenticate and maintain sessions across requests
**And** sessions are invalidated on sign-out with proper security cleanup
**And** refresh token is cleared from HTTP-only cookie on sign-out

---

## Epic 2: Authentication and User Management

This epic covers all authentication flows, user account creation, and the initial user profile setup that enables the rest of the application functionality.

### Story 2.1: User Registration and Account Creation

As a new user,
I want to create an authenticated account with email and password,
So that I can access the application securely and manage my personal and group finances.

**Acceptance Criteria:**

**Given** I am a new user without an account,
**When** I navigate to the sign-up page and provide valid email and password
**Then** my account is created and I am automatically signed in
**And** I see the personal dashboard as my landing page

**Given** I am creating an account,
**When** I provide an email that is already registered
**Then** I see a clear error message indicating the email is in use
**And** I am not charged for a duplicate account

**Given** I have successfully created an account,
**When** I sign out and sign back in with my credentials
**Then** I am authenticated successfully and see my dashboard

---

### Story 2.2: User Sign-In and Session Management

As a returning user,
I want to sign in with my email and password to access my account,
So that I can continue managing my personal and group finances.

**Acceptance Criteria:**

**Given** I have an existing account,
**When** I enter valid credentials on the sign-in page
**Then** I am authenticated with access token (short-lived) and refresh token (HTTP-only cookie)
**And** I am redirected to my dashboard

**Given** I am on the sign-in page,
**When** I enter invalid credentials
**Then** I see a clear error message indicating invalid credentials
**And** no tokens are issued

**Given** I am signed in,
**When** my access token expires
**Then** the system automatically uses the refresh token to get a new access token
**And** I continue using the app without re-authentication
**And** refresh token is rotated on each refresh

**Given** I sign out,
**When** I click sign-out
**Then** access token is invalidated
**And** refresh token is cleared from HTTP-only cookie
**And** I am redirected to sign-in page

---

### Story 2.3: User Profile and Settings Management

As an authenticated user,
I want to view and edit my profile information,
So that my account reflects my current details and preferences.

**Acceptance Criteria:**

**Given** I am signed in,
**When** I navigate to my profile settings
**Then** I can view my current email and any profile details

**Given** I am in profile settings,
**When** I update my profile information
**Then** the changes are saved and reflected in my account
**And** I receive confirmation that my profile was updated

---

## Epic 3: Personal Finance Module

This epic covers all personal finance functionality: income/expense tracking, savings goals, loans (money borrowed), and lending (money lent to others). This module operates in strict separation from the group finance module.

### Story 3.1: Personal Transaction Recording (Income/Expense)

As a user,
I want to record income and expense transactions with categories,
So that I can track my personal cash flow and understand where my money goes.

**Acceptance Criteria:**

**Given** I am on the personal dashboard,
**When** I select "Record Income" and enter amount (optional transaction_id), category, and optional description
**Then** the income entry is saved and my balance reflects the increase
**And** the transaction appears in my transaction history with the selected category

**Given** I am on the personal dashboard,
**When** I select "Record Expense" and enter amount (optional transaction_id), category, and optional description
**Then** the expense entry is saved and my balance reflects the decrease
**And** the transaction appears in my transaction history with the selected category

**Given** I have entered transaction details,
**When** I review the impact preview before confirming
**Then** I see clear before/after balance impact in plain language
**And** I can cancel or proceed with confidence

---

### Story 3.2: Category Management for Personal Finance

As a user,
I want to create and manage categories for income, expenses, and goals,
So that I can organize my personal finances according to my needs.

**Acceptance Criteria:**

**Given** I am in the personal finance section,
**When** I navigate to category management
**Then** I can view all existing categories for income and expense

**Given** I am in category management,
**When** I create a new category with a name and type (income/expense)
**Then** the category is added and available for selection in transaction forms

**Given** I have created categories,
**When** I try to delete a category that is in use
**Then** I am prevented from deleting with a clear message about usage
**And** I can delete categories that are not associated with any transactions

---

### Story 3.3: Personal Savings Goals

As a user,
I want to create savings goals with target amounts and deadlines,
So that I can track progress toward specific financial objectives.

**Acceptance Criteria:**

**Given** I am in the personal goals section,
**When** I create a new savings goal with name, target amount, and optional deadline
**Then** the goal is created with progress at 0%
**And** I can view the goal in my goals list
**And** the goal concept is the same as group goals: saving/reserving money pulls the progress bar upward, spending/implementation pulls it downward

**Given** I have created a savings goal,
**When** I add/reserve money toward the goal
**Then** the goal progress increases proportionally (progress bar moves upward)
**And** I can see the current amount versus target amount
**And** I can view a chart (e.g., pie chart) showing progress breakdown

**Given** I have reached or exceeded my target amount,
**When** I view the goal
**Then** I see clear indication that the goal is complete
**And** I can mark the goal as achieved or continue saving beyond the target

---

### Story 3.4: Personal Loan Management (Money Borrowed)

As a user,
I want to create loan records for money I have borrowed,
So that I can track repayment obligations and understand my outstanding debts.

**Acceptance Criteria:**

**Given** I am in the personal finance section,
**When** I create a loan record with amount, borrower details (textarea for name, phone numbers, etc. - unicode supported), optional interest rate, optional transaction_id, and optional due date
**Then** the loan is created as active with full amount owed
**And** it appears in my obligations list as money I need to repay

**Given** I have an active loan,
**When** I record a repayment amount
**Then** the loan balance is reduced by the repayment amount
**And** the remaining obligation is updated accordingly

**Given** I have partially repaid a loan,
**When** I view the loan details
**Then** I see original amount, total repaid, remaining balance, and due status
**And** I can record additional repayments until the loan is fully settled

---

### Story 3.5: Personal Lending Management (Money Lent)

As a user,
I want to create lend records for money I have provided to others,
So that I can track when I am owed money and when I should receive repayment.

**Acceptance Criteria:**

**Given** I am in the personal finance section,
**When** I create a lend record with amount, borrower details (textarea for name, phone numbers, etc. - unicode supported), optional interest rate, optional transaction_id, and optional due date
**Then** the lend is created as active with full amount expected to be returned
**And** it appears in my obligations list as money owed to me

**Given** I have an active lend record,
**When** I record money received from the borrower
**Then** the lend balance is reduced by the received amount
**And** the remaining expectation is updated accordingly

**Given** I have partially received repayment,
**When** I view the lend details
**Then** I see original amount, total received, remaining balance, and due status
**And** I can record additional received amounts until fully repaid

---

## Epic 4: Group Finance Module

This epic covers all group financial functionality: deposits, withdrawals, reserves for goals, and goal implementation. This module enforces strict separation from personal finance.

### Story 4.1: Group Creation and Membership

As a user,
I want to create a group and invite members,
So that I can manage shared finances with others in a governed group context.

**Acceptance Criteria:**

**Given** I am signed in,
**When** I create a new group with a name and optional description
**Then** the group is created with me as the admin
**And** I see the group dashboard as the group owner

**Given** I am a group admin,
**When** I invite members via email address
**Then** an invitation link is generated and sent to the invitee
**And** the link guides new users to create an account before joining if they don't have one

**Given** I have received an invitation link,
**When** I click the link (and if I'm already signed in, I'm let in directly; if not, I sign in first)
**Then** I am added to the group as a member
**And** I can access the group finance features

**Given** I am a group admin,
**When** I remove a member from the group
**Then** the member loses access to group finances
**And** their transaction history records are NOT deleted
**And** their financial records are marked with is_viable = false (excluded from calculations)
**And** if the user rejoins the group later, is_viable is set to true and their records are included in calculations again
**And** the group maintains a complete audit trail of all past transactions

---

### Story 4.2: Group Deposits

As a group member,
I want to deposit money into the group fund,
So that I can contribute my share to the group's shared resources.

**Acceptance Criteria:**

**Given** I am a member of a group,
**When** I record a deposit with amount, optional transaction_id, and optional transaction reference
**Then** the deposit is recorded and my net balance increases
**And** the group's available funds reflect the deposit
**And** an audit event is logged for the deposit
**And** this deposit does not affect my personal finance

**Given** I am recording a deposit,
**When** I view the impact preview before confirming
**Then** I see how my net balance and group available funds will change
**And** I can proceed with confidence or cancel

---

### Story 4.3: Group Withdrawals

As a group member,
I want to withdraw money from the group fund,
So that I can access my contributed (or borrowed) share of the group resources.

**Acceptance Criteria:**

**Given** I am a member of a group,
**When** I request a withdrawal amount that is within my net balance (standard withdrawal)
**Then** the withdrawal is processed and my net balance decreases
**And** the group's available funds decrease accordingly
**And** an audit event is logged

**Given** I am requesting a withdrawal,
**When** the amount exceeds my net balance but is within available group funds (over-withdrawal)
**Then** I am notified that this is an over-withdrawal that triggers borrowing
**And** I must confirm to proceed with the over-withdrawal

**Given** I confirm an over-withdrawal,
**When** the system processes the withdrawal
**Then** the amount exceeding my net balance is treated as borrowing
**And** proportional borrowing obligation is created from positive net-balance members
**And** an explainability trace shows how the borrowing was allocated
**And** an audit event is logged with full trace details

---

### Story 4.4: Group Goal Creation

As a group admin (or group members with explicit permission from admin),
I want to create group goals with target amounts and optional deadlines,
So that the group can save toward shared objectives with clear progress tracking.

**Acceptance Criteria:**

**Given** I am a group admin or authorized member,
**When** I create a goal with name, target amount, and optional deadline
**Then** the goal is created with implemented amount at 0
**And** the goal appears in the group's goal list
**And** progress is displayed as 0 / target amount

**Given** I have created a goal,
**When** I view the goal details
**Then** I see target amount, implemented amount, optional deadline, and progress percentage
**And** the progress bar reflects 0% completion

---

### Story 4.5: Group Reserve for Goals

As a group member,
I want to reserve money for a specific group goal,
So that I can contribute to the goal while blocking those funds from withdrawal.

**Acceptance Criteria:**

**Given** I am in a group with at least one goal,
**When** I select a goal and reserve an amount
**Then** the reserved amount is blocked from withdrawal
**And** it results in NOT changing the net balance, just blocking withdrawals
**And** the goal's progress bar moves upward (money saved/collected)
**And** the group's available funds decrease by the reserved amount
**And** reservation just changes the 'reserved money' field, does not affect the net balance

**Given** I have reserved money for a goal,
**When** I view my available net balance
**Then** I see that reserved amounts are excluded from available balance

**Given** there are no goals in the group,
**When** I attempt to reserve money
**Then** I am prevented from reserving with a message that no goals exist

---

### Story 4.6: Group Goal Implementation

As a group admin (or group members with explicit permission from admin),
I want to record goal implementation (spending) from the group's reserved money,
So that the group can track actual spending against the savings goal.

**Acceptance Criteria:**

**Given** I am a group admin or authorized member with at least one goal and reserved money,
**When** I select a goal and record an implementation amount
**Then** the implementation amount is consumed from the goal's reserved money
**And** the goal progress bar moves downward (money spent)
**And** an audit event is logged

**Given** I implement an amount less than what was reserved,
**When** the implementation is recorded
**Then** the excess amount is automatically unblocked and becomes available for withdrawal

**Given** a goal is fully implemented (e.g., car bought for 12 Lac out of 15 Lac target),
**When** I explicitly click "Complete Goal" to complete the goal
**Then** the excess amount (3 Lac in this example) is freed proportionally to each member's contribution
**And** each member's 'reserved money' field is decreased proportionally (e.g., 6:4:5 ratio for members who contributed 6 Lac, 4 Lac, 5 Lac)
**And** the goal status is marked as completed

**Given** there are no goals in the group or no reserved money,
**When** I attempt to implement a goal
**Then** I am prevented from implementing with a message that no goals exist or no reserved money

---

### Story 4.7: Admin Reserve from Members' Net Balance

As a group admin,
I want to create reservation for goals by reserving money from members' positive net balances,
So that the group can accumulate savings for goals proportionally based on each member's lending capacity.

**Acceptance Criteria:**

**Given** I am a group admin,
**When** I select a goal and initiate "Reserve from Members" action
**Then** the system calculates each member's lending capacity (net balance - reserved money)
**And** displays the total available lending capacity from all members

**Given** I enter a reserve amount,
**When** the reservation is processed
**Then** the amount is reserved proportionally from each member's lending capacity
**And** each member's reserved money increases proportionally (e.g., if member A has 60% of total lending capacity, they reserve 60% of the total reserve amount)
**And** each member's reservation is capped at their individual lending capacity (no member can reserve more than their lending capacity)
**And** the goal's progress bar moves upward (money saved/collected)
**And** an audit event is logged

**Given** a member's lending capacity is less than their proportional share,
**When** the reservation is processed
**Then** that member reserves up to their lending capacity
**And** the remaining amount is redistributed proportionally among members with remaining capacity

**Given** I view the reservation summary,
**Then** I see which member reserved how much and their remaining lending capacity

---

## Epic 5: Deterministic Rule Engine

This epic covers the core rule engine that enforces fairness, settlement constraints, and eligibility rules for group finance. All rule outcomes must be deterministic and explainable.

### Story 5.1: Over-withdrawal and Proportional Borrowing Allocation

As the system,
I want to allocate borrowing proportionally from positive net-balance members based on their lending capacity,
So that over-withdrawals are fairly distributed according to each member's available contribution.

**Acceptance Criteria:**

**Given** a member requests withdrawal exceeding their net balance,
**When** the withdrawal is within available group funds
**Then** the excess amount is allocated as borrowing proportionally to lending capacity
**And** the allocation follows deterministic formula: each positive net-balance member's share = (their lending capacity / total lending capacity) * excess amount
**And** lending capacity = net balance - reserved money (if member has reserved money to a goal, their capacity to lend is reduced)

**Given** the proportional allocation is calculated,
**When** the allocation is applied
**Then** each borrowing member has their available net balance reduced by their allocated share
**And** each borrowing member has an obligation created recording the amount owed
**And** the withdrawing member has their obligation recorded for the total borrowed amount

**Given** the allocation is complete,
**When** any member reviews the withdrawal
**Then** an explainability trace shows: which members contributed to the borrowing, how much each contributed proportionally, and why this allocation was chosen

---

### Story 5.2: Settlement Prerequisites and Return-Before-Deposit Rules

As the system,
I want to enforce settlement prerequisites before new deposits,
So that unresolved withdrawal obligations are settled before adding new funds.

**Acceptance Criteria:**

**Given** a group has policy requiring settlement before deposit,
**When** a member with unresolved obligations attempts to deposit
**Then** the system requires the member to settle obligations first
**And** the deposit is blocked until obligations are resolved

**Given** a member has unresolved withdrawal obligations,
**When** they attempt a new withdrawal (return-before-deposit rule)
**Then** the system requires settlement of existing obligations before allowing new withdrawal
**And** the user is guided through the settlement process

**Given** the settlement policy is enforced,
**When** the member completes the required settlements
**Then** the restriction is lifted and normal deposit/withdrawal resumes
**And** all enforcement actions are logged for audit

---

### Story 5.3: Net Balance State and Eligibility Rules

As the system,
I want to calculate and expose each member's net balance state,
So that eligibility for actions is determined by their financial position in the group.

**Acceptance Criteria:**

**Given** group transactions have occurred,
**When** I calculate each member's net balance
**Then** net balance = total deposits - total withdrawals - borrowing allocations + total returned withdrawals
**And** borrowing allocations are excluded from net balance calculation because the money is not in the group fund (it comes from over-withdrawal)

**Given** net balances are calculated,
**When** I apply eligibility rules based on balance state
**Then** members with positive net balance are eligible to have their lending capacity contribute to borrowing allocation
**And** members with negative net balance are eligible to receive borrowing allocations (they owe money)
**And** lending capacity = net balance - reserved money (reserving money reduces lending capacity)

**Given** eligibility is determined,
**When** I expose the net balance state to members
**Then** each member can see their current net balance
**And** each member can see their borrowing obligations and repayment requirements
**And** each member can see their reserved money amount and lending capacity
**And** the group admin can see all members' net balance states

---

### Story 5.4: Available Group Funds Calculation

As the system,
I want to maintain and expose the available group funds formula,
So that all members understand what money is available for withdrawal and reserve.

**Acceptance Criteria:**

**Given** group transactions have occurred,
**When** I calculate available group funds
**Then** the formula holds: available_group_funds = total_member_deposits - total_reserved_for_goals - total_withdrawn
**And** goal_implementation_total is NOT part of the available group funds calculation

**Given** the formula is calculated,
**When** any member views available group funds
**Then** the displayed amount is always consistent with the formula
**And** the formula holds regardless of transaction sequence

**Given** a withdrawal is requested,
**When** the system checks if withdrawal is possible
**Then** the withdrawal is only allowed if requested amount <= available group funds
**And** this check includes both standard and over-withdrawal scenarios

---

### Story 5.5: Deterministic Rule Integrity Verification

As a QA engineer,
I want to verify that identical inputs produce identical outputs from the rule engine,
So that the system maintains deterministic behavior required for audit and dispute resolution.

**Acceptance Criteria:**

**Given** a specific set of group state inputs (deposits, withdrawals, balances, reserves),
**When** I run the rule engine calculation multiple times
**Then** the outputs are identical across all runs
**And** this holds true for standard withdrawal, over-withdrawal, reserve, and implementation scenarios

**Given** deterministic behavior is verified,
**When** I test edge cases (zero balances, maximum values, boundary conditions)
**Then** the rule engine produces consistent, predictable outputs
**And** no exceptions or errors occur in edge case scenarios

---

## Epic 6: Explainability, Audit, and Observability

This epic covers all features related to explaining rule outcomes, audit trails, and system observability with correlation IDs.

### Story 6.1: Explainability Traces for Group Rule Outcomes

As a user,
I want to see "why this happened" explanations for all balance-impacting group outcomes,
So that I understand how rule decisions were made and can verify fairness.

**Acceptance Criteria:**

**Given** a balance-impacting group action has occurred (withdrawal, borrowing allocation, reserve, implementation),
**When** I view the explainability trace for that action
**Then** I see a human-readable explanation of what happened
**And** the trace includes: the input state, the rule applied, the calculation performed, and the output state

**Given** an over-withdrawal triggered proportional borrowing,
**When** I review the explainability trace
**Then** I see exactly how much each positive net-balance member contributed
**And** I can verify the proportional calculation is correct

**Given** I am viewing any group rule outcome,
**When** I access the explainability panel
**Then** the explanation is always available (not optional or hidden behind support)
**And** the trace follows the architecture's event naming: <domain>.<action>.v1 format

---

### Story 6.2: Obligation Timeline and State Visibility

As a user,
I want to view current and upcoming obligation states,
So that I understand what payments are due and when.

**Acceptance Criteria:**

**Given** I have obligations (borrowing or lending),
**When** I view the obligation timeline
**Then** I see obligations organized by state: current, upcoming, overdue
**And** each obligation shows amount, counterpart, due date (if any), and status

**Given** I am on the obligation timeline,
**When** I filter by state (current/upcoming/overdue)
**Then** I see only obligations in that state
**And** clear visual indicators distinguish each state

**Given** an obligation is overdue,
**When** I view it
**Then** I see clear indication of overdue status
**And** I am guided to the settlement action

---

### Story 6.3: Chronological Event and Audit Log View

As a support reviewer or group admin,
I want to access chronological event views for dispute investigation,
So that I can reconstruct exactly what happened in any financial event.

**Acceptance Criteria:**

**Given** I am an authorized reviewer,
**When** I access the audit log for a group
**Then** I see all financial events in chronological order
**And** each event includes: timestamp, actor, action type, amount, and outcome

**Given** I am investigating a specific transaction,
**When** I search or filter the audit log
**Then** I can find the specific event and expand its details
**And** the full trace (inputs, rule, output) is available for that event

**Given** I am reviewing logs,
**When** I need to correlate client and server events
**Then** I can use correlation IDs to trace the full request path
**And** both client-side and server-side logs are linked by traceId

---

### Story 6.4: Client-Side and Server-Side Trace Logging

As a developer,
I want to ensure every critical flow is logged with correlation IDs,
So that end-to-end trace reconstruction is possible for every financial event.

**Acceptance Criteria:**

**Given** a financial mutation occurs (deposit, withdrawal, reserve, implementation),
**When** the system processes the request
**Then** both client-side and server-side logs capture the function/method call
**And** every log entry includes: step-level success/failure status, timestamp, actor context, and correlation ID

**Given** logging is implemented,
**When** I perform a critical flow (e.g., over-withdrawal)
**Then** I can reconstruct the entire path from client request to server processing to final state
**And** trace IDs are consistent across the full path

**Given** a critical flow has a gap in the trace,
**When** the system detects missing-trace events
**Then** operational alerting is triggered to investigate the gap
**And** the gap is logged for audit review

---

### Story 6.5: Goal Progress Timeline Updates

As a user,
I want to see chronological goal progress updates tied to implementation events,
So that I understand how the goal has evolved over time.

**Acceptance Criteria:**

**Given** a group has a goal,
**When** I view the goal's progress timeline
**Then** I see each event that affected the goal: reserves (progress up) and implementations (progress down)
**And** each event shows timestamp, event type, amount, and resulting progress

**Given** the progress timeline is displayed,
**When** I view a reserve event
**Then** I see the progress bar moved upward (money collected)
**And** I see which member(s) reserved and how much

**Given** the progress timeline is displayed,
**When** I view an implementation event
**Then** I see the progress bar moved downward (money spent)
**And** I see which source was used (member net balances or goal reserve)

---

## Epic 7: UX Design System and UI Components

This epic covers the implementation of the design system, custom domain components, and accessibility requirements specified in the UX design.

### Story 7.1: Design System Foundation (shadcn/ui + Tokens)

As a developer,
I want to setup the design system foundation with shadcn/ui and project tokens,
So that all UI components follow consistent visual patterns and the Calm Trust Blue theme.

**Acceptance Criteria:**

**Given** the project requires shadcn/ui,
**When** I install and configure shadcn/ui components
**Then** base components (Button, Input, Card, Dialog, etc.) are available
**And** they are themed with the project's design tokens (primary #2563EB, accent #14B8A6)

**Given** shadcn/ui is configured,
**When** I apply the typography tokens (Sora, Manrope, IBM Plex Mono)
**Then** headings use Sora, body text uses Manrope, and numeric values use IBM Plex Mono

**Given** the design system is operational,
**When** I build UI using shadcn components
**Then** consistent spacing (8px base unit) and color semantics are applied
**And** the visual system follows the Calm Trust Blue theme consistently

---

### Story 7.2: ScenarioLauncher Component

As a user,
I want fast entry points for common personal and group actions,
So that I can quickly initiate transactions without navigating complex menus.

**Acceptance Criteria:**

**Given** I am on the personal or group dashboard,
**When** I view the ScenarioLauncher
**Then** I see quick-action options for common scenarios (income, expense, deposit, withdrawal, etc.)
**And** actions are visually prominent and one-tap accessible

**Given** I tap a scenario option,
**When** the launcher initiates the action
**Then** the appropriate form or flow is opened with context pre-filled
**And** the interaction feels fast and low-friction

**Given** the ScenarioLauncher is in loading state,
**When** I trigger an action
**Then** I see loading feedback before the flow opens

---

### Story 7.3: ImpactPreviewCard Component

As a user,
I want to see before/after impact preview before confirming money-affecting actions,
So that I understand exactly what will happen to my balance before I commit.

**Acceptance Criteria:**

**Given** I am completing a money-affecting form (income, expense, deposit, withdrawal),
**When** I have entered the required fields
**Then** the ImpactPreviewCard displays computing state
**And** as I adjust values, the preview updates to show current impact

**Given** the impact is ready,
**When** I view the ImpactPreviewCard
**Then** I see clear before/after comparison in plain language
**And** the impact shows exactly how balances will change

**Given** I change input values,
**When** the ImpactPreviewCard updates
**Then** I see the changed-input state with updated preview
**And** I can proceed or cancel based on the preview

---

### Story 7.4: ObligationCommandCenter Component

As a user,
I want to see current, upcoming, and overdue obligations in one view,
So that I can quickly understand what is due and take action.

**Acceptance Criteria:**

**Given** I have obligations,
**When** I view the ObligationCommandCenter
**Then** I see obligations organized into Current, Upcoming, and Overdue buckets
**And** each obligation shows amount, counterpart, and status

**Given** I am viewing the command center,
**When** I filter by state (Current/Upcoming/Overdue)
**Then** I see only obligations in that state
**And** the empty state is actionable (not a dead end)

**Given** I want to settle an obligation,
**When** I tap the settle action on an obligation
**Then** I can complete the settlement flow
**And** confirmation shows the updated status

---

### Story 7.5: ExplainabilityDrawer Component

As a user,
I want to access "why this happened" explanations for group rule outcomes,
So that I can verify fairness and understand complex allocations.

**Acceptance Criteria:**

**Given** a balance-impacting group action has occurred,
**When** I view the success state
**Then** the ExplainabilityDrawer is automatically surfaced (proactively shown)
**And** I don't need to hunt for the explanation

**Given** the drawer is collapsed,
**When** I expand it
**Then** I see the full trace: inputs, rule applied, calculation, output
**And** the explanation is human-readable and verifiable

**Given** I am viewing the trace,
**When** the trace is loading
**Then** I see loading feedback
**And** if trace is missing, I see a warning about the missing trace

---

### Story 7.6: NextStepRecommendationPanel Component

As a user,
I want to see what action to take next after completing a flow,
So that I can immediately continue to the next relevant action.

**Acceptance Criteria:**

**Given** I have completed a transaction flow,
**When** I view the success state
**Then** the NextStepRecommendationPanel shows the recommended next action(s)
**And** the recommendation is specific to my current context

**Given** there is one recommended action,
**When** I view the panel
**Then** I see a single clear action I can take

**Given** there are multiple possible next actions,
**When** I view the panel
**Then** I see multiple options with clear labels
**And** I can choose which to pursue

**Given** there is no specific next action,
**When** I view the panel
**Then** I see a neutral state indicating I can proceed as desired

---

### Story 7.7: PermissionGuardAction Component

As a user,
I want to see clear feedback when I attempt an action I'm not permitted to perform,
So that I understand why I was denied and what I can do instead.

**Acceptance Criteria:**

**Given** I attempt an admin-only action (goal implementation, permission changes),
**When** I am not authorized for that action
**Then** the PermissionGuardAction shows denied state with reason code
**And** I see clear explanation of why I was denied

**Given** I am authorized for an action,
**When** I trigger the action
**Then** the action proceeds normally without any guard blocking

**Given** policy has been updated,
**When** I attempt a previously allowed action that is now restricted
**Then** I see the denied state with policy-updated indication
**And** I understand the change happened at the policy level

---

### Story 7.8: Mobile-First Responsive Implementation

As a user,
I want the application to work optimally on mobile devices,
So that I can manage finances effectively from my phone.

**Acceptance Criteria:**

**Given** I am using a mobile device (320-767px viewport),
**When** I access the application
**Then** the layout follows mobile-first patterns
**And** touch targets are at least 44x44px
**And** core actions are above the fold

**Given** I am using a tablet (768-1023px viewport),
**When** I access the application
**Then** layouts progressively enhance with expanded cards
**And** touch ergonomics are preserved

**Given** I am using desktop (1024px+),
**When** I access the application
**Then** denser layouts are available for admin/support views
**And** core interaction logic remains consistent with mobile

---

### Story 7.9: Accessibility Compliance (WCAG 2.2 AA)

As a user,
I want the application to be accessible via keyboard and assistive technologies,
So that I can use the application regardless of ability.

**Acceptance Criteria:**

**Given** I navigate via keyboard only,
**When** I access core user workflows
**Then** all actions are operable via keyboard
**And** focus order is logical and predictable

**Given** I use a screen reader,
**When** I interact with form controls and interactive elements
**Then** all elements have accessible labels
**And** status changes are announced

**Given** I have visual impairments,
**When** I view UI elements
**Then** text and background contrast meets WCAG AA standards
**And** status information is not conveyed by color alone (paired with icons/text)

---

### Story 7.10: Empty, Loading, and Error State Patterns

As a user,
I want consistent, helpful feedback in empty, loading, and error scenarios,
So that I always know what is happening and how to proceed.

**Acceptance Criteria:**

**Given** I encounter an empty state,
**When** I view the empty UI
**Then** it is actionable (provides a way to create content or navigate)
**And** it is never a dead end

**Given** I am waiting for a computation,
**When** I view the loading state
Then I see progress reassurance indicating the system is working
And I don't see a static spinner without context

**Given** an operation fails,
**When** I view the error state
Then I see a clear error message with reason code
And I see a recovery action I can take

---