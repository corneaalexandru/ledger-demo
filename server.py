#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
import mimetypes
import re
import sys
import threading
import webbrowser
import zipfile
from collections import defaultdict
from datetime import date, datetime, timedelta
from html import escape as html_escape
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

from ledger_core.backups import backup_local_data
from ledger_core.fx import DEFAULT_CONVERTER, normalize_currency as core_normalize_currency
from ledger_core.health import data_health_summary
from ledger_core.local_csv import LocalCsvLedgerStore
from ledger_core.reports import report_presets
from ledger_core.schemas import SHEETS as CORE_SHEETS


ROOT = Path(__file__).resolve().parent
STATIC_DIR = ROOT / "static"
DATA_DIR = ROOT / "local_ledger_data"
WORKBOOK_PATH = ROOT / "local_ledger_workbook.xlsx"
LEGACY_DATA_DIR = ROOT / "mock_google_sheet"
LEGACY_WORKBOOK_PATH = ROOT / "mock_ledger_google_sheet.xlsx"
SHEET_DIR = DATA_DIR
TODAY = date(2026, 6, 10)

FX_RATES_TO_EUR = {
    "EUR": 1.0,
    "USD": 0.92,
    "AED": 0.25,
    "RON": 0.20,
    "GBP": 1.17,
    "CHF": 1.04,
    "CAD": 0.67,
    "AUD": 0.61,
    "JPY": 0.006,
}


ACCOUNTS_HEADERS = [
    "account_id",
    "provider_id",
    "account_reference",
    "account_status",
    "capital_bucket",
    "account_type",
    "account_currency",
    "balance_native",
    "amount_eur_converted",
    "amount_usd_converted",
    "credit_limit_native",
    "available_credit_native",
    "ledger_status",
    "review_status",
    "notes",
]

TRANSACTIONS_HEADERS = [
    "transaction_id",
    "transaction_date",
    "posted_date",
    "memo",
    "description",
    "category_id",
    "subcategory_id",
    "transaction_class",
    "source_system",
    "country_code",
    "statement_currency",
    "statement_amount",
    "sanitized_statement_amount",
    "amount_eur_converted",
    "amount_usd_converted",
    "account_id",
    "income_source",
    "merchant",
    "transfer_scope",
    "portfolio_id",
    "imported_transaction",
    "ledger_status",
    "review_status",
    "notes",
]

TRADES_HEADERS = [
    "trade_id",
    "account_id",
    "portfolio_id",
    "provider_id",
    "symbol",
    "asset_name",
    "instrument_type",
    "trade_currency",
    "quantity",
    "entry_date",
    "entry_price",
    "exit_date",
    "exit_price",
    "current_price",
    "price_as_of",
    "fees_native",
    "position_status",
    "realized_pl_native",
    "current_market_value_native",
    "unrealized_pl_native",
    "realized_pl_pct",
    "unrealized_pl_pct",
    "ledger_status",
    "review_status",
    "notes",
]

PORTFOLIO_HEADERS = [
    "portfolio_id",
    "portfolio_name",
    "provider",
    "base_currency",
    "asset_bucket",
    "asset_name",
    "ticker",
    "exchange",
    "asset_class",
    "isin",
    "current_value_native",
    "current_value_currency",
    "current_value_eur",
    "target_allocation_pct",
    "expected_cagr_pct",
    "expected_volatility_pct",
    "total_fees_pct",
    "achieved_pl_native",
    "achieved_return_pct",
    "fees_paid_native",
    "cost_base_eur",
    "contributed_eur",
    "notes",
]

MIP_HEADERS = [
    "_portfolio_mip_id",
    "portfolio_id",
    "portfolio_name",
    "provider",
    "start_date",
    "mip_phase_end_date_target",
    "portfolio_exit_date",
    "contribution_type",
    "contribution_role",
    "ph1",
    "ph2",
    "ph3",
    "ph4",
    "ph5",
    "ph6",
    "notes",
]

PHASE_HEADERS = ["phase_id", "phase_name", "start_date", "end_date"]

SHEETS = {
    "accounts_register": ACCOUNTS_HEADERS,
    "transactions_register": TRANSACTIONS_HEADERS,
    "trades_register": TRADES_HEADERS,
    "portfolio_strategy_instruments": PORTFOLIO_HEADERS,
    "portfolio_monthly_investment_plan": MIP_HEADERS,
    "portfolio_exit_phases": PHASE_HEADERS,
}

if SHEETS != CORE_SHEETS:
    raise RuntimeError("Public server schema drifted from ledger_core.schemas.")

STORE = LocalCsvLedgerStore(DATA_DIR, sheets=SHEETS, fx=DEFAULT_CONVERTER)


def money(value: float) -> float:
    return round(float(value or 0), 2)


def num(value, default: float = 0.0) -> float:
    if value is None:
        return default
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value).strip().replace(",", "")
    if not text:
        return default
    try:
        return float(text)
    except ValueError:
        return default


def has_value(value) -> bool:
    return str(value or "").strip() != ""


def money_text(value: float) -> str:
    return f"{money(value):.2f}"


def normalize_currency(value, default: str = "EUR") -> str:
    return core_normalize_currency(value, default)


def fx_rate_to_eur(currency: str) -> float:
    return FX_RATES_TO_EUR.get(normalize_currency(currency), 1.0)


def convert_currency(amount: float, source_currency: str, target_currency: str = "EUR") -> float:
    return float(DEFAULT_CONVERTER.convert(amount, source_currency, target_currency))


def row_amount(row: dict, *keys: str) -> float:
    for key in keys:
        if has_value(row.get(key)):
            return num(row.get(key))
    return 0.0


def account_amount_eur(row: dict) -> float:
    if has_value(row.get("amount_eur_converted")):
        return num(row.get("amount_eur_converted"))
    return convert_currency(num(row.get("balance_native")), row.get("account_currency", "EUR"), "EUR")


def account_native_field_eur(row: dict, field: str) -> float:
    return convert_currency(num(row.get(field)), row.get("account_currency", "EUR"), "EUR")


def transaction_amount_eur(row: dict) -> float:
    if has_value(row.get("amount_eur_converted")):
        return num(row.get("amount_eur_converted"))
    amount = row_amount(row, "sanitized_statement_amount", "statement_amount")
    return convert_currency(amount, row.get("statement_currency", "EUR"), "EUR")


def trade_value_eur(row: dict, field: str) -> float:
    return convert_currency(num(row.get(field)), row.get("trade_currency", "EUR"), "EUR")


def intish(value, default: int = 0) -> int:
    try:
        return int(float(str(value).replace(",", "")))
    except (TypeError, ValueError):
        return default


def iso_months(start: str, end: str) -> list[str]:
    year, month = [int(part) for part in start.split("-")]
    end_year, end_month = [int(part) for part in end.split("-")]
    months = []
    while (year, month) <= (end_year, end_month):
        months.append(f"{year:04d}-{month:02d}")
        month += 1
        if month == 13:
            year += 1
            month = 1
    return months


def month_end(month_key: str) -> str:
    year, month = [int(part) for part in month_key.split("-")]
    if month == 12:
        next_month = date(year + 1, 1, 1)
    else:
        next_month = date(year, month + 1, 1)
    return (next_month - timedelta(days=1)).isoformat()


def truthy(value) -> bool:
    return str(value or "").strip().lower() not in {"", "0", "false", "no", "none"}


def migrate_legacy_data_paths() -> None:
    local_has_rows = DATA_DIR.exists() and any(DATA_DIR.glob("*.csv"))
    if LEGACY_DATA_DIR.exists() and not local_has_rows:
        if DATA_DIR.exists():
            DATA_DIR.rmdir()
        LEGACY_DATA_DIR.rename(DATA_DIR)
    if LEGACY_WORKBOOK_PATH.exists() and not WORKBOOK_PATH.exists():
        LEGACY_WORKBOOK_PATH.rename(WORKBOOK_PATH)


def rows_path(sheet_name: str) -> Path:
    migrate_legacy_data_paths()
    return SHEET_DIR / f"{sheet_name}.csv"


def read_rows(sheet_name: str) -> list[dict]:
    migrate_legacy_data_paths()
    return STORE.list_rows(sheet_name)


def write_rows(sheet_name: str, rows: list[dict]) -> None:
    migrate_legacy_data_paths()
    SHEET_DIR.mkdir(parents=True, exist_ok=True)
    STORE.write_rows(sheet_name, rows)
    write_local_workbook()


def normalize_row(sheet_name: str, row: dict) -> dict:
    next_row = dict(row)
    if sheet_name == "accounts_register":
        currency = normalize_currency(next_row.get("account_currency"))
        next_row["account_currency"] = currency
        if has_value(next_row.get("balance_native")):
            native = num(next_row.get("balance_native"))
            next_row["amount_eur_converted"] = money_text(convert_currency(native, currency, "EUR"))
            next_row["amount_usd_converted"] = money_text(convert_currency(native, currency, "USD"))
    elif sheet_name == "transactions_register":
        currency = normalize_currency(next_row.get("statement_currency"))
        next_row["statement_currency"] = currency
        if has_value(next_row.get("sanitized_statement_amount")) or has_value(next_row.get("statement_amount")):
            native = row_amount(next_row, "sanitized_statement_amount", "statement_amount")
            if not has_value(next_row.get("sanitized_statement_amount")):
                next_row["sanitized_statement_amount"] = money_text(native)
            next_row["amount_eur_converted"] = money_text(convert_currency(native, currency, "EUR"))
            next_row["amount_usd_converted"] = money_text(convert_currency(native, currency, "USD"))
    elif sheet_name == "trades_register":
        next_row["trade_currency"] = normalize_currency(next_row.get("trade_currency"))
    elif sheet_name == "portfolio_strategy_instruments":
        currency = normalize_currency(next_row.get("current_value_currency") or next_row.get("base_currency"))
        next_row["base_currency"] = normalize_currency(next_row.get("base_currency") or currency)
        next_row["current_value_currency"] = currency
        if has_value(next_row.get("current_value_native")):
            next_row["current_value_eur"] = money_text(convert_currency(num(next_row.get("current_value_native")), currency, "EUR"))
    return next_row


def default_accounts() -> list[dict]:
    return [
        {
            "account_id": "acct_000001",
            "provider_id": "Revolut",
            "account_reference": "Everyday EUR",
            "account_status": "active",
            "capital_bucket": "liquid",
            "account_type": "bank_account",
            "account_currency": "EUR",
            "balance_native": "28450",
            "amount_eur_converted": "28450",
            "amount_usd_converted": "30726",
            "ledger_status": "accountable",
            "review_status": "reviewed",
            "notes": "Main operating account",
        },
        {
            "account_id": "acct_000002",
            "provider_id": "Wise",
            "account_reference": "Savings Reserve",
            "account_status": "active",
            "capital_bucket": "reserve",
            "account_type": "savings_account",
            "account_currency": "EUR",
            "balance_native": "44780",
            "amount_eur_converted": "44780",
            "amount_usd_converted": "48362",
            "ledger_status": "accountable",
            "review_status": "reviewed",
            "notes": "Six-month liquidity reserve",
        },
        {
            "account_id": "acct_000003",
            "provider_id": "IBKR",
            "account_reference": "Brokerage Main",
            "account_status": "active",
            "capital_bucket": "investment",
            "account_type": "brokerage",
            "account_currency": "USD",
            "balance_native": "159239.13",
            "ledger_status": "accountable",
            "review_status": "reviewed",
            "notes": "ETF and equity portfolio held in USD",
        },
        {
            "account_id": "acct_000004",
            "provider_id": "PensionCo",
            "account_reference": "Retirement Plan",
            "account_status": "active",
            "capital_bucket": "retirement",
            "account_type": "pension",
            "account_currency": "RON",
            "balance_native": "342000",
            "ledger_status": "accountable",
            "review_status": "reviewed",
            "notes": "Long-term pension capital in local currency",
        },
        {
            "account_id": "acct_000005",
            "provider_id": "Amex",
            "account_reference": "Credit Card",
            "account_status": "active",
            "capital_bucket": "liability",
            "account_type": "credit_card",
            "account_currency": "AED",
            "balance_native": "-14880",
            "credit_limit_native": "48000",
            "available_credit_native": "33120",
            "ledger_status": "accountable",
            "review_status": "reviewed",
            "notes": "Paid monthly",
        },
    ]


def default_transactions() -> list[dict]:
    rows = []
    counter = 1
    months = iso_months("2023-07", "2026-06")
    for index, month in enumerate(months):
        year, month_number = [int(part) for part in month.split("-")]
        base_day = date(year, month_number, 1)
        salary = 8300 + (index // 12) * 350
        bonus = 2200 if month_number in {3, 6, 9, 12} else 0
        rent = -2450 - (index // 12) * 120
        groceries = -880 - (index % 5) * 25
        utilities = -360 - (index % 4) * 18
        dining = -540 - (index % 6) * 45
        travel = -900 - (700 if month_number in {4, 8, 12} else 0)
        investment = -1800 - (index // 12) * 250
        entries = [
            (2, "Employer salary", "Salary", "salary", "salary", salary, "acct_000001", "Employer", "payroll"),
            (4, "Quarterly consulting invoice", "Consulting", "consulting", "consulting", bonus, "acct_000001", "Consulting", "invoice"),
            (6, "Monthly rent", "Housing", "rent", "expense", rent, "acct_000001", "", "landlord"),
            (9, "Groceries and household", "Food", "groceries", "expense", groceries, "acct_000005", "", "market"),
            (12, "Utilities", "Home", "utilities", "expense", utilities, "acct_000001", "", "utility"),
            (18, "Dining and social", "Lifestyle", "dining", "expense", dining, "acct_000005", "", "restaurants"),
            (22, "Travel and mobility", "Travel", "travel", "expense", travel, "acct_000005", "", "travel"),
            (25, "Brokerage contribution", "Investing", "portfolio_contribution", "transfer", investment, "acct_000001", "", "IBKR"),
        ]
        for day_offset, memo, category, subcategory, klass, amount, account_id, income_source, merchant in entries:
            if amount == 0:
                continue
            tx_date = (base_day + timedelta(days=min(day_offset, 27))).isoformat()
            rows.append(
                {
                    "transaction_id": f"tx_{counter:06d}",
                    "transaction_date": tx_date,
                    "posted_date": tx_date,
                    "memo": memo,
                    "description": f"{memo} ({month})",
                    "category_id": category,
                    "subcategory_id": subcategory,
                    "transaction_class": klass,
                    "source_system": "Local Ledger",
                    "country_code": "AE",
                    "statement_currency": "EUR",
                    "statement_amount": f"{amount:.2f}",
                    "sanitized_statement_amount": f"{amount:.2f}",
                    "amount_eur_converted": f"{amount:.2f}",
                    "amount_usd_converted": f"{amount * 1.08:.2f}",
                    "account_id": account_id,
                    "income_source": income_source,
                    "merchant": merchant,
                    "transfer_scope": "portfolio" if klass == "transfer" else "",
                    "portfolio_id": "core" if klass == "transfer" else "",
                    "imported_transaction": "yes",
                    "ledger_status": "accountable",
                    "review_status": "reviewed",
                    "notes": "",
                }
            )
            counter += 1
    return rows


def default_trades() -> list[dict]:
    seed = [
        ("tr_000001", "VWCE", "Vanguard FTSE All-World UCITS ETF", 410, "2023-09-15", 97.4, "", "", 123.2, 12.0, "active", "EUR"),
        ("tr_000002", "CSPX", "iShares Core S&P 500 UCITS ETF", 96, "2024-01-18", 430.0, "", "", 548.5, 18.0, "active", "USD"),
        ("tr_000003", "EIMI", "iShares Core MSCI EM IMI", 820, "2024-03-12", 29.6, "", "", 34.1, 8.0, "active", "EUR"),
        ("tr_000004", "MSFT", "Microsoft", 45, "2024-05-10", 376.0, "", "", 451.0, 22.0, "active", "USD"),
        ("tr_000005", "ASML", "ASML Holding", 18, "2024-10-02", 664.0, "", "", 733.0, 16.0, "active", "EUR"),
        ("tr_000006", "NVDA", "NVIDIA", 90, "2024-02-20", 78.0, "2025-08-12", 122.0, 122.0, 14.0, "closed", "USD"),
        ("tr_000007", "TSLA", "Tesla", 35, "2024-07-08", 248.0, "2025-02-21", 211.0, 211.0, 11.0, "closed", "USD"),
        ("tr_000008", "AGGU", "iShares Global Aggregate Bond", 540, "2025-01-17", 5.21, "", "", 5.43, 5.0, "active", "EUR"),
    ]
    rows = []
    for trade_id, symbol, name, qty, entry_date, entry, exit_date, exit_price, current, fee, status, currency in seed:
        realized = (num(exit_price) - entry) * qty - fee if status == "closed" else 0
        market_value = current * qty if status == "active" else 0
        unrealized = (current - entry) * qty - fee if status == "active" else 0
        rows.append(
            {
                "trade_id": trade_id,
                "account_id": "acct_000003",
                "portfolio_id": "core",
                "provider_id": "IBKR",
                "symbol": symbol,
                "asset_name": name,
                "instrument_type": "ETF" if symbol in {"VWCE", "CSPX", "EIMI", "AGGU"} else "Stock",
                "trade_currency": currency,
                "quantity": str(qty),
                "entry_date": entry_date,
                "entry_price": f"{entry:.2f}",
                "exit_date": exit_date,
                "exit_price": str(exit_price),
                "current_price": f"{current:.2f}",
                "price_as_of": "2026-06-10",
                "fees_native": f"{fee:.2f}",
                "position_status": status,
                "realized_pl_native": f"{realized:.2f}",
                "current_market_value_native": f"{market_value:.2f}",
                "unrealized_pl_native": f"{unrealized:.2f}",
                "realized_pl_pct": f"{(realized / (entry * qty) * 100) if entry * qty else 0:.2f}",
                "unrealized_pl_pct": f"{(unrealized / (entry * qty) * 100) if entry * qty else 0:.2f}",
                "ledger_status": "accountable",
                "review_status": "reviewed",
                "notes": "Sample investment row",
            }
        )
    return rows


def default_portfolio_rows() -> list[dict]:
    return [
        {
            "portfolio_id": "core",
            "portfolio_name": "Core Portfolio",
            "provider": "IBKR",
            "base_currency": "EUR",
            "asset_bucket": "core_liquid_market",
            "asset_name": "Global ETF Allocation",
            "ticker": "VWCE/CSPX/EIMI",
            "exchange": "LSE/XETRA",
            "asset_class": "ETF",
            "current_value_native": "118500",
            "current_value_currency": "EUR",
            "current_value_eur": "118500",
            "target_allocation_pct": "50",
            "expected_cagr_pct": "6.5",
            "expected_volatility_pct": "13",
            "total_fees_pct": "0.22",
            "achieved_pl_native": "24750",
            "achieved_return_pct": "26.4",
            "fees_paid_native": "440",
            "cost_base_eur": "93750",
            "contributed_eur": "97500",
            "notes": "Broad-market core allocation",
        },
        {
            "portfolio_id": "growth",
            "portfolio_name": "Growth Portfolio",
            "provider": "IBKR",
            "base_currency": "USD",
            "asset_bucket": "single_stocks",
            "asset_name": "Quality Growth Basket",
            "ticker": "MSFT/ASML",
            "exchange": "NASDAQ/Euronext",
            "asset_class": "Equity",
            "current_value_native": "47391.30",
            "current_value_currency": "USD",
            "current_value_eur": "43600",
            "target_allocation_pct": "20",
            "expected_cagr_pct": "8",
            "expected_volatility_pct": "22",
            "total_fees_pct": "0.05",
            "achieved_pl_native": "7900",
            "achieved_return_pct": "22.1",
            "fees_paid_native": "190",
            "cost_base_eur": "35700",
            "contributed_eur": "36500",
            "notes": "Concentrated growth sleeve",
        },
        {
            "portfolio_id": "defensive",
            "portfolio_name": "Defensive Portfolio",
            "provider": "IBKR",
            "base_currency": "EUR",
            "asset_bucket": "bonds",
            "asset_name": "Global Bonds",
            "ticker": "AGGU",
            "exchange": "LSE",
            "asset_class": "Bond ETF",
            "current_value_native": "29320",
            "current_value_currency": "EUR",
            "current_value_eur": "29320",
            "target_allocation_pct": "15",
            "expected_cagr_pct": "3.2",
            "expected_volatility_pct": "5",
            "total_fees_pct": "0.1",
            "achieved_pl_native": "1180",
            "achieved_return_pct": "4.2",
            "fees_paid_native": "40",
            "cost_base_eur": "28140",
            "contributed_eur": "28200",
            "notes": "Lower-volatility stabilizer",
        },
        {
            "portfolio_id": "pension",
            "portfolio_name": "Pension Portfolio",
            "provider": "PensionCo",
            "base_currency": "RON",
            "asset_bucket": "retirement",
            "asset_name": "Employer Pension Fund",
            "ticker": "PENSION",
            "exchange": "Internal",
            "asset_class": "Pension",
            "current_value_native": "342000",
            "current_value_currency": "RON",
            "current_value_eur": "68400",
            "target_allocation_pct": "15",
            "expected_cagr_pct": "4.8",
            "expected_volatility_pct": "9",
            "total_fees_pct": "0.7",
            "achieved_pl_native": "9200",
            "achieved_return_pct": "15.5",
            "fees_paid_native": "620",
            "cost_base_eur": "59200",
            "contributed_eur": "61100",
            "notes": "Retirement account balance",
        },
    ]


def default_mip_rows() -> list[dict]:
    return [
        {
            "_portfolio_mip_id": "core::mip::self",
            "portfolio_id": "core",
            "portfolio_name": "Core Portfolio",
            "provider": "IBKR",
            "start_date": "2026-06-01",
            "mip_phase_end_date_target": "2035-12-31",
            "portfolio_exit_date": "2050-12-31",
            "contribution_type": "mip",
            "contribution_role": "self",
            "ph1": "1800",
            "ph2": "2300",
            "ph3": "2900",
            "ph4": "3400",
            "ph5": "2600",
            "ph6": "1200",
            "notes": "Main recurring deployment plan",
        },
        {
            "_portfolio_mip_id": "growth::mip::self",
            "portfolio_id": "growth",
            "portfolio_name": "Growth Portfolio",
            "provider": "IBKR",
            "start_date": "2026-06-01",
            "mip_phase_end_date_target": "2032-12-31",
            "portfolio_exit_date": "2045-12-31",
            "contribution_type": "mip",
            "contribution_role": "self",
            "ph1": "650",
            "ph2": "850",
            "ph3": "1000",
            "ph4": "1100",
            "ph5": "750",
            "ph6": "300",
            "notes": "Higher-risk satellite sleeve",
        },
        {
            "_portfolio_mip_id": "defensive::mip::self",
            "portfolio_id": "defensive",
            "portfolio_name": "Defensive Portfolio",
            "provider": "IBKR",
            "start_date": "2026-06-01",
            "mip_phase_end_date_target": "2040-12-31",
            "portfolio_exit_date": "2050-12-31",
            "contribution_type": "mip",
            "contribution_role": "self",
            "ph1": "450",
            "ph2": "500",
            "ph3": "600",
            "ph4": "700",
            "ph5": "900",
            "ph6": "1100",
            "notes": "Risk reduction and income sleeve",
        },
    ]


def default_phase_rows() -> list[dict]:
    return [
        {"phase_id": "ph1", "phase_name": "Foundation", "start_date": "2026-06-01", "end_date": "2029-12-31"},
        {"phase_id": "ph2", "phase_name": "Scale", "start_date": "2030-01-01", "end_date": "2034-12-31"},
        {"phase_id": "ph3", "phase_name": "Acceleration", "start_date": "2035-01-01", "end_date": "2039-12-31"},
        {"phase_id": "ph4", "phase_name": "Peak Deployment", "start_date": "2040-01-01", "end_date": "2044-12-31"},
        {"phase_id": "ph5", "phase_name": "De-risk", "start_date": "2045-01-01", "end_date": "2048-12-31"},
        {"phase_id": "ph6", "phase_name": "Exit", "start_date": "2049-01-01", "end_date": "2050-12-31"},
    ]


def ensure_local_data(reset: bool = False) -> None:
    migrate_legacy_data_paths()
    SHEET_DIR.mkdir(parents=True, exist_ok=True)
    defaults = {
        "accounts_register": default_accounts,
        "transactions_register": default_transactions,
        "trades_register": default_trades,
        "portfolio_strategy_instruments": default_portfolio_rows,
        "portfolio_monthly_investment_plan": default_mip_rows,
        "portfolio_exit_phases": default_phase_rows,
    }
    for sheet_name, factory in defaults.items():
        if reset or not rows_path(sheet_name).exists():
            write_rows(sheet_name, factory())
    write_local_workbook()


def column_letter(index: int) -> str:
    letters = ""
    while index:
        index, remainder = divmod(index - 1, 26)
        letters = chr(65 + remainder) + letters
    return letters or "A"


def xml_cell(value, row_index: int, col_index: int) -> str:
    ref = f"{column_letter(col_index)}{row_index}"
    text = "" if value is None else str(value)
    if re.fullmatch(r"-?\d+(\.\d+)?", text):
        return f'<c r="{ref}"><v>{text}</v></c>'
    return f'<c r="{ref}" t="inlineStr"><is><t>{html_escape(text)}</t></is></c>'


def worksheet_xml(headers: list[str], rows: list[dict]) -> str:
    sheet_rows = []
    all_rows = [dict(zip(headers, headers)), *rows]
    for row_index, row in enumerate(all_rows, start=1):
        cells = "".join(xml_cell(row.get(header, ""), row_index, col_index) for col_index, header in enumerate(headers, start=1))
        sheet_rows.append(f'<row r="{row_index}">{cells}</row>')
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f"<sheetData>{''.join(sheet_rows)}</sheetData></worksheet>"
    )


WORKBOOK_ZIP_TIMESTAMP = (2026, 6, 10, 0, 0, 0)


def write_workbook_part(zf: zipfile.ZipFile, path: str, content: str) -> None:
    info = zipfile.ZipInfo(path, WORKBOOK_ZIP_TIMESTAMP)
    info.compress_type = zipfile.ZIP_DEFLATED
    info.external_attr = 0o644 << 16
    zf.writestr(info, content)


def write_local_workbook() -> None:
    migrate_legacy_data_paths()
    SHEET_DIR.mkdir(parents=True, exist_ok=True)
    sheet_names = list(SHEETS)
    with zipfile.ZipFile(WORKBOOK_PATH, "w") as zf:
        write_workbook_part(
            zf,
            "[Content_Types].xml",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            '<Default Extension="xml" ContentType="application/xml"/>'
            '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            + "".join(
                f'<Override PartName="/xl/worksheets/sheet{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
                for i in range(1, len(sheet_names) + 1)
            )
            + "</Types>",
        )
        write_workbook_part(
            zf,
            "_rels/.rels",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
            "</Relationships>",
        )
        write_workbook_part(
            zf,
            "xl/workbook.xml",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
            'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            "<sheets>"
            + "".join(
                f'<sheet name="{html_escape(name[:31])}" sheetId="{i}" r:id="rId{i}"/>'
                for i, name in enumerate(sheet_names, start=1)
            )
            + "</sheets></workbook>",
        )
        write_workbook_part(
            zf,
            "xl/_rels/workbook.xml.rels",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            + "".join(
                f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i}.xml"/>'
                for i in range(1, len(sheet_names) + 1)
            )
            + "</Relationships>",
        )
        for i, sheet_name in enumerate(sheet_names, start=1):
            write_workbook_part(zf, f"xl/worksheets/sheet{i}.xml", worksheet_xml(SHEETS[sheet_name], read_rows(sheet_name)))


def active_rows(rows: list[dict]) -> list[dict]:
    return [row for row in rows if str(row.get("ledger_status", "accountable")).lower() != "deleted"]


def filter_rows(rows: list[dict], params: dict[str, str], fields: list[str]) -> list[dict]:
    query = str(params.get("q", "")).strip().lower()
    result = rows
    if query:
        result = [row for row in result if any(query in str(row.get(field, "")).lower() for field in fields)]
    for key, value in params.items():
        if key in {"q", "limit", "offset", "sort", "direction", "scope", "date_from", "date_to", "period", "month", "window"}:
            continue
        if not value:
            continue
        result = [row for row in result if str(row.get(key, "")).lower() == str(value).lower()]
    if params.get("date_from"):
        result = [row for row in result if str(row.get("transaction_date") or row.get("entry_date") or row.get("posted_date") or "") >= params["date_from"]]
    if params.get("date_to"):
        result = [row for row in result if str(row.get("transaction_date") or row.get("entry_date") or row.get("posted_date") or "") <= params["date_to"]]
    return result


def sorted_page(rows: list[dict], params: dict[str, str], default_sort: str) -> tuple[list[dict], int, int]:
    sort_field = params.get("sort") or default_sort
    direction = params.get("direction") or "desc"
    rows = sorted(rows, key=lambda row: sort_key(row.get(sort_field, ""), sort_field), reverse=direction != "asc")
    limit_raw = params.get("limit", "50")
    limit = len(rows) if limit_raw == "all" else max(1, min(intish(limit_raw, 50), 1000))
    offset = max(0, intish(params.get("offset"), 0))
    return rows[offset : offset + limit], limit, offset


def sort_key(value, field: str):
    if "date" in field or field in {"month", "activity_date"}:
        return str(value or "")
    if re.search(r"(amount|balance|value|price|fees|pl|pct|quantity|used|income|expense|net)", field):
        return num(value)
    return str(value or "").lower()


def ids_in_body(payload: dict, key: str) -> list[str]:
    values = payload.get(key, [])
    if isinstance(values, str):
        values = [values]
    return [str(value).strip() for value in values if str(value).strip()]


def next_id(rows: list[dict], field: str, prefix: str) -> str:
    max_number = 0
    for row in rows:
        match = re.search(r"(\d+)$", str(row.get(field, "")))
        if match:
            max_number = max(max_number, int(match.group(1)))
    return f"{prefix}_{max_number + 1:06d}"


def upsert_row(sheet_name: str, id_field: str, row_id: str, values: dict) -> dict:
    rows = read_rows(sheet_name)
    headers = SHEETS[sheet_name]
    for index, row in enumerate(rows):
        if str(row.get(id_field, "")) == str(row_id):
            next_row = {**row, **{key: values.get(key, row.get(key, "")) for key in headers if key in values}}
            rows[index] = next_row
            write_rows(sheet_name, rows)
            return next_row
    raise KeyError(f"{row_id} was not found.")


def create_row(sheet_name: str, id_field: str, prefix: str, values: dict, defaults: dict) -> dict:
    rows = read_rows(sheet_name)
    row_id = str(values.get(id_field) or next_id(rows, id_field, prefix)).strip()
    if any(str(row.get(id_field)) == row_id for row in rows):
        raise ValueError(f"{row_id} already exists.")
    row = {header: values.get(header, defaults.get(header, "")) for header in SHEETS[sheet_name]}
    row[id_field] = row_id
    rows.append(row)
    write_rows(sheet_name, rows)
    return row


def mutate_status(sheet_name: str, id_field: str, ids: list[str], ledger_status: str, remove: bool = False) -> dict:
    rows = read_rows(sheet_name)
    found = set()
    next_rows = []
    for row in rows:
        row_id = str(row.get(id_field, ""))
        if row_id in ids:
            found.add(row_id)
            if remove:
                continue
            row["ledger_status"] = ledger_status
            if "review_status" in row:
                row["review_status"] = "reviewed" if ledger_status == "deleted" else "review_required"
        next_rows.append(row)
    missing = [row_id for row_id in ids if row_id not in found]
    if missing:
        raise KeyError(f"Not found: {', '.join(missing)}")
    write_rows(sheet_name, next_rows)
    return {"ok": True, f"{id_field}s": ids, "count": len(ids)}


def duplicate_rows(sheet_name: str, id_field: str, prefix: str, ids: list[str]) -> dict:
    rows = read_rows(sheet_name)
    by_id = {str(row.get(id_field)): row for row in rows}
    created = []
    for source_id in ids:
        if source_id not in by_id:
            raise KeyError(f"{source_id} was not found.")
        row = dict(by_id[source_id])
        row[id_field] = next_id(rows + created, id_field, prefix)
        row["ledger_status"] = "accountable"
        row["review_status"] = "review_required"
        rows.append(row)
        created.append(row)
    write_rows(sheet_name, rows)
    return {"ok": True, "created": created, "count": len(created)}


def account_summary(rows: list[dict]) -> dict:
    active = active_rows(rows)
    total = money(sum(account_amount_eur(row) for row in active))
    by_bucket = defaultdict(float)
    by_provider = defaultdict(float)
    by_type = defaultdict(float)
    by_currency = defaultdict(float)
    credit_cards = []
    for row in active:
        amount = account_amount_eur(row)
        by_bucket[row.get("capital_bucket") or "other"] += amount
        by_provider[row.get("provider_id") or "Unknown"] += amount
        by_type[row.get("account_type") or "account"] += amount
        by_currency[row.get("account_currency") or "EUR"] += amount
        if "credit" in str(row.get("account_type", "")).lower():
            used = abs(account_native_field_eur(row, "balance_native"))
            limit = account_native_field_eur(row, "credit_limit_native")
            credit_cards.append(
                {
                    "account_id": row.get("account_id"),
                    "provider_id": row.get("provider_id"),
                    "used_eur": money(used),
                    "limit_eur": money(limit),
                    "available_eur": money(account_native_field_eur(row, "available_credit_native")),
                    "utilization_pct": money((used / limit * 100) if limit else 0),
                }
            )
    liquid = by_bucket["liquid"] + by_bucket["reserve"]
    return {
        "net_worth_eur": total,
        "assets_eur": money(sum(max(account_amount_eur(row), 0) for row in active)),
        "liabilities_eur": money(sum(min(account_amount_eur(row), 0) for row in active)),
        "liquid_capital_eur": money(liquid),
        "non_liquid_capital_eur": money(total - liquid),
        "active_accounts": len(active),
        "review_open": sum(1 for row in rows if row.get("review_status") != "reviewed"),
        "by_bucket": [{"label": key, "value": money(value), "amount_eur": money(value)} for key, value in sorted(by_bucket.items())],
        "by_provider": [{"label": key, "value": money(value), "amount_eur": money(value)} for key, value in sorted(by_provider.items())],
        "by_type": [{"label": key, "value": money(value), "amount_eur": money(value)} for key, value in sorted(by_type.items())],
        "by_currency": [{"label": key, "value": money(value), "amount_eur": money(value)} for key, value in sorted(by_currency.items())],
        "credit_cards": credit_cards,
    }


def transaction_amount(row: dict) -> float:
    return transaction_amount_eur(row)


def transaction_summary(rows: list[dict]) -> dict:
    active = active_rows(rows)
    monthly = defaultdict(lambda: {"income_eur": 0.0, "expense_eur": 0.0, "net_eur": 0.0, "transfers_eur": 0.0, "transactions": 0})
    income_by_source = defaultdict(float)
    spend_by_category = defaultdict(float)
    for row in active:
        amount = transaction_amount(row)
        month = str(row.get("transaction_date") or row.get("posted_date") or "")[:7]
        if not month:
            continue
        bucket = monthly[month]
        bucket["transactions"] += 1
        bucket["net_eur"] += amount
        if amount >= 0:
            bucket["income_eur"] += amount
            income_by_source[row.get("income_source") or row.get("category_id") or "Income"] += amount
        elif row.get("transaction_class") == "transfer":
            bucket["transfers_eur"] += abs(amount)
        else:
            bucket["expense_eur"] += abs(amount)
            spend_by_category[row.get("category_id") or "Expense"] += abs(amount)
    monthly_series = [
        {
            "month": month,
            "income_eur": money(values["income_eur"]),
            "expense_eur": money(values["expense_eur"]),
            "net_eur": money(values["net_eur"]),
            "transfers_eur": money(values["transfers_eur"]),
            "transactions": values["transactions"],
        }
        for month, values in sorted(monthly.items())
    ]
    current_year = str(TODAY.year)
    ytd = [row for row in active if str(row.get("transaction_date", "")).startswith(current_year)]
    income = sum(transaction_amount(row) for row in active if transaction_amount(row) > 0)
    expenses = abs(sum(transaction_amount(row) for row in active if transaction_amount(row) < 0 and row.get("transaction_class") != "transfer"))
    ytd_net = sum(transaction_amount(row) for row in ytd)
    current_month = monthly.get(f"{TODAY.year:04d}-{TODAY.month:02d}", {})
    yearly_targets, monthly_targets = planning_targets(monthly_series)
    structural = sum(num(row.get("structural_overspending_eur")) for row in monthly_targets)
    return {
        "lifetime_income_eur": money(income),
        "lifetime_expense_eur": money(expenses),
        "lifetime_net_eur": money(income - expenses),
        "income_eur": money(income),
        "expense_eur": money(expenses),
        "net_eur": money(sum(transaction_amount(row) for row in active)),
        "ytd_net_eur": money(ytd_net),
        "current_month_income_eur": money(current_month.get("income_eur", 0)),
        "current_month_expense_eur": money(current_month.get("expense_eur", 0)),
        "current_month_net_eur": money(current_month.get("net_eur", 0)),
        "monthly_series": monthly_series,
        "income_sources": [{"label": key, "amount_eur": money(value), "value": money(value)} for key, value in sorted(income_by_source.items(), key=lambda item: -item[1])],
        "category_spend": [{"label": key, "amount_eur": money(value), "value": money(value)} for key, value in sorted(spend_by_category.items(), key=lambda item: -item[1])],
        "capital_targets": {
            "income_baseline_eur": money(sum(num(row.get("income_baseline_eur")) for row in yearly_targets)),
            "target_savings_eur": money(sum(num(row.get("target_savings_eur")) for row in yearly_targets)),
            "actual_savings_eur": money(sum(num(row.get("actual_savings_eur")) for row in yearly_targets)),
            "actual_expenses_eur": money(sum(num(row.get("actual_expenses_eur")) for row in yearly_targets)),
            "structural_overspending_eur": money(structural),
        },
        "yearly_targets": yearly_targets,
        "monthly_targets": monthly_targets,
        "review_open": sum(1 for row in rows if row.get("review_status") != "reviewed"),
        "uncategorized": sum(1 for row in active if not row.get("category_id")),
        "missing_core_fields": 0,
        "imported_no": sum(1 for row in active if row.get("imported_transaction") != "yes"),
        "total": len(active),
    }


def planning_targets(monthly_series: list[dict]) -> tuple[list[dict], list[dict]]:
    monthly_rows = []
    for row in monthly_series:
        income = num(row.get("income_eur"))
        expenses = num(row.get("expense_eur"))
        if income <= 0:
            income = 8600
        ceiling = income * 0.48
        savings_target = income - ceiling
        monthly_rows.append(
            {
                "month": row["month"],
                "income_target_eur": money(income),
                "expense_ceiling_eur": money(ceiling),
                "savings_target_eur": money(savings_target),
                "actual_expense_eur": money(expenses),
                "structural_overspending_eur": money(max(expenses - ceiling, 0)),
            }
        )
    by_year = defaultdict(list)
    for row in monthly_rows:
        by_year[row["month"][:4]].append(row)
    yearly_rows = []
    for year, rows in sorted(by_year.items()):
        income = sum(num(row["income_target_eur"]) for row in rows)
        ceiling = sum(num(row["expense_ceiling_eur"]) for row in rows)
        target = sum(num(row["savings_target_eur"]) for row in rows)
        actual_expense = sum(num(row["actual_expense_eur"]) for row in rows)
        actual_savings = income - actual_expense
        yearly_rows.append(
            {
                "year": int(year),
                "source": "monthly_targets",
                "income_target_label": "Sample recurring income",
                "income_baseline_eur": money(income),
                "expense_ceiling_eur": money(ceiling),
                "target_savings_eur": money(target),
                "actual_expenses_eur": money(actual_expense),
                "actual_savings_eur": money(actual_savings),
                "structural_overspending_eur": money(max(actual_expense - ceiling, 0)),
                "expense_target_pct": money((ceiling / income * 100) if income else 0),
                "savings_target_pct": money((target / income * 100) if income else 0),
                "actual_expense_pct": money((actual_expense / income * 100) if income else 0),
                "actual_savings_pct": money((actual_savings / income * 100) if income else 0),
                "status": "above_ceiling" if actual_expense > ceiling else "on_target",
            }
        )
    return yearly_rows, monthly_rows


def trade_summary(rows: list[dict]) -> dict:
    active = active_rows(rows)
    realized = sum(trade_value_eur(row, "realized_pl_native") for row in active)
    unrealized = sum(trade_value_eur(row, "unrealized_pl_native") for row in active)
    market_value = sum(trade_value_eur(row, "current_market_value_native") for row in active)
    fees = sum(trade_value_eur(row, "fees_native") for row in active)
    active_positions = sum(1 for row in active if row.get("position_status") == "active")
    closed_positions = sum(1 for row in active if row.get("position_status") == "closed")
    return {
        "realized_pl_eur": money(realized),
        "unrealized_pl_eur": money(unrealized),
        "total_pl_eur": money(realized + unrealized),
        "market_value_eur": money(market_value),
        "fees_eur": money(fees),
        "active_positions": active_positions,
        "closed_positions": closed_positions,
        "trades": len(active),
        "realized_pl_by_currency": [{"currency": "EUR", "amount": money(realized), "amount_eur": money(realized)}],
        "unrealized_pl_by_currency": [{"currency": "EUR", "amount": money(unrealized), "amount_eur": money(unrealized)}],
        "market_value_by_currency": [{"currency": "EUR", "amount": money(market_value), "amount_eur": money(market_value)}],
    }


def portfolio_payload(accounts: dict, transactions: dict, trades: dict) -> dict:
    instruments = read_rows("portfolio_strategy_instruments")
    mip_rows = [mip_row_payload(row) for row in read_rows("portfolio_monthly_investment_plan")]
    phases = phase_payload(mip_rows)
    current_value = sum(num(row.get("current_value_eur")) for row in instruments)
    contributed = sum(num(row.get("contributed_eur")) for row in instruments)
    achieved = current_value - contributed
    monthly_plan = sum(num(row.get("ph1")) for row in read_rows("portfolio_monthly_investment_plan"))
    performance_rows = []
    start_value = max(contributed * 0.72, 1)
    for i, month in enumerate(iso_months("2023-07", "2026-06")):
        progress = i / 35
        performance_rows.append(
            {
                "month": month,
                "current_value_eur": money(start_value + (current_value - start_value) * progress),
                "contributed_eur": money(contributed * (0.5 + 0.5 * progress)),
                "plan_to_date_eur": money(contributed * (0.54 + 0.48 * progress)),
                "monthly_contribution_eur": money(monthly_plan),
            }
        )
    forecast_rows = []
    last_value = current_value
    for i, month in enumerate(iso_months("2026-06", "2029-06")):
        value = last_value * ((1 + 0.056 / 12) ** i) + monthly_plan * i
        forecast_rows.append({"month": month, "forecast_eur": money(value), "current_value_eur": money(value)})
    return {
        "summary": {
            "current_value_eur": money(current_value),
            "contributed_eur": money(contributed),
            "achieved_pl_eur": money(achieved),
            "achieved_return_pct": money((achieved / contributed * 100) if contributed else 0),
            "plan_to_date_eur": money(contributed * 1.03),
            "contribution_gap_eur": money(current_value - contributed * 1.03),
            "plan_completion_pct": money((current_value / (contributed * 1.03) * 100) if contributed else 0),
            "monthly_contribution_eur": money(monthly_plan),
            "instruments": len(instruments),
            "current_phase_id": "ph1",
        },
        "instruments": instruments,
        "portfolios": mip_rows,
        "performance": {
            "summary": {
                "current_value_eur": money(current_value),
                "contributed_eur": money(contributed),
                "achieved_pl_eur": money(achieved),
                "achieved_return_pct": money((achieved / contributed * 100) if contributed else 0),
                "monthly_contribution_eur": money(monthly_plan),
            },
            "portfolios": [
                {
                    "portfolio_id": row.get("portfolio_id"),
                    "portfolio_name": row.get("portfolio_name"),
                    "current_value_eur": money(num(row.get("current_value_eur"))),
                    "contributed_eur": money(num(row.get("contributed_eur"))),
                    "cost_base_eur": money(num(row.get("cost_base_eur"))),
                    "profit_loss_eur": money(num(row.get("current_value_eur")) - num(row.get("cost_base_eur"))),
                    "return_pct": money(((num(row.get("current_value_eur")) - num(row.get("cost_base_eur"))) / num(row.get("cost_base_eur")) * 100) if num(row.get("cost_base_eur")) else 0),
                    "monthly_contribution_eur": money(monthly_plan / max(len(instruments), 1)),
                }
                for row in instruments
            ],
            "monthly_series": performance_rows,
            "forecast_series": forecast_rows,
        },
        "exit_strategy": {
            "current_phase": phases[0] if phases else {"phase_id": "ph1"},
            "phases": phases,
            "plan": mip_rows,
        },
        "monte_carlo": {
            "summary": {
                "expected_value_eur": money(forecast_rows[-1]["forecast_eur"] if forecast_rows else current_value),
                "low_value_eur": money((forecast_rows[-1]["forecast_eur"] if forecast_rows else current_value) * 0.78),
                "high_value_eur": money((forecast_rows[-1]["forecast_eur"] if forecast_rows else current_value) * 1.34),
                "remaining_contributions_eur": 636000,
            },
            "series": [
                {
                    "month": row["month"],
                    "p10_eur": money(row["forecast_eur"] * 0.78),
                    "p50_eur": row["forecast_eur"],
                    "p90_eur": money(row["forecast_eur"] * 1.34),
                }
                for row in forecast_rows
            ],
        },
    }


def mip_row_payload(row: dict) -> dict:
    phase_contributions = {f"ph{i}": num(row.get(f"ph{i}")) for i in range(1, 7)}
    return {**row, "phase_contributions": phase_contributions, "current_monthly_contribution_eur": money(phase_contributions["ph1"])}


def phase_payload(mip_rows: list[dict]) -> list[dict]:
    phases = []
    for phase in read_rows("portfolio_exit_phases"):
        phase_id = phase.get("phase_id")
        start = phase.get("start_date")
        end = phase.get("end_date")
        months = months_between(start, end)
        monthly = sum(num(row.get("phase_contributions", {}).get(phase_id)) for row in mip_rows)
        phases.append(
            {
                **phase,
                "months": months,
                "monthly_contribution_eur": money(monthly),
                "phase_contribution_eur": money(monthly * months),
                "cumulative_contribution_eur": 0,
            }
        )
    cumulative = 0
    for phase in phases:
        cumulative += num(phase.get("phase_contribution_eur"))
        phase["cumulative_contribution_eur"] = money(cumulative)
    return phases


def months_between(start: str, end: str) -> int:
    try:
        start_date = datetime.strptime(start, "%Y-%m-%d").date()
        end_date = datetime.strptime(end, "%Y-%m-%d").date()
        return max(0, (end_date.year - start_date.year) * 12 + end_date.month - start_date.month + 1)
    except (TypeError, ValueError):
        return 0


def overview_payload(params: dict[str, str]) -> dict:
    accounts = account_summary(read_rows("accounts_register"))
    transactions = transaction_summary(read_rows("transactions_register"))
    trades = trade_summary(read_rows("trades_register"))
    portfolio = portfolio_payload(accounts, transactions, trades)
    return {
        "scope": "summary" if params.get("scope") == "summary" else "full",
        "generated_at": datetime.now().replace(microsecond=0).isoformat(),
        "sheet_stats": [{"sheet": name, "rows": len(read_rows(name))} for name in SHEETS],
        "accounts": accounts,
        "transactions": transactions,
        "trades": trades,
        "portfolio": portfolio,
        "planning": {
            "summary": transactions.get("capital_targets", {}),
            "yearly_targets": transactions.get("yearly_targets", []),
            "monthly_targets": transactions.get("monthly_targets", []),
            "exit_strategy": portfolio.get("exit_strategy", {}),
            "monte_carlo": portfolio.get("monte_carlo", {}),
        },
    }


def api_accounts(params: dict[str, str]) -> dict:
    all_rows = read_rows("accounts_register")
    filtered = filter_rows(all_rows, params, ACCOUNTS_HEADERS)
    page, limit, offset = sorted_page(filtered, params, "amount_eur_converted")
    return {
        "rows": page,
        "total": len(filtered),
        "unfiltered_total": len(all_rows),
        "offset": offset,
        "limit": limit,
        "sort": params.get("sort") or "amount_eur_converted",
        "direction": params.get("direction") or "desc",
        "summary": account_summary(filtered),
        "filters": {
            "providers": sorted({row.get("provider_id") for row in all_rows if row.get("provider_id")}),
            "account_statuses": sorted({row.get("account_status") for row in all_rows if row.get("account_status")}),
            "capital_buckets": sorted({row.get("capital_bucket") for row in all_rows if row.get("capital_bucket")}),
            "ledger_statuses": sorted({row.get("ledger_status") for row in all_rows if row.get("ledger_status")}),
        },
        "edit_options": {},
        "suggestions": [],
        "insights": account_summary(all_rows),
        "insight_tables": {},
    }


def api_transactions(params: dict[str, str]) -> dict:
    all_rows = read_rows("transactions_register")
    filtered = filter_rows(all_rows, params, TRANSACTIONS_HEADERS)
    page, limit, offset = sorted_page(filtered, params, "transaction_date")
    summary = transaction_summary(filtered)
    return {
        "rows": [{**row, "has_statement": row.get("imported_transaction") == "yes"} for row in page],
        "total": len(filtered),
        "unfiltered_total": len(all_rows),
        "offset": offset,
        "limit": limit,
        "sort": params.get("sort") or "transaction_date",
        "direction": params.get("direction") or "desc",
        "summary": summary,
        "filters": {
            "transaction_classes": sorted({row.get("transaction_class") for row in all_rows if row.get("transaction_class")}),
            "categories": sorted({row.get("category_id") for row in all_rows if row.get("category_id")}),
            "accounts": sorted({row.get("account_id") for row in all_rows if row.get("account_id")}),
            "ledger_statuses": sorted({row.get("ledger_status") for row in all_rows if row.get("ledger_status")}),
        },
        "edit_options": {},
        "suggestions": [],
        "insights": transaction_summary(all_rows),
        "scope": params.get("scope") or "register",
    }


def api_trades(params: dict[str, str]) -> dict:
    all_rows = read_rows("trades_register")
    filtered = filter_rows(all_rows, params, TRADES_HEADERS)
    for row in filtered:
        row["activity_date"] = row.get("exit_date") or row.get("entry_date") or row.get("price_as_of")
    page, limit, offset = sorted_page(filtered, params, "activity_date")
    summary = trade_summary(filtered)
    return {
        "rows": page,
        "total": len(filtered),
        "unfiltered_total": len(all_rows),
        "offset": offset,
        "limit": limit,
        "sort": params.get("sort") or "activity_date",
        "direction": params.get("direction") or "desc",
        "summary": summary,
        "filters": {
            "position_statuses": sorted({row.get("position_status") for row in all_rows if row.get("position_status")}),
            "providers": sorted({row.get("provider_id") for row in all_rows if row.get("provider_id")}),
            "symbols": sorted({row.get("symbol") for row in all_rows if row.get("symbol")}),
            "ledger_statuses": sorted({row.get("ledger_status") for row in all_rows if row.get("ledger_status")}),
        },
        "edit_options": {},
        "suggestions": [],
        "insights": trade_summary(all_rows),
        "insight_tables": trade_insight_tables(all_rows),
    }


def trade_insight_tables(rows: list[dict]) -> dict:
    by_year = defaultdict(lambda: {"period": "", "realized_pl_eur": 0.0, "unrealized_pl_eur": 0.0, "fees_eur": 0.0, "trades": 0})
    for row in rows:
        year = str(row.get("exit_date") or row.get("entry_date") or "")[:4] or "unknown"
        by_year[year]["period"] = year
        by_year[year]["realized_pl_eur"] += num(row.get("realized_pl_native"))
        by_year[year]["unrealized_pl_eur"] += num(row.get("unrealized_pl_native"))
        by_year[year]["fees_eur"] += num(row.get("fees_native"))
        by_year[year]["trades"] += 1
    return {"performance_by_year": [dict(value) for _, value in sorted(by_year.items())]}


def statement_preview() -> dict:
    rows = [
        {
            "import_record_id": "local_import_001",
            "import_decision": "import",
            "decision_reason": "New sample card charge",
            "match_basis": "No existing transaction id",
            "source_type": "csv",
            "source_file": "sample_statement_june_2026.csv",
            "file_name": "sample_statement_june_2026.csv",
            "proposed_transaction_id": "tx_import_001",
            "transaction_date": "2026-06-08",
            "posted_date": "2026-06-08",
            "memo": "Sample statement lunch",
            "transaction_class": "expense",
            "category_id": "Food",
            "subcategory_id": "dining",
            "account_id": "acct_000005",
            "country_code": "AE",
            "statement_currency": "EUR",
            "statement_amount": "-36.20",
            "sanitized_statement_amount": "-36.20",
        },
        {
            "import_record_id": "local_import_002",
            "import_decision": "duplicate",
            "decision_reason": "Same amount and date already exists",
            "match_basis": "amount/date/account",
            "source_type": "csv",
            "source_file": "sample_statement_june_2026.csv",
            "file_name": "sample_statement_june_2026.csv",
            "duplicate_transaction_id": "tx_000282",
            "transaction_date": "2026-06-12",
            "memo": "Utilities",
            "transaction_class": "expense",
            "category_id": "Home",
            "account_id": "acct_000001",
            "statement_currency": "EUR",
            "statement_amount": "-390.00",
            "sanitized_statement_amount": "-390.00",
        },
    ]
    return {
        "ok": True,
        "rows": rows,
        "unsupported_rows": [],
        "parsed_transactions": len(rows),
        "importable": 1,
        "duplicates": 1,
        "unsupported_files": 0,
        "saved_files": ["sample_statement_june_2026.csv"],
    }


class LedgerPublicHandler(BaseHTTPRequestHandler):
    server_version = "LedgerPublic/1.0"

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("%s - - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), fmt % args))

    def do_HEAD(self) -> None:
        self.do_GET()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        params = {key: values[-1] for key, values in parse_qs(parsed.query).items()}
        try:
            if parsed.path == "/api/health":
                return self.send_json({"ok": True, "mode": "local", "workbook": str(WORKBOOK_PATH.name)})
            if parsed.path == "/api/overview":
                return self.send_json(overview_payload(params))
            if parsed.path == "/api/accounts":
                return self.send_json(api_accounts(params))
            if parsed.path == "/api/transactions":
                return self.send_json(api_transactions(params))
            if parsed.path == "/api/trades":
                return self.send_json(api_trades(params))
            if parsed.path == "/api/statements/import":
                return self.send_json(statement_preview())
            if parsed.path == "/api/cache/status":
                return self.send_json(public_cache_status())
            if parsed.path == "/api/data-health":
                return self.send_json(public_data_health())
            if parsed.path == "/api/report-presets":
                return self.send_json({"ok": True, "rows": report_presets()})
            if parsed.path == "/api/refresh":
                write_local_workbook()
                return self.send_json({"ok": True, "refreshed": True})
            tx_id = self.path_id(parsed.path, "/api/transactions/", "/statement/file")
            if tx_id:
                return self.send_bytes(b"Local statement attachment for Ledger Public.\n", "text/plain; charset=utf-8", "sample-statement.txt")
            tx_id = self.path_id(parsed.path, "/api/transactions/", "/statement")
            if tx_id:
                return self.send_json(transaction_statement(tx_id))
            self.serve_static(parsed.path)
        except Exception as error:
            self.send_json({"ok": False, "error": str(error)}, status=500)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        try:
            if parsed.path == "/api/statements/import/upload":
                self.discard_body()
                return self.send_json(statement_preview(), status=201)
            if parsed.path == "/api/statements/import/apply":
                payload = self.read_json()
                applied = apply_statement_import(payload.get("record_ids", []))
                data = statement_preview()
                data.update({"applied": applied, "archived_duplicates": 0, "rows": []})
                return self.send_json(data)
            if parsed.path == "/api/statements/import/clear":
                self.discard_body()
                data = statement_preview()
                data.update({"rows": [], "unsupported_rows": [], "cleared_files": 1, "parsed_transactions": 0, "importable": 0, "duplicates": 0})
                return self.send_json(data)
            if parsed.path == "/api/backup":
                archive = backup_local_data(DATA_DIR, ROOT / "local_ledger_backups", label="ledger-public")
                return self.send_json({"ok": True, "backup": archive.name, "path": str(archive)})
            tx_id = self.path_id(parsed.path, "/api/transactions/", "/statement/attachments")
            if tx_id:
                self.discard_body()
                return self.send_json(transaction_statement(tx_id), status=201)
            if parsed.path == "/api/accounts":
                row = create_row("accounts_register", "account_id", "acct", self.values_payload(), {"account_status": "active", "capital_bucket": "liquid", "account_type": "bank_account", "account_currency": "EUR", "ledger_status": "accountable", "review_status": "review_required"})
                return self.send_json({"ok": True, "account_id": row["account_id"], "row": row}, status=201)
            if parsed.path == "/api/transactions":
                row = create_row("transactions_register", "transaction_id", "tx", self.values_payload(), {"transaction_date": TODAY.isoformat(), "posted_date": TODAY.isoformat(), "transaction_class": "expense", "statement_currency": "EUR", "ledger_status": "accountable", "review_status": "review_required"})
                return self.send_json({"ok": True, "transaction_id": row["transaction_id"], "row": row}, status=201)
            if parsed.path == "/api/trades":
                row = create_row("trades_register", "trade_id", "tr", self.values_payload(), {"entry_date": TODAY.isoformat(), "trade_currency": "EUR", "position_status": "active", "ledger_status": "accountable", "review_status": "review_required"})
                return self.send_json({"ok": True, "trade_id": row["trade_id"], "row": row}, status=201)
            if parsed.path == "/api/trades/refresh-prices":
                return self.send_json(refresh_local_prices())
            if parsed.path in {"/api/accounts/duplicate", "/api/transactions/duplicate", "/api/trades/duplicate"}:
                return self.send_json(self.bulk_duplicate(parsed.path), status=201)
            if parsed.path in {"/api/accounts/restore", "/api/transactions/restore", "/api/trades/restore"}:
                return self.send_json(self.bulk_restore(parsed.path))
            for name, id_field, prefix in [
                ("accounts_register", "account_id", "acct"),
                ("transactions_register", "transaction_id", "tx"),
                ("trades_register", "trade_id", "tr"),
            ]:
                row_id = self.path_id(parsed.path, f"/api/{name.split('_')[0]}/", "/duplicate")
                if row_id:
                    result = duplicate_rows(name, id_field, prefix, [row_id])
                    row = result["created"][0]
                    return self.send_json({"ok": True, id_field: row[id_field], "row": row}, status=201)
                row_id = self.path_id(parsed.path, f"/api/{name.split('_')[0]}/", "/restore")
                if row_id:
                    mutate_status(name, id_field, [row_id], "accountable")
                    return self.send_json({"ok": True, id_field: row_id, "restored": 1})
            self.send_json({"ok": False, "error": "Not found"}, status=404)
        except Exception as error:
            self.send_json({"ok": False, "error": str(error)}, status=400)

    def do_PATCH(self) -> None:
        parsed = urlparse(self.path)
        values = self.values_payload()
        try:
            if parsed.path.startswith("/api/accounts/"):
                row_id = unquote(parsed.path.removeprefix("/api/accounts/").strip("/"))
                row = upsert_row("accounts_register", "account_id", row_id, values)
                return self.send_json({"ok": True, "account_id": row["account_id"], "row": row})
            if parsed.path.startswith("/api/transactions/"):
                row_id = unquote(parsed.path.removeprefix("/api/transactions/").strip("/"))
                row = upsert_row("transactions_register", "transaction_id", row_id, values)
                return self.send_json({"ok": True, "transaction_id": row["transaction_id"], "row": row})
            if parsed.path.startswith("/api/trades/"):
                row_id = unquote(parsed.path.removeprefix("/api/trades/").strip("/"))
                row = upsert_row("trades_register", "trade_id", row_id, values)
                return self.send_json({"ok": True, "trade_id": row["trade_id"], "row": row})
            if parsed.path.startswith("/api/portfolio/instruments/"):
                row_id = unquote(parsed.path.removeprefix("/api/portfolio/instruments/").strip("/"))
                row = upsert_row("portfolio_strategy_instruments", "portfolio_id", row_id, values)
                return self.send_json({"ok": True, "portfolio_id": row["portfolio_id"], "row": row})
            if parsed.path.rstrip("/") == "/api/portfolio/mip" or parsed.path.startswith("/api/portfolio/mip/"):
                params = parse_qs(parsed.query)
                row_id = params.get("id", [""])[0] or unquote(parsed.path.removeprefix("/api/portfolio/mip/").strip("/")) or values.get("_portfolio_mip_id")
                values = flatten_mip_values(values)
                row = upsert_row("portfolio_monthly_investment_plan", "_portfolio_mip_id", row_id, values)
                return self.send_json({"ok": True, "_portfolio_mip_id": row["_portfolio_mip_id"], "row": mip_row_payload(row)})
            if parsed.path.startswith("/api/portfolio/phases/"):
                row_id = unquote(parsed.path.removeprefix("/api/portfolio/phases/").strip("/"))
                row = upsert_row("portfolio_exit_phases", "phase_id", row_id, values)
                return self.send_json({"ok": True, "phase_id": row["phase_id"], "row": row})
            self.send_json({"ok": False, "error": "Not found"}, status=404)
        except Exception as error:
            self.send_json({"ok": False, "error": str(error)}, status=400)

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        try:
            if parsed.path == "/api/accounts":
                return self.send_json(mutate_status("accounts_register", "account_id", ids_in_body(self.read_json(), "account_ids"), "deleted"))
            if parsed.path == "/api/transactions":
                return self.send_json(mutate_status("transactions_register", "transaction_id", ids_in_body(self.read_json(), "transaction_ids"), "deleted"))
            if parsed.path == "/api/trades":
                return self.send_json(mutate_status("trades_register", "trade_id", ids_in_body(self.read_json(), "trade_ids"), "deleted"))
            if parsed.path == "/api/accounts/permanent":
                return self.send_json(mutate_status("accounts_register", "account_id", ids_in_body(self.read_json(), "account_ids"), "deleted", remove=True))
            if parsed.path == "/api/transactions/permanent":
                return self.send_json(mutate_status("transactions_register", "transaction_id", ids_in_body(self.read_json(), "transaction_ids"), "deleted", remove=True))
            if parsed.path == "/api/trades/permanent":
                return self.send_json(mutate_status("trades_register", "trade_id", ids_in_body(self.read_json(), "trade_ids"), "deleted", remove=True))
            if parsed.path.startswith("/api/accounts/"):
                row_id = unquote(parsed.path.removeprefix("/api/accounts/").strip("/"))
                return self.send_json(mutate_status("accounts_register", "account_id", [row_id], "deleted"))
            if parsed.path.startswith("/api/transactions/"):
                row_id = unquote(parsed.path.removeprefix("/api/transactions/").strip("/"))
                return self.send_json(mutate_status("transactions_register", "transaction_id", [row_id], "deleted"))
            if parsed.path.startswith("/api/trades/"):
                row_id = unquote(parsed.path.removeprefix("/api/trades/").strip("/"))
                return self.send_json(mutate_status("trades_register", "trade_id", [row_id], "deleted"))
            if parsed.path.startswith("/api/portfolio/mip/"):
                row_id = unquote(parsed.path.removeprefix("/api/portfolio/mip/").strip("/"))
                rows = [row for row in read_rows("portfolio_monthly_investment_plan") if row.get("_portfolio_mip_id") != row_id]
                write_rows("portfolio_monthly_investment_plan", rows)
                return self.send_json({"ok": True, "_portfolio_mip_id": row_id, "deleted": 1})
            self.send_json({"ok": False, "error": "Not found"}, status=404)
        except Exception as error:
            self.send_json({"ok": False, "error": str(error)}, status=400)

    def bulk_duplicate(self, path: str) -> dict:
        payload = self.read_json()
        if "accounts" in path:
            return duplicate_rows("accounts_register", "account_id", "acct", ids_in_body(payload, "account_ids"))
        if "transactions" in path:
            return duplicate_rows("transactions_register", "transaction_id", "tx", ids_in_body(payload, "transaction_ids"))
        return duplicate_rows("trades_register", "trade_id", "tr", ids_in_body(payload, "trade_ids"))

    def bulk_restore(self, path: str) -> dict:
        payload = self.read_json()
        if "accounts" in path:
            return mutate_status("accounts_register", "account_id", ids_in_body(payload, "account_ids"), "accountable")
        if "transactions" in path:
            return mutate_status("transactions_register", "transaction_id", ids_in_body(payload, "transaction_ids"), "accountable")
        return mutate_status("trades_register", "trade_id", ids_in_body(payload, "trade_ids"), "accountable")

    def values_payload(self) -> dict:
        payload = self.read_json()
        return payload.get("values", payload) if isinstance(payload, dict) else {}

    def read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0") or 0)
        if not length:
            return {}
        body = self.rfile.read(length)
        try:
            return json.loads(body.decode("utf-8"))
        except json.JSONDecodeError:
            return {}

    def discard_body(self) -> None:
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length:
            self.rfile.read(length)

    def path_id(self, path: str, prefix: str, suffix: str) -> str:
        if not path.startswith(prefix) or not path.endswith(suffix):
            return ""
        value = path[len(prefix) : -len(suffix)].strip("/")
        return unquote(value) if value and "/" not in value else ""

    def send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def send_bytes(self, body: bytes, content_type: str, file_name: str = "") -> None:
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        if file_name:
            self.send_header("Content-Disposition", f'inline; filename="{file_name}"')
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def serve_static(self, path: str) -> None:
        clean_path = "index.html" if path in {"", "/"} else path.lstrip("/")
        target = (STATIC_DIR / clean_path).resolve()
        if not str(target).startswith(str(STATIC_DIR.resolve())) or not target.exists() or not target.is_file():
            target = STATIC_DIR / "index.html"
        content_type = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        self.send_bytes(target.read_bytes(), content_type)


def flatten_mip_values(values: dict) -> dict:
    next_values = dict(values)
    phase_values = next_values.pop("phase_contributions", {}) or {}
    for phase_id in [f"ph{i}" for i in range(1, 7)]:
        if phase_id in phase_values and phase_id not in next_values:
            next_values[phase_id] = phase_values[phase_id]
    if not next_values.get("_portfolio_mip_id"):
        next_values["_portfolio_mip_id"] = "::".join(
            str(next_values.get(key, "")).strip()
            for key in ("portfolio_id", "contribution_type", "contribution_role")
            if str(next_values.get(key, "")).strip()
        )
    return next_values


def public_data_health() -> dict:
    return data_health_summary({sheet_name: read_rows(sheet_name) for sheet_name in SHEETS}, today=TODAY)


def public_cache_status() -> dict:
    migrate_legacy_data_paths()
    return {
        "ok": True,
        "ttl_seconds": 0,
        "memory": [
            {"sheet": sheet_name, "rows": len(read_rows(sheet_name)), "source": "local_csv"}
            for sheet_name in SHEETS
        ],
        "snapshot": {"path": str(WORKBOOK_PATH), "mode": "local_workbook"},
        "last_snapshot_error": "",
    }


def transaction_statement(transaction_id: str) -> dict:
    row = next((item for item in read_rows("transactions_register") if item.get("transaction_id") == transaction_id), {})
    return {
        "ok": True,
        "transaction_id": transaction_id,
        "summary": {
            "memo": row.get("memo", "Local transaction"),
            "amount": row.get("statement_amount", "0"),
            "currency": row.get("statement_currency", "EUR"),
            "date": row.get("transaction_date", TODAY.isoformat()),
        },
        "files": [{"file_name": "sample-statement.txt", "content_type": "text/plain", "url": f"/api/transactions/{transaction_id}/statement/file?file=sample-statement.txt"}],
        "body": "Ledger Public statement preview. Attachments are stored only in this local package.",
    }


def apply_statement_import(record_ids: list[str]) -> int:
    if not record_ids:
        return 0
    rows = read_rows("transactions_register")
    row = {
        "transaction_id": next_id(rows, "transaction_id", "tx"),
        "transaction_date": "2026-06-08",
        "posted_date": "2026-06-08",
        "memo": "Sample statement lunch",
        "description": "Imported from local statement queue",
        "category_id": "Food",
        "subcategory_id": "dining",
        "transaction_class": "expense",
        "source_system": "Local Statement Import",
        "country_code": "AE",
        "statement_currency": "EUR",
        "statement_amount": "-36.20",
        "sanitized_statement_amount": "-36.20",
        "amount_eur_converted": "-36.20",
        "amount_usd_converted": "-39.10",
        "account_id": "acct_000005",
        "merchant": "sample cafe",
        "imported_transaction": "yes",
        "ledger_status": "accountable",
        "review_status": "reviewed",
        "notes": "Imported in Ledger Public",
    }
    rows.append(row)
    write_rows("transactions_register", rows)
    return 1


def refresh_local_prices() -> dict:
    rows = read_rows("trades_register")
    updated = 0
    for row in rows:
        if row.get("position_status") == "active":
            price = num(row.get("current_price"))
            row["current_price"] = f"{price * 1.003:.2f}"
            row["current_market_value_native"] = f"{num(row.get('quantity')) * num(row.get('current_price')):.2f}"
            row["unrealized_pl_native"] = f"{(num(row.get('current_price')) - num(row.get('entry_price'))) * num(row.get('quantity')) - num(row.get('fees_native')):.2f}"
            row["price_as_of"] = TODAY.isoformat()
            updated += 1
    write_rows("trades_register", rows)
    return {"ok": True, "updated_positions": updated, "skipped": [], "brokerage_account_formulas": 1, "price_as_of": TODAY.isoformat()}


def run_server(port: int, host: str, open_browser: bool = False) -> None:
    ensure_local_data()
    server = ThreadingHTTPServer((host, port), LedgerPublicHandler)
    url = f"http://{host}:{port}"
    if open_browser:
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    print(f"Ledger Public running at {url}")
    print(f"Local ledger workbook: {WORKBOOK_PATH}")
    print("Press Ctrl+C to stop the local server.")
    server.serve_forever()


def main() -> None:
    parser = argparse.ArgumentParser(description="Standalone Ledger Public server with local first-run sample data.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--open", action="store_true", help="Open Ledger Public in the default browser after the server starts.")
    parser.add_argument("--init-only", action="store_true", help="Create or refresh the local CSV tabs and XLSX workbook, then exit.")
    parser.add_argument("--reset-data", action="store_true", help="Reset local CSV tabs to the bundled sample defaults.")
    args = parser.parse_args()
    ensure_local_data(reset=args.reset_data)
    if args.init_only:
        print(f"Local ledger workbook created at {WORKBOOK_PATH}")
        return
    run_server(args.port, args.host, open_browser=args.open)


if __name__ == "__main__":
    main()
