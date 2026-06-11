from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path


class SQLiteSheetCache:
    def __init__(self, path: Path | str) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._init()

    def put_sheet(self, sheet_name: str, rows: list[dict], headers: list[str]) -> None:
        now = time.time()
        with self._connect() as connection:
            connection.execute(
                """
                insert into sheet_cache(sheet_name, loaded_at, headers_json, rows_json)
                values(?, ?, ?, ?)
                on conflict(sheet_name) do update set
                    loaded_at=excluded.loaded_at,
                    headers_json=excluded.headers_json,
                    rows_json=excluded.rows_json
                """,
                (sheet_name, now, json.dumps(headers), json.dumps(rows, default=str)),
            )

    def get_sheet(self, sheet_name: str) -> tuple[list[dict], list[str], float] | None:
        with self._connect() as connection:
            row = connection.execute(
                "select rows_json, headers_json, loaded_at from sheet_cache where sheet_name=?",
                (sheet_name,),
            ).fetchone()
        if not row:
            return None
        rows_json, headers_json, loaded_at = row
        return json.loads(rows_json), json.loads(headers_json), float(loaded_at)

    def status(self) -> dict:
        with self._connect() as connection:
            rows = connection.execute(
                "select sheet_name, loaded_at, length(rows_json) from sheet_cache order by sheet_name"
            ).fetchall()
        return {
            "path": str(self.path),
            "sheets": [
                {"sheet": sheet, "loaded_at": loaded_at, "bytes": byte_count}
                for sheet, loaded_at, byte_count in rows
            ],
        }

    def clear(self) -> None:
        with self._connect() as connection:
            connection.execute("delete from sheet_cache")

    def _init(self) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                create table if not exists sheet_cache(
                    sheet_name text primary key,
                    loaded_at real not null,
                    headers_json text not null,
                    rows_json text not null
                )
                """
            )

    def _connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.path)
