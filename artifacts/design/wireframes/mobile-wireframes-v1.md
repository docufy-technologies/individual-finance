# Mobile Wireframes v1, Individual Finance

## WF-01, Personal Home (Action-First)
- Header: Context switch (`Personal | Group`)
- Balance summary card
- Quick stats (income, expense, net)
- **Primary CTA:** `Record Scenario`
- Next-step panel (always visible)
- Bottom nav: Home / Personal / Group / Timeline / Activity

## WF-02, Scenario Launcher
- Intent tiles:
  - Add Income
  - Add Expense
  - Record Lend/Loan
  - Settle Obligation
- Recent actions row
- Quick search for scenario
- Cancel/back action

## WF-03, Personal Entry + Impact Preview
- Step 1: Type (income/expense)
- Step 2: Amount + category
- Step 3: Optional details (`transaction_id`, note)
- **Impact Preview block (before/after)**
- `Confirm & Save` primary button
- Validation inline under fields

## WF-04, Success + Next Step
- Confirmation banner
- Updated balance snapshot
- Recommended next action card
- CTA: `Do Next Step`
- Secondary: `Go to Timeline`

## WF-05, Group Home
- Available group funds card (previously "cash-in-hand")
- Net positions summary
- Recent group events
- **Obligation Command Center snippet**
- Primary CTA: `Record Group Scenario`
- Admin actions (guarded by permission state)

## WF-06, Group Withdrawal + Explainability
- Withdrawal type (standard/emergency)
- Amount input
- **Withdrawal Logic:**
  - User withdraws their own contributed money
  - Over-withdrawal: triggers borrowing allocation from members with positive net balance
  - Formula: `available_group_funds = total_member_deposits - total_reserved_for_goals - total_withdrawn`
- Deterministic preview:
  - before/after
  - borrowing allocation
  - obligation impact
- Confirm action
- Auto-open `Why this happened` drawer after success

## WF-07, Obligations Command Center (Direction 4 module)
- Tabs/chips: Current / Upcoming / Overdue
- Obligation cards:
  - who owes who
  - amount
  - due status
- Quick action: `Settle`
- Empty state: “No active obligations”

## WF-08, Explainability Drawer
- Rule applied
- Inputs
- Output allocation
- Correlation ID
- Link to full trace
- Copy explanation action

## WF-09, Audit Timeline
- Chronological list
- Event filters
- Open trace details
- Error/reconciliation markers

## WF-10, Admin Guarded Action (Goal Implementation)
- Goal selector
- Source selector
- Impact preview
- Permission message (if denied)
- Confirm with reasoned audit copy

---

## WF-17, Group Members Management
- Member list with role badges
- Invite action:
  - Email search
  - Generate invitation link
- Pending invitations status
- Remove member (with confirmation)

## WF-18, Policy-Based Access Control (PBAC)
- Policy list (reserve, implement, withdraw, manage members)
- Policy editor:
  - Select action
  - Choose allowed roles/members
- Preview of permissions

---

## WF-11, Error Recovery, Transaction Save Failure
- Persistent error banner with plain-language message
- Reason code displayed under message
- Retry CTA: `Try Again`
- Safe secondary action: `Save Draft`
- Context reminder: preview remains visible, no data loss

## WF-12, Retry Flow, Group Computation Timeout
- Loading skeleton transitions to timeout state
- Message: computation taking longer than expected
- Actions:
  - `Retry Computation`
  - `Edit Inputs`
- Diagnostic hint for support (optional correlation ref)

## WF-13, Permission Denied, Admin-Only Action
- Attempted action remains visible but disabled after denial
- Clear denial card:
  - human-readable reason
  - policy/role source
  - reason code
- Alternative CTA: `Request Admin Help`

## WF-14, No Goal Exists, Implementation Blocked
- Goal selector empty state with explanation
- Primary CTA replaced by `Create Goal`
- Secondary: `Back to Group Home`
- Inline note: implementation unavailable until goal exists

## WF-15, Missing Trace Segment, Support View
- Trace timeline shows gap marker
- Warning card: incomplete trace detected
- Actions:
  - `Refresh Trace`
  - `Report Issue`
- Display available segments with timestamps for partial investigation

## WF-16, Network Offline / Reconnect State
- Top persistent offline indicator
- Money-impacting actions disabled with explanation
- Queue-friendly actions allowed only where safe
- Reconnect CTA: `Retry Connection`
- On reconnect: sync confirmation + updated next-step card

## Notes for Implementation
- Use shadcn components first for all primitives.
- Use Magic MCP to source/adapt prebuilt composites before custom build.
- Keep mobile-first layout and WCAG AA requirements across all wireframes.
