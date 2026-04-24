```yaml
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
inputDocuments:
  - /home/ratul/CodeBase/individual-finance/resources/project-brief-first-draft.md
documentCounts:
  briefCount: 1
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 0
workflowType: 'prd'
classification:
  projectType: web_app
  domain: fintech
  complexity: high
  projectContext: greenfield
```

# Product Requirements Document - Individual Finance

**Author:** Ratul
**Date:** 2026-04-16

## Executive Summary

Individual Finance is a scenario-first finance web application designed for users who manage both personal and shared money responsibilities. It addresses a recurring gap in existing tools, users can record transactions, but they still struggle to understand obligation states, repayment timing, and fairness outcomes in real-world group finance situations.

The product solves this by combining two strictly separated modules: Personal Finance and Group Finance. Personal Finance supports income, expenses, savings goals, loans, lending, and user-defined categories. Group Finance enforces deterministic shared-money rules for deposits, withdrawals, reserves, borrowing allocation, and admin-governed goal implementation. This separation prevents rule contamination and preserves accounting clarity across contexts.

The product is built for high-trust decision-making under real-life constraints, including emergency over-withdrawal, proportional burden sharing, and repayment sequencing. The intended outcome is operational clarity: users can always determine why a balance changed, who owes what, and what must happen next.

### What Makes This Special

Most finance apps optimize for generic transaction tracking. Individual Finance differentiates by formalizing informal money behavior into explainable, rule-driven obligations without introducing social judgment.

Its core differentiator is a deterministic rule engine with explainability and timeline intelligence:

- **Explainable fairness:** every computed outcome can be traced to explicit rule logic.
- **Obligation timeline visibility:** users see upcoming commitments, settlement pathways, and due-state progression, not just static balances.
- **Scenario-first interaction model:** users start from real money situations, then the system applies the relevant ledger logic automatically.
- **Non-judgmental product doctrine:** the system provides clarity and accountability, not behavioral scoring.

This combination creates trust, reduces disputes, and improves financial coordination in both individual and group settings.

## Project Classification

- **Project Type:** Web Application
- **Domain:** Fintech
- **Complexity:** High
- **Project Context:** Greenfield

## Success Criteria

### User Success

1. **Fast clarity onboarding**
   
   - New user completes account setup and first personal transaction in **10 minutes or less**.
   - New group admin creates a group and completes the first deposit or withdrawal flow in **15 minutes or less**.

2. **Obligation clarity**
   
   - In usability testing, **90% or more** of users can answer within **30 seconds**:
     - Why did my balance change?
     - Who owes what?
     - What happens next?

3. **Dispute reduction outcome**
   
   - Among active groups, self-reported money confusion or dispute incidents reduce by **50% or more within 8 weeks** of adoption.

4. **Scenario-first adoption**
   
   - **70% or more** of first-week users complete at least one scenario-driven flow (borrow, repay, reserve, or implement goal).

### Business Success

**By Month 3 (post-MVP launch):**

- **1,500 or more** registered users
- **500 or more** MAU
- **120 or more** active groups
- **WAU/MAU 40% or more**
- **D30 retention 30% or more** overall, **40% or more** for group admins

**By Month 12:**

- **12,000 or more** registered users
- **4,000 or more** MAU
- **1,000 or more** active groups
- **D90 retention 25% or more** overall, **35% or more** for group admins
- **35% or more** of MAU use both personal and group modules

### Technical Success

1. **Deterministic rule integrity**
   
   - Same inputs always produce same outputs across environments.
   - **0 critical rule-calculation mismatches** in production.

2. **Auditability and explainability**
   
   - **100%** of financial state changes produce auditable event logs.
   - **100%** of group-rule outcomes include explainable "why this happened" traces.

3. **Authorization integrity**
   
   - **0 unauthorized admin-only actions** (goal implementation, permission changes).

4. **Performance and reliability**
   
   - Group rule computation: **p95 300ms or less**
   - Ledger write and balance update: **p95 800ms or less**
   - Availability: **99.5% for MVP**, target **99.9% post-MVP**

### Measurable Outcomes

- Median time to resolve “who owes what” question: **less than 60 seconds**
- Settlement completion rate for created obligations within due window: **75% or more**
- Explainability usage (users opening "why" detail): **50% or more** of group transactions
- Support tickets tagged "calculation confusion": **under 5%** of total tickets after first 3 months

## Product Scope

### MVP - Minimum Viable Product

- Personal module core:
  - income, expense, savings by goal, loan and lend create, repayment and receive, category editing
- Group module core:
  - deposits, withdrawals, reserves, goal implementation logging (admin-only)
- Deterministic group rule engine:
  - over-withdrawal handling
  - proportional borrowing allocation
  - settlement and return-before-new-deposit constraints
  - net-balance-based eligibility rules
- Role-based permissions (admin/member)
- Full audit trail and explainability for group rule outcomes
- Basic obligation timeline view (current and upcoming obligations)

### Growth Features (Post-MVP)

- Advanced notifications and reminders for due obligations
- Predictive obligation stress indicators (non-judgmental)
- Better analytics dashboards (user and group insights)
- Localization expansion (full Bangla-first UX polish)
- Data export, import, and reporting enhancements

### Vision (Future)

- Trustworthy shared-finance operating layer for households and small communities
- Scenario-first financial coordination across broader contexts (events, rotating funds, community pools)
- Explainable, dispute-resistant financial collaboration at scale

## User Journeys

### Journey 1 - Primary User Success Path (Personal Money Clarity)

**Persona:** Arif, salaried individual managing personal cash flow, goals, and informal lend/return records.

**Opening Scene:**
Arif tracks money across memory, chat, and scattered notes. He cannot reliably explain monthly outcomes or outstanding obligations.

**Rising Action:**

1. Arif creates an account and selects a scenario-first personal setup path.
2. He creates income and expense categories aligned with real usage.
3. He adds income, expenses, a savings goal, and a lend transaction.
4. He records partial return and checks updated obligation state.

**Climax:**
Arif can immediately see why balances changed, what is still outstanding, and what next action closes the loop.

**Resolution:**
He transitions from fragmented tracking to clear, reliable personal obligation visibility.

### Journey 2 - Primary User Edge Path (Group Emergency Over-Withdrawal)

**Persona:** Nabila, group member needing emergency access to funds beyond her own contribution.

**Opening Scene:**
Nabila faces an urgent need. Existing tools cannot model fair emergency over-withdrawal without causing disputes.

**Rising Action:**

1. Nabila requests a withdrawal from group funds.
2. System validates available group funds and allows controlled over-withdrawal.
3. Excess amount is allocated as proportional borrowing from users with positive net balance.
4. System records obligations and settlement requirements.

**Climax:**
All members can inspect deterministic explanation output for allocation, obligations, and updated net states.

**Resolution:**
Emergency need is fulfilled while preserving fairness and trust.

### Journey 3 - Admin User Path (Goal Reserve and Implementation)

**Persona:** Rahman, group admin responsible for goal governance and permission-sensitive financial actions.

**Opening Scene:**
Group creates a goal (example: Buy a car) with a target amount (example: 200,000 BDT). Goal creation does not reserve funds and progress starts at **0 / 200,000 BDT**.

**Rising Action (Reserve Creation):**

1. Admin opens reserve creation flow and selects a goal from dropdown.
2. If no goal exists, reserve action is unavailable.
3. Admin records the reserve amount (example: 50,000 BDT).
4. System calculates each member's lending capacity: `lending_capacity = net_balance - reserved_money`
5. System reserves the amount proportionally from each member's lending capacity.
6. Each member's reservation is capped at their individual lending capacity.
7. If a member's lending capacity is less than their proportional share, the remaining amount is redistributed proportionally among members with remaining capacity.
8. System reduces each member's available lending capacity by their reserved amount.
9. Progress bar moves upward (money saved/collected) to **50,000 / 200,000 BDT**.

**Rising Action (Goal Implementation):**

1. Admin opens goal implementation flow and selects a goal from dropdown.
2. If no reserved money exists for the goal, implementation is blocked.
3. Admin records implementation amount (example: 20,000 BDT).
4. System consumes that amount from the reserved money.
5. System updates goal progress (example: **20,000 / 200,000 BDT**) — implementation pulls the progress bar downward.
6. Remaining reserved money (30,000 BDT) remains blocked for withdrawal and available for future implementations.
7. If actual implementation amount is less than reserved amount, the excess is automatically unblocked and becomes available for withdrawal.

**Climax:**
Goal reserve is created with deterministic proportional allocation from members' lending capacities, then implementation consumes from reserved funds with transparent progress tracking.

**Resolution:**
Group can track reserved funds and implemented progress against target while preserving fairness and accurate available cash state.

### Journey 4 - Support/Troubleshooting Path (Dispute Investigation)

**Persona:** Support reviewer or admin investigator handling “balance is wrong” claims.

**Opening Scene:**
A member disputes net balance after mixed withdrawals, repayments, and goal implementations.

**Rising Action:**

1. Reviewer opens event ledger and obligation timeline.
2. Reviewer checks rule-applied records, inputs, outputs, and state transitions.
3. Reviewer validates whether mismatch is misunderstanding or data-entry issue.

**Climax:**
Reviewer reproduces full state path and provides evidence-backed explanation.

**Resolution:**
Issue is resolved with auditable traceability rather than manual interpretation.

### Journey Requirements Summary

- Scenario-first onboarding and action entry for personal and group contexts.
- Deterministic group rule engine for over-withdrawal, proportional borrowing, settlement, and reserve allocation.
- Goal lifecycle support: target amount, progress tracking, and implementation-gated reserve behavior.
- Strict authorization boundaries for admin-only actions.
- Explainability payload for all balance-impacting group outcomes.
- Obligation timeline visibility for current and upcoming states.
- Complete event audit trail for support and dispute resolution.

## Domain-Specific Requirements

### Compliance & Regulatory

- Maintain full transactional auditability for all money-affecting events (deposits, withdrawals, borrowing allocation, repayments, reserves, and goal implementation).
- Enforce role-governed control for sensitive actions (admin-only goal implementation and permission management).
- Maintain immutable event logs suitable for dispute resolution and future regulatory review.
- Enforce strict separation between personal and group ledgers for accounting integrity.
- Maintain detailed execution traceability across client and server: log every function or method call with step-level success/failure status, error reason, timestamp, actor, and correlation ID.

### Technical Constraints

- Deterministic computation: identical inputs must always produce identical outputs.
- Money precision: floating-point with up to 2 decimal places for all monetary values (amounts, balances, targets, etc.).
- Atomic consistency boundaries for ledger write, balance update, obligation update, reserve update, and goal progress update.
- Strict policy-based access control (PBAC), with fine-grained access configurable from group settings.
- Every money-related field supports an optional `transaction_id` to support both cash and digital flow traceability.
- Goal implementation requires an existing goal with reserved money — implementation from members' positive net balances is no longer supported.
- Goal reserve allocation: Admin creates a reservation by reserving money from members' positive net balances based on each member's lending capacity.
- Lending capacity formula: `lending_capacity = net_balance - reserved_money`
- Reservation algorithm: Amount is reserved proportionally from each member's lending capacity, capped at individual lending capacity. If a member's capacity is less than their proportional share, the remaining amount is redistributed proportionally among members with remaining capacity.
- If actual implementation amount is less than the reserved amount, the excess is automatically unblocked and becomes available for withdrawal.
- Explainability is mandatory for all balance-impacting group rule outcomes.

### Integration Requirements

- No bank/payment integration in MVP.
- Internal consistency required between rule engine, obligation timeline, goal progress model, goal reserve accounting, and audit/event ledger.
- In group finance context, the following formula must always hold:
  - `available_group_funds = total_member_deposits - total_reserved_for_goals - total_withdrawn`
  - Where `total_withdrawn` is the gross withdrawal amount (including any borrowed amounts from over-withdrawal).

### Risk Mitigations

- **Allocation disputes:** deterministic proportional rules + explainability + full trace logs.
- **Rule conflicts in edge cases:** decision-table-based rule precedence + edge-case acceptance tests.
- **Access misuse:** PBAC enforcement, policy-change audit logs, and scoped permissions from group settings.
- **Reserve/progress inconsistency:** invariant checks and reconciliation across ledger, reserve, and goal progress states.
- **Opaque behavior risk:** clarity-first output and non-judgmental system responses.

## Innovation & Novel Patterns

### Detected Innovation Areas

1. **Scenario-first financial interaction model**
   Users start from real-life money situations instead of abstract accounting forms. This reduces cognitive friction and aligns product behavior with actual user intent.

2. **Deterministic, explainable fairness engine for group finance**
   Group allocations, borrowing distribution, and reserve effects are computed with explicit, reproducible logic and explanation traces. This shifts conflict resolution from subjective interpretation to inspectable rule outcomes.

3. **Single-source goal implementation model**
   Admin can implement goal amounts using either members' positive net-balance reserve contributions or goal reserve. One implementation record uses exactly one source—mixing both sources in a single implementation is not allowed. This provides operational flexibility without breaking accounting integrity.

4. **Obligation-forward system design**
   Product emphasizes obligation state transitions and timeline visibility, not just transaction history. Users understand both current state and what is due next.

5. **Traceability-first architecture**
   Client-side and server-side method-level success/failure logging with correlation IDs creates high diagnostic confidence and auditable execution narratives.

### Market Context & Competitive Landscape

Most personal finance tools focus on individual transaction categorization and budget tracking. Most group expense tools focus on split accounting but do not enforce deterministic reserve and implementation rules under complex obligation states. This product occupies a differentiated position at the intersection of personal plus group finance, rule-governed fairness, and explainability-driven trust.

### Validation Approach

- Run scenario-based usability tests for top 6 flows and measure time-to-clarity and decision confidence.
- Perform deterministic replay tests for group rule engine outputs under edge-case permutations.
- Track dispute-resolution effectiveness via support analytics and explanation-open rates.
- Validate PBAC effectiveness through permission matrix tests and unauthorized action attempts.
- Validate reserve-from-members model with reconciliation tests across lending capacity, net balances, and goal reserve.
- Validate implementation-from-reserved model with reconciliation tests across reserved money and goal progress.

### Risk Mitigation

- **Risk:** users find rule behavior complex
  **Mitigation:** explanation-first UX and scenario-driven entry points.

- **Risk:** scaling complexity of rule engine
  **Mitigation:** decision tables, invariant checks, and replayable test harnesses.

- **Risk:** false confidence from incomplete logs
  **Mitigation:** mandatory client/server correlation logging standard with alerting on trace gaps.

- **Risk:** reserve-from-members misuse by admins
  **Mitigation:** confirmation UX, proportional allocation transparency, and full audit logs.

- **Risk:** implementation without sufficient reserved money
  **Mitigation:** implementation blocked if reserved money is insufficient, clear error messaging.

## Web App Specific Requirements

### Project-Type Overview

Individual Finance is a web application requiring high-confidence financial state management across personal and group contexts. The web layer must support scenario-first workflows, deterministic rule outputs, and explainable state transitions while preserving strict module separation and role-sensitive access behavior.

### Technical Architecture Considerations

- Application model: responsive web app (mobile-first interaction patterns, desktop-supportive administration flow).
- Package manager: **pnpm and pnpx must be used exclusively** — npm and yarn are not permitted.
- Client-state strategy: predictable state management for money-affecting operations with explicit loading, success, and failure states.
- Server authority: server-side canonical ledger and rule execution, client reflects authoritative outcomes.
- Concurrency handling: idempotent write operations and replay-safe transaction processing for all money-related mutations.
- Observability: full client and server trace logs with correlation IDs for every action path and step-level status.
- Policy enforcement: PBAC policy evaluation at API boundary and service layer, configurable from group settings.
- Data consistency model: transactional consistency for ledger, reserve, obligation, and goal-progress updates.

### Browser and UX Requirements

- Support current major browser versions (Chrome, Edge, Firefox, Safari).
- Mobile viewport usability for core member flows (deposit, withdrawal, repayment, reserve visibility).
- Desktop-optimized admin controls for permission policies, reserve creation, implementation, and audit review.
- Scenario-first action entry with clear transition feedback for every rule-sensitive action.
- Human-readable explainability panels for all group rule outcomes.

### Security and Authorization Model

- Authenticated sessions required for all personal and group operations.
- Group-scoped PBAC rules:
  - policy-managed action rights,
  - admin-only restricted actions,
  - explicit policy audit events.
- Sensitive action protections:
  - confirmation steps for implementation and policy changes,
  - denial responses with clear reason codes.

### Performance and Reliability Targets

- Group-rule computation: p95 300ms or less.
- Ledger write and derived state update: p95 800ms or less.
- Availability target: 99.5% for MVP, 99.9% post-MVP.
- Failure handling preserves financial consistency over UI responsiveness.

### Implementation Considerations

- Goal implementation can **only** be sourced from reserved money (consumed from goal reserve).
- **Deprecated:** Implementation from members' positive net balances — this option is no longer available.
- If no reserved money exists for the selected goal, implementation is blocked until funds are reserved.
- Goal lifecycle behavior:
  - goal target set at creation,
  - initial implemented amount is 0,
  - reserve events update reserved state only (pulls progress bar upwards),
  - implementation events increase implemented amount and update progress bar (pulls progress bar downwards).
- Goal implementation is blocked when no goal exists.
- If actual implementation amount is less than reserved amount, the excess amount is automatically unblocked and becomes available for withdrawal.
- Group available_group_funds invariant:
  - `available_group_funds = total_member_deposits - total_reserved_for_goals - total_withdrawn`

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-solving MVP with deterministic trust core.

The MVP must prove one core outcome: users can manage personal and group money with clear, explainable obligations and fewer disputes.

**Resource Requirements (Specialist Team):**

- 1 Backend Engineer (ledger, rule engine, PBAC, audit architecture)
- 1 Frontend Engineer (scenario-first UX, explainability views, goal progress and timeline interfaces)
- 1 QA Engineer (deterministic replay tests, edge-case and regression coverage)
- 1 Product/UX role (part-time acceptable for discovery, UX refinement, and scope governance)

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**

1. Personal money tracking plus loan/lend lifecycle
2. Group emergency over-withdrawal with proportional borrowing allocation
3. Admin goal reserve (reserve from members' positive net balances) and goal implementation (consume from reserved money)
4. Support-grade dispute trace and explanation review

**Must-Have Capabilities:**

- Personal module: income, expense, savings goals, loan/lend create and repayment lifecycle, category management
- Group module: deposits, withdrawals, reserve entries, goal creation, goal implementation
- Goal progression: target amount, implemented amount, progress bar updates on implementation events
- Rule engine: deterministic over-withdrawal, proportional allocation, settlement constraints, eligibility rules
- PBAC: strict policy-based access controls configurable at group settings level
- Explainability and observability: "why this happened" traces plus full client/server method-level logs with correlation IDs
- Core invariant enforcement: `available_group_funds = total_member_deposits - total_reserved_for_goals - total_withdrawn`

### Post-MVP Features

**Phase 2 (Growth):**

- Advanced obligation reminders and notifications
- Predictive obligation stress indicators
- Richer user/group analytics
- Higher-level PBAC policy templates
- Localization and UX polish

**Phase 3 (Expansion):**

- Broader community/shared-fund templates
- Cross-group coordination features
- Advanced compliance/reporting exports
- Optional external integration layer

### Risk Mitigation Strategy

**Technical Risks:** rule complexity and edge-case collisions

- Mitigation: decision tables, invariants, deterministic replay tests

**Market Risks:** slow migration from informal methods

- Mitigation: scenario-first onboarding and immediate clarity wins

**Resource Risks:** delivery pressure with limited bandwidth

- Mitigation: specialist role split (backend/frontend), strict MVP boundary control, defer non-core analytics and expansion features

## Functional Requirements

### Identity, Membership, and Access Governance

- FR1: Users can create and access authenticated accounts.
- FR2: Users can create groups and join groups through permissioned membership.
- FR3: Group admins can assign and revoke admin roles.
- FR4: Group admins can add and remove group members via email invitation links. Admins can search by email and send invitation links. If the invitee has no existing account, the link guides them through account creation before joining the group.
- FR5: Group administrators can configure policy-based access controls from group settings, which specifies which members can perform specific actions (e.g., reserve for goal, implement goal).
- FR6: The system can enforce policy-based access checks for every group-scoped action.
- FR7: The system can restrict admin-only actions (goal implementation and permission changes) to authorized users.
- FR7a: The system can add an `is_viable` field to all group-related entities (groups, members, goals, etc.), defaulting to `true`.
- FR7b: When a member is removed from a group, the system must set `is_viable = false` for that member (excluding them from calculations).
- FR7c: When a member rejoins a group, the system must set `is_viable = true` for that member.
- FR7d: Transaction history must be preserved when a member is removed (no deletion of records).

### Personal Finance Management

- FR8: Users can record income entries with categories.
- FR9: Users can record expense entries with categories.
- FR10: Users can create and manage personal savings records tied to goals.
- FR11: Users can create personal goals with deadlines and target amounts.
- FR12: Users can create loan records with optional interest values.
- FR13: Users can record loan repayments against active loans.
- FR14: Users can create lend records for money provided to others.
- FR15: Users can record money received against active lend records.
- FR16: Users can manage category definitions for income, expense, and goal types.

### Group Ledger and Money Movement

- FR17: Group members can record deposit transactions in group context.
- FR18: Group members can request and record withdrawals in group context.
- FR19: The system can compute and expose current available group funds.
- FR20: The system can maintain strict logical and operational separation between personal and group finance records.
- FR21: The system can maintain an optional transaction reference for all money-related records.
- FR22: The system can support both cash and non-cash money movements without requiring transaction references.

### Group Borrowing, Settlement, and Balance Rules

- FR23: The system can allow over-withdrawal when requested amount is within available group funds.
- FR24: The system can treat over-withdrawal excess as borrowing from users with positive net balances.
- FR25: The system can allocate borrowing proportionally to eligible positive net-balance members.
- FR26: The system can maintain borrowing obligations for users who over-withdraw.
- FR27: The system can enforce settlement prerequisites before new deposits when defined policy requires it.
- FR28: The system can enforce return-before-deposit sequencing for users with unresolved withdrawal obligations.
- FR29: The system can calculate and expose each member's net balance state.
- FR30: The system can apply eligibility rules based on positive or negative net balance states.
- FR31: Net balance formula: `net_balance = total_deposits - total_withdrawals - borrowing_allocations + returned_withdrawals`.
- FR32: Borrowing allocations are excluded from net balance because the money comes from over-withdrawal, not from the group fund.
- FR33: The system can calculate each member's lending capacity: `lending_capacity = net_balance - reserved_money`.
- FR34: Reserving money for a goal reduces the member's lending capacity.

### Goals, Reserve Management, and Progress Tracking

- FR35: Group admins can create group goals with target amounts.
- FR36: The system can initialize newly created goals with implemented progress equal to zero.
- FR37: The system can display goal progress as implemented amount versus target amount.
- FR38: Users can reserve money for a specific goal only when at least one goal exists. Reserving blocks the reserved amount from withdrawal and contributes to goal tracking.
- FR39: Group admins can record goal implementation only when at least one goal exists.
- FR40: The system can require goal selection during implementation recording.
- FR41: Admin can create reservation for goals by reserving money from members' positive net balances.
- FR42: Reservation is based on each member's lending capacity, calculated as `lending_capacity = net_balance - reserved_money`.
- FR43: Amount is reserved proportionally from each member's lending capacity, capped at their individual lending capacity.
- FR44: If a member's lending capacity is less than their proportional share, the remaining amount is redistributed proportionally among members with remaining capacity.
- FR45: The system can update selected goal progress after each implementation event.
- FR46: The system can maintain and expose total reserved-for-goals state.
- FR47: The system can enforce and expose available group funds state derived from deposits and reserves.

### Explainability, Timeline, and Supportability

- FR48: The system can provide explainable "why this happened" outputs for all balance-impacting group-rule outcomes.
- FR49: The system can expose rule-applied context for allocation, obligation, and reserve outcomes.
- FR50: Users can view obligation timeline states for current and upcoming commitments.
- FR51: Support/admin reviewers can access chronological event views for dispute investigation.
- FR52: The system can provide traceable state transition history for money-impacting operations.
- FR53: The system can surface chronological goal progress timeline updates tied to implementation events. Reserve events pull the progress bar upwards (money collected/saved), while implementation events pull the progress bar downwards (money spent).

### Auditability and Operational Traceability

- FR54: The system can generate auditable event logs for every financial state change.
- FR55: The system can capture client-side and server-side logs for each function or method call in critical flows.
- FR56: The system can record step-level success/failure status for traceable execution paths.
- FR57: The system can associate logs across layers using correlation identifiers.
- FR58: Authorized reviewers can retrieve logs and event trails for troubleshooting and verification.

## Non-Functional Requirements

### Performance

- NFR1: Group-rule computation operations must complete within p95 300ms under normal load.
- NFR2: Ledger write plus derived state updates must complete within p95 800ms.
- NFR3: Primary user actions (deposit, withdrawal, reserve, implementation record, repayment) must provide user-visible completion feedback within 2 seconds for successful operations.
- NFR4: Goal progress and available group funds values must reflect committed updates immediately after transaction completion.

### Security

- NFR5: All data in transit must be encrypted using TLS.
- NFR6: Sensitive stored data must be encrypted at rest.
- NFR7: PBAC enforcement must be applied server-side for every group-scoped protected action.
- NFR8: Unauthorized protected actions must be denied with auditable reason codes.
- NFR9: Security-relevant events (authentication, policy changes, admin actions) must be logged and queryable by authorized reviewers.
- NFR10: Session management must support secure authentication lifecycle (issue, refresh, revoke, expire).

### Reliability and Consistency

- NFR11: The system must preserve deterministic rule behavior, identical inputs produce identical outputs.
- NFR12: Money-impacting operations must be atomic across ledger, balance, reserve, obligation, and goal progress updates.
- NFR13: System must maintain the group invariant:
  - `available_group_funds = total_member_deposits - total_reserved_for_goals - total_withdrawn`
- NFR14: On partial failure during money-impacting operations, the system must prevent partial committed financial state.
- NFR15: Production availability target is 99.5% for MVP and 99.9% post-MVP.

### Scalability

- NFR16: System must support growth from MVP traffic to at least 10x transaction volume without architectural redesign.
- NFR17: Performance degradation under 10x load must remain within agreed operational thresholds (no critical rule-path timeout or deterministic mismatch).
- NFR18: Logging and audit storage must scale with full trace retention requirements without blocking transaction processing.

### Accessibility

- NFR19: Core user workflows must be operable via keyboard navigation.
- NFR20: Essential UI elements must maintain sufficient text and background contrast for readability.
- NFR21: Key status and action feedback must be perceivable without relying only on color.
- NFR22: Form controls and interactive elements must expose accessible labels for assistive technologies.

### Observability and Traceability

- NFR23: System must log client-side and server-side function/method calls for critical financial workflows.
- NFR24: Each traced operation must include step-level success/failure state, timestamp, actor context, and correlation ID.
- NFR25: End-to-end trace reconstruction must be possible for every financial event path.
- NFR26: Explainability payloads for group outcomes must be retained and retrievable for support and audit use.
- NFR27: Missing-trace events in critical flows must trigger operational alerting.
- NFR28: All events must be logged with timestamps in the format: `[timestamp] [log level] function [function_name], variable [variable_name] changed its value to [new_value]`.
