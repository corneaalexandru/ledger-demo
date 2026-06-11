from __future__ import annotations

import re
from typing import Protocol


class LedgerStore(Protocol):
    def list_rows(self, sheet_name: str) -> list[dict]:
        ...

    def upsert_row(self, sheet_name: str, id_field: str, row_id: str, values: dict) -> dict:
        ...

    def append_row(self, sheet_name: str, id_field: str, prefix: str, values: dict, defaults: dict | None = None) -> dict:
        ...

    def soft_delete(self, sheet_name: str, id_field: str, ids: list[str]) -> dict:
        ...

    def restore(self, sheet_name: str, id_field: str, ids: list[str]) -> dict:
        ...

    def refresh(self) -> dict:
        ...


def normalize_ids(values: list[str] | str | None) -> list[str]:
    if values is None:
        return []
    if isinstance(values, str):
        values = [values]
    return list(dict.fromkeys(str(value).strip() for value in values if str(value).strip()))


def next_id(rows: list[dict], field: str, prefix: str) -> str:
    max_number = 0
    for row in rows:
        match = re.search(r"(\d+)$", str(row.get(field, "")))
        if match:
            max_number = max(max_number, int(match.group(1)))
    return f"{prefix}_{max_number + 1:06d}"
