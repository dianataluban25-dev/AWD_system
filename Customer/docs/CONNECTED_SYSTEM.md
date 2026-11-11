# Connected customer and admin

The operational server is `backend/`. Both frontends use its `/api` routes and
database. The imported project at `admin-web/ADMINSIDE/HAKDOG` supplies the React
admin source; it does not run a second copy of the order database.

## Run locally

Start MySQL in XAMPP. From `C:\EELE_MOB_APP` run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-connected-system.ps1
```

On first run, enter the admin name and a password of at least 12 characters.
The temporary account email is `admin@elee.test`, as requested. No default
password is embedded in the application. Change the email later in Settings
using the current password.

- Admin: `http://localhost:8000/admin`
- Customer: `http://localhost:8000/customer/`
- Phone/QR sharing has not been enabled. The local server binds to 127.0.0.1.
  Approval is required before exposing the preview to the Wi-Fi network.
  LAN URLs are local previews, not public hosting.

After changing frontend source, rebuild:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\build-connected-system.ps1
```

For Android development only, supply the API URL explicitly:
`flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8000/api`.
The QR customer experience is the website; no APK installation is required.

## Data and queue rules

Add actual products from Admin > Products. No sample catalog is automatically
loaded by the customer or seeded by the default database seeder. The explicit
CatalogSeeder is retained only for development demonstrations and tests.
Older existing seeded products in the local database are preserved; review
prices and stock in Products before using them for actual customers.

Orders use server prices, stock checks, delivery fee and idempotency keys.
Pickup and delivery share a FIFO queue sorted by checkout time, with the
database ID breaking ties. Pending, Processing and Ready orders remain active;
Completed and Cancelled orders leave the queue. Queue number identifies the
order; queue position changes as earlier orders leave.

Staff can start processing, mark the matching pickup/delivery ready status,
record actual cash receipt, complete paid pickup orders, or cancel unpaid orders.
Cancellation restores reserved stock exactly once. COD payment confirmation
also confirms delivery and completes the order. Customer status and queue
updates run automatically every 10 seconds while the page is active. Admin
updates pause during product editing, order dialogs and settings forms.
The customer catalog reloads from the shared product API every 10 seconds.
Checkout reloads public store settings every 10 seconds: delivery fee,
pickup/delivery availability and pickup contact details. Disabled fulfillment
is also rejected by the server before stock is deducted. Public store metadata
is available at `/api/store`; internal alert settings are not exposed.
Admin, customer queue and receipt pages update without a Refresh button.
Failed API reads show an error with Retry, not sample data.

Dashboard, customers, payments, receipts and inventory review are derived from
actual records. Recommendations use local item-item collaborative filtering
trained from completed, paid order history. Staff train/retrain on the
Recommendations page. Explicit per-product mappings are a labelled fallback.
See AI_RECOMMENDATIONS.md for the algorithm and dataset requirements.
Original HTML layouts and CSS are used by the active React frontend. Legacy
scripts and sample table rows are stripped from the build; live records,
filters, pagination and actions are rendered into the original layouts.
The old imported fixed-login route was removed.

Staff and admin use the same supplied web frontend, as confirmed by the user.
Both can sign in and manage order operations; only admins can change store
settings. Staff can read alert preferences and edit recommendation mappings.

## Checks

Delivery schedule: Sunday checkout remains open. Sunday delivery orders store
Monday as `delivery_not_before`, using Asia/Manila time. The public store API
provides a no-Sunday-delivery notice for checkout, and staff order details show
the saved date. Delivery completion (including COD collection that completes
delivery) is blocked on Sundays. Pickup is unaffected.

Backend integration tests cover authentication/roles, shared catalog and price
updates, checkout, FIFO queue, pickup/delivery statuses, payment restrictions,
cancellation and stock restoration, customer-token isolation, settings and
temporary email updates. Tests use disposable SQLite databases, not live orders.
Frontend API tests cover authenticated pagination and validation errors.
Flutter tests cover customer flows, queue, receipts, layouts and missing API
configuration without demo fallback.
