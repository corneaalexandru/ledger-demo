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
        if not row.get("amount_eur_converted") and row.get("statement_currency") not in {"", "EUR"}:
            issues.append(issue("missing_fx", "transactions_register", tx_id, "Transaction is missing EUR conversion."))
        if not row.get("category_id"):
            issues.append(issue("uncategorized", "transactions_register", tx_id, "Transaction has no category."))
        if row.get("imported_transaction") != "yes":
            issues.append(issue("unlinked_import", "transactions_register", tx_id, "Transaction is not linked to an imported source."))
        if row.get("review_status") in {"review_required", ""}:
            issues.append(issue("review_required", "transactions_register", tx_id, "Transaction requires review."))

    account_ids = {row.get("account_id") for row in accounts if row.get("account_id")}
    for row in trades:
        trade_id = row.get("trade_id", "")
        if row.get("account_id") and row.get("account_id") not in account_ids:
            issues.append(issue("broken_link", "trades_register", trade_id, "Trade references a missing account."))
        if stale_price(row.get("price_as_of"), today, stale_price_days):
            issues.append(issue("stale_price", "trades_register", trade_id, "Trade price is stale."))
        if row.get("review_status") in {"review_required", ""}:
            issues.append(issue("review_required", "trades_register", trade_id, "Trade requires review."))

    portfolio_ids = {row.get("portfolio_id") for row in portfolios if row.get("portfolio_id")}
    for row in trades:
        if row.get("portfolio_id") and portfolio_ids and row.get("portfolio_id") not in portfolio_ids:
            issues.append(issue("broken_link", "trades_register", row.get("trade_id", ""), "Trade references a missing portfolio."))

    counts = Counter(item["type"] for item in issues)
    return {"ok": not issues, "issue_count": len(issues), "counts": dict(sorted(counts.items())), "issues": issues}


def issue(issue_type: str, sheet: str, row_id: str, message: str) -> dict:
    return {"type": issue_type, "sheet": sheet, "row_id": row_id, "message": message}


def stale_price(value: object, today: date, stale_price_days: int) -> bool:
    if not value:
        return True
    try:
        parsed = datetime.strptime(str(value)[:10], "%Y-%m-%d").date()
    except ValueError:
        return True
    return (today - parsed).days > stale_price_days
