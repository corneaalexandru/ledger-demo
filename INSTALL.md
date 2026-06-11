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
start_demo.command
```

If macOS blocks it:

1. Right-click `start_demo.command`.
2. Choose `Open`.
3. Confirm.

### Option B: Terminal

```bash
cd ledger-demo
python3 server.py --open
```

## Windows

Double-click:

```text
start_demo.bat
```

Or run:

```bat
cd ledger-demo
py server.py --open
```

## Linux

```bash
cd ledger-demo
python3 server.py --open
```

## Stop The Server

In the terminal window running the demo, press:

```text
Ctrl+C
```

## First Run Data

The first run creates local CSV tabs in:

```text
mock_google_sheet/
```

It also creates:

```text
mock_ledger_google_sheet.xlsx
```

These files are ignored by Git. They are the user's local ledger data, not app code.

## Update The App Later

To get the newest app logic without replacing local data:

```bash
git pull
python3 server.py --open
```

Future pulls do not overwrite `mock_google_sheet/` or `mock_ledger_google_sheet.xlsx`.

## Reset Mock Data

This overwrites the user's local ignored demo data with fresh sample rows:

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
