# ELEE feature alignment

| Feature | Flutter customer client | Laravel backend | React staff web |
| --- | --- | --- | --- |
| Catalog/search/categories | Demo default; paginated Laravel catalog in live mode | Product API and fee metadata ready | Team integration pending |
| Checkout | Local default; live API adapter with persistent retries | Transactional orders, server totals and stock reservation | Integration pending |
| Inventory | Demo default; server prices and stock in live mode | Product creation ready; editing/restock later | Screens pending |
| Receipt/status | Local/store receipts and PDF; live token-protected refresh | Token-protected order lookup ready | Payment API ready |
| Staff access | No customer staff tools | Sanctum login/logout and order list | Screens pending |
| Delivery/pickup | Existing choices | Fee and COD/pickup rules enforced | Fulfillment API ready |
| Hosting | Local only | MySQL setup guide ready | Deployment pending |

Flutter's Laravel adapter is implemented and verified with client tests; configure `API_BASE_URL` and the browser origin to enable it. Today's phone preview remains local demo mode. Existing local receipts remain demo records. React and Flutter should share one agreed API/database after integration. The separate React/Laravel website was not available for inspection; coordinate the API contract and migrations with the web team before adopting `backend/` into an existing Laravel repository.
