from __future__ import annotations

import base64
import getpass
import hashlib
import hmac
import json
import os
import secrets
import stat
from pathlib import Path


DEFAULT_AUTH_FILE = ".ledger_auth.json"
DEFAULT_ITERATIONS = 260_000


def truthy(value: object) -> bool:
    return str(value or "").strip().lower() in {"1", "true", "yes", "on"}


class AuthManager:
    def __init__(self, root: Path, *, env: dict[str, str] | None = None) -> None:
        self.root = Path(root)
        self.env = env or os.environ
        self.path = self._auth_path()

    def enabled(self) -> bool:
        if truthy(self.env.get("LEDGER_AUTH_DISABLED")):
            return False
        return self.path.exists()

    def verify_header(self, authorization: str | None) -> bool:
        if not self.enabled():
            return True
        credentials = self._read_config()
        if not credentials:
            return False
        username, password = parse_basic_authorization(authorization)
        if not username or not password:
            return False
        if not hmac.compare_digest(username, str(credentials.get("username", ""))):
            return False
        return verify_password(password, credentials)

    def realm(self) -> str:
        return str(self._read_config().get("realm") or "Ledger")

    def _auth_path(self) -> Path:
        configured = self.env.get("LEDGER_AUTH_CONFIG") or DEFAULT_AUTH_FILE
        path = Path(configured).expanduser()
        return path if path.is_absolute() else self.root / path

    def _read_config(self) -> dict:
        try:
            return json.loads(self.path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return {}


def parse_basic_authorization(authorization: str | None) -> tuple[str, str]:
    scheme, _, value = str(authorization or "").partition(" ")
    if scheme.lower() != "basic" or not value:
        return "", ""
    try:
        decoded = base64.b64decode(value.strip(), validate=True).decode("utf-8")
    except (ValueError, UnicodeDecodeError):
        return "", ""
    username, separator, password = decoded.partition(":")
    if not separator:
        return "", ""
    return username, password


def password_hash(password: str, salt_hex: str, iterations: int) -> str:
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt_hex),
        int(iterations),
    )
    return digest.hex()


def verify_password(password: str, credentials: dict) -> bool:
    salt = str(credentials.get("salt", ""))
    expected = str(credentials.get("password_hash", ""))
    iterations = int(credentials.get("iterations") or DEFAULT_ITERATIONS)
    if not salt or not expected:
        return False
    actual = password_hash(password, salt, iterations)
    return hmac.compare_digest(actual, expected)


def write_auth_config(path: Path, username: str, password: str, *, realm: str = "Ledger") -> None:
    salt = secrets.token_hex(16)
    payload = {
        "version": 1,
        "realm": realm,
        "username": username,
        "salt": salt,
        "iterations": DEFAULT_ITERATIONS,
        "password_hash": password_hash(password, salt, DEFAULT_ITERATIONS),
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    try:
        path.chmod(stat.S_IRUSR | stat.S_IWUSR)
    except OSError:
        pass


def setup_auth(root: Path, *, app_name: str = "Ledger", force: bool = False) -> int:
    if truthy(os.getenv("LEDGER_AUTH_DISABLED")):
        print("Ledger browser password is disabled by LEDGER_AUTH_DISABLED=1.")
        return 0
    manager = AuthManager(root)
    if manager.path.exists() and not force:
        print(f"{app_name} browser password already exists.")
        return 0

    print(f"\n{app_name} browser password setup")
    print("=" * (len(app_name) + 24))
    print("This protects the local web app with a browser username and password.")
    print("The password is hashed locally and is not committed to Git.")

    username = input("\nUsername [ledger]: ").strip() or "ledger"
    while True:
        password = getpass.getpass("Password: ")
        confirmation = getpass.getpass("Confirm password: ")
        if password != confirmation:
            print("Passwords did not match. Try again.")
            continue
        if len(password) < 8:
            print("Use at least 8 characters.")
            continue
        break

    write_auth_config(manager.path, username, password, realm=app_name)
    print(f"Wrote {manager.path}")
    return 0
