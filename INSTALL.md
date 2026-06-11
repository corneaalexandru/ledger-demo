# Install And Run

## macOS

Double-click:

```text
start_ledger_public.command
```

If macOS blocks it:

1. Right-click `start_ledger_public.command`.
2. Choose `Open`.
3. Confirm.

The launcher updates the app, installs missing Google requirements, runs Google setup once, creates a local browser username/password once, then starts Ledger.

## Terminal

```bash
git clone https://github.com/corneaalexandru/ledger-public.git
cd ledger-public
python3 -m pip install -r requirements-google.txt
python3 scripts/setup_google.py
python3 scripts/setup_auth.py --app-name "Ledger Public"
python3 server.py --store google --open
```

## Google Sheet Database

1. Upload `starter/ledger_starter_workbook.xlsx` to Google Drive.
2. Open it with Google Sheets.
3. Copy the spreadsheet ID from the URL.
4. Save your service-account JSON in `credentials/`.
5. Share the Google Sheet with the `client_email` from that JSON file as Editor.
6. Run the setup wizard or double-click the launcher.

The wizard writes:

```text
.env
.ledger_public_setup/google_configured
.ledger_auth.json
```

Those files are ignored by Git and should stay private.

## Stop The Server

In the terminal window running Ledger Public, press:

```text
Ctrl+C
```

## Change Port

```bash
LEDGER_PORT=8770 ./start_ledger_public.command
```

Then open:

```text
http://127.0.0.1:8770
```
