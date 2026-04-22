import sys
from pathlib import Path
import openpyxl

from pipeline.parsers import talismans, relics, dormant_powers, characters, bosses, consumables, level_costs, expeditions
from pipeline.export import export_all

RAW_DIR = Path(__file__).parent / "data" / "raw"
DATA_FILE = RAW_DIR / "nightreign_data.xlsx"


def main() -> None:
    if not DATA_FILE.exists():
        print(f"ERROR: Source file not found: {DATA_FILE}")
        print("Place nightreign_data.xlsx in pipeline/data/raw/ and re-run.")
        sys.exit(1)

    print(f"Loading {DATA_FILE}...")
    wb = openpyxl.load_workbook(DATA_FILE, read_only=True, data_only=True)

    print("Parsing talismans...")
    talisman_data = talismans.parse(wb)
    print(f"  {len(talisman_data)} talismans")

    print("Parsing relics & passives...")
    relic_data = relics.parse(wb)
    print(f"  {len(relic_data)} relics/passives")

    print("Parsing dormant powers...")
    dormant_data = dormant_powers.parse(wb)
    print(f"  {len(dormant_data)} dormant powers")

    print("Parsing characters...")
    character_data = characters.parse(wb)
    print(f"  {len(character_data)} characters")

    print("Parsing bosses...")
    boss_data = bosses.parse(wb)
    print(f"  {len(boss_data)} bosses")

    print("Parsing consumables...")
    consumable_data = consumables.parse(wb)
    print(f"  {len(consumable_data)} consumables")

    print("Parsing level costs...")
    level_cost_data = level_costs.parse(wb)
    print(f"  {len(level_cost_data)} level cost entries")

    print("Parsing expedition relics...")
    expedition_data = expeditions.parse(wb)
    print(f"  {len(expedition_data)} expeditions")

    wb.close()

    print("\nExporting JSON...")
    export_all(
        talismans=talisman_data,
        relics=relic_data,
        dormant_powers=dormant_data,
        characters=character_data,
        bosses=boss_data,
        consumables=consumable_data,
        level_costs=level_cost_data,
        expeditions=expedition_data,
    )
    print("\nDone. JSON files written to public/data/")


if __name__ == "__main__":
    main()
