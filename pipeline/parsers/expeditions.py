import re
import openpyxl

_CHAR_COLS = {
    "Wylder": 2,
    "Guardian": 3,
    "Ironeye": 4,
    "Duchess": 5,
    "Raider": 6,
    "Revenant": 7,
    "Recluse": 8,
    "Executor": 9,
    "Scholar": 10,
    "Undertaker": 11,
}

# Expedition names follow a "Night of the X" / "Dark Night of the X" / "The X" pattern
_EXPEDITION_RE = re.compile(
    r"^(Night of|Dark Night of|The Night of|The Will of|Everdark)",
    re.IGNORECASE,
)


def _is_expedition_name(val: str) -> bool:
    return bool(_EXPEDITION_RE.match(val.strip()))


def parse(wb: openpyxl.Workbook) -> list[dict]:
    ws = wb["Guaranteed Relics"]
    expeditions = []
    current: dict | None = None
    header_found = False

    for row in ws.iter_rows(values_only=True):
        if not header_found:
            if row[0] == "Boss":
                header_found = True
            continue

        col0 = str(row[0]).strip() if row[0] else ""
        col1 = str(row[1]).strip() if (len(row) > 1 and row[1]) else ""

        if col0 and _is_expedition_name(col0):
            # Start new expedition
            current = {
                "name": col0,
                "relics": {"Generic": [], **{c: [] for c in _CHAR_COLS}},
            }
            expeditions.append(current)

        if current is None:
            continue

        # col0 (if not expedition name) and col1 both go into Generic
        if col0 and not _is_expedition_name(col0):
            current["relics"]["Generic"].append(col0)
        if col1:
            current["relics"]["Generic"].append(col1)

        # Character-specific relics
        for char, col in _CHAR_COLS.items():
            if col < len(row) and row[col]:
                val = str(row[col]).strip()
                if val:
                    current["relics"][char].append(val)

    return expeditions
