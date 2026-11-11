# ELEE online school demo

Published on 13 October 2026:

https://elee-hardware-school-demo.divine-larch-0412.chatgpt.site

Scan `school-online-qr.png` in this folder or open the link directly. This public demo works over school Wi-Fi or mobile data; the laptop and local preview server do not need to stay on. The older `phone-preview-qr.png` is for local Wi-Fi testing only.

The deployed version uses the existing Flutter customer website in local demo mode. Orders and receipts are saved in each visitor's browser, not submitted to Laravel or visible to the React staff website. Receipts from localhost or the LAN preview do not automatically transfer to this different website address. No staff credentials, database records or backend secrets are included in the hosted files.

Tomorrow's live backend connection remains a separate step: agree the Laravel API contract with the web team, host the backend on HTTPS, configure allowed origins, rebuild with its `API_BASE_URL`, and update the existing Site. See `PHONE_AND_WEB_SETUP.md`.

Hosted static source is retained under `sites/elee-school-demo`; reuse its `.openai/hosting.json` project identity for future updates.
