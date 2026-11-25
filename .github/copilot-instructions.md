# Digital Business Studio — instructions for the Developer

This repository is the **public storefront** of the Digital Business Studio, run by James
(the PAPERWORLD shop Director). The owner approves new products once a week.

## Never
- Never put a sellable file (the PDF, template, ZIP, spreadsheet that customers pay for) in this
  repository. It is public. Only **previews** go in `assets/previews/` (small, watermarked or partial).
- Never add third-party scripts, analytics, trackers, cookies or iframes.
- Never write income promises, fake reviews/testimonials, "best seller" claims or brand imitation.
- Never edit `.github/`, `.paperworld/`, `package.json` or `package-lock.json`.

## Structure
- `products.json` — the catalogue. Each product: `slug`, `title` (≤80), `summary` (≤200),
  optional `description`, `price_eur` (1–99), `status` (`draft` | `soon` | `live`), `preview`
  (`./assets/previews/<slug>.svg|png|jpg|webp`), and when `live`: `payment_link`
  (`https://buy.stripe.com/...`) and `file_key` (the private file name, e.g. `weekly-planner.pdf`).
- `index.html`, `style.css`, `app.js` — the shop page (renders `products.json`).
- `thanks.html`, `delivery.js` — after payment: asks the shop's delivery service for a personal,
  short-lived download link.
- `tests/` — `catalog` and `storefront` are the required tests (`npm test`).

## Pull requests
Keep changes small. Start the PR description with two plain Greek lines:
`Cause: …` and `Fix: …`.
