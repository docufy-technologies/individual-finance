# MVP Wireframe Specification - Individual Finance

## Global Frame

- Top bar: Context switch (`Personal | Group`), global search (desktop), profile.
- Bottom nav (mobile): Home, Personal, Group, Timeline, Activity.
- FAB: `Record Scenario`.
- Right utility panel (desktop): quick explainability + upcoming obligations.

## R-01 `/onboarding/welcome`

**Purpose:** Start fast with correct module mental model.

**Blocks**

1. Hero: “Clarity under pressure”
2. Choice cards:
   - `Start Personal`
   - `Start Group`
3. Trust bullets:
   - “See why balances change”
   - “Track who owes what”
   - “Know what happens next”

**CTA**

- Primary: `Get Started`
- Secondary: `I already have an account`

**States**

- Error: “Could not initialize setup. Try again.”

## R-02 `/personal/dashboard`

**Purpose:** Personal money command center.

**Blocks**

1. Balance summary cards (income, expense, net)
2. Outstanding card (loan/lend remaining)
3. Upcoming commitments list
4. Recent activity feed
5. Quick actions:
   - `Add Income`
   - `Add Expense`
   - `Record Loan`
   - `Record Lend`

**CTA**

- Primary: `Record Scenario`
- Secondary: `View Full Timeline`

**Empty state**

- “No transactions yet. Add your first income or expense.”

**Error state**

- “Could not load personal summary. Retry.”

## R-03 `/personal/transaction/new`

**Purpose:** Fast, low-friction entry.

**Blocks**

1. Transaction type tabs: Income | Expense
2. Amount input
3. Category selector
4. Date + optional `transaction_id`
5. Note field
6. Live impact preview card

**CTA**

- Primary: `Save Transaction`
- Secondary: `Cancel`

**Validation copy**

- “Amount is required.”
- “Choose a category.”

## R-04 `/personal/loan-lend`

**Purpose:** Track informal obligations clearly.

**Blocks**

1. Segment: Loans | Lends
2. Active records table/cards
3. Record detail drawer (original, repaid/received, remaining, due)
4. Action buttons:
   - `Record Repayment`
   - `Record Received`

**CTA**

- Primary: `Create Loan/Lend Record`
- Secondary: `Filter`

**Empty state**

- “No active records. Create one to track repayments.”

## R-05 `/group/home/:groupId`

**Purpose:** Group financial truth at a glance.

**Blocks**

1. Group available funds card (previously "cash-in-hand")
2. Net position snapshot (top owing/top owed)
3. Urgent obligations panel
4. Recent rule-impacting events
5. Admin-only quick actions (if authorized):
   - `Create Goal`
   - `Implement Goal`
   - `Manage Policies`

**CTA**

- Primary: `Record Group Scenario`
- Secondary: `Open Explainability Center`

**Permission state**

- Disabled admin actions show reason tooltip: “Admin permission required.”

## R-06 `/group/withdrawal/new`

**Purpose:** Safe emergency and regular withdrawals.

**Blocks**

1. Scenario selector:
   - Standard Withdrawal
   - Emergency Withdrawal
2. Amount + member context
3. Before/After preview:
   - available group funds before
   - excess borrow amount (triggers borrowing allocation from members with positive net balance)
   - proportional allocation impact
4. Confirmation checkpoint

**Withdrawal Logic**
- User withdraws their own contributed money
- Over-withdrawal: user withdraws more than their contribution → triggers borrowing from other members with positive net balance
- Formula: `available_group_funds = total_member_deposits - total_reserved_for_goals - total_withdrawn`
- `total_withdrawn` is gross amount (including borrowed amounts)

**CTA**

- Primary: `Confirm Withdrawal`
- Secondary: `Edit Amount`

**Critical states**

- Loading: “Computing deterministic allocation...”
- Success: “Withdrawal recorded. Obligations updated.”
- Error: “Could not complete withdrawal. No money state was partially saved.”

## R-07 `/group/goals`

**Purpose:** Goal lifecycle and progress clarity.

**Blocks**

1. Goal cards (target, implemented, progress bar)
2. Goal timeline
3. Reserve status card
4. Admin actions:
   - `Create Goal`
   - `Record Implementation`

**Progress Bar Behavior**
- Reserve events: progress bar moves UPWARDS (money collected/saved)
- Implementation events: progress bar moves DOWNWARDS (money spent)
- If actual implementation < reserved amount, excess is automatically unblocked

**CTA**

- Primary (admin): `Record Implementation`
- Secondary: `View Goal Timeline`

**Empty state**

- "No goals yet. Create your first group goal."

## R-08 `/group/implementation/new`

**Purpose:** Controlled admin action with audit confidence.

**Blocks**

1. Goal selector (required)
2. Implementation amount
3. Source selector (required):
   - Member positive net balance
   - Goal reserve
   - **Note:** One implementation record uses exactly ONE source (never both)
4. Impact preview:
   - member balance impact
   - goal progress impact (moves DOWNWARDS)
   - invariant check status
5. Final confirmation + audit note

**CTA**

- Primary: `Confirm Implementation`
- Secondary: `Back`

**Blocking states**

- No goal: “Implementation is unavailable until at least one goal exists.”
- Unauthorized: “You do not have permission for this action.”

## R-09 `/group/obligations`

**Purpose:** Answer “who owes what” instantly.

**Blocks**

1. Summary chips: Current | Upcoming | Overdue
2. Obligation list with due states
3. Per-item actions:
   - `Settle`
   - `View Why`
4. Bulk filter and sort

**CTA**

- Primary: `Settle Obligation`
- Secondary: `Open Timeline`

**Empty state**

- “No active obligations. You are all clear.”

## R-10 `/group/explainability`

**Purpose:** Explain every rule outcome in plain language.

**Blocks**

1. Search/filter (event type, member, date)
2. Explainability cards
3. Detail drawer sections:
   - Rule applied
   - Inputs
   - Deterministic output
   - Obligations created
   - Correlation ID link

**CTA**

- Primary: `Open Full Trace`
- Secondary: `Copy Explanation`

## R-11 `/group/members`

**Purpose:** Group admin manages membership via email invitation.

**Blocks**

1. Member list with role badges (admin/member)
2. Invite action:
   - Email search/input
   - Generate invitation link
3. Pending invitations status
4. Remove member action (with confirmation)

**CTA**

- Primary: `Send Invitation`
- Secondary: `Manage Policies`

**Empty state**

- "No members yet. Invite people to join your group."

## R-12 `/group/settings/policies`

**Purpose:** Policy-Based Access Control (PBAC) configuration.

**Blocks**

1. Policy list with actions:
   - Reserve for goal
   - Implement goal
   - Manage members
   - Approve withdrawals
2. Policy editor:
   - Select action
   - Choose which roles/members can perform
3. Preview of who can do what

**CTA**

- Primary: `Save Policies`
- Secondary: `Reset to Defaults`

**Empty state**

- "Default policies apply. Customize to restrict specific actions."

## R-11 `/audit/events`

**Purpose:** Immutable event history.

**Blocks**

1. Chronological event table
2. Filters (actor, type, date, status)
3. Event detail pane

**CTA**

- Primary: `Investigate Event`
- Secondary: `Export View`

## R-12 `/audit/trace/:correlationId`

**Purpose:** End-to-end reconstruction for disputes.

**Blocks**

1. Correlation header
2. Step stream:
   - Client step status
   - Server step status
   - timestamps
3. Failure branch marker
4. Resolution notes section

**CTA**

- Primary: `Generate Investigation Summary`
- Secondary: `Back to Events`
