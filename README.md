# Nightreign Wiki

Elden Ring Nightreign reference site — boss HP tables, relics, talismans, character stats, consumables, and more. Built from the community spreadsheet by Slay, Unlined-Betters, Emerald Wolf, and Penumbra.

**Current data version:** v1.03.2 + DLC

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- Python 3.11+ (for the data pipeline)

### Install dependencies and run

```bash
npm install
npm run dev
```

The site runs at `http://localhost:5173`.

---

## Project Structure

```
nightreign-site/
├── pipeline/                  # Python data pipeline
│   ├── data/
│   │   ├── raw/               # Source XLSX file lives here
│   │   └── archive/           # Old versions (YYYY-MM-DD/)
│   ├── parsers/               # One module per data type
│   ├── models.py              # Pydantic models
│   ├── export.py              # Writes JSON to public/data/
│   └── main.py                # Entry point
│
├── public/data/               # Generated JSON (committed)
│   ├── talismans.json
│   ├── relics.json
│   ├── dormant_powers.json
│   ├── characters.json
│   ├── bosses.json
│   ├── consumables.json
│   ├── level_costs.json
│   ├── expeditions.json
│   ├── meta.json
│   └── changelog.json         # Hand-edited patch notes
│
└── src/                       # React source
    ├── components/
    ├── hooks/
    └── pages/
```

---

## Updating data after a patch

1. **Archive current files:**
   ```bash
   mkdir -p pipeline/data/archive/YYYY-MM-DD
   cp pipeline/data/raw/nightreign_data.xlsx pipeline/data/archive/YYYY-MM-DD/
   ```

2. **Replace the source file:**
   Place the updated spreadsheet at `pipeline/data/raw/nightreign_data.xlsx`.

3. **Re-run the pipeline:**
   ```bash
   py -3.11 -m pipeline.main
   ```
   This regenerates all JSON files and updates `meta.json`.

4. **Update the changelog:**
   Edit `public/data/changelog.json` and add a new entry at the top:
   ```json
   {
     "version": "1.04.0",
     "date": "2026-05-01",
     "notes": ["New boss added", "Relic rebalance"]
   }
   ```

5. **Verify and deploy:**
   ```bash
   npm run dev   # spot-check locally
   git add public/data/
   git commit -m "Update data to v1.04.0"
   git push      # triggers auto-deploy on Netlify/Vercel
   ```

---

## Pipeline: adding a new data category

1. Add a new parser in `pipeline/parsers/your_category.py`.
2. Add the parse call and export in `pipeline/main.py` and `pipeline/export.py`.
3. Create a new React page in `src/pages/YourPage.jsx`.
4. Add the route to `src/App.jsx` and the nav link to `src/components/Nav.jsx`.

---

## Tech stack

| Layer | Technology |
|---|---|
| Data pipeline | Python 3.11 + pandas + openpyxl + pydantic |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Tables | TanStack Table v8 |
| Charts | Recharts |
| Deployment | Netlify / Vercel / GitHub Pages |

---

## Deployment (Netlify)

1. Push this repo to GitHub.
2. Connect the repo to Netlify.
3. Build command: `npm run build`
4. Publish directory: `dist`

Auto-deploys on every push to `main`.
