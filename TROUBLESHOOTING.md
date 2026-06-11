# Troubleshooting

## Python Is Missing

Install Python from:

```text
https://www.python.org/downloads/
```

Then reopen Terminal and try again.

## Port 8765 Is Busy

Run on another port:

```bash
python3 server.py --port 8770 --open
```

## macOS Blocks The Launcher

Right-click `start_demo.command`, choose `Open`, then confirm.

## Browser Does Not Open

Open this manually:

```text
http://127.0.0.1:8765
```

If you used a different port, replace `8765`.

## Reset Everything

```bash
python3 server.py --reset-data --init-only
```

## Print To PDF Looks Wrong

In the browser print dialog:

- Use A4.
- Disable browser headers and footers when possible.
- Use the app's print icon from the page you want to export.

## The Demo Shows Mock Data

That is expected. This public package is intentionally disconnected from live Google Sheets and private data.
