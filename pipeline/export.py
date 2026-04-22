import json
import shutil
from datetime import date
from pathlib import Path

from pipeline.models import (
    Talisman, RelicPassive, DormantPower, Character,
    Boss, Consumable, LevelCost, Meta,
)


PUBLIC_DATA = Path(__file__).parent.parent / "public" / "data"


def _write(name: str, data) -> None:
    PUBLIC_DATA.mkdir(parents=True, exist_ok=True)
    out = PUBLIC_DATA / name
    if isinstance(data, list):
        payload = [item.model_dump() for item in data]
    else:
        payload = data.model_dump()
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  wrote {out} ({len(payload) if isinstance(payload, list) else 1} items)")


def export_all(
    talismans: list[Talisman],
    relics: list[RelicPassive],
    dormant_powers: list[DormantPower],
    characters: list[Character],
    bosses: list[Boss],
    consumables: list[Consumable],
    level_costs: list[LevelCost],
    expeditions: list[dict],
    version: str = "1.03.2",
) -> None:
    _write("talismans.json", talismans)
    _write("relics.json", relics)
    _write("dormant_powers.json", dormant_powers)
    _write("characters.json", characters)
    _write("bosses.json", bosses)
    _write("consumables.json", consumables)
    _write("level_costs.json", level_costs)

    PUBLIC_DATA.mkdir(parents=True, exist_ok=True)
    exp_path = PUBLIC_DATA / "expeditions.json"
    exp_path.write_text(json.dumps(expeditions, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  wrote {exp_path} ({len(expeditions)} items)")

    meta = Meta(
        version=version,
        last_updated=date.today().isoformat(),
        dlc_included=True,
        source="Nightreign Useful Info spreadsheet v1.03.2 + DLC, created by Slay, Unlined-Betters, Emerald Wolf, and Penumbra",
    )
    _write("meta.json", meta)

    # Write initial changelog if it doesn't exist
    changelog_path = PUBLIC_DATA / "changelog.json"
    if not changelog_path.exists():
        changelog = [
            {
                "version": "1.03.2",
                "date": date.today().isoformat(),
                "notes": [
                    "Initial release with DLC content",
                    "Includes all Nightlord and Everdark Sovereign boss stats",
                    "Full character level 1-15 stat progression",
                    "Talismans, relics, weapon passives, dormant powers, and consumables",
                ]
            }
        ]
        changelog_path.write_text(
            json.dumps(changelog, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(f"  wrote {changelog_path}")
