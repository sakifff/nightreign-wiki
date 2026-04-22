import openpyxl
from pipeline.models import Consumable


def parse(wb: openpyxl.Workbook) -> list[Consumable]:
    ws = wb["Consumable Effects"]
    results = []
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            continue
        name = row[0]
        if not name:
            continue
        effect_ingame = str(row[1]).strip() if row[1] else ""
        effect = str(row[2]).strip() if row[2] else ""
        duration = str(row[3]).strip() if row[3] else None
        notes = str(row[4]).strip() if row[4] else None

        results.append(Consumable(
            name=str(name).strip(),
            effect_ingame=effect_ingame,
            effect=effect,
            duration=duration,
            notes=notes,
        ))
    return results
