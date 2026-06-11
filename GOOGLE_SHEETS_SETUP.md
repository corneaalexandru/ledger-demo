# Google Sheets Setup

Ledger Public uses a user-owned Google Sheet as its database.

## 1. Create The Starter Sheet

Upload this file to Google Drive:

```text
starter/ledger_starter_workbook.xlsx
```

Open it with Google Sheets. Copy the spreadsheet ID from the URL:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
```

## 2. Create A Service Account

In Google Cloud:

1. Create or choose a project.
2. Enable the Google Sheets API.
3. Create a service account.
4. Create a JSON key.
5. Save the JSON file locally, for example:

```text
credentials/ledger-service-account.json
```

## 3. Share The Sheet

Open the JSON file and find `client_email`.

Share the Google Sheet with that email as Editor.

## 4. Run The Wizard

On macOS, double-click:

```text
start_ledger_public.command
```

Or run manually:

```bash
python3 -m pip install -r requirements-google.txt
python3 scripts/setup_google.py
```

The wizard writes `.env` once:

```env
LEDGER_STORE=google
LEDGER_SPREADSHEET_ID=your_google_sheet_id_here
GOOGLE_APPLICATION_CREDENTIALS=credentials/ledger-service-account.json
LEDGER_PROJECT_CURRENCY=EUR
```

The wizard asks for Project Currency during setup. Supported values are EUR, USD, AED, RON, GBP, CHF, CAD, AUD, and JPY.

## 5. Start Ledger

```bash
python3 server.py --store google --open
```

## Notes

XLSX sheet names are limited to 31 characters. The starter workbook therefore contains `portfolio_monthly_investment_pl`. During setup, Ledger creates the canonical `portfolio_monthly_investment_plan` tab in Google Sheets and copies the starter rows into it.

Re-run setup at any time with:

```bash
python3 scripts/setup_google.py --force
```
