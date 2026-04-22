import openpyxl
from pipeline.models import Talisman


def parse(wb: openpyxl.Workbook) -> list[Talisman]:
    ws = wb["Talisman Effects"]
    results = []
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            continue  # skip header
        name, effect_ingame, effect, notes = row[0], row[1], row[2], row[3]
        if not name or not effect:
            continue
        results.append(Talisman(
            name=str(name).strip(),
            effect_ingame=str(effect_ingame).strip() if effect_ingame else "",
            effect=str(effect).strip(),
            notes=str(notes).strip() if notes else None,
        ))
    return results
