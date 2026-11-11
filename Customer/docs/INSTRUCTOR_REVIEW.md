# Instructor review

Local customer: http://127.0.0.1:8000/customer/
Shared staff/admin: http://127.0.0.1:8000/admin

Verified local entry points: customer, admin, product API, store API and shared
font return HTTP 200. Latest checks: 24 backend tests (173 assertions), 76
customer UI/responsive tests, and learned-recommendation/customer-settings tests
passed. Both web builds succeeded.

## Demonstration sequence

1. Sign in with your own admin password. Show the live catalog and store settings.
2. Place a customer pickup order; show its order number in staff Orders and Queue.
3. Move it to Processing, then Ready for Pickup. Show customer status updating.
4. Record cash payment, then complete pickup. Show the receipt and queue advance.
5. Repeat delivery with COD; recording delivery payment completes the order.
6. Cancel an unpaid test order and verify reserved stock is restored once.
7. Show Recommendations: dataset count, training status and fallback configuration.

## AI demonstration prerequisite

The local model was trained on five eligible completed orders on October 16.
The dataset is small; show its current status in the training panel.

Before demonstrating learned suggestions, complete at least three clearly
identified test orders through the normal customer/staff flow. Include at least one order containing multiple products. These orders reserve stock and
appear in reports, so use designated test products/quantities and distinguish
test transactions from real sales. Then click Train / Retrain model and verify
the trained status. Add a trigger product to the customer cart and wait for
catalog update to demonstrate learned recommendations.

The minimum data gate proves the training flow; it does not establish real-world
recommendation quality. Evaluate with a larger dataset before production use.
See AI_RECOMMENDATIONS.md for the algorithm and reference.

## Scope

This is a localhost instructor-review build. A physical phone cannot access
the computer's localhost through its own browser. Phone/QR demonstration requires
a reachable deployment or an explicitly configured testing connection.
Deployment, real phone testing and operational backups remain production steps.

Refresh both browser tabs with Ctrl+F5 before the review and keep the Laravel
server and MySQL running throughout the demo. Do not share admin credentials
in presentation slides or screenshots.
