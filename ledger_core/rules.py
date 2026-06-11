from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class ClassificationRule:
    pattern: str
    category_id: str = ""
    subcategory_id: str = ""
    transaction_class: str = ""
    merchant: str = ""

    def applies_to(self, row: dict) -> bool:
        haystack = " ".join(str(row.get(key, "")) for key in ("memo", "description", "merchant")).lower()
        return self.pattern.lower() in haystack


def apply_classification_rules(row: dict, rules: list[ClassificationRule]) -> dict:
    next_row = dict(row)
    for rule in rules:
        if not rule.applies_to(next_row):
            continue
        for field in ("category_id", "subcategory_id", "transaction_class", "merchant"):
            value = getattr(rule, field)
            if value and not next_row.get(field):
                next_row[field] = value
        break
    return next_row


def load_classification_rules(path: Path | str) -> list[ClassificationRule]:
    rule_path = Path(path)
    if not rule_path.exists():
        return []
    with rule_path.open("r", encoding="utf-8", newline="") as handle:
        return [
            ClassificationRule(
                pattern=row.get("pattern", ""),
                category_id=row.get("category_id", ""),
                subcategory_id=row.get("subcategory_id", ""),
                transaction_class=row.get("transaction_class", ""),
                merchant=row.get("merchant", ""),
            )
            for row in csv.DictReader(handle)
            if row.get("pattern")
        ]
