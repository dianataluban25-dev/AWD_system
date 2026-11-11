# ELEE deployment readiness audit — October 21, 2026

## Verdict

Suitable for a supervised local demo after the fixes below. **Not yet approved
for public production use.** Tests are evidence for covered scenarios, not a
guarantee that the system is perfect. No hosting deployment or real store
transactions were performed during this audit.

## Verified

| Area | Evidence |
| --- | --- |
| Authentication and permissions | Backend tests cover staff/admin/customer isolation, token logout, protected settings, password changes/reset links and throttling |
| Products | Create/edit, archive/restore, stock visibility and deletion blocked by order history |
| Checkout | Server prices/fees, idempotent retries, stock rollback, delivery/pickup validation and disabled fulfillment |
| Queue and order lifecycle | Stable FIFO and closed-order removal; completion now requires correct readiness status |
| Payments | Unpaid pickup cannot complete; COD completion is guarded by readiness and Sunday delivery policy |
| Sunday delivery | Manila timezone; Sunday checkout accepted for Monday; Sunday delivery completion blocked |
| Receipts | Own-token access, server totals, refreshed PDF status and failed-read recovery |
| Recommendations | Learned cosine weights, cancelled/unpaid exclusion, automatic retraining and manual fallback |
| Customer UI | Full responsive/widget test suite; receipt retry regression fixed |
| Staff UI | Browser sign-in/dashboard/settings checks used a disposable SQLite database and test account; real store data was not edited |
| Dependencies | Composer production audit: no reported advisories/abandoned packages; npm production audit: zero reported vulnerabilities at audit time |

Final test runs: **32 backend tests / 264 assertions**, **107 customer tests**,
and **4 frontend API/audio tests** passed. Both frontend builds succeeded.
Browser audio unit tests validate the sound generator; they do not prove audible
playback on every browser/device.

## Fixes made during the audit

- Customer checkout sends the reviewed total. If current prices/fees differ,
  the API rejects the order with a review message and rolls back stock. Cart
  prices refresh from the live catalog without replacing cart item identity.
- Receipt refresh errors remain visible during automatic retries and clear after
  a successful response. Previously the retry loop erased the error too soon.
- Customer receipt view shows the saved Sunday/Monday delivery notice.
- COD cannot be marked delivered/paid before Ready for Delivery. Paid pickup
  cannot complete before Ready for Pickup. Existing completed operations remain
  idempotent. Early cash-at-store payment remains allowed.
- Isolated catalog/store/checkout/receipt/reset/staff request limits prevent
  background polling from consuming another operation's allowance.
- CORS permits DELETE for configured frontend origins.
- Staff sign-in handles email case and whitespace; account email updates normalize
  input too.
- Stock labels, dashboard lists and counts use the configured low-stock threshold.
- AI page refresh resumes automatically; learned mappings count in the summary
  instead of only counting manual fallback mappings.
- Numeric zero dashboard values display explicitly; empty sales axes avoid
  repeated rounded peso tick labels.
- Local debug display disabled. Added `.env.production.example` and a read-only
  `php artisan elee:deployment-check` command.

## Deployment blockers

1. **Hosting and HTTPS:** No production service/domain is configured or tested.
   The local APP_ENV is local, APP_URL is HTTP and the current server is PHP's
   development server. Use a production PHP web server with document root set to
   `backend/public`; never publish the entire backend directory.
2. **Production database and secrets:** Current local database access uses root.
   Configure a dedicated production database user, secret environment variables,
   stable APP_KEY, secure cookies and actual HTTPS application URL. The proposed
   PostgreSQL hosting option has not been tested here; migrations/import and
   database-specific concurrency must be tested on that exact engine.
3. **Backups and restore:** No scheduled backup or successful production restore
   drill has been verified. A local `.sql` export is not evidence of a working
   production backup/restore process.
4. **Actual device acceptance:** Repeat checkout, status, receipt/PDF download,
   sound and reconnection tests in real Android/iPhone browsers over the final
   HTTPS host. Replace the LAN QR only after the final URL is verified.

## Business/operational decisions before real customer use

- Unpaid orders reserve stock immediately and have no automatic expiration.
  Staff must cancel abandoned orders. Agree a reservation timeout and abuse
  prevention policy before unattended public ordering; do not silently invent
  the store's cancellation rules.
- Paid cancellation/refunds are intentionally blocked; no refund workflow is
  implemented. Document how staff handle this case before launch.
- Customer receipt recovery is device/browser based. Clearing browser storage
  loses its receipt tokens; there is no authenticated cross-device recovery UI.
- The model has a small local dataset. No held-out quality evaluation has been
  completed. Test recommendation relevance on representative store transactions;
  do not claim measured accuracy or generative AI.
- No load or multi-worker database race test was completed. Staff currently
  downloads order history during polling; queue positions are computed per order.
  Add server-side aggregates/bounded data fetches before scaling the deployment.
- Staff accounts are provisioned by console commands, not a user-management UI.
  The password-reset link submission flow exists, but no production email
  delivery/recovery procedure has been verified.

## Production check command

Run `php artisan elee:deployment-check` on the target host after configuring it.
Local audit result: PHP, key, database access, assets, admin account and delivery
migration pass. Production environment, HTTPS URL, secure cookie and dedicated
database user require setup. A passing command still does not validate backups,
actual TLS/network accessibility, recommendation quality or load capacity.

Do not commit `.env`, `.sql`, local diagnostic files or logs. Keep shared admin
secrets out of source archives uploaded to public repositories. Built assets are
currently ignored by Git, so hosting must build them or receive the verified
release artifacts explicitly.

References:
- Laravel deployment: https://laravel.com/docs/12.x/deployment
- Production debug handling: https://laravel.com/docs/12.x/errors
- PHP built-in server limitations: https://www.php.net/commandline.webserver
