from __future__ import annotations

ACCOUNTS_SHEET = "accounts_register"
TRANSACTIONS_SHEET = "transactions_register"
TRADES_SHEET = "trades_register"
PORTFOLIO_SHEET = "portfolio_strategy_instruments"
PORTFOLIO_MIP_SHEET = "portfolio_monthly_investment_plan"
PORTFOLIO_PHASES_SHEET = "portfolio_exit_phases"

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

PORTFOLIO_MIP_HEADERS = [
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

PORTFOLIO_PHASE_HEADERS = ["phase_id", "phase_name", "start_date", "end_date"]

SHEETS = {
    ACCOUNTS_SHEET: ACCOUNTS_HEADERS,
    TRANSACTIONS_SHEET: TRANSACTIONS_HEADERS,
    TRADES_SHEET: TRADES_HEADERS,
    PORTFOLIO_SHEET: PORTFOLIO_HEADERS,
    PORTFOLIO_MIP_SHEET: PORTFOLIO_MIP_HEADERS,
    PORTFOLIO_PHASES_SHEET: PORTFOLIO_PHASE_HEADERS,
}

ID_FIELDS = {
    ACCOUNTS_SHEET: "account_id",
    TRANSACTIONS_SHEET: "transaction_id",
    TRADES_SHEET: "trade_id",
    PORTFOLIO_SHEET: "portfolio_id",
    PORTFOLIO_MIP_SHEET: "_portfolio_mip_id",
    PORTFOLIO_PHASES_SHEET: "phase_id",
}

ID_PREFIXES = {
    ACCOUNTS_SHEET: "acct",
    TRANSACTIONS_SHEET: "tx",
    TRADES_SHEET: "tr",
}

GOOGLE_SHEET_RANGES = {
    ACCOUNTS_SHEET: "A:O",
    TRANSACTIONS_SHEET: "A:X",
    TRADES_SHEET: "A:X",
}

PUBLIC_RUNTIME_PATHS = {
    "local_ledger_data/",
    "local_ledger_workbook.xlsx",
    "mock_google_sheet/",
    "mock_ledger_google_sheet.xlsx",
}
