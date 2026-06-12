# Changelog

Ledger Public follows the private Ledger development stream. Public releases contain the same shared UI/core behavior where it is safe to publish, without private data or credentials.

## 2026-06-12

- Kept transaction date, month, and year quick filters active when switching to Insights or Targets.
- Fixed monthly target drilldowns so month rows stay in Targets and keep the top period selector in sync.
- Flattened Settings into one page and standardized Settings/About into one-card-per-item insight grids.
- Added grey planned and black achieved progress bars to monthly target category rows.
- Moved About into its own sidebar page below Settings and removed the raw markdown opener from the changelog view.
- Reworked Settings sections into compact cards and added Settings > Profile for name, surname, username, password, and email.
- Removed the browser username/password setup flow from the launcher in favor of the in-app profile store.

## 2026-06-11

- Normalized Google Sheets date serials back to ISO dates so uploaded starter workbooks remain compatible after Google conversion.
- Recalculated transaction conversions from edited statement amounts even when the disabled sanitized amount field is not submitted.
- Renamed the visible transaction base column to Project Amount.
- Added INR as a supported Project Currency and shipped a static changelog fallback for stale server routes.
- Added switchable Project Currency support, setup-time Project Currency selection, expanded starter FX rates, and a hardened Settings changelog loader.
- Added Settings > About with copyright, license, contact, disclaimer, and changelog subpages linked to `CHANGELOG.md`.
- Added Google Sheets mode using a user-owned spreadsheet and service-account JSON.
- Added `starter/ledger_starter_workbook.xlsx` as the starter database template with mock data and reference tabs.
- Added one-time setup wizard in `scripts/setup_google.py`.
- Updated `start_ledger_public.command` to pull the latest app version, install Google requirements when missing, run setup once, and start in Google mode.
- Added release guards for credentials, `.env`, runtime data, backups, and private markers.
