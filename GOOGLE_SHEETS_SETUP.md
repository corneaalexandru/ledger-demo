# Google Sheets Setup

Ledger Public can run in two modes:

- `local`: no setup, local CSV files, good for demo/offline use.
- `google`: user-owned Google Sheet plus user-owned auth file, closest to Ledger Private.

The public repository does not include any real spreadsheet ID, `.env`, or credentials.

## 1. Install Google Dependencies

Local mode uses only Python. Google mode needs the Google client packages:

```bash
python3 -m pip install -r requirements-google.txt
```

## 2. Create A Service Account

In Google Cloud:

1. Create or choose a project.
2. Enable the Google Sheets API.
3. Create a service account.
4. Create a JSON key for that service account.
5. Save the JSON file locally, for example:

```text
credentials/ledger-service-account.json
```

The `credentials/` folder is ignored by Git except for its placeholder file.

## 3. Share The Google Sheet

Create a Google Sheet for Ledger.

Open the service-account JSON and find its email address. It looks like:

```text
name@project-id.iam.gserviceaccount.com
```

Share the Google Sheet with that email as an editor.

## 4. Configure Ledger Public

Copy the example environment file:

```bash
cp .env.example .env
```

Set:

```env
LEDGER_STORE=google
LEDGER_SPREADSHEET_ID=your_google_sheet_id_here
GOOGLE_APPLICATION_CREDENTIALS=./credentials/ledger-service-account.json
```

## 5. Create Or Repair Tabs

Run this once to create the Ledger tabs and headers in your Google Sheet:

```bash
python3 server.py --store google --init-google-sheet --init-only
```

## 6. Start The App

```bash
python3 server.py --store google --open
```

On macOS, after `.env` is configured:

```bash
./start_ledger_public.command
```

## Local Demo Mode

To run without Google:

```bash
python3 server.py --store local --open
```

Local mode creates ignored runtime files:

```text
local_ledger_data/
local_ledger_workbook.xlsx
```

Those files are not used by Google mode unless you explicitly switch back to `local`.
