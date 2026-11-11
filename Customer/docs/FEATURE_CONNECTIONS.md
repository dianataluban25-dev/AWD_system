# Customer and staff connection audit

The supplied admin frontend uses the shared Laravel database and can perform
staff order operations. The user confirmed that staff and admin share this web
frontend. Staff login uses the same sign-in form; store-setting changes remain
restricted to administrators.

| Feature | Connection |
| --- | --- |
| Products, price, stock, images, availability | Staff product writes feed the public catalog; customer catalog reloads every 10 seconds |
| Checkout | Server calculates price, delivery fee and stock reservation |
| Queue | Server derives FIFO positions from shared active orders; customer reloads every 10 seconds |
| Processing and pickup/delivery readiness | Staff status writes feed the customer receipt and queue |
| Cash collection and completion | Staff payment/completion writes feed customer payment/status |
| Cancellation | Removes the order from the active queue and restores stock once |
| Delivery fee | Checkout reloads store configuration; server calculates the final fee |
| Pickup/delivery availability | Customer filters its selector; server rejects disabled options before reserving stock |
| Store name/address/contact/hours | Public store API; checkout shows details for pickup |
| Notifications | Admin alerts only; preferences are stored in the database |
| Admin account | Internal account settings; never exposed to customers |
| Customers, payment records, receipt records, dashboard | Derived from real order records |
| Recommendations | Trained item-item collaborative filtering learns from paid, completed orders. Staff can retrain and inspect dataset status. Customer ranks learned scores, excluding cart/unavailable items. Explicit staff mappings are labelled manual fallback when no learned results exist |

API tests use isolated SQLite data and cover prices, checkout, FIFO, pickup,
delivery, payment, cancellation, role/token restrictions and store settings.
Flutter tests cover checkout settings, customer queue and receipt updates.
An actual phone/QR test is still required before claiming production readiness.
