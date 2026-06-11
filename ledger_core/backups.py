from __future__ import annotations

import zipfile
from datetime import datetime
from pathlib import Path


def backup_local_data(data_dir: Path | str, destination_dir: Path | str, *, label: str = "ledger") -> Path:
    data_path = Path(data_dir)
    destination = Path(destination_dir)
    destination.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    archive_path = destination / f"{label}-local-data-{stamp}.zip"
    with zipfile.ZipFile(archive_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(data_path.rglob("*")):
            if path.is_file():
                archive.write(path, path.relative_to(data_path))
    return archive_path


def restore_local_data(archive_path: Path | str, data_dir: Path | str) -> None:
    destination = Path(data_dir)
    destination.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive_path) as archive:
        archive.extractall(destination)
