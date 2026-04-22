import openpyxl
from pipeline.models import RelicPassive

_CHARACTERS = {
    "wylder", "guardian", "ironeye", "duchess", "raider",
    "revenant", "recluse", "executor", "scholar", "undertaker",
}


def _detect_character(description: str) -> str | None:
    low = description.lower()
    for char in _CHARACTERS:
        if char in low:
            return char.capitalize()
    return None


def _parse_sheet(ws, source: str) -> list[RelicPassive]:
    results = []
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            continue
        if not row[0] and not row[1]:
            continue
        category = str(row[0]).strip() if row[0] else ""
        description = str(row[1]).strip() if row[1] else ""
        effect = str(row[2]).strip() if row[2] else ""
        stackable = str(row[3]).strip() if row[3] else None
        notes = str(row[4]).strip() if row[4] else None

        if not description and not effect:
            continue

        character = _detect_character(description)

        results.append(RelicPassive(
            category=category,
            description=description,
            effect=effect,
            stackable=stackable,
            notes=notes,
            character=character,
            source=source,
        ))
    return results


def parse(wb: openpyxl.Workbook) -> list[RelicPassive]:
    results = []
    results += _parse_sheet(wb["Relic Effects"], "generic_relic")
    results += _parse_sheet(wb["Deep Relic Effects"], "deep_relic")
    results += _parse_sheet(wb["Weapon Effects"], "weapon_passive")
    results += _parse_sheet(wb["Deep Weapon Effects"], "deep_weapon")
    return results
