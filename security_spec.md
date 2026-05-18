# Security Specification for Tunex Gaming

## 1. Data Invariants
- A Participation cannot exist without a valid User ID and Tournament ID.
- A Transaction type 'ENTRY_FEE' must result in reduced coins for the user.
- Only Admins can modify 'config' documents.
- Only Admins can create/update 'tournaments'.
- Users cannot change their own 'coins' or 'isAdmin' fields in 'users' collection directly (must happen via server logic or admin).

## 2. The "Dirty Dozen" Payloads (Deny Cases)
1. User trying to set `isAdmin: true` on their own profile.
2. User trying to increment their `coins` directly.
3. User trying to read another user's `transactions`.
4. User trying to update a `tournament` status to 'COMPLETED' (Admin only).
5. User trying to create a `participation` for another user ID.
6. User trying to delete a `transaction` record.
7. User trying to update `config/home` without admin rights.
8. Attacker injecting 5KB string into `tournament.id`.
9. User trying to join a full tournament (joinedSlots >= totalSlots).
10. User trying to join a tournament with zero balance (handled by client, but rules should prevent orphaned writes if possible).
11. Attacker spoofing email in auth but `email_verified` is false.
12. User trying to edit `createdAt` after document creation.

## 3. Test Runner (Draft)
A comprehensive test suite would involve initializing `rules-unit-testing` and verifying these payloads. I will focus on writing the most rigorous rules possible.
