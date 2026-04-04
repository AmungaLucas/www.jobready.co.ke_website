---
Task ID: 1
Agent: Main
Task: Fix M-Pesa payment race condition, link walk-in orders, add My Orders to dashboard

Work Log:
- Analyzed the complete codebase: M-Pesa payment flow (stk-push, stk-query, callback), CV services, user auth (register, OTP, Google), dashboard sidebar/layout
- Identified root cause of payment failure: stk-query/route.js was marking "The transaction is still under processing" (resultCode 4999) as FAILED instead of PENDING
- Fixed stk-query status detection: Added keyword matching for "processing", "pending", "still", "timeout" to correctly classify as PENDING
- Fixed stk-query DB update logic: Only update DB for definitive results (SUCCESS/CANCELLED/TIMEOUT), skip "FAILED" for still-processing transactions
- Fixed OrderModal polling: Separated TIMEOUT handling, only show error for definitive failures
- Fixed verify-otp route: Added order linking when phone user is found/created
- Fixed register route: Added order linking by email and phone in transaction
- Fixed auth.js Google OAuth: Added order linking on sign-in
- Fixed AppSidebar: Added "My Orders" nav item for job seekers
- Fixed DashboardShell: Changed hardcoded role to use session.user.role from JWT
- Fixed orders/my API: Added OR conditions to match by email/phone for unlinked walk-in orders
- Fixed stuck payment cmnkm6m03000ii8041gxa34si: Queried Safaricom (confirmed SUCCESS), updated payment to SUCCESS and order to PAID
- Fixed Basic CV price from KSh 1 (test) to KSh 500

Stage Summary:
- 8 files modified: stk-query/route.js, verify-otp/route.js, register/route.js, auth.js, AppSidebar.jsx, DashboardShell.jsx, orders/my/route.js, OrderModal.jsx
- 1 DB fix: payment status corrected from FAILED to SUCCESS, order status from PENDING/UNPAID to PAID
- 1 DB fix: Basic CV service tier price corrected from 1 to 500
- Key insight: Safaricom resultCode 4999 with "still under processing" was being treated as FAILED by the default case in the switch statement
