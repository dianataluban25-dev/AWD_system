# Project check — 13 October 2026

Verified in this workspace:

- 102 Flutter tests passed, covering shopping/navigation, stock limits, checkout, receipt/PDF behavior, live API mapping, persistent retry keys, tokens and recovery.
- The layout matrix covers Android and iOS platform themes at 280×653, 320×568, 360×640, 390×844, 412×915, 568×320, 844×390, 768×1024, 1024×768 and 1366×1024, at 1×, 1.5× and 2× text scale. Each case checks home, catalog, categories, search, product, cart, checkout, confirmation, receipt, saved receipts and the app shell for framework layout exceptions, before/after scrolling. These are simulated layouts, not physical devices.
- Keyboard-inset checks passed for portrait and short landscape checkout.
- 12 Laravel tests / 61 assertions passed on in-memory SQLite and on the dedicated `elee_readiness_test_20261013` MySQL database. Tests cover stock rollback, retries, server totals, authentication, private receipt access, payments, completion, validation and CORS.
- Flutter analysis reported no issues. Backend formatting passed. Customer website production build succeeded with locally bundled CanvasKit resources.
- Local preview returned HTTP 200 at `http://192.168.1.52:8080`; browser preview loaded with no captured console errors. QR image generated for that address.

Fixed: catalog header/filter overflow at narrow/short layouts; cart controls overflow on narrow screens; price wrapping; fractional-peso parsing/display; obsolete PHP API endpoints; receipt action retry/timeout behavior; checkout server identifiers/totals; persisted retry keys and recovery; correct local/store receipt labeling; same-name products now use server IDs in the cart; Android Internet permission and web metadata/orientation.

Default preview remains device-only demo mode as requested. Live mode is enabled through `API_BASE_URL`; React integration is scheduled for tomorrow. The React project is not in this workspace and has not been modified or verified. The local `elee` MySQL database was newly created, migrated, and seeded with illustrative products; no staff account/password was generated.

Remaining real-environment checks: physical Android Chrome/iPhone Safari behavior (especially PDF downloads and keyboard), the separate React staff screens, hosted HTTPS/CORS and a permanent QR, native iOS signing/build on macOS, and simultaneous HTTP checkout load. Cancellation/stock release, inventory audit/editing, staff roles and reporting remain future features. Unpaid accepted orders reserve stock.

Use [the setup guide](PHONE_AND_WEB_SETUP.md) for today’s QR and tomorrow’s connection.
