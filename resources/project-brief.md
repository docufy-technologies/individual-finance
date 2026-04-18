# Project Brief (First Draft) — Individual Finance

## Project Name

**Individual Finance**

## Document Purpose

Define the product vision, scope, users, and core rules for a finance app that supports both **Personal Finance** and **Group Finance** with strict separation of data and logic.

## Product Vision

Help users track money with confidence across personal and shared contexts, while enforcing fair and transparent group accounting rules that are hard to manage manually.

## Problem Statement

People can log personal income and expenses in many apps, but most tools fail when users need:

1. Goal-linked savings and loans in one place.
2. Shared group finance with fair borrowing allocation.
3. Rule-driven net balance enforcement for deposits, withdrawals, and goal implementation.

This creates errors, disputes, and poor decision-making in both individual and group money management.

## Target Users

- **Primary:** Individuals managing personal cash flow, savings goals, loans, and lending.
- **Secondary:** Small groups (families, roommates, clubs, teams) pooling money for shared goals.
- **Admin users:** Group managers who control permissions and official goal implementation records.

## Core Product Scope

### 1) Personal Finance Module

Authenticated users can:

- Add income records.
- Add expense records.
- Add savings records tied to goals (without transaction ID).
- Manage loan records:
  - Loan creation
  - Loan repayment
  - Interest supported, default value `0`
- Manage lend records:
  - Lend money
  - Receive money back
- Add goals with deadlines.
- Edit categories for:
  - Income
  - Expense
  - Goal type

### 2) Group Finance Module (Strictly Separate)

Group Finance is a separate entity and must not mix with Personal Finance records or rules.

Group users can:

- Add deposits.
- Add withdrawal records.
- Reserve funds for goals.
- Record goal implementation (admin-controlled).

System capabilities:

- Calculate cash in hand.
- Calculate cash reserved for goals.
- Support over-withdrawal under defined constraints:
  - User may withdraw beyond own deposit if amount is within available cash in hand.
  - Excess is treated as borrowing from users with positive net balance.
  - Borrow allocation is proportional to each lender’s positive net balance.

## Critical Business Rules (Group Finance)

1. Personal and Group Finance must remain logically and operationally separate.
2. Users who borrow or over-withdraw must settle obligations before making new deposits.
3. Deposit equalization rule applies:
   - Every user should equalize to the highest deposit baseline adjusted by goal implementation.
4. Withdrawals require positive net balance; however, as borrowing exists, user can borrow money regardless of having 0 or negative net balances (in case of emergency)
5. Users must return withdrawn amounts before new deposits.
6. Only admins can:
   - Record goal implementations
   - Manage group permissions (add/remove users, assign admin role)
7. Goal implementation amount splits proportionally by users’ net balances.
8. Users with net balance below `0` are excluded from proportional goal implementation splits.
9. Users can only implement goals if net balance is above `0`.

## Non-Functional Expectations (Draft)

- Clear audit trail for all finance actions.
- Deterministic rule engine for group calculations.
- Data integrity for money movements and balance states.
- Role-based authorization for admin-only actions.
- Scalable ledger structure for future reporting and analytics.

## Risks and Unknowns

- Some group rules may conflict in edge cases if interpreted literally.
- “Equalize deposits” formula needs a formal, testable definition.
- “Return before deposit” needs exact sequencing rules for partial repayments.
- Goal implementation eligibility needs clear event timing (pre/post transaction boundary).

## Out of Scope

- Bank integrations.
- Payment gateway and auto-sync.
- Tax estimation.
- Investment portfolio tracking.

[out of document]

**next action:**

Convert this brief into a formal PRD with:

1. Canonical data model (ledger, balance, obligations, role tables).
2. Rule engine decision table for every group transaction type.
3. Acceptance criteria and edge-case scenarios for each rule.
