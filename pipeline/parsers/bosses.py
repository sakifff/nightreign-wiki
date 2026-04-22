import openpyxl
from pipeline.models import Boss, BossHP, BossResistances

_CHARACTERS = [
    "Wylder", "Guardian", "Ironeye", "Duchess", "Raider",
    "Revenant", "Recluse", "Executor", "Scholar", "Undertaker",
]

# Column indices for boss stat sheets (0-based)
# Header: Name, None, ID, Health, None, Phys Neg, PhysMod, Strike Neg, StrikeMod,
#         Slash Neg, SlashMod, Pierce Neg, PierceMod, Magic Neg, MagicMod,
#         Fire Neg, FireMod, Ltng Neg, LtngMod, Holy Neg, HolyMod, None,
#         Poison, Rot, Bleed, Frost, Sleep, Madness, Blight, Poise
_COL_NAME = 0
_COL_ID = 2
_COL_HP = 3
_COL_PHYS = 5
_COL_PHYS_MOD = 6
_COL_STRIKE = 7
_COL_STRIKE_MOD = 8
_COL_SLASH = 9
_COL_SLASH_MOD = 10
_COL_PIERCE = 11
_COL_PIERCE_MOD = 12
_COL_MAGIC = 13
_COL_MAGIC_MOD = 14
_COL_FIRE = 15
_COL_FIRE_MOD = 16
_COL_LIGHTNING = 17
_COL_LIGHTNING_MOD = 18
_COL_HOLY = 19
_COL_HOLY_MOD = 20
_COL_POISON = 22
_COL_ROT = 23
_COL_BLEED = 24
_COL_FROST = 25
_COL_SLEEP = 26
_COL_MADNESS = 27
_COL_BLIGHT = 28
_COL_POISE = 29


def _to_float(v) -> float | None:
    if v is None:
        return None
    if isinstance(v, str) and v.strip().lower() == "immune":
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def _to_resist(v) -> float | str | None:
    if v is None:
        return None
    if isinstance(v, str) and v.strip().lower() == "immune":
        return "Immune"
    try:
        return float(v)
    except (TypeError, ValueError):
        return str(v).strip() if v else None


def _parse_hp_sheet(ws) -> dict[str, tuple[float | None, BossResistances, float | None]]:
    """Returns dict of name -> (hp, resistances, game_id)"""
    bosses = {}
    header_skipped = False
    for row in ws.iter_rows(values_only=True):
        if not header_skipped:
            header_skipped = True
            continue
        name = row[_COL_NAME] if len(row) > _COL_NAME else None
        if not name or str(name).strip() == "":
            continue
        name = str(name).strip()
        game_id = _to_float(row[_COL_ID]) if len(row) > _COL_ID else None
        hp_raw = row[_COL_HP] if len(row) > _COL_HP else None
        # HP may be a formula string like '=2*11328' - evaluate simple ones
        hp = None
        if hp_raw is not None:
            if isinstance(hp_raw, (int, float)):
                hp = float(hp_raw)
            elif isinstance(hp_raw, str):
                try:
                    hp = float(eval(hp_raw.lstrip("=")))
                except Exception:
                    hp = None

        def get(col):
            return row[col] if len(row) > col else None

        resistances = BossResistances(
            phys_neg=_to_float(get(_COL_PHYS)),
            phys_mod=_to_float(get(_COL_PHYS_MOD)),
            strike_neg=_to_float(get(_COL_STRIKE)),
            strike_mod=_to_float(get(_COL_STRIKE_MOD)),
            slash_neg=_to_float(get(_COL_SLASH)),
            slash_mod=_to_float(get(_COL_SLASH_MOD)),
            pierce_neg=_to_float(get(_COL_PIERCE)),
            pierce_mod=_to_float(get(_COL_PIERCE_MOD)),
            magic_neg=_to_float(get(_COL_MAGIC)),
            magic_mod=_to_float(get(_COL_MAGIC_MOD)),
            fire_neg=_to_float(get(_COL_FIRE)),
            fire_mod=_to_float(get(_COL_FIRE_MOD)),
            lightning_neg=_to_float(get(_COL_LIGHTNING)),
            lightning_mod=_to_float(get(_COL_LIGHTNING_MOD)),
            holy_neg=_to_float(get(_COL_HOLY)),
            holy_mod=_to_float(get(_COL_HOLY_MOD)),
            poison=_to_resist(get(_COL_POISON)),
            rot=_to_resist(get(_COL_ROT)),
            bleed=_to_resist(get(_COL_BLEED)),
            frost=_to_resist(get(_COL_FROST)),
            sleep=_to_resist(get(_COL_SLEEP)),
            madness=_to_resist(get(_COL_MADNESS)),
            blight=_to_resist(get(_COL_BLIGHT)),
            poise=_to_resist(get(_COL_POISE)),
        )
        bosses[name] = (hp, resistances, game_id)
    return bosses


def parse(wb: openpyxl.Workbook) -> list[Boss]:
    # Collect HP from all 6 sheets
    std_solo = _parse_hp_sheet(wb["Nightlord Stats Solo"])
    std_duo = _parse_hp_sheet(wb["Nightlord Stats Duo"])
    std_trio = _parse_hp_sheet(wb["Nightlord Stats Trio"])
    dlc_solo = _parse_hp_sheet(wb["Everdark Sovereign Stats Solo"])
    dlc_duo = _parse_hp_sheet(wb["Everdark Sovereign Stats Duo"])
    dlc_trio = _parse_hp_sheet(wb["Everdark Sovereign Stats Trio"])

    # Merge all boss names
    all_names: set[str] = set()
    for d in (std_solo, std_duo, std_trio, dlc_solo, dlc_duo, dlc_trio):
        all_names.update(d.keys())

    bosses = []
    for name in sorted(all_names):
        # Get resistances from solo sheet (most complete)
        res_source = std_solo.get(name) or dlc_solo.get(name)
        resistances = res_source[1] if res_source else BossResistances()
        game_id = res_source[2] if res_source else None

        hp = BossHP(
            standard_solo=std_solo[name][0] if name in std_solo else None,
            standard_duo=std_duo[name][0] if name in std_duo else None,
            standard_trio=std_trio[name][0] if name in std_trio else None,
            dlc_solo=dlc_solo[name][0] if name in dlc_solo else None,
            dlc_duo=dlc_duo[name][0] if name in dlc_duo else None,
            dlc_trio=dlc_trio[name][0] if name in dlc_trio else None,
        )

        bosses.append(Boss(
            name=name,
            game_id=game_id,
            hp=hp,
            resistances=resistances,
            build_recommendations=[],
        ))

    return bosses
