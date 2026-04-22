import openpyxl
from pipeline.models import Character, CharacterBaseStats, CharacterLevelStats

_CHARACTERS = [
    "Wylder", "Guardian", "Ironeye", "Duchess", "Raider",
    "Revenant", "Recluse", "Executor", "Scholar", "Undertaker",
]


def _to_float(v) -> float | None:
    if v is None:
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def _parse_base_stats(ws) -> dict[str, CharacterBaseStats]:
    # Row 0 = header, rows 1+ = one character per row
    # Columns: Name, Base HP, Base FP, Base Stam, Vigor, Mind, Endurance,
    #          Strength, Dexterity, Intelligence, Faith, Arcane,
    #          Phys Neg, Slash Neg, Strike Neg, Thrust Neg, Magic Neg, Fire Neg, Ltng Neg, Holy Neg,
    #          Poison Resist, Rot Resist, Bleed Resist, Frost Resist, Sleep Resist, Madness Resist, Blight Resist, Poise
    stats = {}
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            continue
        name = row[0]
        if not name or str(name).strip() not in _CHARACTERS:
            continue
        f = _to_float
        stats[str(name).strip()] = CharacterBaseStats(
            base_hp=f(row[1]) or 0,
            base_fp=f(row[2]) or 0,
            base_stamina=f(row[3]) or 0,
            vigor=f(row[4]) or 0,
            mind=f(row[5]) or 0,
            endurance=f(row[6]) or 0,
            strength=f(row[7]) or 0,
            dexterity=f(row[8]) or 0,
            intelligence=f(row[9]) or 0,
            faith=f(row[10]) or 0,
            arcane=f(row[11]) or 0,
            phys_neg=f(row[12]) or 0,
            slash_neg=f(row[13]) or 0,
            strike_neg=f(row[14]) or 0,
            thrust_neg=f(row[15]) or 0,
            magic_neg=f(row[16]) or 0,
            fire_neg=f(row[17]) or 0,
            lightning_neg=f(row[18]) or 0,
            holy_neg=f(row[19]) or 0,
            poison_resist=f(row[20]) or 0,
            rot_resist=f(row[21]) or 0,
            bleed_resist=f(row[22]) or 0,
            frost_resist=f(row[23]) or 0,
            sleep_resist=f(row[24]) or 0,
            madness_resist=f(row[25]) or 0,
            blight_resist=f(row[26]) or 0,
            poise=f(row[27]) or 0,
        )
    return stats


def _parse_level_stats(ws) -> dict[str, list[CharacterLevelStats]]:
    # Row 0 = note, Row 1 = header
    # Columns: Name, Level, Vigor, Mind, Endurance, Strength, Dexterity,
    #          Intelligence, Faith, Arcane, Phys Neg, Slash Neg, Strike Neg,
    #          Thrust Neg, Magic Neg, Fire Neg, Ltng Neg, Holy Neg,
    #          Poison Resist, Rot Resist, Bleed Resist, Frost Resist,
    #          Sleep Resist, Madness Resist, Blight Resist, Poise
    level_stats: dict[str, list[CharacterLevelStats]] = {c: [] for c in _CHARACTERS}
    header_found = False
    for row in ws.iter_rows(values_only=True):
        if not header_found:
            if row[0] == "Name":
                header_found = True
            continue
        name = row[0]
        if not name or str(name).strip() not in _CHARACTERS:
            continue
        char = str(name).strip()
        level_val = _to_float(row[1])
        if level_val is None:
            continue
        f = _to_float
        level_stats[char].append(CharacterLevelStats(
            level=int(level_val),
            vigor=f(row[2]),
            mind=f(row[3]),
            endurance=f(row[4]),
            strength=f(row[5]),
            dexterity=f(row[6]),
            intelligence=f(row[7]),
            faith=f(row[8]),
            arcane=f(row[9]),
            phys_neg=f(row[10]),
            slash_neg=f(row[11]),
            strike_neg=f(row[12]),
            thrust_neg=f(row[13]),
            magic_neg=f(row[14]),
            fire_neg=f(row[15]),
            lightning_neg=f(row[16]),
            holy_neg=f(row[17]),
            poison_resist=f(row[18]),
            rot_resist=f(row[19]),
            bleed_resist=f(row[20]),
            frost_resist=f(row[21]),
            sleep_resist=f(row[22]),
            madness_resist=f(row[23]),
            blight_resist=f(row[24]),
            poise=f(row[25]),
        ))
    # Sort each character's levels
    for char in level_stats:
        level_stats[char].sort(key=lambda x: x.level)
    return level_stats


def parse(wb: openpyxl.Workbook) -> list[Character]:
    base_stats = _parse_base_stats(wb["Character Stats Level 15"])
    level_stats = _parse_level_stats(wb["Character Stats Table (Outdated"])

    characters = []
    for name in _CHARACTERS:
        if name not in base_stats:
            continue
        characters.append(Character(
            name=name,
            base_stats=base_stats[name],
            level_stats=level_stats.get(name, []),
        ))
    return characters
