# Ledger Demo

A standalone, mock-data version of the Ledger finance dashboard.

This public demo runs entirely on the user's computer. It does not connect to the live Ledger Google Sheet, does not use service-account credentials, and does not include private financial data.

## Quick Start

### macOS

1. Download the repository ZIP from GitHub.
2. Unzip it.
3. Double-click `start_demo.command`.
4. Open `http://127.0.0.1:8765` if the browser does not open automatically.

If macOS blocks the launcher, right-click `start_demo.command`, choose `Open`, then confirm.

### Windows

1. Download the repository ZIP from GitHub.
2. Unzip it.
3. Double-click `start_demo.bat`.
4. Open `http://127.0.0.1:8765` if the browser does not open automatically.

### Terminal

```bash
python3 server.py --open
```

If port `8765` is busy:

```bash
python3 server.py --port 8770 --open
```

## Requirements

- Python 3.10+ recommended.
- No `pip install` step is required.
- No Google account or API credentials are required.

The demo server uses only the Python standard library.

## Local Data Model

The public repository contains the app logic, backend, UI, and a first-run data generator. It does not version user ledger files.

On first run, the server creates a local mock ledger:

- `mock_google_sheet/*.csv`
- `mock_ledger_google_sheet.xlsx`

Those files are ignored by Git. A user can edit/import their own local data, then run `git pull` later to get the newest app logic without pulling or overwriting the sample data again.

The app reads and writes the CSV tabs. The workbook is regenerated from those CSV files whenever the local data changes.

## Demo Features

- Accounts, transactions, trades, portfolio, planning, and settings screens.
- Mock account/transaction/trade create, edit, duplicate, restore, and delete flows.
- Mock statement import preview and apply flow.
- Mock trade price refresh.
- Print-to-PDF from relevant pages.
- Local reset back to bundled demo data.

## Reset The Demo

This overwrites the local ignored data folder with fresh sample rows:

```bash
python3 server.py --reset-data --init-only
```

## Mock Google Sheet

Open `mock_ledger_google_sheet.xlsx` in Excel, Numbers, or upload it into Google Sheets to inspect the mock source tabs.

The app itself does not read from Google Sheets in this public package; it uses the local CSV files in `mock_google_sheet/` so the demo works offline.

## Updating The App Without Touching Data

```bash
git pull
python3 server.py --open
```

`git pull` updates tracked code and documentation only. It leaves `mock_google_sheet/` and `mock_ledger_google_sheet.xlsx` alone because they are local runtime data.

Back up `mock_google_sheet/` before sharing or moving a user's ledger to another computer.

## Documentation

- [INSTALL.md](INSTALL.md) - install and run instructions.
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - common fixes.
- [SECURITY.md](SECURITY.md) - what is and is not included in this public demo.

## Important

This is a demo package. Do not commit private bank exports, real statement files, service account keys, or `.env` files into a fork. Keep personal data in the ignored `mock_google_sheet/` runtime folder or in a private repository.
