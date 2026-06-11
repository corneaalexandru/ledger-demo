from __future__ import annotations


def report_presets() -> list[dict]:
    return [
        {
            "id": "overview-summary",
            "label": "Overview Summary",
            "page": "overview",
            "view": "insights",
            "description": "Net worth, cash flow, portfolio, and planning summary for print-to-PDF.",
        },
        {
            "id": "accounts-insights",
            "label": "Accounts Insights",
            "page": "accounts",
            "view": "insights",
            "description": "Account mix, liquidity, credit utilization, and top balances.",
        },
        {
            "id": "transactions-cash-flow",
            "label": "Cash Flow",
            "page": "transactions",
            "view": "insights",
            "description": "Income, expenses, savings rate, and import review summary.",
        },
        {
            "id": "portfolio-plan",
            "label": "Portfolio Plan",
            "page": "portfolio",
            "view": "overview",
            "description": "Portfolio value, funding progress, forecast, and exit strategy.",
        },
    ]
