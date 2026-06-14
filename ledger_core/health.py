from __future__ import annotations

from collections import Counter
from datetime import date, datetime


def data_health_summary(rows_by_sheet: dict[str, list[dict]], *, today: date | None = None, stale_price_days: int = 7) -> dict:
    today = today or date.today()
    issues: list[dict] = []
    transactions = rows_by_sheet.get("transactions_register", [])
    accounts = rows_by_sheet.get("accounts_register", [])
    trades = rows_by_sheet.get("trades_register", [])
    portfolios = rows_by_sheet.get("portfolio_strategy_instruments", [])

    for row in transactions:
        tx_id = row.get("transaction_id", "")
        ledger_status = normalized_text(row.get("ledger_status")) or "accountable"
        if ledger_status == "deleted":
            continue
        currency = normalized_text(row.get("statement_currency")).upper()
        if not has_sheet_value(row.get("amount_eur_converted")) and currency not in {"", "EUR"}:
            issues.append(issue("missing_fx", "transactions_register", tx_id, "Transaction is missing EUR conversion."))
        if ledger_status == "accountable" and not has_sheet_value(row.get("category_id")):
            issues.append(issue("uncategorized", "transactions_register", tx_id, "Transaction has no category."))
        if normalized_text(row.get("imported_transaction")) not in {"yes", "no"}:
            issues.append(issue("unlinked_import", "transactions_register", tx_id, "Transaction import link status is missing."))
        if normalized_text(row.get("review_status")) in {"review_required", ""}:
            issues.append(issue("review_required", "transactions_register", tx_id, "Transaction requires review."))

    account_ids = {
        row.get("account_id")
        for row in accounts
        if row.get("account_id") and (normalized_text(row.get("ledger_status")) or "accountable") != "deleted"
    }
    for row in trades:
        trade_id = row.get("trade_id", "")
        if (normalized_text(row.get("ledger_status")) or "accountable") == "deleted":
            continue
        if row.get("account_id") and row.get("account_id") not in account_ids:
            issues.append(issue("broken_link", "trades_register", trade_id, "Trade references a missing account."))
        if normalized_text(row.get("position_status")) == "active" and stale_price(row.get("price_as_of"), today, stale_price_days):
            issues.append(issue("stale_price", "trades_register", trade_id, "Trade price is stale."))
        if normalized_text(row.get("review_status")) in {"review_required", ""}:
            issues.append(issue("review_required", "trades_register", trade_id, "Trade requires review."))

    portfolio_ids = {row.get("portfolio_id") for row in portfolios if row.get("portfolio_id")}
    for row in trades:
        if (normalized_text(row.get("ledger_status")) or "accountable") == "deleted":
            continue
        if row.get("portfolio_id") and portfolio_ids and row.get("portfolio_id") not in portfolio_ids:
            issues.append(issue("broken_link", "trades_register", row.get("trade_id", ""), "Trade references a missing portfolio."))

    counts = Counter(item["type"] for item in issues)
    return {"ok": not issues, "issue_count": len(issues), "counts": dict(sorted(counts.items())), "issues": issues}


def issue(issue_type: str, sheet: str, row_id: str, message: str) -> dict:
    return {"type": issue_type, "sheet": sheet, "row_id": row_id, "message": message}


def normalized_text(value: object) -> str:
    return str(value or "").strip().lower()


def has_sheet_value(value: object) -> bool:
    return value is not None and str(value).strip() != ""


def stale_price(value: object, today: date, stale_price_days: int) -> bool:
    if not value:
        return True
    try:
        parsed = datetime.strptime(str(value)[:10], "%Y-%m-%d").date()
    except ValueError:
        return True
    return (today - parsed).days > stale_price_days
