# Nightreign Wiki — Claude Code Context

## Project overview
Static reference site for Elden Ring Nightreign (v1.03.2 + DLC). Converts a community spreadsheet into a React web app. Data pipeline is Python; frontend is React + Vite + Tailwind.

## Current phase
Phase 2 complete — React scaffold + all pages built. Next: Phase 3 polish (global search refinement, mobile pass, CI/CD setup).

## Commands

```bash
# Run data pipeline (regenerates all JSON)
py -3.11 -m pipeline.main

# Start dev server
npm run dev

# Build for production
npm run build
```

## Architecture
- `pipeline/` — Python pipeline, reads `pipeline/data/raw/nightreign_data.xlsx`, writes to `public/data/`
- `public/data/` — Generated JSON files served statically (committed to repo)
- `src/` — React source; all data loaded via `fetch('/data/*.json')` at runtime
- No backend server — fully static

## Source data
Single file: `pipeline/data/raw/nightreign_data.xlsx`
Sheet → JSON mapping:
| Sheet | JSON output |
|---|---|
| Talisman Effects | talismans.json |
| Relic Effects + Deep Relic Effects + Weapon Effects + Deep Weapon Effects | relics.json |
| Dormant Powers | dormant_powers.json |
| Character Stats Level 15 + Character Stats Table (Outdated) | characters.json |
| Nightlord Stats Solo/Duo/Trio + Everdark Sovereign Stats Solo/Duo/Trio | bosses.json |
| Consumable Effects | consumables.json |
| Level Up Cost | level_costs.json |
| Guaranteed Relics | expeditions.json |

## Key data notes
- All 17 uploaded Excel files are identical — only `pipeline/data/raw/nightreign_data.xlsx` is used
- Scholar and Undertaker are DLC characters — they have base stats only, no per-level progression in the source data (`Character Stats Table (Outdated)` sheet lacks them)
- "Guaranteed Relics" sheet contains guaranteed relics per expedition (not per boss), displayed on `/builds` as "Expedition Relics"
- Boss HP columns: Solo/Duo/Trio = 1/2/3 player modes; Standard vs DLC (Everdark Sovereign) are separate sheets
- Resistance modifier values: positive = takes MORE damage from that type; negative = takes less; "Immune" is a string

## Routes
| Route | Page | Data |
|---|---|---|
| / | Home | meta.json + summary counts |
| /talismans | Talismans | talismans.json |
| /relics | Relics & Passives | relics.json (filtered by source field) |
| /dormant-powers | Dormant Powers | dormant_powers.json |
| /consumables | Consumables | consumables.json |
| /characters | Characters grid | characters.json |
| /characters/:name | Character detail | characters.json + relics.json |
| /bosses | Boss table | bosses.json |
| /bosses/:name | Boss detail | bosses.json |
| /builds | Expedition relics | expeditions.json |
| /level-calculator | Rune calc | level_costs.json |
| /changelog | Changelog | changelog.json |

## File naming conventions
- Pipeline parsers: `pipeline/parsers/<datatype>.py`
- React pages: `src/pages/<PageName>.jsx`
- Shared components: `src/components/<ComponentName>.jsx`
- Data hooks: `src/hooks/use<Name>.js`

## Updating for a patch
1. Archive `pipeline/data/raw/nightreign_data.xlsx` to `pipeline/data/archive/YYYY-MM-DD/`
2. Replace with updated file (same name)
3. `py -3.11 -m pipeline.main`
4. Edit `public/data/changelog.json` to add new entry at top
5. Commit `public/data/` and push
