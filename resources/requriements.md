## Personal Finance

Authenticated User can:

1. Add income record
2. Add expense record
3. Add Savings Record (for a goal) (without transaction id)
4. Add Loan records (with interest: default is 0)
   - Loan creation
   - Loan repayment
5. Add Lend records
   - Lend money
   - Receive Money
6. Add Goals (with deadlines)
7. Edit categories for income, expense, goal (goal type).

## Group Finance

Group Finance is a separate entity and SHOULD NOT be mixed with Personal Finance. It has its own set of rules and requirements. The main idea is to have a shared pool of money for a group of users, where they can contribute, withdraw, and reserve money for goals.

1. Add deposit
2. Add withdrawal records
3. reserve for goals
4. add goal implementations
5. the system will calculate cash in hand and cash reserved for goals
6. Users can withdraw money beyond their deposit if the amount is under cash in hand (in that case the system will make them borrow from other users, whose net balance is above 0, and it will be calculated proportionately to their net balance)
7. Users should return the withdrawal and borrowed money before making any deposit.
8. Every user should equalize their deposit amount (which is highest deposit - goal implementation).
9. Users can only withdraw money if their net balance is above 0, and they should return the withdrawn money before making any deposit.
10. Only admin can record goal implementations and the amount should be spitted proportionately to the users' net balance, the system should not consider users who have net balance below 0,
11. Users can only implement goals if their net balance is above 0
12. Only admin can manage users' permissions for group finance (add/remove users, assign admin role)
