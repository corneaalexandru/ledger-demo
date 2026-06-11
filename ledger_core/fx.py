from __future__ import annotations

import re
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from typing import Mapping

DEFAULT_RATES_TO_EUR = {
    "EUR": Decimal("1"),
    "USD": Decimal("0.92"),
    "AED": Decimal("0.25"),
    "RON": Decimal("0.20"),
    "GBP": Decimal("1.17"),
    "CHF": Decimal("1.04"),
    "CAD": Decimal("0.67"),
    "AUD": Decimal("0.61"),
    "JPY": Decimal("0.006"),
}

SUPPORTED_CONVERSION_CURRENCIES = tuple(DEFAULT_RATES_TO_EUR.keys())


def normalize_currency(value: object, default: str = "EUR") -> str:
    text = str(value or "").strip().upper()
    return text if re.fullmatch(r"[A-Z]{3}", text) else default


def decimal_number(value: object, default: Decimal = Decimal("0")) -> Decimal:
    if isinstance(value, Decimal):
        return value
    try:
        return Decimal(str(value or "").replace(",", "").strip())
    except (InvalidOperation, ValueError):
        return default


def money(value: Decimal | float | int | str) -> Decimal:
    return decimal_number(value).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


@dataclass(frozen=True)
class FXConverter:
    rates_to_eur: Mapping[str, Decimal] | None = None

    def rate_to_eur(self, currency: object) -> Decimal:
        rates = self.rates_to_eur or DEFAULT_RATES_TO_EUR
        return rates.get(normalize_currency(currency), Decimal("1"))

    def convert(self, amount: object, source_currency: object, target_currency: object = "EUR") -> Decimal:
        source_rate = self.rate_to_eur(source_currency)
        target_rate = self.rate_to_eur(target_currency)
        if not target_rate:
            return money(amount)
        return money(decimal_number(amount) * source_rate / target_rate)

    def conversion_fields(self, amount: object, source_currency: object) -> dict[str, str]:
        return {
            "amount_eur_converted": f"{self.convert(amount, source_currency, 'EUR'):.2f}",
            "amount_usd_converted": f"{self.convert(amount, source_currency, 'USD'):.2f}",
        }


DEFAULT_CONVERTER = FXConverter()
