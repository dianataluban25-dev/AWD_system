# Phone preview and Laravel / React connection

**Online school demo is now available:** https://elee-hardware-school-demo.divine-larch-0412.chatgpt.site — use `school-online-qr.png`. This works on other networks with the laptop off. Orders remain browser-local. See [online demo details](ONLINE_DEMO.md). The steps below are retained for local preview and backend integration.

## Phone preview today

Open **http://192.168.1.52:8080** on the phone or scan `phone-preview-qr.png` in this folder. Phone and computer must share the same Wi-Fi. Keep the computer and preview server running. This QR is a local test link; it will change if the computer's LAN IP changes. Mobile data alone cannot reach it.

The default preview uses local orders. It does not submit to the store. Use the same browser to reopen saved receipts; clearing browser storage removes them.

To restart from PowerShell in `C:\EELE_MOB_APP`:

```powershell
.\scripts\start-phone-preview.ps1 -SkipBuild
```

To rebuild and regenerate the QR after changes:

```powershell
.\scripts\start-phone-preview.ps1 -LanIp 192.168.1.52
```

If the phone cannot open the link, confirm the Wi-Fi and current `ipconfig` address, keep the server open, and allow the preview server on Windows **Private networks** if Windows asks. Guest Wi-Fi may isolate devices.

## Connect tomorrow

Flutter customer screens and the React staff website connect independently to the **same Laravel API and database**. React handles staff login, order list, payment confirmation and fulfillment. The Flutter customer site handles products, checkout and private customer receipts.

Start MySQL in XAMPP. The local `elee` database has been initialized with migrations and the illustrative starter catalog. Do not run `migrate:fresh` on it.

Terminal 1:

```powershell
.\scripts\start-backend.ps1 -LanIp 192.168.1.52
```

Terminal 2 (rebuilds the customer site in live mode):

```powershell
.\scripts\start-phone-preview.ps1 -LanIp 192.168.1.52 -ApiUrl http://192.168.1.52:8000/api
```

The QR URL stays the same. Live mode fetches real product IDs and the configured delivery fee, sends orders to Laravel, uses server totals and order numbers, and refreshes staff payment changes. It never silently substitutes demo products when the API fails. Names and mobile numbers are required for live checkout, including pickup, as required by the API.

Set React's API base URL to `http://192.168.1.52:8000/api`, using the environment-variable name expected by **your React project**. Its source code is not present in this workspace. Follow [the API contract](LARAVEL_API_CONTRACT.md) for requests and authentication. If React runs at another origin, add that exact origin to `FRONTEND_ORIGINS` (or the backend launcher) and restart Laravel. Origins include the scheme and port, without a trailing slash.

Create a staff account privately; there is no bundled/default staff password:

```powershell
cd backend
php artisan elee:create-staff your-email@example.com --name="Store Staff"
```

Never put staff login credentials or staff tokens into the customer site.

## Retry and receipts

An ambiguous network failure retains the checkout payload and key, including after browser restart. Retry the same checkout or use **Saved receipts → Recover pending order**. A changed order is blocked until the pending one is resolved, preventing accidental duplicate submission. Recovery appears in Saved receipts; review the cart before placing another order. Validation failures allow correction and a fresh attempt.

Device-only receipts are preserved when live mode is enabled, clearly marked, and never imported as real orders. Live receipt tokens are stored privately in that browser and scoped to the backend URL. Losing browser storage means losing the customer receipt access token; ask store staff for assistance.

## Android, iPhone and deployment

The QR opens a responsive **website** on Android Chrome and iPhone Safari; no APK is needed. The local HTTP preview is for checking on the same Wi-Fi. For a permanent QR and access outside that Wi-Fi, deploy the customer build and Laravel API on HTTPS, configure the hosted origins, and generate a new QR for the hosted customer URL.

For native Android emulator development use `--dart-define=API_BASE_URL=http://10.0.2.2:8000/api`. Native release builds should use an HTTPS API. Android has the Internet permission. Native iOS installation/build verification requires macOS/Xcode and signing; this Windows workspace cannot perform that step.

Check on the physical phone: portrait/landscape, keyboard during checkout, add/remove/select cart items, place an order, reopen the receipt, download PDF, and return to shopping. After connecting React, confirm cash payment there and refresh the same customer receipt. Download the new Paid PDF after refreshing.
