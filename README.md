# Ledger Public

A standalone public version of the Ledger finance dashboard.

Ledger Public runs entirely on the user's computer. It does not connect to the live Ledger Google Sheet, does not use service-account credentials, and does not include private financial data.

## Quick Start

### macOS

1. Download the repository ZIP from GitHub.
2. Unzip it.
3. Double-click `start_ledger_public.command`.
4. Open `http://127.0.0.1:8765` if the browser does not open automatically.

If macOS blocks the launcher, right-click `start_ledger_public.command`, choose `Open`, then confirm.

### Windows

1. Download the repository ZIP from GitHub.
2. Unzip it.
3. Double-click `start_ledger_public.bat`.
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

The local server uses only the Python standard library.

## Local Data Model

The public repository contains the app logic, backend, UI, and a first-run data generator. It does not version user ledger files.

On first run, the server creates local ledger files:

- `local_ledger_data/*.csv`
- `local_ledger_workbook.xlsx`

Those files are ignored by Git. A user can edit/import their own local data, then run `git pull` later to get the newest app logic without pulling or overwriting the sample data again.

The app reads and writes the CSV tabs. The workbook is regenerated from those CSV files whenever the local data changes.

## Features

- Accounts, transactions, trades, portfolio, planning, and settings screens.
- Local account/transaction/trade create, edit, duplicate, restore, and delete flows.
- Local statement import preview and apply flow.
- Local trade price refresh.
- Print-to-PDF from relevant pages.
- Offline FX conversion for multi-currency accounts, transactions, trades, and portfolio rows.
- Local reset back to bundled sample data.

## Reset Local Data

This overwrites the local ignored data folder with fresh sample rows:

```bash
python3 server.py --reset-data --init-only
```

## Local Ledger Workbook

Open `local_ledger_workbook.xlsx` in Excel, Numbers, or upload it into Google Sheets to inspect the local source tabs.

The app itself does not read from Google Sheets in this public package; it uses the local CSV files in `local_ledger_data/` so Ledger Public works offline.

## Updating The App Without Touching Data

```bash
git pull
python3 server.py --open
```

`git pull` updates tracked code and documentation only. It leaves `local_ledger_data/` and `local_ledger_workbook.xlsx` alone because they are local runtime data.

Back up `local_ledger_data/` before sharing or moving a user's ledger to another computer.

## Documentation

- [INSTALL.md](INSTALL.md) - install and run instructions.
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - common fixes.
- [SECURITY.md](SECURITY.md) - what is and is not included in Ledger Public.

## Important

This is a public package. Do not commit private bank exports, real statement files, service account keys, or `.env` files into a fork. Keep personal data in the ignored `local_ledger_data/` runtime folder or in a private repository.
