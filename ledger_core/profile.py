from __future__ import annotations

import hashlib
import hmac
import json
import secrets
import stat
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DEFAULT_PROFILE_FILE = ".ledger_profile.json"
DEFAULT_ITERATIONS = 260_000
PROFILE_FIELDS = ("name", "surname", "username", "email")


class ProfileStore:
    def __init__(self, root: Path, *, file_name: str = DEFAULT_PROFILE_FILE) -> None:
        self.root = Path(root)
        self.path = self.root / file_name

    def read(self) -> dict[str, Any]:
        payload = self._read_payload()
        return public_profile(payload)

    def update(self, values: dict[str, Any]) -> dict[str, Any]:
        current = self._read_payload()
        next_payload = {
            "version": 1,
            **{field: clean_profile_value(values.get(field, current.get(field, ""))) for field in PROFILE_FIELDS},
            "updated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        }
        password = str(values.get("password") or "")
        if password:
            if len(password) < 8:
                raise ValueError("Profile password must be at least 8 characters.")
            salt = secrets.token_hex(16)
            next_payload.update(
                {
                    "salt": salt,
                    "iterations": DEFAULT_ITERATIONS,
                    "password_hash": password_hash(password, salt, DEFAULT_ITERATIONS),
                }
            )
        else:
            for field in ("salt", "iterations", "password_hash"):
                if current.get(field):
                    next_payload[field] = current[field]
        self._write_payload(next_payload)
        return public_profile(next_payload)

    def verify(self, username: str, password: str) -> bool:
        payload = self._read_payload()
        if not payload.get("password_hash"):
            return False
        if not hmac.compare_digest(str(username or ""), str(payload.get("username") or "")):
            return False
        return hmac.compare_digest(
            password_hash(str(password or ""), str(payload.get("salt") or ""), int(payload.get("iterations") or DEFAULT_ITERATIONS)),
            str(payload.get("password_hash") or ""),
        )

    def _read_payload(self) -> dict[str, Any]:
        try:
            payload = json.loads(self.path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return {}
        return payload if isinstance(payload, dict) else {}

    def _write_payload(self, payload: dict[str, Any]) -> None:
        self.path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
        try:
            self.path.chmod(stat.S_IRUSR | stat.S_IWUSR)
        except OSError:
            pass


def clean_profile_value(value: Any) -> str:
    return " ".join(str(value or "").strip().split())


def public_profile(payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "ok": True,
        "profile": {
            **{field: clean_profile_value(payload.get(field, "")) for field in PROFILE_FIELDS},
            "has_password": bool(payload.get("password_hash")),
            "updated_at": str(payload.get("updated_at") or ""),
        },
    }


def password_hash(password: str, salt_hex: str, iterations: int) -> str:
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt_hex),
        int(iterations),
    )
    return digest.hex()
