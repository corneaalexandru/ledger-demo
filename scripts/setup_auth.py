#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from ledger_core.auth import setup_auth


def main() -> int:
    parser = argparse.ArgumentParser(description="Set up the local Ledger browser password.")
    parser.add_argument("--app-name", default="Ledger", help="Browser auth realm shown in the password prompt.")
    parser.add_argument("--force", action="store_true", help="Replace the existing local browser password.")
    args = parser.parse_args()
    return setup_auth(ROOT, app_name=args.app_name, force=args.force)


if __name__ == "__main__":
    raise SystemExit(main())
