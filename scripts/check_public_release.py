#!/usr/bin/env python3
from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME_PREFIXES = (
    "local_ledger_data/",
    "mock_google_sheet/",
)
RUNTIME_FILES = {
    "local_ledger_workbook.xlsx",
    "mock_ledger_google_sheet.xlsx",
}


def main() -> int:
    run([sys.executable, "-m", "py_compile", "server.py"])
    run([sys.executable, "server.py", "--init-only"])
    reject_tracked_runtime_data()
    verify_clean_first_run()
    print("Ledger Public release check passed.")
    return 0


def run(command: list[str], cwd: Path = ROOT) -> None:
    print("+ " + " ".join(command))
    subprocess.run(command, cwd=cwd, check=True)


def reject_tracked_runtime_data() -> None:
    result = subprocess.run(["git", "ls-files"], cwd=ROOT, check=True, text=True, stdout=subprocess.PIPE)
    tracked = result.stdout.splitlines()
    bad = [
        path
        for path in tracked
        if path in RUNTIME_FILES or any(path.startswith(prefix) for prefix in RUNTIME_PREFIXES)
    ]
    if bad:
        raise SystemExit("Runtime data is tracked:\n" + "\n".join(bad))


def verify_clean_first_run() -> None:
    with tempfile.TemporaryDirectory() as raw_tmp:
        tmp = Path(raw_tmp)
        for path in ROOT.iterdir():
            if path.name in {".git", "local_ledger_data", "mock_google_sheet"} or path.name in RUNTIME_FILES:
                continue
            destination = tmp / path.name
            if path.is_dir():
                shutil.copytree(path, destination, ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
            else:
                shutil.copy2(path, destination)
        run([sys.executable, "server.py", "--init-only"], cwd=tmp)
        for expected in ("local_ledger_data/accounts_register.csv", "local_ledger_workbook.xlsx"):
            if not (tmp / expected).exists():
                raise SystemExit(f"First run did not create {expected}")


if __name__ == "__main__":
    raise SystemExit(main())
