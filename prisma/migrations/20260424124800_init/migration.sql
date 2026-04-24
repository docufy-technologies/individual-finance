-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "users" (
    "uuid" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "password_hash" TEXT,
    "income_categories" TEXT NOT NULL DEFAULT '',
    "expense_categories" TEXT NOT NULL DEFAULT '',
    "goal_categories" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_viable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "groups" (
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "creator_uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_viable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "group_members" (
    "uuid" UUID NOT NULL,
    "group_uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_viable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "group_member_permissions" (
    "uuid" UUID NOT NULL,
    "member_uuid" UUID NOT NULL,
    "group_uuid" UUID NOT NULL,
    "can_reserve_for_goal" BOOLEAN NOT NULL DEFAULT false,
    "can_implement_goal" BOOLEAN NOT NULL DEFAULT false,
    "can_update_permissions" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "group_member_permissions_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "group_invitations" (
    "uuid" UUID NOT NULL,
    "group_uuid" UUID NOT NULL,
    "invited_email" TEXT NOT NULL,
    "invitation_code" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "accepted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_uuid" UUID NOT NULL,

    CONSTRAINT "group_invitations_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "personal_incomes" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(19,2) NOT NULL,
    "description" TEXT,
    "transaction_ref" TEXT,
    "income_date" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "personal_incomes_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "personal_expenses" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(19,2) NOT NULL,
    "description" TEXT,
    "transaction_ref" TEXT,
    "expense_date" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "personal_expenses_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "personal_goals" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "target_amount" DECIMAL(19,2) NOT NULL,
    "implemented_amount" DECIMAL(19,2) NOT NULL DEFAULT 0,
    "reserved_total" DECIMAL(19,2) NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "deadline" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_viable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "personal_goals_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "personal_goal_reservations" (
    "uuid" UUID NOT NULL,
    "goal_uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "amount" DECIMAL(19,2) NOT NULL,
    "transaction_ref" TEXT,
    "reserved_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_goal_reservations_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "personal_goal_implementations" (
    "uuid" UUID NOT NULL,
    "goal_uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "amount" DECIMAL(19,2) NOT NULL,
    "transaction_ref" TEXT,
    "implemented_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_goal_implementations_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "personal_loans" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "lender_description" TEXT NOT NULL,
    "principal_amount" DECIMAL(19,2) NOT NULL,
    "interest_rate" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_at" TIMESTAMPTZ(6),
    "status" TEXT NOT NULL,
    "transaction_ref" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_viable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "personal_loans_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "personal_loan_repayments" (
    "uuid" UUID NOT NULL,
    "loan_uuid" UUID NOT NULL,
    "amount" DECIMAL(19,2) NOT NULL,
    "paid_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_ref" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_loan_repayments_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "personal_lends" (
    "uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "borrower_description" TEXT NOT NULL,
    "principal_amount" DECIMAL(19,2) NOT NULL,
    "interest_rate" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_at" TIMESTAMPTZ(6),
    "status" TEXT NOT NULL,
    "transaction_ref" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_viable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "personal_lends_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "personal_lend_repayments" (
    "uuid" UUID NOT NULL,
    "lend_uuid" UUID NOT NULL,
    "amount" DECIMAL(19,2) NOT NULL,
    "paid_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_ref" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personal_lend_repayments_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "group_deposits" (
    "uuid" UUID NOT NULL,
    "group_uuid" UUID NOT NULL,
    "member_uuid" UUID NOT NULL,
    "amount" DECIMAL(19,2) NOT NULL,
    "description" TEXT,
    "transaction_ref" TEXT,
    "deposited_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "group_deposits_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "group_withdrawals" (
    "uuid" UUID NOT NULL,
    "group_uuid" UUID NOT NULL,
    "member_uuid" UUID NOT NULL,
    "amount" DECIMAL(19,2) NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "transaction_ref" TEXT,
    "withdrawn_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "group_withdrawals_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "group_goals" (
    "uuid" UUID NOT NULL,
    "group_uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "target_amount" DECIMAL(19,2) NOT NULL,
    "implemented_amount" DECIMAL(19,2) NOT NULL DEFAULT 0,
    "reserved_total" DECIMAL(19,2) NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "deadline" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "is_viable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "group_goals_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "group_goal_reservations" (
    "uuid" UUID NOT NULL,
    "group_goal_uuid" UUID NOT NULL,
    "group_uuid" UUID NOT NULL,
    "member_uuid" UUID NOT NULL,
    "amount" DECIMAL(19,2) NOT NULL,
    "transaction_ref" TEXT,
    "reserved_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_goal_reservations_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "group_goal_implementations" (
    "uuid" UUID NOT NULL,
    "group_goal_uuid" UUID NOT NULL,
    "group_uuid" UUID NOT NULL,
    "member_uuid" UUID NOT NULL,
    "amount" DECIMAL(19,2) NOT NULL,
    "transaction_ref" TEXT,
    "implemented_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_goal_implementations_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "over_withdrawal_borrowings" (
    "uuid" UUID NOT NULL,
    "group_uuid" UUID NOT NULL,
    "borrower_member_uuid" UUID NOT NULL,
    "lender_member_uuid" UUID NOT NULL,
    "withdrawal_uuid" UUID NOT NULL,
    "amount" DECIMAL(19,2) NOT NULL,
    "status" TEXT NOT NULL,
    "returned_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "settled_at" TIMESTAMPTZ(6),

    CONSTRAINT "over_withdrawal_borrowings_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "over_withdrawal_settlements" (
    "uuid" UUID NOT NULL,
    "borrowing_uuid" UUID NOT NULL,
    "amount" DECIMAL(19,2) NOT NULL,
    "paid_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_ref" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "over_withdrawal_settlements_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "uuid" UUID NOT NULL,
    "group_uuid" UUID,
    "user_uuid" UUID,
    "event_type" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_uuid" UUID NOT NULL,
    "trace_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_uuid_idx" ON "refresh_tokens"("user_uuid");

-- CreateIndex
CREATE INDEX "groups_creator_uuid_idx" ON "groups"("creator_uuid");

-- CreateIndex
CREATE INDEX "group_members_group_uuid_idx" ON "group_members"("group_uuid");

-- CreateIndex
CREATE INDEX "group_members_user_uuid_idx" ON "group_members"("user_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "group_members_group_uuid_user_uuid_key" ON "group_members"("group_uuid", "user_uuid");

-- CreateIndex
CREATE INDEX "group_member_permissions_member_uuid_idx" ON "group_member_permissions"("member_uuid");

-- CreateIndex
CREATE INDEX "group_member_permissions_group_uuid_idx" ON "group_member_permissions"("group_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "group_member_permissions_member_uuid_group_uuid_key" ON "group_member_permissions"("member_uuid", "group_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "group_invitations_invitation_code_key" ON "group_invitations"("invitation_code");

-- CreateIndex
CREATE INDEX "group_invitations_group_uuid_idx" ON "group_invitations"("group_uuid");

-- CreateIndex
CREATE INDEX "personal_incomes_user_uuid_idx" ON "personal_incomes"("user_uuid");

-- CreateIndex
CREATE INDEX "personal_incomes_income_date_idx" ON "personal_incomes"("income_date");

-- CreateIndex
CREATE INDEX "personal_expenses_user_uuid_idx" ON "personal_expenses"("user_uuid");

-- CreateIndex
CREATE INDEX "personal_expenses_expense_date_idx" ON "personal_expenses"("expense_date");

-- CreateIndex
CREATE INDEX "personal_goals_user_uuid_idx" ON "personal_goals"("user_uuid");

-- CreateIndex
CREATE INDEX "personal_goal_reservations_goal_uuid_idx" ON "personal_goal_reservations"("goal_uuid");

-- CreateIndex
CREATE INDEX "personal_goal_reservations_user_uuid_idx" ON "personal_goal_reservations"("user_uuid");

-- CreateIndex
CREATE INDEX "personal_goal_implementations_goal_uuid_idx" ON "personal_goal_implementations"("goal_uuid");

-- CreateIndex
CREATE INDEX "personal_goal_implementations_user_uuid_idx" ON "personal_goal_implementations"("user_uuid");

-- CreateIndex
CREATE INDEX "personal_loans_user_uuid_idx" ON "personal_loans"("user_uuid");

-- CreateIndex
CREATE INDEX "personal_loans_status_idx" ON "personal_loans"("status");

-- CreateIndex
CREATE INDEX "personal_loan_repayments_loan_uuid_idx" ON "personal_loan_repayments"("loan_uuid");

-- CreateIndex
CREATE INDEX "personal_lends_user_uuid_idx" ON "personal_lends"("user_uuid");

-- CreateIndex
CREATE INDEX "personal_lends_status_idx" ON "personal_lends"("status");

-- CreateIndex
CREATE INDEX "personal_lend_repayments_lend_uuid_idx" ON "personal_lend_repayments"("lend_uuid");

-- CreateIndex
CREATE INDEX "group_deposits_group_uuid_idx" ON "group_deposits"("group_uuid");

-- CreateIndex
CREATE INDEX "group_deposits_deposited_at_idx" ON "group_deposits"("deposited_at");

-- CreateIndex
CREATE INDEX "group_deposits_member_uuid_idx" ON "group_deposits"("member_uuid");

-- CreateIndex
CREATE INDEX "group_withdrawals_group_uuid_idx" ON "group_withdrawals"("group_uuid");

-- CreateIndex
CREATE INDEX "group_withdrawals_withdrawn_at_idx" ON "group_withdrawals"("withdrawn_at");

-- CreateIndex
CREATE INDEX "group_withdrawals_member_uuid_idx" ON "group_withdrawals"("member_uuid");

-- CreateIndex
CREATE INDEX "group_goals_group_uuid_idx" ON "group_goals"("group_uuid");

-- CreateIndex
CREATE INDEX "group_goal_reservations_group_goal_uuid_idx" ON "group_goal_reservations"("group_goal_uuid");

-- CreateIndex
CREATE INDEX "group_goal_reservations_group_uuid_idx" ON "group_goal_reservations"("group_uuid");

-- CreateIndex
CREATE INDEX "group_goal_reservations_member_uuid_idx" ON "group_goal_reservations"("member_uuid");

-- CreateIndex
CREATE INDEX "group_goal_implementations_group_goal_uuid_idx" ON "group_goal_implementations"("group_goal_uuid");

-- CreateIndex
CREATE INDEX "group_goal_implementations_group_uuid_idx" ON "group_goal_implementations"("group_uuid");

-- CreateIndex
CREATE INDEX "group_goal_implementations_member_uuid_idx" ON "group_goal_implementations"("member_uuid");

-- CreateIndex
CREATE INDEX "over_withdrawal_borrowings_group_uuid_idx" ON "over_withdrawal_borrowings"("group_uuid");

-- CreateIndex
CREATE INDEX "over_withdrawal_borrowings_borrower_member_uuid_idx" ON "over_withdrawal_borrowings"("borrower_member_uuid");

-- CreateIndex
CREATE INDEX "over_withdrawal_borrowings_lender_member_uuid_idx" ON "over_withdrawal_borrowings"("lender_member_uuid");

-- CreateIndex
CREATE INDEX "over_withdrawal_borrowings_withdrawal_uuid_idx" ON "over_withdrawal_borrowings"("withdrawal_uuid");

-- CreateIndex
CREATE INDEX "over_withdrawal_borrowings_status_idx" ON "over_withdrawal_borrowings"("status");

-- CreateIndex
CREATE INDEX "over_withdrawal_settlements_borrowing_uuid_idx" ON "over_withdrawal_settlements"("borrowing_uuid");

-- CreateIndex
CREATE INDEX "audit_events_group_uuid_idx" ON "audit_events"("group_uuid");

-- CreateIndex
CREATE INDEX "audit_events_entity_uuid_idx" ON "audit_events"("entity_uuid");

-- CreateIndex
CREATE INDEX "audit_events_trace_id_idx" ON "audit_events"("trace_id");

-- CreateIndex
CREATE INDEX "audit_events_created_at_idx" ON "audit_events"("created_at");

-- CreateIndex
CREATE INDEX "audit_events_event_type_idx" ON "audit_events"("event_type");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_creator_uuid_fkey" FOREIGN KEY ("creator_uuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_uuid_fkey" FOREIGN KEY ("group_uuid") REFERENCES "groups"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_member_permissions" ADD CONSTRAINT "group_member_permissions_group_uuid_fkey" FOREIGN KEY ("group_uuid") REFERENCES "groups"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_member_permissions" ADD CONSTRAINT "group_member_permissions_member_uuid_fkey" FOREIGN KEY ("member_uuid") REFERENCES "group_members"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_invitations" ADD CONSTRAINT "group_invitations_creator_uuid_fkey" FOREIGN KEY ("creator_uuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_invitations" ADD CONSTRAINT "group_invitations_group_uuid_fkey" FOREIGN KEY ("group_uuid") REFERENCES "groups"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_incomes" ADD CONSTRAINT "personal_incomes_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_expenses" ADD CONSTRAINT "personal_expenses_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_goals" ADD CONSTRAINT "personal_goals_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_goal_reservations" ADD CONSTRAINT "personal_goal_reservations_goal_uuid_fkey" FOREIGN KEY ("goal_uuid") REFERENCES "personal_goals"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_goal_reservations" ADD CONSTRAINT "personal_goal_reservations_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_goal_implementations" ADD CONSTRAINT "personal_goal_implementations_goal_uuid_fkey" FOREIGN KEY ("goal_uuid") REFERENCES "personal_goals"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_goal_implementations" ADD CONSTRAINT "personal_goal_implementations_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_loans" ADD CONSTRAINT "personal_loans_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_loan_repayments" ADD CONSTRAINT "personal_loan_repayments_loan_uuid_fkey" FOREIGN KEY ("loan_uuid") REFERENCES "personal_loans"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_lends" ADD CONSTRAINT "personal_lends_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_lend_repayments" ADD CONSTRAINT "personal_lend_repayments_lend_uuid_fkey" FOREIGN KEY ("lend_uuid") REFERENCES "personal_lends"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_deposits" ADD CONSTRAINT "group_deposits_group_uuid_fkey" FOREIGN KEY ("group_uuid") REFERENCES "groups"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_deposits" ADD CONSTRAINT "group_deposits_member_uuid_fkey" FOREIGN KEY ("member_uuid") REFERENCES "group_members"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_withdrawals" ADD CONSTRAINT "group_withdrawals_group_uuid_fkey" FOREIGN KEY ("group_uuid") REFERENCES "groups"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_withdrawals" ADD CONSTRAINT "group_withdrawals_member_uuid_fkey" FOREIGN KEY ("member_uuid") REFERENCES "group_members"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_goals" ADD CONSTRAINT "group_goals_group_uuid_fkey" FOREIGN KEY ("group_uuid") REFERENCES "groups"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_goal_reservations" ADD CONSTRAINT "group_goal_reservations_group_uuid_fkey" FOREIGN KEY ("group_uuid") REFERENCES "groups"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_goal_reservations" ADD CONSTRAINT "group_goal_reservations_group_goal_uuid_fkey" FOREIGN KEY ("group_goal_uuid") REFERENCES "group_goals"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_goal_reservations" ADD CONSTRAINT "group_goal_reservations_member_uuid_fkey" FOREIGN KEY ("member_uuid") REFERENCES "group_members"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_goal_implementations" ADD CONSTRAINT "group_goal_implementations_group_uuid_fkey" FOREIGN KEY ("group_uuid") REFERENCES "groups"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_goal_implementations" ADD CONSTRAINT "group_goal_implementations_group_goal_uuid_fkey" FOREIGN KEY ("group_goal_uuid") REFERENCES "group_goals"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_goal_implementations" ADD CONSTRAINT "group_goal_implementations_member_uuid_fkey" FOREIGN KEY ("member_uuid") REFERENCES "group_members"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "over_withdrawal_borrowings" ADD CONSTRAINT "over_withdrawal_borrowings_borrower_member_uuid_fkey" FOREIGN KEY ("borrower_member_uuid") REFERENCES "group_members"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "over_withdrawal_borrowings" ADD CONSTRAINT "over_withdrawal_borrowings_group_uuid_fkey" FOREIGN KEY ("group_uuid") REFERENCES "groups"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "over_withdrawal_borrowings" ADD CONSTRAINT "over_withdrawal_borrowings_lender_member_uuid_fkey" FOREIGN KEY ("lender_member_uuid") REFERENCES "group_members"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "over_withdrawal_borrowings" ADD CONSTRAINT "over_withdrawal_borrowings_withdrawal_uuid_fkey" FOREIGN KEY ("withdrawal_uuid") REFERENCES "group_withdrawals"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "over_withdrawal_settlements" ADD CONSTRAINT "over_withdrawal_settlements_borrowing_uuid_fkey" FOREIGN KEY ("borrowing_uuid") REFERENCES "over_withdrawal_borrowings"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_group_uuid_fkey" FOREIGN KEY ("group_uuid") REFERENCES "groups"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
