from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
from typing import Any

from ledger_core.fx import DEFAULT_CONVERTER, FXConverter
from ledger_core.local_csv import LocalCsvLedgerStore
from ledger_core.schemas import SHEETS
from ledger_core.store import next_id, normalize_ids


GOOGLE_SCOPES = ("https://www.googleapis.com/auth/spreadsheets",)
SHEET_IMPORT_ALIASES = {
    # XLSX tab names are limited to 31 chars. The starter workbook uses this
    # Excel-safe name, then setup copies it into the canonical Google tab.
    "portfolio_monthly_investment_plan": "portfolio_monthly_investment_pl",
}
GOOGLE_DATE_FIELDS = {
    "mip_phase_end_date_target",
    "price_as_of",
    *{header for headers in SHEETS.values() for header in headers if header.endswith("_date")},
}
GOOGLE_SHEETS_DATE_EPOCH = date(1899, 12, 30)


@dataclass(frozen=True)
class GoogleSheetsConfig:
    spreadsheet_id: str
    credentials_path: Path


class GoogleSheetsLedgerStore:
    def __init__(
        self,
        config: GoogleSheetsConfig,
        *,
        sheets: dict[str, list[str]] | None = None,
        fx: FXConverter | None = None,
    ) -> None:
        self.config = config
        self.sheets = sheets or SHEETS
        self.fx = fx or DEFAULT_CONVERTER
        self._normalizer = LocalCsvLedgerStore(Path("."), sheets=self.sheets, fx=self.fx)
        self._service = None

    @property
    def service(self) -> Any:
        if self._service is None:
            self._service = build_sheets_service(self.config.credentials_path)
        return self._service

    def list_rows(self, sheet_name: str) -> list[dict]:
        return self._list_rows_from_tab(sheet_name, sheet_name)

    def _list_rows_from_tab(self, tab_name: str, sheet_name: str) -> list[dict]:
        headers = self.sheets[sheet_name]
        values = (
            self.service.spreadsheets()
            .values()
            .get(
                spreadsheetId=self.config.spreadsheet_id,
                range=f"{quote_sheet_name(tab_name)}!A1:{column_name(len(headers))}",
                valueRenderOption="UNFORMATTED_VALUE",
            )
            .execute()
            .get("values", [])
        )
        if not values:
            return []
        sheet_headers = [str(value).strip() for value in values[0]]
        if not any(sheet_headers):
            sheet_headers = headers
        rows = []
        for raw_row in values[1:]:
            row = {
                header: google_sheet_value(header, raw_row[index] if index < len(raw_row) else "")
                for index, header in enumerate(sheet_headers)
            }
            rows.append(self._normalizer.normalize_row(sheet_name, {header: row.get(header, "") for header in headers}))
        return rows

    def write_rows(self, sheet_name: str, rows: list[dict]) -> None:
        headers = self.sheets[sheet_name]
        values = [headers]
        for row in rows:
            normalized = self._normalizer.normalize_row(sheet_name, row)
            values.append([normalized.get(header, "") for header in headers])
        tab = quote_sheet_name(sheet_name)
        body = {"values": values}
        self.service.spreadsheets().values().clear(
            spreadsheetId=self.config.spreadsheet_id,
            range=f"{tab}!A:{column_name(len(headers))}",
            body={},
        ).execute()
        self.service.spreadsheets().values().update(
            spreadsheetId=self.config.spreadsheet_id,
            range=f"{tab}!A1",
            valueInputOption="USER_ENTERED",
            body=body,
        ).execute()

    def upsert_row(self, sheet_name: str, id_field: str, row_id: str, values: dict) -> dict:
        rows = self.list_rows(sheet_name)
        for index, row in enumerate(rows):
            if str(row.get(id_field, "")) == str(row_id):
                rows[index] = self._normalizer.normalize_row(sheet_name, {**row, **values})
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
        row = self._normalizer.normalize_row(sheet_name, row)
        rows.append(row)
        self.write_rows(sheet_name, rows)
        return row

    def soft_delete(self, sheet_name: str, id_field: str, ids: list[str]) -> dict:
        return self._mutate_status(sheet_name, id_field, ids, "deleted")

    def restore(self, sheet_name: str, id_field: str, ids: list[str]) -> dict:
        return self._mutate_status(sheet_name, id_field, ids, "accountable")

    def refresh(self) -> dict:
        return {"ok": True, "mode": "google_sheets", "spreadsheet_id": self.config.spreadsheet_id}

    def ensure_sheets(self) -> dict:
        metadata = self.service.spreadsheets().get(spreadsheetId=self.config.spreadsheet_id).execute()
        existing = {
            sheet["properties"]["title"]: sheet["properties"]["sheetId"]
            for sheet in metadata.get("sheets", [])
        }
        alias_rows = {}
        for sheet_name, alias in SHEET_IMPORT_ALIASES.items():
            if sheet_name not in existing and alias in existing:
                alias_rows[sheet_name] = self._list_rows_from_tab(alias, sheet_name)

        requests = [
            {"addSheet": {"properties": {"title": sheet_name}}}
            for sheet_name in self.sheets
            if sheet_name not in existing
        ]
        if requests:
            self.service.spreadsheets().batchUpdate(
                spreadsheetId=self.config.spreadsheet_id,
                body={"requests": requests},
            ).execute()

        for sheet_name, headers in self.sheets.items():
            rows = self.list_rows(sheet_name) if sheet_name in existing else []
            if sheet_name in alias_rows and not rows:
                self.write_rows(sheet_name, alias_rows[sheet_name])
            else:
                self.service.spreadsheets().values().update(
                    spreadsheetId=self.config.spreadsheet_id,
                    range=f"{quote_sheet_name(sheet_name)}!A1",
                    valueInputOption="USER_ENTERED",
                    body={"values": [headers]},
                ).execute()
        return {"ok": True, "sheets": list(self.sheets), "imported_aliases": sorted(alias_rows)}

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


def build_sheets_service(credentials_path: Path):
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError as error:
        raise RuntimeError(
            "Google Sheets mode requires Google client packages. Run: python3 -m pip install -r requirements-google.txt"
        ) from error

    credentials = service_account.Credentials.from_service_account_file(
        str(credentials_path),
        scopes=GOOGLE_SCOPES,
    )
    return build("sheets", "v4", credentials=credentials, cache_discovery=False)


def column_name(index: int) -> str:
    name = ""
    while index:
        index, remainder = divmod(index - 1, 26)
        name = chr(65 + remainder) + name
    return name or "A"


def quote_sheet_name(sheet_name: str) -> str:
    return "'" + sheet_name.replace("'", "''") + "'"


def google_sheet_value(header: str, value: Any) -> Any:
    if value is None:
        return ""
    if header not in GOOGLE_DATE_FIELDS:
        return value
    return google_date_serial_to_iso(value) or value


def google_date_serial_to_iso(value: Any) -> str:
    if isinstance(value, bool):
        return ""
    if isinstance(value, (int, float)):
        serial = float(value)
    elif isinstance(value, str) and value.strip().replace(".", "", 1).isdigit():
        serial = float(value.strip())
    else:
        return ""
    whole_days = int(serial)
    if abs(serial - whole_days) > 0.000001:
        return ""
    parsed = GOOGLE_SHEETS_DATE_EPOCH + timedelta(days=whole_days)
    if not 1900 <= parsed.year <= 2200:
        return ""
    return parsed.isoformat()
