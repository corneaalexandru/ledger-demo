# Security Notes

This repository is designed to be safe for public sharing.

## Included

- Static UI files.
- Local Python server.
- First-run sample data generator.
- Public-safe Google Sheets adapter code.
- `.env.example` with placeholder values only.

## Local Runtime Data

The app creates these files on first run:

- `local_ledger_data/*.csv`
- `local_ledger_workbook.xlsx`

They are ignored by Git. Treat them as the user's private local ledger, even when they started from sample rows.

## Not Included

- `.env` files.
- Google service-account JSON files.
- Real Google Sheet IDs.
- OAuth tokens.
- Real statement imports.
- Real bank exports.
- Private ledger data.

## Before Publishing Changes

Run this from the repository root:

```bash
grep -RInE "PRIVATE KEY|client_secret|refresh_token|service_account|\\.env" .
```

Do not commit anything private. Keep personal ledger rows in the ignored local runtime files, or in a separate private repository.

For Google Sheets mode, keep the user's service-account JSON in `credentials/` or another ignored path.
