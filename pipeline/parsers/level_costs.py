import openpyxl
from pipeline.models import LevelCost


def _to_float(v) -> float | None:
    if v is None:
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def parse(wb: openpyxl.Workbook) -> list[LevelCost]:
    # Use data_only workbook - formulas will be evaluated values or None
    ws = wb["Level Up Cost"]
    results = []
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            continue  # header
        level_val = _to_float(row[0])
        if level_val is None:
            continue
        level = int(level_val)
        runes_to_next = _to_float(row[1])
        cost_increase = _to_float(row[2])
        total_runes = _to_float(row[3]) or 0.0

        results.append(LevelCost(
            level=level,
            runes_to_next=runes_to_next,
            cost_increase=cost_increase,
            total_runes=total_runes,
        ))
    return results
