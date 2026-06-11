# Ledger Public

Ledger Public is the shareable version of Ledger. It uses the same UI and core logic as the private Ledger app, but each user connects their own Google Sheet and service-account JSON.

No private data, real spreadsheet ID, `.env`, or credentials are included.

## Quick Start

1. Download or clone this repository.
2. Upload `starter/ledger_starter_workbook.xlsx` to Google Drive and open it with Google Sheets.
3. Create a Google service-account JSON key.
4. Double-click `start_ledger_public.command`.
5. Follow the one-time setup wizard.

The launcher will:

- Pull the latest app version when this folder is a git clone.
- Install Google Sheets requirements when missing.
- Ask for the service-account JSON and Google Sheet ID only when setup is not complete.
- Ask for the default Project Currency used across summaries, charts, reports, and printouts.
- Start Ledger Public at `http://127.0.0.1:8765`.

## Starter Database

The starter workbook contains mock accounts, transactions, trades, portfolio plan rows, categories, FX rates, and starter classification rules.
Project Currency can be set during setup and changed later in Settings. Source/native rows remain stored in their original currencies.

```text
starter/ledger_starter_workbook.xlsx
```

Upload it to Google Drive, open it as a Google Sheet, then use that Sheet as the Ledger database.

Because XLSX tab names are limited to 31 characters, one starter tab uses the Excel-safe name `portfolio_monthly_investment_pl`. During setup, Ledger repairs the Google Sheet and copies that data into the canonical `portfolio_monthly_investment_plan` tab.

## Manual Start

```bash
python3 -m pip install -r requirements-google.txt
python3 scripts/setup_google.py
python3 server.py --store google --open
```

Change port:

```bash
LEDGER_PORT=8770 ./start_ledger_public.command
```

## Updating

The macOS launcher runs `git pull --ff-only` automatically when the app folder is a git clone. If the repository was downloaded as a ZIP, download a fresh ZIP to update.

User data stays in the user's Google Sheet. Pulling app updates does not overwrite the Sheet or the local `.env`/credentials files.

## Documentation

- [INSTALL.md](INSTALL.md) - install and run instructions.
- [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) - detailed Google setup.
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - common fixes.
- [SECURITY.md](SECURITY.md) - public safety rules.
- [CHANGELOG.md](CHANGELOG.md) - release history.

## Important

Do not commit private bank exports, real statement files, service-account keys, `.env`, or personal ledger data into a fork. Keep those in the user's Google Sheet or ignored local credential files.
