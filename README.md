# SitingDash — Ohio Pilot (local scaffold)

One-page static dashboard for the Ohio siting pilot (Licking County and Delaware County).  
**Local only. Not published. Do not push or enable GitHub Pages until Jeff explicitly OKs it.**

Intended public path, when approved: `https://winecoolermike.github.io/sitingdash/`  
This folder is a standalone project (there is no `winecoolermike.github.io` user site and no `sitingdash` repo yet). Relative asset paths are set so the same files work at the repo root locally and under the `/sitingdash/` project-pages path later.

## Preview

No build step.

```bash
cd /workspace/sitingdash
python3 -m http.server 8765 --bind 127.0.0.1
# then open http://127.0.0.1:8765/
```

Opening `index.html` directly (`file://`) also works: if `data/pilot-placeholder.json` cannot be fetched, `js/app.js` uses an inlined copy of the same placeholder payload.

## Files

```
index.html
favicon.svg
css/style.css
js/app.js                  # renderer + inlined fallback payload
data/pilot-placeholder.json
SCHEMA.md
README.md
```

## Data rules

- `data/pilot-placeholder.json` is the draft contract for SitingIntel output (`schema.name`: `sitingdash-pilot`, `schema.version`: `0.1.0`). See `SCHEMA.md`.
- Every numeric field in the placeholder feed is `null`. The UI renders `—` or `00 / --`.
- Every section is stamped **AWAITING SITINGINTEL DATA**.
- Every data card shows **LAST VERIFIED: AWAITING DATA** until a real ISO-8601 timestamp is present.
- Rows are labeled `[SAMPLE SHAPE]` and `placeholder: true`. They are layout chrome, not real Licking or Delaware results.

## What this is not

Not legal, financial, or political advice. Not a live feed. Not deployed.
