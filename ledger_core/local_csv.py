from __future__ import annotations

import csv
from pathlib import Path

from ledger_core.fx import DEFAULT_CONVERTER, FXConverter, normalize_currency
from ledger_core.schemas import SHEETS
from ledger_core.store import next_id, normalize_ids


class LocalCsvLedgerStore:
    def __init__(self, data_dir: Path | str, *, sheets: dict[str, list[str]] | None = None, fx: FXConverter | None = None) -> None:
        self.data_dir = Path(data_dir)
        self.sheets = sheets or SHEETS
        self.fx = fx or DEFAULT_CONVERTER

    def list_rows(self, sheet_name: str) -> list[dict]:
        path = self._path(sheet_name)
        if not path.exists():
            return []
        with path.open("r", encoding="utf-8", newline="") as handle:
            return [self.normalize_row(sheet_name, dict(row)) for row in csv.DictReader(handle)]

    def write_rows(self, sheet_name: str, rows: list[dict]) -> None:
        self.data_dir.mkdir(parents=True, exist_ok=True)
        headers = self.sheets[sheet_name]
        with self._path(sheet_name).open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=headers, extrasaction="ignore")
            writer.writeheader()
            for row in rows:
                normalized = self.normalize_row(sheet_name, row)
                writer.writerow({header: normalized.get(header, "") for header in headers})

    def upsert_row(self, sheet_name: str, id_field: str, row_id: str, values: dict) -> dict:
        rows = self.list_rows(sheet_name)
        for index, row in enumerate(rows):
            if str(row.get(id_field, "")) == str(row_id):
                rows[index] = self.normalize_row(sheet_name, {**row, **values})
                self.write_rows(sheet_name, rows)
                return rows[index]
        raise KeyError(f"{row_id} was not found.")

    def append_row(self, sheet_name: str, id_field: str, prefix: str, values: dict, defaults: dict | None = None) -> dict:
        rows = self.list_rows(sheet_name)
        row_id = str(values.get(id_field) or next_id(rows, id_field, prefix)).strip()
        if any(str(row.get(id_field)) == row_id for row in rows):
            raise ValueError(f"{row_id} already exists.")
        defaults = defaults or {}
        row = {header: values.get(header, defaults.get(header, "")) for header in self.sheets[sheet_name]}
        row[id_field] = row_id
        row = self.normalize_row(sheet_name, row)
        rows.append(row)
        self.write_rows(sheet_name, rows)
        return row

    def soft_delete(self, sheet_name: str, id_field: str, ids: list[str]) -> dict:
        return self._mutate_status(sheet_name, id_field, ids, "deleted")

    def restore(self, sheet_name: str, id_field: str, ids: list[str]) -> dict:
        return self._mutate_status(sheet_name, id_field, ids, "accountable")

    def refresh(self) -> dict:
        return {"ok": True, "mode": "local_csv"}

    def normalize_row(self, sheet_name: str, row: dict) -> dict:
        next_row = dict(row)
        if sheet_name == "accounts_register":
            currency = normalize_currency(next_row.get("account_currency"))
            next_row["account_currency"] = currency
            if has_value(next_row.get("balance_native")):
                native = next_row.get("balance_native")
                next_row.update(self.fx.conversion_fields(native, currency))
        elif sheet_name == "transactions_register":
            currency = normalize_currency(next_row.get("statement_currency"))
            next_row["statement_currency"] = currency
            native = first_value(next_row, "sanitized_statement_amount", "statement_amount")
            if has_value(native):
                if not has_value(next_row.get("sanitized_statement_amount")):
                    next_row["sanitized_statement_amount"] = str(native)
                next_row.update(self.fx.conversion_fields(native, currency))
        elif sheet_name == "trades_register":
            next_row["trade_currency"] = normalize_currency(next_row.get("trade_currency"))
        elif sheet_name == "portfolio_strategy_instruments":
            currency = normalize_currency(next_row.get("current_value_currency") or next_row.get("base_currency"))
            next_row["base_currency"] = normalize_currency(next_row.get("base_currency") or currency)
            next_row["current_value_currency"] = currency
            if has_value(next_row.get("current_value_native")):
                next_row["current_value_eur"] = f"{self.fx.convert(next_row.get('current_value_native'), currency, 'EUR'):.2f}"
        return next_row

    def _mutate_status(self, sheet_name: str, id_field: str, ids: list[str], ledger_status: str) -> dict:
        row_ids = normalize_ids(ids)
        rows = self.list_rows(sheet_name)
        found = set()
        for row in rows:
            if str(row.get(id_field, "")) in row_ids:
                found.add(str(row.get(id_field, "")))
                row["ledger_status"] = ledger_status
                if "review_status" in row:
                    row["review_status"] = "review_done" if ledger_status == "deleted" else "review_required"
        missing = [row_id for row_id in row_ids if row_id not in found]
        if missing:
            raise KeyError(f"Not found: {', '.join(missing)}")
        self.write_rows(sheet_name, rows)
        return {"ok": True, "count": len(row_ids), f"{id_field}s": row_ids}

    def _path(self, sheet_name: str) -> Path:
        return self.data_dir / f"{sheet_name}.csv"


def has_value(value: object) -> bool:
    return str(value or "").strip() != ""


def first_value(row: dict, *keys: str) -> object:
    for key in keys:
        if has_value(row.get(key)):
            return row.get(key)
    return ""
