# Database Schema — Individual Finance

> **Status:** Final — validated against PRD and architecture
> **Based on:** `artifacts/planning-artifacts/prd.md`
> **Last updated:** 2026-04-24

---

## Overview

This is the canonical database schema for Individual Finance. It was validated against the PRD and architecture document, with the following key design decisions incorporated:

- Replaced `role` column in `group_members` with granular PBAC permissions
- Moved categories to `users` table as comma-separated text (dropped `category_uuid` FKs, no icons)
- Renamed `personal_goal_savings` → `personal_goal_reservations` (no ledger FK, adds `transaction_ref`)
- Renamed `loans` column `borrower_name` → `borrower_description`
- Renamed `lends` column `lender_name` → `lender_description`; `interest_rate` defaults to 0
- Split `group_ledger_entries` into `group_deposits` and `group_withdrawals`
- Split `personal_ledger_entries` into `personal_incomes` and `personal_expenses`
- Added `reserved_total` to `group_goals`
- Renamed `sessions` → `refresh_tokens` (access token = stateless JWT, refresh token = rotating hashed credential)
- Simplified `refresh_tokens` — dropped `revoked_at` and `last_used_at` (token existence = validity, no history needed)
- Renamed `reserves` → `group_goal_reservations` with `group_goal_uuid`
- Renamed `obligations` → `over_withdrawal_borrowings`
- Renamed `obligation_settlements` → `over_withdrawal_settlements`
- Replaced `source_entry_uuid` in borrowings with `withdrawal_uuid`
- Added `updated_at` to `over_withdrawal_borrowings`
- Added `group_goal_implementations` table
- Added `implemented_amount` and `reserved_total` to `personal_goals` (mirrors group_goals)
- Added `personal_goal_implementations` table
- Renamed `entry_date` in group_deposits → `deposited_at`
- Renamed `entry_date` in group_withdrawals → `withdrawn_at`
- Dropped `group_policy_permissions` (overkill for MVP — `can_<action>` columns in `group_member_permissions` suffice)
- Added `transaction_ref` to `personal_loans` and `personal_lends`
- Added `is_completed` (DEFAULT false) to `personal_goals` and `group_goals`

---

## Entity Relationship Diagram (Conceptual)

```
users ──────────────── group_members ─────────────── groups
    │                        │                        │
    │                        │                   group_deposits
refresh_tokens           group_member_permissions group_withdrawals
personal_incomes                                group_goal_reservations
personal_expenses                               group_goal_implementations
personal_goals ─────── personal_goal_reservations over_withdrawal_borrowings
personal_goal_implementations                     over_withdrawal_settlements
personal_loans ─────── personal_loan_repayments  group_goals
personal_lends ─────── personal_lend_repayments
                                                   audit_events (global)
```

---

## Table: users

Root user identity.

| Column               | Type          | Constraints             | Notes                          |
| -------------------- | ------------- | ----------------------- | ------------------------------ |
| `uuid`               | `UUID`        | PK                      |                                |
| `email`              | `TEXT`        | UNIQUE, NOT NULL        |                                |
| `full_name`          | `TEXT`        | NOT NULL                |                                |
| `password_hash`      | `TEXT`        | NULL                    | For credential auth            |
| `income_categories`  | `TEXT`        | NOT NULL, DEFAULT ''    | Comma-separated category names |
| `expense_categories` | `TEXT`        | NOT NULL, DEFAULT ''    | Comma-separated category names |
| `goal_categories`    | `TEXT`        | NOT NULL, DEFAULT ''    | Comma-separated category names |
| `created_at`         | `TIMESTAMPTZ` | NOT NULL, DEFAULT now() |                                |
| `updated_at`         | `TIMESTAMPTZ` | NOT NULL                |                                |
| `is_viable`          | `BOOLEAN`     | NOT NULL, DEFAULT true  | Soft-delete / rejoin flag      |

**Indexes:**

- `email` (unique lookup)

**Design notes:**

- Categories stored as text, parsed via application logic. No icons.
- Default categories can be seeded on first login.

---

## Table: refresh_tokens

Rotating refresh token store. Access tokens are stateless JWTs — only the refresh token is stored server-side.

| Column       | Type          | Constraints                       | Notes                                  |
| ------------ | ------------- | --------------------------------- | -------------------------------------- |
| `uuid`       | `UUID`        | PK                                |                                        |
| `user_uuid`  | `UUID`        | FK → users.uuid, NOT NULL | User who owns this refresh token (multiple rows allowed for multi-device) |
| `token_hash` | `TEXT`        | UNIQUE, NOT NULL                  | Hashed refresh token (never plaintext) |
| `expires_at` | `TIMESTAMPTZ` | NOT NULL                          |                                        |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, DEFAULT now()           |                                        |

**Indexes:**

- `token_hash` (unique lookup for token validation)
- `user_uuid` (for session listing/revocation per user)

**Design notes:**

- Supports multiple concurrent sessions (different devices/browsers) — each gets its own refresh token row.
- Token validation flow: (1) validate access token signature with private key — (2) if valid, check for exact refresh token match in DB — (3) if found, DELETE old + INSERT new token pair, both refresh token and access token. Token existence = validity. No `revoked_at` needed because deleted = invalid.
- `token_hash` means even DB compromise doesn't expose live refresh tokens.
- **No history kept** — old tokens are immediately invalid after rotation and cannot be replayed.

---

## Table: groups

Group finance container.

| Column         | Type          | Constraints               | Notes                 |
| -------------- | ------------- | ------------------------- | --------------------- |
| `uuid`         | `UUID`        | PK                        |                       |
| `name`         | `TEXT`        | NOT NULL                  |                       |
| `creator_uuid` | `UUID`        | FK → users.uuid, NOT NULL | Creator = first admin |
| `created_at`   | `TIMESTAMPTZ` | NOT NULL, DEFAULT now()   |                       |
| `updated_at`   | `TIMESTAMPTZ` | NOT NULL                  |                       |
| `is_viable`    | `BOOLEAN`     | NOT NULL, DEFAULT true    | Soft-delete flag      |

**Indexes:**

- `creator_uuid` (for listing groups by creator)

---

## Table: group_members

Links users to groups. PBAC permissions are managed per-member via `policy_permissions`.

| Column       | Type          | Constraints                | Notes                                   |
| ------------ | ------------- | -------------------------- | --------------------------------------- |
| `uuid`       | `UUID`        | PK                         |                                         |
| `group_uuid` | `UUID`        | FK → groups.uuid, NOT NULL |                                         |
| `user_uuid`  | `UUID`        | FK → users.uuid, NOT NULL  |                                         |
| `joined_at`  | `TIMESTAMPTZ` | NOT NULL, DEFAULT now()    |                                         |
| `is_viable`  | `BOOLEAN`     | NOT NULL, DEFAULT true     | FR7b/c: false on remove, true on rejoin |

**Constraints:**

- UNIQUE `group_uuid, user_uuid`

**Indexes:**

- `group_uuid` (for listing members in a group)
- `user_uuid` (for listing groups a user belongs to)

---

## Table: group_member_permissions

Granular PBAC permissions per group member.

| Column                   | Type          | Constraints                        | Notes                         |
| ------------------------ | ------------- | ---------------------------------- | ----------------------------- |
| `uuid`                   | `UUID`        | PK                                 |                               |
| `member_uuid`            | `UUID`        | FK → group_members.uuid, NOT NULL | Member this permission applies to |
| `group_uuid`             | `UUID`        | FK → groups.uuid, NOT NULL         | Group scope for this permission set |

**Constraints:**

- UNIQUE `(member_uuid, group_uuid)` — one permission row per member per group

**Indexes:**

- `member_uuid` (for listing a member's permissions across groups)
- `group_uuid` (for listing all member permissions in a group)

**Design notes:**

- Group creator gets all permissions = true by default.
- Only admins with `can_update_permissions = true` can modify others' permissions.
- **Creator cannot revoke their own admin access.** System enforces at least one admin at all times.
- When a member is re-added, their previous permission set is restored (permission data preserved on `is_viable = false`).

---

## Table: group_invitations

Email invitation links for inviting members.

| Column            | Type          | Constraints                | Notes                    |
| ----------------- | ------------- | -------------------------- | ------------------------ |
| `uuid`            | `UUID`        | PK                         |                          |
| `group_uuid`      | `UUID`        | FK → groups.uuid, NOT NULL |                          |
| `invited_email`   | `TEXT`        | NOT NULL                   |                          |
| `invitation_code` | `TEXT`        | UNIQUE, NOT NULL           | Code sent in email link  |
| `expires_at`      | `TIMESTAMPTZ` | NOT NULL                   |                          |
| `accepted_at`     | `TIMESTAMPTZ` | NULL                       | NULL = not yet accepted  |
| `created_at`      | `TIMESTAMPTZ` | NOT NULL, DEFAULT now()    |                          |
| `creator_uuid`    | `UUID`        | FK → users.uuid, NOT NULL  | Admin who created invite |

**Indexes:**

- `invitation_code` (unique lookup for invitation link validation)
- `group_uuid` (for listing invitations per group)

---

## Table: personal_incomes

Personal income records.

| Column            | Type            | Constraints                  | Notes                                      |
| ----------------- | --------------- | ---------------------------- | ------------------------------------------ |
| `uuid`            | `UUID`          | PK                           |                                            |
| `user_uuid`       | `UUID`          | FK → users.uuid, NOT NULL    |                                            |
| `category`        | `TEXT`          | NOT NULL                     | Category name must be in income_categories |
| `amount`          | `DECIMAL(19,2)` | NOT NULL, CHECK (amount > 0) |                                            |
| `description`     | `TEXT`          | NULL                         | Optional note                              |
| `transaction_ref` | `TEXT`          | NULL                         | Optional external ref (FR21)               |
| `income_date`     | `TIMESTAMPTZ`   | NOT NULL                     | When the income was received               |
| `created_at`      | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()      |                                            |
| `updated_at`      | `TIMESTAMPTZ`   | NOT NULL                     |                                            |

**Indexes:**

- `user_uuid` (for filtering by user)
- `income_date` (for chronological queries)

---

## Table: personal_expenses

Personal expense records.

| Column            | Type            | Constraints                  | Notes                                       |
| ----------------- | --------------- | ---------------------------- | ------------------------------------------- |
| `uuid`            | `UUID`          | PK                           |                                             |
| `user_uuid`       | `UUID`          | FK → users.uuid, NOT NULL    |                                             |
| `category`        | `TEXT`          | NOT NULL                     | Category name must be in expense_categories |
| `amount`          | `DECIMAL(19,2)` | NOT NULL, CHECK (amount > 0) |                                             |
| `description`     | `TEXT`          | NULL                         | Optional note                               |
| `transaction_ref` | `TEXT`          | NULL                         | Optional external ref (FR21)                |
| `expense_date`    | `TIMESTAMPTZ`   | NOT NULL                     | When the expense occurred                   |
| `created_at`      | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()      |                                             |
| `updated_at`      | `TIMESTAMPTZ`   | NOT NULL                     |                                             |

**Indexes:**

- `user_uuid` (for filtering by user)
- `expense_date` (for chronological queries)

**Design notes:**

- `category` is text (not FK) — user can delete categories without breaking history.
- No icons stored.
- The `type` column is gone — each table is self-describing by name.

---

## Table: personal_goals

Personal savings goals.

| Column               | Type            | Constraints                         | Notes                             |
| -------------------- | --------------- | ----------------------------------- | --------------------------------- |
| `uuid`               | `UUID`          | PK                                  |                                   |
| `user_uuid`          | `UUID`          | FK → users.uuid, NOT NULL           |                                   |
| `name`               | `TEXT`          | NOT NULL                            |                                   |
| `category`           | `TEXT`          | NOT NULL                            | Goal type category as text        |
| `description`        | `TEXT`          | NULL                                |                                   |
| `target_amount`      | `DECIMAL(19,2)` | NOT NULL, CHECK (target_amount > 0) |                                   |
| `implemented_amount` | `DECIMAL(19,2)` | NOT NULL, DEFAULT 0                 | Total consumed by implementations |
| `reserved_total`     | `DECIMAL(19,2)` | NOT NULL, DEFAULT 0                 | Total reserved for this goal      |
| `is_completed`       | `BOOLEAN`       | NOT NULL, DEFAULT false             | Goal completed flag               |
| `deadline`           | `TIMESTAMPTZ`   | NULL                                | Optional target date              |
| `created_at`         | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()             |                                   |
| `updated_at`         | `TIMESTAMPTZ`   | NOT NULL                            |                                   |
| `is_viable`          | `BOOLEAN`       | NOT NULL, DEFAULT true              |                                   |

**Indexes:**

- `user_uuid` (for listing goals by user)

**Design notes:**

- Mirrors `group_goals` structure.
- `reserved_total` grows on reserve events, decreases when excess is unblocked.
- `implemented_amount` tracks total consumed from reserved money.
- `progress = implemented_amount / target_amount`.

---

## Table: personal_goal_reservations

Manual reservations toward personal goals. Decreases "available to spend".

| Column            | Type            | Constraints                        | Notes                                      |
| ----------------- | --------------- | ---------------------------------- | ------------------------------------------ |
| `uuid`            | `UUID`          | PK                                 |                                            |
| `goal_uuid`       | `UUID`          | FK → personal_goals.uuid, NOT NULL |                                            |
| `user_uuid`       | `UUID`          | FK → users.uuid, NOT NULL          |                                            |
| `amount`          | `DECIMAL(19,2)` | NOT NULL, CHECK (amount > 0)       | Manually reserved amount                   |
| `transaction_ref` | `TEXT`          | NULL                               | Optional external ref (e.g., transfer ref) |
| `reserved_at`     | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()            |                                            |
| `created_at`      | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()            |                                            |

**Indexes:**

- `goal_uuid` (for listing reservations per goal)
- `user_uuid` (for listing reservations by user)

**Design notes:**

- User manually reserves amounts toward goals.
- Can include transaction_ref for bank transfers etc.
- Decreases available-to-spend in personal finance view.

---

## Table: personal_goal_implementations

Records of personal goal implementation — consumes money from personal goal reservations.

| Column            | Type            | Constraints                        | Notes                             |
| ----------------- | --------------- | ---------------------------------- | --------------------------------- |
| `uuid`            | `UUID`          | PK                                 |                                   |
| `goal_uuid`       | `UUID`          | FK → personal_goals.uuid, NOT NULL | Goal being implemented            |
| `user_uuid`       | `UUID`          | FK → users.uuid, NOT NULL          | User who performed implementation |
| `amount`          | `DECIMAL(19,2)` | NOT NULL, CHECK (amount > 0)       | Amount consumed from reserves     |
| `transaction_ref` | `TEXT`          | NULL                               | Optional external ref             |
| `implemented_at`  | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()            | When implementation occurred      |
| `created_at`      | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()            |                                   |

**Indexes:**

- `goal_uuid` (for listing implementations per goal)
- `user_uuid` (for listing implementations by user)

**Design notes:**

- Mirrors `group_goal_implementations` structure.
- Implementation only possible when `reserved_total > 0` for the goal.
- If `amount` < reserved remaining, excess is unblocked.

---

## Table: personal_loans

Records of money loaned FROM others (user is debtor).

| Column               | Type            | Constraints                                                      | Notes                           |
| -------------------- | --------------- | ---------------------------------------------------------------- | ------------------------------- |
| `uuid`               | `UUID`          | PK                                                               |                                 |
| `user_uuid`          | `UUID`          | FK → users.uuid, NOT NULL                                        | Creditor                        |
| `lender_description` | `TEXT`          | NOT NULL                                                         | Who borrowed (name, note, etc.) |
| `principal_amount`   | `DECIMAL(19,2)` | NOT NULL, CHECK (principal_amount > 0)                           | Original amount                 |
| `interest_rate`      | `DECIMAL(5,4)`  | NOT NULL, DEFAULT 0                                              | Annual rate, e.g. 0.05 for 5%   |
| `currency`           | `TEXT`          | NOT NULL, DEFAULT 'BDT'                                          |                                 |
| `started_at`         | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()                                          |                                 |
| `due_at`             | `TIMESTAMPTZ`   | NULL                                                             | Optional due date               |
| `status`             | `TEXT`          | NOT NULL, CHECK (status IN ('active', 'settled', 'written_off')) |                                 |
| `transaction_ref`    | `TEXT`          | NULL                                                             | Optional external ref           |
| `created_at`         | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()                                          |                                 |
| `updated_at`         | `TIMESTAMPTZ`   | NOT NULL                                                         |                                 |
| `is_viable`          | `BOOLEAN`       | NOT NULL, DEFAULT true                                           |                                 |

**Indexes:**

- `user_uuid` (for listing loans by user)
- `status` (for filtering by loan status)

---

## Table: personal_loan_repayments

Repayments received against a personal loan.

| Column            | Type            | Constraints                        | Notes                 |
| ----------------- | --------------- | ---------------------------------- | --------------------- |
| `uuid`            | `UUID`          | PK                                 |                       |
| `loan_uuid`       | `UUID`          | FK → personal_loans.uuid, NOT NULL |                       |
| `amount`          | `DECIMAL(19,2)` | NOT NULL, CHECK (amount > 0)       |                       |
| `paid_at`         | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()            |                       |
| `transaction_ref` | `TEXT`          | NULL                               | Optional external ref |
| `created_at`      | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()            |                       |

**Indexes:**

- `loan_uuid` (for listing repayments per loan)

---

## Table: personal_lends

Records of money borrowed TO others (user is creditor).

| Column                 | Type            | Constraints                                                      | Notes                       |
| ---------------------- | --------------- | ---------------------------------------------------------------- | --------------------------- |
| `uuid`                 | `UUID`          | PK                                                               |                             |
| `user_uuid`            | `UUID`          | FK → users.uuid, NOT NULL                                        | Debtor                      |
| `borrower_description` | `TEXT`          | NOT NULL                                                         | Who lent (name, note, etc.) |
| `principal_amount`     | `DECIMAL(19,2)` | NOT NULL, CHECK (principal_amount > 0)                           | Original amount             |
| `interest_rate`        | `DECIMAL(5,4)`  | NOT NULL, DEFAULT 0                                              | Annual rate                 |
| `currency`             | `TEXT`          | NOT NULL, DEFAULT 'BDT'                                          |                             |
| `started_at`           | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()                                          |                             |
| `due_at`               | `TIMESTAMPTZ`   | NULL                                                             | Optional due date           |
| `status`               | `TEXT`          | NOT NULL, CHECK (status IN ('active', 'settled', 'written_off')) |                             |
| `created_at`           | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()                                          |                             |
| `updated_at`           | `TIMESTAMPTZ`   | NOT NULL                                                         |                             |
| `is_viable`            | `BOOLEAN`       | NOT NULL, DEFAULT true                                           |                             |

**Indexes:**

- `user_uuid` (for listing lends by user)
- `status` (for filtering by lend status)

---

## Table: personal_lend_repayments

Money sent to settle a personal lend.

| Column            | Type            | Constraints                        | Notes                 |
| ----------------- | --------------- | ---------------------------------- | --------------------- |
| `uuid`            | `UUID`          | PK                                 |                       |
| `lend_uuid`       | `UUID`          | FK → personal_lends.uuid, NOT NULL |                       |
| `amount`          | `DECIMAL(19,2)` | NOT NULL, CHECK (amount > 0)       |                       |
| `paid_at`         | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()            |                       |
| `transaction_ref` | `TEXT`          | NULL                               | Optional external ref |
| `created_at`      | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()            |                       |

**Indexes:**

- `lend_uuid` (for listing repayments per lend)

---

## Table: group_deposits

Group deposit transactions.

| Column            | Type            | Constraints                       | Notes                     |
| ----------------- | --------------- | --------------------------------- | ------------------------- |
| `uuid`            | `UUID`          | PK                                |                           |
| `group_uuid`      | `UUID`          | FK → groups.uuid, NOT NULL        |                           |
| `member_uuid`     | `UUID`          | FK → group_members.uuid, NOT NULL | Who deposited             |
| `amount`          | `DECIMAL(19,2)` | NOT NULL, CHECK (amount > 0)      |                           |
| `description`     | `TEXT`          | NULL                              | Optional note             |
| `transaction_ref` | `TEXT`          | NULL                              | Optional external ref     |
| `deposited_at`    | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()           | When the deposit happened |
| `created_at`      | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()           |                           |
| `updated_at`      | `TIMESTAMPTZ`   | NOT NULL                          |                           |

**Indexes:**

- `group_uuid` (for listing deposits per group)
- `deposited_at` (for chronological queries)
- `member_uuid` (for listing deposits by member)

---

## Table: group_withdrawals

Group withdrawal transactions (includes over-withdrawal).

| Column            | Type            | Constraints                                                 | Notes                        |
| ----------------- | --------------- | ----------------------------------------------------------- | ---------------------------- |
| `uuid`            | `UUID`          | PK                                                          |                              |
| `group_uuid`      | `UUID`          | FK → groups.uuid, NOT NULL                                  |                              |
| `member_uuid`     | `UUID`          | FK → group_members.uuid, NOT NULL                           | Who withdrew                 |
| `amount`          | `DECIMAL(19,2)` | NOT NULL, CHECK (amount > 0)                                |                              |
| `type`            | `TEXT`          | NOT NULL, CHECK (type IN ('withdrawal', 'over_withdrawal')) |                              |
| `description`     | `TEXT`          | NULL                                                        | Optional note                |
| `transaction_ref` | `TEXT`          | NULL                                                        | Optional external ref        |
| `withdrawn_at`    | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()                                     | When the withdrawal happened |
| `created_at`      | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()                                     |                              |
| `updated_at`      | `TIMESTAMPTZ`   | NOT NULL                                                    |                              |

**Indexes:**

- `group_uuid` (for listing withdrawals per group)
- `withdrawn_at` (for chronological queries)
- `member_uuid` (for listing withdrawals by member)

**Design notes:**

- Split from `group_ledger_entries` for cleaner separation.
- `over_withdrawal` type triggers borrowing allocation at service layer.

---

## Table: group_goals

Group-level financial goals.

| Column               | Type            | Constraints                         | Notes                             |
| -------------------- | --------------- | ----------------------------------- | --------------------------------- |
| `uuid`               | `UUID`          | PK                                  |                                   |
| `group_uuid`         | `UUID`          | FK → groups.uuid, NOT NULL          |                                   |
| `name`               | `TEXT`          | NOT NULL                            |                                   |
| `target_amount`      | `DECIMAL(19,2)` | NOT NULL, CHECK (target_amount > 0) |                                   |
| `implemented_amount` | `DECIMAL(19,2)` | NOT NULL, DEFAULT 0                 | Total consumed by implementations |
| `reserved_total`     | `DECIMAL(19,2)` | NOT NULL, DEFAULT 0                 | Total reserved across all members |
| `is_completed`       | `BOOLEAN`       | NOT NULL, DEFAULT false             | Goal completed flag               |
| `deadline`           | `TIMESTAMPTZ`   | NULL                                | Optional target date              |
| `created_at`         | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()             |                                   |
| `updated_at`         | `TIMESTAMPTZ`   | NOT NULL                            |                                   |
| `is_viable`          | `BOOLEAN`       | NOT NULL, DEFAULT true              | FR7a                              |

**Indexes:**

- `group_uuid` (for filtering by group)

**Design notes:**

- `reserved_total` tracks total money reserved for this goal across all members.
- `implemented_amount` tracks total consumed from reserved money.
- `progress = implemented_amount / target_amount`.
- Reserved total grows on reserve events, decreases when excess is unblocked.

---

## Table: group_goal_reservations

Money reserved from members for a specific group goal.

| Column            | Type            | Constraints                       | Notes                              |
| ----------------- | --------------- | --------------------------------- | ---------------------------------- |
| `uuid`            | `UUID`          | PK                                |                                    |
| `group_goal_uuid` | `UUID`          | FK → group_goals.uuid, NOT NULL   |                                    |
| `group_uuid`      | `UUID`          | FK → groups.uuid, NOT NULL        | Denormalized for query efficiency  |
| `member_uuid`     | `UUID`          | FK → group_members.uuid, NOT NULL | Member from whom reserve was taken |
| `amount`          | `DECIMAL(19,2)` | NOT NULL, CHECK (amount > 0)      | Amount reserved from this member   |
| `transaction_ref` | `TEXT`          | NULL                              | Optional external ref              |
| `reserved_at`     | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()           |                                    |
| `created_at`      | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()           |                                    |

**Indexes:**

- `group_goal_uuid` (for listing reservations per goal)
- `group_uuid` (for listing reservations per group)
- `member_uuid` (for listing reservations by member)

**Design notes:**

- Renamed from `reserves` → `group_goal_reservations`.
- Each row tracks how much was reserved from which member.
- `transaction_ref` enables tracing reserve transactions to external sources (e.g., bank transfers).
- Enables transparent redistribution when a member's lending capacity is exceeded.

---

## Table: group_goal_implementations

Records of goal implementation — consumes money from `group_goal_reservations`.

| Column            | Type            | Constraints                       | Notes                              |
| ----------------- | --------------- | --------------------------------- | ---------------------------------- |
| `uuid`            | `UUID`          | PK                                |                                    |
| `group_goal_uuid` | `UUID`          | FK → group_goals.uuid, NOT NULL   | Goal being implemented             |
| `group_uuid`      | `UUID`          | FK → groups.uuid, NOT NULL        |                                    |
| `member_uuid`     | `UUID`          | FK → group_members.uuid, NOT NULL | Admin who performed implementation |
| `amount`          | `DECIMAL(19,2)` | NOT NULL, CHECK (amount > 0)      | Amount consumed from reserves      |
| `transaction_ref` | `TEXT`          | NULL                              | Optional external ref              |
| `implemented_at`  | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()           | When implementation occurred       |
| `created_at`      | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()           |                                    |

**Indexes:**

- `group_goal_uuid` (for listing implementations per goal)
- `group_uuid` (for listing implementations per group)
- `member_uuid` (for listing implementations by member)

**Design notes:**

- Implementation only possible when `reserved_total > 0` for the goal.
- If `amount` < reserved remaining, excess is unblocked and becomes available for withdrawal.
- Consumes from `group_goal_reservations` proportionally at service layer.
- Admin-only action (enforced by `can_implement_goal` permission).

---

## Table: over_withdrawal_borrowings

Tracks borrowing obligations from over-withdrawal events. Each row = one lender's slice of the over-withdrawal.

| Column                 | Type            | Constraints                                                   | Notes                            |
| ---------------------- | --------------- | ------------------------------------------------------------- | -------------------------------- |
| `uuid`                 | `UUID`          | PK                                                            |                                  |
| `group_uuid`           | `UUID`          | FK → groups.uuid, NOT NULL                                    |                                  |
| `borrower_member_uuid` | `UUID`          | FK → group_members.uuid, NOT NULL                             | Member who over-withdrew         |
| `lender_member_uuid`   | `UUID`          | FK → group_members.uuid, NOT NULL                             | Member who funded the excess     |
| `withdrawal_uuid`      | `UUID`          | FK → group_withdrawals.uuid, NOT NULL                         | The over-withdrawal entry        |
| `amount`               | `DECIMAL(19,2)` | NOT NULL, CHECK (amount > 0)                                  | Amount borrowed from this lender |
| `status`               | `TEXT`          | NOT NULL, CHECK (status IN ('pending', 'partial', 'settled')) |                                  |
| `returned_at`          | `TIMESTAMPTZ`   | NULL                                                          | When borrower returned funds to group |
| `created_at`           | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()                                       |                                  |
| `updated_at`           | `TIMESTAMPTZ`   | NOT NULL                                                      |                                  |
| `settled_at`           | `TIMESTAMPTZ`   | NULL                                                          | When fully repaid to lender      |

**Indexes:**

- `group_uuid` (for filtering by group)
- `borrower_member_uuid` (for filtering by borrower)
- `lender_member_uuid` (for filtering by lender)
- `withdrawal_uuid` (for linking back to withdrawal)
- `status` (for filtering by settlement status)

**Design notes:**

- Renamed from `obligations` → `over_withdrawal_borrowings` (purpose-clear).
- `withdrawal_uuid` directly references the `group_withdrawals` entry (replaces vague `source_entry_uuid`).
- Granular per-lender rows allow partial settlement tracking.

---

## Table: over_withdrawal_settlements

Tracks repayments against over-withdrawal borrowings.

| Column            | Type            | Constraints                                    | Notes                 |
| ----------------- | --------------- | ---------------------------------------------- | --------------------- |
| `uuid`            | `UUID`          | PK                                             |                       |
| `borrowing_uuid`  | `UUID`          | FK → over_withdrawal_borrowings.uuid, NOT NULL |                       |
| `amount`          | `DECIMAL(19,2)` | NOT NULL, CHECK (amount > 0)                   | Amount repaid         |
| `paid_at`         | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()                        |                       |
| `transaction_ref` | `TEXT`          | NULL                                           | Optional external ref |
| `created_at`      | `TIMESTAMPTZ`   | NOT NULL, DEFAULT now()                        |                       |

**Indexes:**

- `borrowing_uuid` (for listing settlements per borrowing)

**Design notes:**

- Renamed from `obligation_settlements` → `over_withdrawal_settlements`.

---

## Table: audit_events

Immutable event log for all financial state changes.

| Column        | Type          | Constraints             | Notes                                                              |
| ------------- | ------------- | ----------------------- | ------------------------------------------------------------------ |
| `uuid`        | `UUID`        | PK                      |                                                                    |
| `group_uuid`  | `UUID`        | FK → groups.uuid, NULL  | NULL for personal events                                           |
| `user_uuid`   | `UUID`        | FK → users.uuid, NULL   | Actor who triggered event                                          |
| `event_type`  | `TEXT`        | NOT NULL                | e.g. DEPOSIT, WITHDRAWAL, OVER_WITHDRAWAL, RESERVE, IMPLEMENT_GOAL |
| `entity_type` | `TEXT`        | NOT NULL                | e.g. group_deposit, over_withdrawal_borrowing, group_goal          |
| `entity_uuid` | `UUID`        | NOT NULL                | Primary key of affected entity                                     |
| `trace_id`    | `TEXT`        | NOT NULL                | Correlation ID for client/server tracing                           |
| `payload`     | `JSONB`       | NOT NULL                | Full event data including inputs, outputs, explainability          |
| `created_at`  | `TIMESTAMPTZ` | NOT NULL, DEFAULT now() |                                                                    |

**Indexes:**

- `group_uuid` (for filtering by group)
- `entity_uuid` (for finding events by entity)
- `trace_id` (for trace correlation)
- `created_at` (for chronological queries)
- `event_type` (for filtering by event type)

**Design notes:**

- `event_type` aligned to renamed tables (e.g., OVER_WITHDRAWAL_BORROWING, OVER_WITHDRAWAL_SETTLEMENT).
- `payload` contains full explainability for group rule outcomes (FR43, FR44).

---

## Derived State (Application Layer — Not Stored Directly)

### Per-Member Net Balance

```
net_balance = total_deposits - total_withdrawals - borrowing_allocations + returned_withdrawals
```

FR31: Borrowing allocations excluded because excess comes from over-withdrawal, not group funds.

### Per-Member Lending Capacity

```
lending_capacity = net_balance - total_reserved_for_member
```

FR33: Reserved money reduces available lending capacity.

### Group Available Funds

```
available_group_funds = total_member_deposits - total_reserved_for_goals - total_withdrawn
```

FR13 / NFR13 invariant. `total_withdrawn` is gross (including borrowed amounts).

---

## Open Questions / Discussion Points

~~1. **Personal goal reservations** — Does the `transaction_ref` cover the transfer use case, or do we need a separate "source account" field?~~ — `transaction_ref` is sufficient.

~~2. **group_policy_permissions** — The JSON structure is flexible but less typed. Should we define a JSON schema for validation, or keep it freeform with application-layer parsing?~~ — Dropped for MVP. `can_<action>` columns in `group_member_permissions` suffice.

3. **Permission propagation** — When a member is re-added after removal, should their previous permission set be restored, or should they get defaults again? — **Restored.** Permission set preserved on rejoin.

4. **Creator self-revocation** — If the creator revokes their own admin access, who becomes the fallback admin? Should the system require at least one admin at all times? — **Creator cannot revoke their own admin access.** System enforces at least one admin (the creator).
