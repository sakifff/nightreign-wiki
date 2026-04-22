import openpyxl
from pipeline.models import DormantPower


def parse(wb: openpyxl.Workbook) -> list[DormantPower]:
    ws = wb["Dormant Powers"]
    results = []
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            continue
        if not any(row[:6]):
            continue
        category = str(row[0]).strip() if row[0] else ""
        name = str(row[1]).strip() if row[1] else ""
        description_ingame = str(row[2]).strip() if row[2] else ""
        effect = str(row[3]).strip() if row[3] else ""
        stackable = str(row[4]).strip() if row[4] else None
        notes = str(row[5]).strip() if row[5] else None

        if not name and not effect:
            continue

        results.append(DormantPower(
            category=category,
            name=name,
            description_ingame=description_ingame,
            effect=effect,
            stackable=stackable,
            notes=notes,
        ))
    return results
