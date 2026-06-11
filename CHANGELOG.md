# Changelog

Ledger Public follows the private Ledger development stream. Public releases contain the same shared UI/core behavior where it is safe to publish, without private data or credentials.

## 2026-06-11

- Added Settings > About with copyright, license, contact, disclaimer, and changelog subpages linked to `CHANGELOG.md`.
- Added Google Sheets mode using a user-owned spreadsheet and service-account JSON.
- Added `starter/ledger_starter_workbook.xlsx` as the starter database template with mock data and reference tabs.
- Added one-time setup wizard in `scripts/setup_google.py`.
- Updated `start_ledger_public.command` to pull the latest app version, install Google requirements when missing, run setup once, and start in Google mode.
- Added release guards for credentials, `.env`, runtime data, backups, and private markers.
