# Changelog

Ledger Public follows the private Ledger development stream. Public releases contain the same shared UI/core behavior where it is safe to publish, without private data or credentials.

## 2026-06-13

- Flattened Overview insights into one continuous bordered bullet list and removed the group headers.
- Added a Settings header/content divider so the page matches the About page boundary treatment.

## 2026-06-12

- Added account country support across the Accounts Google Sheet schema, API filters, table, details, and edit form.
- Standardized Overview, Settings, and About bullet sections with the same left-border document-list treatment.
- Removed the repeated single-month target recap row so month drilldowns open directly on category models.
- Converted the Overview headline metrics from cards into the same plain bullet-list style as the supporting sections.
- Added persistent transaction drawer back controls so statement attachments, details, and edit views can switch without closing the drawer.
- Added a weighted Financial Health score to Overview using liquidity, cashflow, savings, target discipline, debt, concentration, capital momentum, and data quality.
- Bounded target progress bars so red over-target segments scale inside the available period column instead of spilling into adjacent values.
- Removed the duplicate structural overspending review signal from Overview while keeping the existing Risk metric.
- Moved structural overspending from the Overview headline row into Risk bullets and promoted Liquid Capital in its place.
- Reduced Overview to five headline insight cards and moved supporting metrics into Settings-style bullet sections.
- Kept active transaction filter chips such as category filters when changing the selected day, month, or year.
- Corrected yearly and monthly target row bars to show expense ceiling progress with red over-ceiling extension and fixed bar alignment.
- Reordered Settings bullets into a cleaner profile, project, source truth, sync, connections, thresholds, and preferences flow.
- Tightened Settings inline inputs and action buttons so fields match text scale and threshold units no longer duplicate.
- Removed the remaining profile username/password fields and password hashing so Ledger opens without a login/authentication module.
- Added compact target progress bars beside year and month labels in target summary tables.
- Matched Settings to the plain About bullet-list style.
- Standardized Settings and About into simpler line-by-line document rows.
- Removed the redundant label, filename, and release-history text above the About changelog content.
- Removed the duplicate divider line below detail drawer headers.
- Extended monthly target progress bars with a red proportional over-target segment.
- Kept transaction date, month, and year quick filters active when switching to Insights or Targets.
- Fixed monthly target drilldowns so month rows stay in Targets and keep the top period selector in sync.
- Flattened Settings into one page and standardized Settings/About into one-card-per-item insight grids.
- Added grey planned and black achieved progress bars to monthly target category rows.
- Moved About into its own sidebar page below Settings and removed the raw markdown opener from the changelog view.
- Reworked Settings sections into compact cards and added Settings > Profile for name, surname, and email.
- Removed the browser username/password setup flow from the launcher and kept the profile store informational only.

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
