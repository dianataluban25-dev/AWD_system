# ELEE API contract — implemented phase 1

Local base URL: `http://localhost:8000/api`. Send `Accept: application/json`; JSON writes also send `Content-Type: application/json`. Money is PHP, calculated in integer centavos. Display prices may include fractional pesos; Flutter now preserves these prices in live mode. Product collections also return `store.delivery_fee_centavos` so checkout can display the configured fee.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/products?search=Hammer&category=Tools&page=1` | Public | Active products, 30 per page |
| POST | `/orders` | Public + Idempotency-Key | Checkout |
| GET | `/orders/{order_number}` | Customer receipt bearer token | Receipt/current status |
| POST | `/staff/login` | Staff email/password | Issue staff token |
| POST | `/staff/logout` | Staff token | Revoke current token |
| POST | `/staff/products` | Staff token | Create product |
| GET | `/staff/orders?page=1` | Staff token | All orders, newest first, 30 per page |
| PATCH | `/staff/orders/{order_number}/paid` | Staff token | Confirm cash collection |
| PATCH | `/staff/orders/{order_number}/complete` | Staff token | Complete paid order |

Lists return `{ "data": [...], "links": {...}, "meta": {...} }`. Follow `links.next` until null. Single resources return `{ "data": {...} }`. Validation errors: HTTP 422 with `message` and `errors`. Other statuses: 401 missing authentication, 403 non-staff, 404 missing/inaccessible receipt, 409 conflicting key/state, 429 rate limit.

Customer checkout also sends optional `expected_total_centavos` (integer), the
total the customer reviewed. A mismatch with current server prices/fees rejects
the checkout with HTTP 422 and preserves stock. The customer must review again.
Pickup completion requires Ready for Pickup; delivery completion requires Ready
for Delivery. COD payment confirmation also completes delivery and requires
delivery readiness. Recording cash-at-store payment can happen before readiness.

## Customer checkout

Generate a random UUID per checkout and send it as `Idempotency-Key`. Preserve the key and payload across timeouts/retries; use a new key only for a new order. Keys are 16–64 letters, digits, hyphens or underscores. Creation returns 201, successful retry returns 200 without a second stock deduction. Changed payload with the same key returns 409. Never use a new key after an ambiguous timeout.

```json
{
  "customer_name": "Juan Dela Cruz",
  "mobile_number": "09123456789",
  "address": "Delivery address",
  "fulfillment_method": "delivery",
  "payment_method": "cash_on_delivery",
  "items": [{ "product_id": 1, "quantity": 2 }]
}
```

Fulfillment: `delivery` or `store_pickup`; payment: `cash_at_store` or `cash_on_delivery`. Pickup requires Cash at Store and may omit address; delivery requires a nonblank address. Phone accepts 10–15 digits and optional leading `+`. Product IDs come from the API, not demo zero IDs. Quantities are positive integers; product IDs cannot repeat.

Response `data` contains `order_number`, customer details, item snapshots (`product_id`, `name`, `unit`, `quantity`, `price`, `line_total`), `subtotal`, `delivery_fee`, `total`, `total_centavos`, `currency`, `payment_status`, `order_status`, `created_at`, nullable `paid_at`. Top-level `access_token` is returned on creation and valid retries. Save it privately with the number; never put it in URLs or logs. Refresh with:

```http
GET /api/orders/ELEE-<server-issued-id>
Authorization: Bearer <customer-access-token>
Accept: application/json
```

The server creates `Unpaid` / `Pending`, assigns identifiers, and ignores client prices, totals and status fields. Stock is reserved atomically. Local demo PDFs only become store receipts after the client actually submits to this API.

## React staff integration

Admin sign-in uses POST `/admin/login` with email/password and requires a database
account with `is_staff` and `is_admin`. Create it interactively with
`php artisan elee:create-staff admin@elee.test --admin` (no fixed password).
The integrated React admin is served at `/admin` from the shared backend.

GET `/staff/products` includes hidden products; PATCH `/staff/products/{id}`
updates validated product fields. GET `/staff/orders` is oldest first and accepts
`active=1`, `status`, and `search` filters. All list endpoints are paginated.

Every order response includes stable `queue_number`, nullable `queue_position`,
and nullable `orders_ahead`. Active statuses are Pending, Processing, Ready for
Pickup and Ready for Delivery; pickup and delivery share one FIFO queue.
PATCH `/staff/orders/{number}/status` accepts a `status` body. Transitions are
Pending → Processing → Ready for the order's fulfillment method. Cancellation
of unpaid active orders restores stock once; terminal orders cannot be reopened.

GET `/staff/me` returns the account. PATCH `/staff/account` accepts name, email
and current_password to update the temporary email. GET/PATCH `/staff/settings`
are admin-only; the update accepts delivery_fee_centavos. New checkouts use the
current fee; existing order snapshots stay unchanged.

POST `/staff/login` with `{ "email": "staff@example.com", "password": "your-password" }`. Response: `{ "token": "...", "user": { "id": 1, "name": "Store Staff", "email": "staff@example.com" } }`. Send `Authorization: Bearer <token>` on staff calls. Tokens expire after eight hours; logout returns 204. No public staff registration; use `php artisan elee:create-staff`.

Product creation: `{ "sku": "HAMMER-02", "name": "Claw Hammer", "category": "Tools", "unit": "piece", "price_centavos": 7000, "stock": 24 }`. Optional fields: `description`, `image_url`, `is_active`.

PATCH `/staff/orders/{number}/paid` has no required body. It records staff identity and payment time once. COD becomes `Paid` / `Completed`; Cash at Store becomes `Paid` / `Pending`. PATCH `/staff/orders/{number}/complete` after fulfillment. Completion before payment is rejected; payment retries preserve the original timestamp.

Set browser origins in `FRONTEND_ORIGINS`. Staff tokens must never be embedded in Flutter customer code. Routing and transactions follow [Laravel routing](https://laravel.com/docs/12.x/routing) and [database documentation](https://laravel.com/docs/12.x/database).
