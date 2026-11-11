# ELEE customer QR ordering website (Flutter Web demo)

[Online school demo](https://elee-hardware-school-demo.divine-larch-0412.chatgpt.site) · [Online QR](docs/school-online-qr.png) · [Demo details](docs/ONLINE_DEMO.md). Orders on this deployed demo remain in each visitor's browser.

Mobile-friendly customer ordering website accessed through the store QR. No customer app installation is required. A Laravel/MySQL backend is now included with [setup instructions](backend/README.md). The Flutter client supports an opt-in live Laravel connection; the team's React admin/staff web uses the same API; see [API agreement](docs/LARAVEL_API_CONTRACT.md) and [project feature alignment](docs/PROJECT_FEATURES.md).

## Run

```powershell
flutter pub get
flutter run
```

Temporary mode uses the bundled catalog and stores demo orders in local preferences. No order is submitted to a store/server. Local receipts survive normal app restarts, but uninstalling or clearing app data removes them. This storage is for demo data, not the production order ledger.

After checkout, use the receipt icon (Saved receipts) in the main toolbar to reopen orders. Refresh Payment Status reloads the locally stored status. Failed saves retain the cart; failed refreshes retain the last displayed status and allow retry.

The receipt page offers **Download Order Summary (PDF)** while Unpaid and **Download Paid Receipt (PDF)** once staff payment is recorded. Each export re-reads the saved order; a failed read produces no download. PDFs include customer/order details, item units and prices, totals, statuses and the payment timestamp when Paid. Bundled Noto Sans fonts keep PDF generation independent of online font services. Browsers initiate a file download using their configured download folder or save prompt. Native builds open the system Save File dialog; select a local folder such as Downloads or On My iPhone. Cancelling leaves the receipt available for retry. Desktop builds explicitly write the PDF to the selected path. No share menu is used. Local PDFs are marked LOCAL RECORD - Not submitted to the store. Downloaded files do not update automatically after payment: download a new copy.

Product visuals use offline illustrations until actual store photos are available. Product image URLs take priority, with illustrations shown while loading or if a photo fails. Category catalogs return to the category list on Back. Adding a product preserves the requested cart quantity and resets the selector to one. Manual receipt refresh shows a notification with the latest saved payment and order status.

Checkout review includes customer details, address, fulfillment, payment method and total before confirmation. Local-only storage is explained before saving. While saving, customer fields and Back navigation are locked; confirmation uses a captured item/total snapshot even after the cart clears. Confirmation and receipt pages include Continue Shopping, and confirmation explains where to reopen saved receipts.

Home navigation has distinct entry points: Search opens an autofocus search screen with query results, clear and empty states; Categories open a page limited to the selected category, returning to the category list on Back; Featured cards open product details. The redundant Featured View all link is removed. Shop Now intentionally shortcuts the Catalog tab for browsing the full inventory.

## Frontend checking

Run `flutter run` without a demo flag. Customer-facing demo branding and the staff-simulator shortcut are removed, including when the old DEMO_STAFF_TOOLS flag is supplied. Orders still use local storage; checkout and PDFs explain that they have not been submitted to the store. Existing receipts are retained. Payment simulation remains an internal test helper, not a customer action.

Store Pickup has no delivery fee and accepts Cash at Store only. Delivery accepts Cash at Store or COD; both include the temporary PHP 60 delivery fee. Cash at Store + Delivery becomes Paid after collection but remains Pending until fulfillment. Digital receipts show Unpaid initially. After staff confirms cash collection, refreshing the same digital receipt shows Paid. A downloadable digital paid receipt replaces the original physical receipt step; staff may optionally print the PDF.

For the customer website, run `flutter run -d chrome` locally or build with `flutter build web`. For native phone/emulator frontend checking, use `flutter run`. Deploy `build/web` to an HTTPS host before creating the permanent store QR. A deployed URL is not configured yet. To enable the Laravel connection, supply `--dart-define=API_BASE_URL=http://YOUR_PC_IP:8000/api`. Without this option, orders remain local. See [phone preview and website integration](docs/PHONE_AND_WEB_SETUP.md).

## Checks

```powershell
flutter analyze --no-pub
flutter test --no-pub
```

The included Laravel API owns real identifiers, stock transactions, totals and staff payment updates. Live mode uses Laravel endpoints, paginated products, fractional-peso prices, server totals/identifiers, private receipt tokens and durable checkout retry keys. Configure the API URL and exact allowed browser origin before using live mode. React staff-screen integration remains in the separate web project.
