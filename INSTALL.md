# Install And Run

## Download From GitHub

1. Open the public GitHub repository.
2. Click `Code`.
3. Click `Download ZIP`.
4. Unzip the downloaded file.

## macOS

### Option A: Double-click

Double-click:

```text
start_ledger_public.command
```

If macOS blocks it:

1. Right-click `start_ledger_public.command`.
2. Choose `Open`.
3. Confirm.

### Option B: Terminal

```bash
git clone https://github.com/corneaalexandru/ledger-public.git
cd ledger-public
python3 server.py --open
```

## Windows

Double-click:

```text
start_ledger_public.bat
```

Or run:

```bat
cd ledger-public
py server.py --open
```

## Linux

```bash
cd ledger-public
python3 server.py --open
```

## Google Sheets Mode

Google Sheets mode is the real-user mode closest to Ledger Private. It uses the user's own Google Sheet and auth file.

```bash
cd ledger-public
cp .env.example .env
python3 -m pip install -r requirements-google.txt
```

Edit `.env`:

```env
LEDGER_STORE=google
LEDGER_SPREADSHEET_ID=your_google_sheet_id_here
GOOGLE_APPLICATION_CREDENTIALS=./credentials/ledger-service-account.json
```

Then initialize the tabs and start:

```bash
python3 server.py --store google --init-google-sheet --init-only
python3 server.py --store google --open
```

See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md).

## Stop The Server

In the terminal window running Ledger Public, press:

```text
Ctrl+C
```

## Local Demo Data

When using local mode, the first run creates local CSV tabs in:

```text
local_ledger_data/
```

It also creates:

```text
local_ledger_workbook.xlsx
```

These files are ignored by Git. They are the user's local ledger data, not app code.

## Update The App Later

To get the newest app logic without replacing local data:

```bash
git pull
python3 server.py --open
```

Future pulls do not overwrite `local_ledger_data/` or `local_ledger_workbook.xlsx`.

## Reset Local Data

This overwrites the user's local ignored data with fresh sample rows:

```bash
python3 server.py --reset-data --init-only
```

## Change Port

```bash
python3 server.py --port 8770 --open
```

Then open:

```text
http://127.0.0.1:8770
```

The macOS launcher accepts the same port through an environment variable:

```bash
LEDGER_PORT=8770 ./start_ledger_public.command
```
