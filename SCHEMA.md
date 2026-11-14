# SitingDash pilot schema — v0.2.0

Contract between SitingIntel (producer) and the SitingDash static renderer (consumer).
v0.2.0 is **additive and backward compatible**: every field added here is optional, and a valid
v0.1.0 file (including SitingIntel's 2026-11-13 Ohio export with its extension fields) is still valid.
The renderer accepts `schema.version` `0.1.x` and `0.2.x`.

Ground rules (unchanged):

- Never estimate. Unknown → `null` (or omit an optional field). Numbers are JSON numbers or `null`.
- Every record carries `sourceClass` (`"fact"` | `"inference"` | `"unconfirmed"`), at least one source URL where one exists, and `lastVerified`.
- `"fact"` means verified against an official or primary record (or an original news report of it). Anything secondhand,
  single-source and unverified, or estimated is `"unconfirmed"`, never `"fact"`.
- The renderer only displays what is in the file. The single derived value it may show is a yes-percentage computed
  from `yes`/`no` when `yesPct` is absent, and it labels that value **computed**.

## What changed from v0.1.0

| # | Change | Where | Notes |
| --- | --- | --- | --- |
| 1 | **New section `regulatoryActions`** | County | Moratoria, zoning bans, ordinances, policies. Fields below. |
| 1 | **`notes`** adopted | Every record | String, or array of strings. Free-form context (MW, acreage, investment, mover/second, ballot %). Rendered as text, never parsed for numbers. |
| 2 | **`sourceUrls[]`** adopted | Every record | All sources. `sourceUrl` stays and should equal `sourceUrls[0]`. Renderer shows the union, deduplicated. |
| 2 | `sourceRecordId`, `sourceFactType` adopted | Every record | Optional provenance strings, shown small. |
| 3 | **`lastVerified` widened** + `lastVerifiedPrecision` | Every record, county | Accepts `YYYY-MM-DD` (date-only) **or** full ISO-8601 timestamp with `Z`/offset. Optional `lastVerifiedPrecision`: `"date"` \| `"datetime"`. |
| 4 | **`milestones[]`** | projectOutcomes | Annexation, rezoning, abatement, moratorium, ballot, etc. |
| 5 | **`recused`, `movedBy`, `secondedBy`, `motionText`**; text tallies | councilVotes | `tally.display` may be any text (`"unanimous (count not stated)"`). Optional `tally.recused`. |
| 6 | **`yesPct`, `noPct`, `certification`, `certificationNote`, `subjectThreshold`** | ballotMeasures | All Nov 3, 2026 results should be `certification: "unofficial"` until canvassed. |
| 7 | **`severity` defined**: `"high"` \| `"medium"` \| `"low"` \| `null`; optional `severityBasis` | redFlags | Severity is always an **inference** (an analyst judgment), regardless of the record's `sourceClass`. `null` = not rated. |
| 8 | **`terms`** object (optional); `commitment` kept | communityBenefitPrecedents | Structured terms alongside the human-readable `commitment` string. |
| 9 | **`toneClass`** (`"fact"` \| `"inference"`) | sentimentTimeline | Class of the `tone` call. The record `sourceClass` can be `"fact"` when the headline/quote is sourced while `toneClass` stays `"inference"`. |
| — | `effect`, `dateNote` | regulatoryActions (and any dated record for `dateNote`) | See below. |
| 10 | **`sourceClass: "unconfirmed"`** added (v0.2.0, 2026-11-13) | Every record | Secondhand or single-source, not verified against an official or primary record. Shown as a magenta UNCONFIRMED badge, distinct from FACT (cyan) and INFERENCE (amber). |
| 11 | **`severityClass`** (always `"inference"`) and the severity rubric below | redFlags | |

Not adopted: per-field `sourceClass` on every field (only `toneClass` and the severity rule above).

## Envelope

```json
{
  "schema": { "name": "sitingdash-pilot", "version": "0.2.0", "notes": "..." },
  "meta": {
    "product": "SitingDash",
    "pilot": { "id": "ohio", "label": "Ohio Pilot", "defaultCountyId": "licking-oh" },
    "status": "partial",
    "dataState": "research_snapshot",
    "generatedAt": "2026-11-14T00:18:52Z",
    "source": { "system": "SitingIntel", "attribution": "...", "feed": "..." },
    "disclaimer": "..."
  },
  "counties": [ /* County */ ]
}
```

`meta.status`: `"awaiting_sitingintel_data"` | `"partial"` | `"ok"`. `meta.dataState`: `"placeholder"` | `"research_snapshot"` | `"live"`.
Both are shown in the page header and status banner.

## County

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | `licking-oh`, `delaware-oh` |
| `name` | string | `Licking County` |
| `state` | string | `OH` |
| `fips` | string | `39089`, `39041` |
| `lastVerified` | string \| null | Date-only or ISO timestamp (see below) |
| `lastVerifiedPrecision` | `"date"` \| `"datetime"` | optional |
| `projectOutcomes` | array | |
| `ballotMeasures` | array | |
| `councilVotes` | array | |
| `sentimentTimeline` | array | |
| `redFlags` | array | |
| `communityBenefitPrecedents` | array | |
| `regulatoryActions` | array | **new, optional** (missing = empty section) |

## Shared record fields

| Field | Type | Status |
| --- | --- | --- |
| `id` | string | required, unique across the file |
| `placeholder` | boolean | `false` for real rows |
| `label` | string | optional display label |
| `sourceClass` | `"fact"` \| `"inference"` \| `"unconfirmed"` | required for real rows |
| `sourceUrl` | string \| null | primary source; should equal `sourceUrls[0]` |
| `sourceUrls` | string[] | **new** optional; all sources, `http(s)` only |
| `sourceRecordId` | string | **new** optional |
| `sourceFactType` | string | **new** optional (e.g. `verified`) |
| `notes` | string \| string[] | **new** optional. A string may use ` \| ` separators; the renderer shows each piece on its own line. |
| `lastVerified` | string \| null | **widened**: `YYYY-MM-DD` or ISO-8601 timestamp |
| `lastVerifiedPrecision` | `"date"` \| `"datetime"` | **new** optional |

### lastVerified display rule

- Date-only (`2026-11-12`): shown exactly as given.
- Timestamp (`2026-11-13T02:33:37Z`): converted to the calendar date in America/Los_Angeles and labeled `PT`
  (that example shows `2026-11-12 PT`).
- Recommended going forward: emit the date the check was actually done, as `YYYY-MM-DD` with
  `lastVerifiedPrecision: "date"`, rather than a file write time.

### Dates on records

Date fields (`decisionDate`, `electionDate`, `meetingDate`, `date`) should be `YYYY-MM-DD`, `YYYY-MM`, or `YYYY`.
Put qualifiers (`"(as quoted)"`, `"(RPC review)"`, ranges, lists) in an optional `dateNote` string.
The renderer shows any string as given, so free text still renders; it just will not sort cleanly.

## Sections

### projectOutcomes
v0.1.0: `projectName`, `projectType`, `status`, `decision`, `decisionDate`, `body`, `record: { yes, no, display }`.

**New optional `milestones[]`:**

```json
{ "type": "annexation | rezoning | abatement | moratorium | ballot | site_plan | permit | other",
  "date": "2026-08-25", "dateNote": null, "body": "Pataskala City Council",
  "description": "Site plan rejected", "result": "rejected 7-0",
  "sourceUrl": "https://...", "sourceClass": "fact" }
```

`record.display` with `yes`/`no` both `null` (for example `"00 / --"`) renders as `—` (no recorded vote).

### ballotMeasures
v0.1.0: `title`, `electionDate`, `jurisdiction`, `result`, `yes`, `no`, `totalBallots`, `turnout`, `threshold`.

| New field | Type | Notes |
| --- | --- | --- |
| `yesPct` | number \| null | 0–100, as reported by the source |
| `noPct` | number \| null | 0–100 |
| `certification` | `"unofficial"` \| `"certified"` \| null | null = not stated |
| `certificationNote` | string \| null | e.g. `"official canvass not confirmed as of 2026-11-12"` |
| `subjectThreshold` | string \| null | What the measure regulates, e.g. `">25 MW peak load"`. Distinct from `threshold` (the vote share needed to pass). |

Tally bar: uses `yesPct`/`noPct` when present (labeled "pct per source"). If absent and both `yes` and `no` are numbers, the bar
uses yes ÷ (yes + no), labeled "computed from yes/no". Otherwise the bar stays empty.
If `certification` is missing, the renderer shows "unofficial (per source text)" only when the record's `result` or `notes`
contains "unofficial" or "preliminary", and otherwise "certification not stated".

### councilVotes
v0.1.0: `body`, `meetingDate`, `matter`, `motion`, `result`, `tally: { yes, no, abstain, absent, display }`, `rollCall: [{ member, vote }] | null`.

| New field | Type | Notes |
| --- | --- | --- |
| `motionText` | string \| null | Verbatim or close paraphrase of the motion |
| `movedBy` | string \| null | |
| `secondedBy` | string \| null | |
| `recused` | string[] | Member names |
| `tally.recused` | number \| null | |
| `tally.display` | string | **Any text allowed** (`"unanimous (count not stated)"`). Never back-fill numeric fields from text. |
| `rollCall[].vote` | `"yes"` \| `"no"` \| `"abstain"` \| `"absent"` \| `"recused"` \| null | `recused` added |

`rollCall: null` renders as "roll call not reported".

### sentimentTimeline
v0.1.0: `periodLabel`, `date`, `tone`, `volume`, `headline`.
**New optional `toneClass`** (`"fact"` \| `"inference"`). If omitted, the tone is treated as inference.
Renderer sorts rows by `date` string ascending (nulls last).

### redFlags
v0.1.0: `severity`, `title`, `summary`, `evidence`.

- `severity`: `"high"` \| `"medium"` \| `"low"` \| `null` (not rated → shown as UNRATED). Always an inference.
- `severityClass`: optional, always `"inference"`.
- `severityBasis`: optional one-line string naming the rubric rule that matched and the flag text it matched.

#### Severity rubric (SitingDash)

Severity is judged only from the flag's own `title` and `summary`. It rates how much the issue the flag describes bears on
siting outcomes. If no rule clearly matches the text, severity stays `null` (UNRATED). Displayed as
"SEVERITY (SITINGDASH INFERENCE)".

| Rule | Level | Matches when the flag text states… |
| --- | --- | --- |
| H1 | high | an enacted moratorium or ban (adopted / passed / in effect, or a recorded passing vote) |
| H2 | high | a denial of the project |
| H3 | high | a ballot or referendum defeat for the project |
| H4 | high | litigation or an appeal affecting the project |
| M1 | medium | a pending or proposed moratorium or ban, including one placed on (or being certified to) a ballot |
| M2 | medium | organized opposition with an official action scheduled |
| M3 | medium | a utility or water constraint documented in an official record |
| L1 | low | commentary or social sentiment with no official action |

Data-quality flags (source contradictions, gaps, paywalls, clerical errors) usually match no rule and stay UNRATED.
- `evidence`: string (may be ` ; `-separated URLs and/or record ids) **or** string[]. URLs render as links; a token matching
  another record's `id` renders as an in-page jump link.

### communityBenefitPrecedents
v0.1.0: `projectName`, `year`, `commitment`, `status`. `commitment` stays as the human-readable string.

**New optional `terms` object** (all keys optional, string or number values, never estimated):

```json
{ "abatementPct": "87.5% yrs 1-15; 75% yrs 16-30", "termYears": 30, "pilotPayment": null,
  "investment": ">$274 million", "jobs": "25-30 FT", "payroll": null, "schoolShare": null,
  "otherTerms": ["..."] }
```

### regulatoryActions (new)

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | |
| `jurisdiction` | string | e.g. `City of Sunbury` |
| `actionType` | string | Recommended: `moratorium`, `zoning_ban`, `zoning_text_amendment`, `zoning_map_amendment`, `rezoning`, `ordinance`, `administrative_policy`, `comprehensive_plan`, `other`. Free text accepted. |
| `date` | string \| null | See "Dates on records"; `dateNote` optional |
| `status` | string \| null | Recommended: `proposed`, `pending`, `approved`, `in_effect`, `expired`, `denied`, `not_adopted`, `unverified`. Optional `statusNote` for detail. |
| `voteSummary` | string \| object \| null | e.g. `{"trustees": "3-0"}`; a JSON-encoded string is also accepted |
| `effect` | string \| null | What the action does |
| `expires` | string \| null | Optional end date for moratoria |
| + shared fields | | |

## SitingDash overlay (`data/sitingdash-overrides.json`)

SitingDash never edits SitingIntel's feed. Its corrections live in an overlay applied in the browser at render time, and every
affected row shows a "RELABELED BY SITINGDASH" / "SEVERITY SET BY SITINGDASH" / "SOURCE ADDED BY SITINGDASH" note with the rule and reason.

```json
{ "name": "sitingdash-overrides", "version": "1.0.0",
  "appliesTo": { "file": "data/ohio-pilot.json", "generatedAt": "2026-11-14T00:18:52Z" },
  "rules": { "U1": "...", "H1": "..." },
  "overrides": [
    { "id": "delaware-oh-flag-19", "rule": "U1", "set": { "sourceClass": "unconfirmed" }, "was": { "sourceClass": "fact" }, "reason": "..." },
    { "id": "licking-oh-flag-09", "rule": "H4", "set": { "severity": "high", "severityClass": "inference", "severityBasis": "H4: ..." }, "reason": "..." },
    { "id": "licking-oh-flag-20", "rule": "S1", "addSourceUrls": ["https://..."], "sourceNote": "source added by SitingDash, verified 2026-11-13 PT", "reason": "..." },
    { "id": "licking-oh-flag-15", "rule": "R1", "relatedRecords": ["licking-oh-vote-14"], "reason": "..." }
  ] }
```

Relabel rules (FACT → UNCONFIRMED), built by `tools/build-overrides.py`:

- **U1** — red flags SitingIntel generated as "Secondhand/unconfirmed source: …".
- **U2** — records SitingIntel's dataset marks `reported` (secondary/aggregator/snippet; not independently confirmed).
- **U3** — Delaware records named by a secondhand flag whose reason says the main claim is secondhand, single-source, or unverified.
- **U4** — records whose own text says unverified / not verified / secondhand / as quoted / est. / estimate / snippet /
  search summary / aggregator / tracker-only / unconfirmed / reportedly / "(reported)" (four items excluded; see `u4Excluded`).

If SitingIntel emits `"unconfirmed"` directly, the overlay's relabels for those records become no-ops.
