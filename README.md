# SitingDash — Ohio Pilot

One-page static dashboard for the Ohio siting pilot (Licking County and Delaware County), fed by SitingIntel's
research export. Live via GitHub Pages at `https://winecoolermike.github.io/sitingdash/` (changes go live only when pushed,
and pushes need Jeff's OK).

## Preview

No build step.

```bash
cd /workspace/sitingdash
python3 -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/            (Licking, default)
#      http://127.0.0.1:8765/#delaware-oh
```

Opening `index.html` directly (`file://`) also works: the page loads `data/ohio-pilot.inline.js`, a byte-for-byte copy of
`data/ohio-pilot.json`. If nothing can be loaded it says so and shows no data.

## Data

- Default feed: `data/ohio-pilot.json` (copied unmodified from SitingIntel's `/workspace/sitingintel-export/ohio-pilot.json`).
- Pick another feed with `?data=data/<file>.json` (relative paths under `data/` only; anything else is ignored and noted
  in the status banner). Example: `?data=data/pilot-placeholder.json` shows the original sample-shaped layout.
- Fallback order: `?data=` → `data/ohio-pilot.json` → `data/pilot-placeholder.json` → inline copy.
- Refresh after SitingIntel regenerates: `tools/sync-data.sh` (copies the export and rewrites the inline copy).
- Contract: `SCHEMA.md` (sitingdash-pilot v0.2.0, backward compatible with v0.1.0).

## Display rules

- Shows only what the JSON says. `null` renders as `—`. The one derived number is a yes-percentage computed from
  `yes`/`no` when `yesPct` is missing, labeled "computed from yes/no".
- Every record shows a fact/inference badge, all of its source URLs as links, its notes (collapsed; "Expand all notes"
  opens them), and its own last-verified date. Timestamps are converted to the Pacific calendar date and labeled `PT`;
  date-only values are shown as given.
- Feed status (`meta.status` / `meta.dataState`, currently partial / research snapshot) is shown in the header and banner.

## Search indexing (flip when Jeff approves)

The page currently has `<meta name="robots" content="noindex, nofollow">` (line 9 of `index.html`).
To make it indexable, delete that one line. A ready-made local branch `indexable` contains exactly that change:

```bash
git diff main indexable      # one-line removal
git checkout main && git merge --ff-only indexable   # or cherry-pick it, after Jeff's OK
```

## Files

```
index.html
favicon.svg
css/style.css
js/app.js                    # renderer (no data inlined)
data/ohio-pilot.json         # SitingIntel export (unmodified copy)
data/ohio-pilot.inline.js    # same data for file:// opens (generated)
data/pilot-placeholder.json  # original sample-shaped feed
tools/sync-data.sh           # refresh helper
SCHEMA.md
README.md
```

Not legal, financial, or political advice.
