#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = ROOT / ".env"
SETUP_DIR = ROOT / ".ledger_public_setup"
SETUP_MARKER = SETUP_DIR / "google_configured"
DEFAULT_CREDENTIALS = Path("credentials/ledger-service-account.json")
STARTER_WORKBOOK = ROOT / "starter" / "ledger_starter_workbook.xlsx"
SUPPORTED_PROJECT_CURRENCIES = ("EUR", "USD", "AED", "RON", "GBP", "CHF", "CAD", "AUD", "INR", "JPY")


def main() -> int:
    parser = argparse.ArgumentParser(description="One-time Ledger Public Google Sheets setup wizard.")
    parser.add_argument("--force", action="store_true", help="Run setup even when .env already looks complete.")
    parser.add_argument("--no-validate", action="store_true", help="Write .env without calling the Google Sheets API.")
    args = parser.parse_args()

    if not args.force and existing_setup_is_complete():
        print("Ledger Public Google setup already exists.")
        return 0

    print("\nLedger Public Google setup")
    print("==========================")
    print("This wizard runs once. It writes .env and never commits credentials.")
    print(f"\nStarter workbook: {STARTER_WORKBOOK}")
    print("Upload that XLSX file to Google Drive, open it with Google Sheets,")
    print("then copy the spreadsheet ID from the Google Sheet URL.")

    credentials_path = ask_path(
        "\nPath to your service-account JSON",
        DEFAULT_CREDENTIALS,
    )
    credentials_path.parent.mkdir(parents=True, exist_ok=True)
    while not credentials_path.exists():
        print(f"\nFile not found: {credentials_path}")
        print("Place your downloaded service-account JSON at that path, then press Enter.")
        input("Ready? ")

    service_email = read_service_account_email(credentials_path)
    print("\nShare your Google Sheet with this service-account email as Editor:")
    print(f"  {service_email}")
    input("Press Enter after the Google Sheet has been shared...")

    spreadsheet_id = ""
    while not spreadsheet_id:
        raw = input("\nGoogle Sheet URL or spreadsheet ID: ").strip()
        spreadsheet_id = extract_spreadsheet_id(raw)
        if not spreadsheet_id:
            print("Could not read a spreadsheet ID. Paste the full Google Sheet URL or the ID between /d/ and /edit.")

    project_currency = ask_project_currency()

    write_env(credentials_path, spreadsheet_id, project_currency)
    write_marker(spreadsheet_id, project_currency)
    print(f"\nWrote {ENV_PATH}")

    if args.no_validate:
        print("Skipped Google validation.")
        return 0

    print("\nChecking Google access and repairing Ledger tabs...")
    result = subprocess.run(
        [sys.executable, "server.py", "--store", "google", "--init-google-sheet", "--init-only"],
        cwd=ROOT,
        text=True,
    )
    if result.returncode != 0:
        print("\nGoogle setup is saved, but validation failed.")
        print("Check that the Sheet is shared with the service-account email and run:")
        print("  python3 scripts/setup_google.py --force")
        return result.returncode

    print("\nGoogle setup complete. Starting Ledger Public...")
    return 0


def existing_setup_is_complete() -> bool:
    env = read_env()
    credentials = env.get("GOOGLE_APPLICATION_CREDENTIALS", "")
    spreadsheet_id = env.get("LEDGER_SPREADSHEET_ID", "")
    return (
        env.get("LEDGER_STORE", "").lower() == "google"
        and bool(spreadsheet_id)
        and bool(credentials)
        and resolve_path(credentials).exists()
    )


def ask_project_currency() -> str:
    supported = " / ".join(SUPPORTED_PROJECT_CURRENCIES)
    while True:
        raw = input(f"\nProject currency [{supported}] [EUR]: ").strip().upper() or "EUR"
        if raw in SUPPORTED_PROJECT_CURRENCIES:
            return raw
        print(f"Choose one of: {supported}")


def ask_path(prompt: str, default: Path) -> Path:
    raw = input(f"{prompt} [{default.as_posix()}]: ").strip()
    return resolve_path(raw or default.as_posix())


def resolve_path(value: str | Path) -> Path:
    path = Path(value).expanduser()
    return path if path.is_absolute() else ROOT / path


def read_service_account_email(path: Path) -> str:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise SystemExit(f"Could not read service-account JSON: {error}") from error
    if payload.get("type") != "service_account" or not payload.get("client_email"):
        raise SystemExit("That JSON file does not look like a Google service-account key.")
    return str(payload["client_email"])


def extract_spreadsheet_id(value: str) -> str:
    if not value:
        return ""
    if "docs.google.com" not in value:
        return value.strip()
    path = urlparse(value).path
    parts = [part for part in path.split("/") if part]
    if "d" in parts:
        index = parts.index("d")
        if index + 1 < len(parts):
            return parts[index + 1]
    return ""


def read_env() -> dict[str, str]:
    if not ENV_PATH.exists():
        return {}
    values = {}
    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def write_env(credentials_path: Path, spreadsheet_id: str, project_currency: str) -> None:
    relative_credentials = credentials_path.relative_to(ROOT) if credentials_path.is_relative_to(ROOT) else credentials_path
    ENV_PATH.write_text(
        "\n".join(
            [
                "LEDGER_STORE=google",
                f"LEDGER_SPREADSHEET_ID={spreadsheet_id}",
                f"GOOGLE_APPLICATION_CREDENTIALS={relative_credentials.as_posix()}",
                f"LEDGER_PROJECT_CURRENCY={project_currency}",
                "",
            ]
        ),
        encoding="utf-8",
    )


def write_marker(spreadsheet_id: str, project_currency: str) -> None:
    SETUP_DIR.mkdir(parents=True, exist_ok=True)
    SETUP_MARKER.write_text(
        f"configured_at={datetime.utcnow().isoformat()}Z\nspreadsheet_id={spreadsheet_id}\nproject_currency={project_currency}\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    raise SystemExit(main())
