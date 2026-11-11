# ELEE Laravel / MySQL backend — phase 1

Laravel 12 (PHP 8.2+) API shared by the future React staff web and Flutter customer client. Flutter defaults to device-only demo storage and supports live API mode with `API_BASE_URL`. React staff-screen integration belongs to the separate web project.

Implemented: paginated product catalog, staff product creation, transactional checkout and stock reservation, customer receipt lookup, staff login/logout and order list, cash payment confirmation, and fulfillment completion. No default staff passwords or customer registration.

## Local setup (Windows / XAMPP)

Start MySQL in the XAMPP Control Panel. Create a **new** database in phpMyAdmin or a MySQL client:

```sql
CREATE DATABASE elee CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then:

```powershell
cd C:\EELE_MOB_APP\backend
composer install
# Fresh checkout only: keep an existing .env and APP_KEY.
Copy-Item .env.example .env
php artisan key:generate
```

Edit `.env` with your MySQL connection: `DB_CONNECTION=mysql`, `DB_HOST=127.0.0.1`, `DB_PORT=3306`, `DB_DATABASE=elee`, and your `DB_USERNAME` / `DB_PASSWORD`. Root / blank password is only the default local XAMPP example. Use a dedicated user on deployment.

```powershell
php artisan migrate
# Optional illustrative starter catalog matching Flutter's demo:
php artisan db:seed
php artisan elee:create-staff staff@example.com --name="Store Staff"
php artisan serve --host=127.0.0.1 --port=8000
```

The staff command privately prompts for a password of at least 12 characters. Catalog seeding only creates missing SKUs; it does not reset existing prices or stock. No migrations have been run against your normal MySQL database automatically.

Try `Invoke-RestMethod http://127.0.0.1:8000/api/products`. React can use `http://localhost:8000/api`; Android emulator uses `http://10.0.2.2:8000/api`. Physical devices need the computer's LAN address and a server listening on that interface.

## Integration and verification

See the [API contract](../docs/LARAVEL_API_CONTRACT.md). Configure exact browser origins in `FRONTEND_ORIGINS` (defaults: `http://localhost:5173,http://localhost:3000`). Add a fixed Flutter web origin when connecting it. Production clients use HTTPS.

```powershell
php artisan test
php vendor/bin/pint --test
php artisan route:list --path=api
```

Tests default to in-memory SQLite. To test MySQL, set `DB_CONNECTION=mysql`, a **dedicated disposable test database** in `DB_DATABASE`, and its host/port/credentials before running tests. RefreshDatabase recreates tables; never point it at the normal store database.

Verified: 12 tests / 60 assertions on SQLite and separately XAMPP MariaDB through Laravel's MySQL driver. Exact MySQL server and simultaneous HTTP checkout load testing remain deployment checks. Checkout locks products in ID order, snapshots item names/units/prices, and rolls back all changes if any item is unavailable. Prices use integer centavos; customer totals/statuses are ignored. Delivery is PHP 60 by default (`DELIVERY_FEE_CENTAVOS=6000`); pickup is free and Cash at Store only.

## Further phases

Enable Flutter with `--dart-define=API_BASE_URL=http://YOUR_PC_IP:8000/api`; see [phone and web setup](../docs/PHONE_AND_WEB_SETUP.md). Connect the team's React screens using staff authentication and order/payment APIs. Inventory adjustment/audit history, product editing, cancellation/stock release, expiry, staff roles, reporting and hosting are later phases. Unpaid accepted orders reserve stock until those workflows exist. Existing local receipts have no automatic import.

Keep APP_KEY stable because checkout retries derive receipt tokens from it. Save the customer receipt token alongside its order number; lost tokens require staff assistance. There is no public order list. Staff bearer tokens expire after eight hours and logout revokes the current token. Never embed staff credentials in customer clients.
