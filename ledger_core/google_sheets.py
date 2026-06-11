from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from ledger_core.fx import DEFAULT_CONVERTER, FXConverter
from ledger_core.local_csv import LocalCsvLedgerStore
from ledger_core.schemas import SHEETS
from ledger_core.store import next_id, normalize_ids


GOOGLE_SCOPES = ("https://www.googleapis.com/auth/spreadsheets",)


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
        headers = self.sheets[sheet_name]
        values = (
            self.service.spreadsheets()
            .values()
            .get(
                spreadsheetId=self.config.spreadsheet_id,
                range=f"{quote_sheet_name(sheet_name)}!A1:{column_name(len(headers))}",
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
            row = {header: raw_row[index] if index < len(raw_row) else "" for index, header in enumerate(sheet_headers)}
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
            self.service.spreadsheets().values().update(
                spreadsheetId=self.config.spreadsheet_id,
                range=f"{quote_sheet_name(sheet_name)}!A1",
                valueInputOption="USER_ENTERED",
                body={"values": [headers]},
            ).execute()
        return {"ok": True, "sheets": list(self.sheets)}

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
