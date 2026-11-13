# SitingDash pilot schema (draft 0.1.0)

This is a draft contract so SitingIntel can emit JSON the dashboard can render without a build step. Jeff / SitingIntel should override any field names or types.

## Envelope

```json
{
  "schema": { "name": "sitingdash-pilot", "version": "0.1.0", "notes": "..." },
  "meta": {
    "product": "SitingDash",
    "pilot": { "id": "ohio", "label": "Ohio Pilot", "defaultCountyId": "licking-oh" },
    "status": "awaiting_sitingintel_data",
    "dataState": "placeholder",
    "generatedAt": null,
    "source": { "system": "SitingIntel", "attribution": null, "feed": null }
  },
  "counties": [ /* County */ ]
}
```

When live data arrives, expected `meta.status` would change (for example `ok` or `partial`) and `dataState` would leave `placeholder`. The renderer currently treats missing timestamps as `LAST VERIFIED: AWAITING DATA` regardless of status.

## County

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable slug: `licking-oh`, `delaware-oh` |
| `name` | string | `Licking County` / `Delaware County` (state is separate) |
| `state` | string | `OH` |
| `fips` | string | 5-digit county FIPS (`39089`, `39041`) |
| `lastVerified` | string or null | ISO-8601 UTC (`…Z`) once SitingIntel provides it |
| `projectOutcomes` | array | |
| `ballotMeasures` | array | |
| `councilVotes` | array | |
| `sentimentTimeline` | array | |
| `redFlags` | array | |
| `communityBenefitPrecedents` | array | Optional section, included in the pilot |

## Shared record fields

Most records include:

- `id` — stable per-slot / per-record id
- `placeholder` — `true` only for sample-shaped layout rows; live rows should omit or set `false`
- `label` — display label; placeholder rows use `[SAMPLE SHAPE] …`
- `sourceClass` — `"fact"` \| `"inference"` \| `null`
- `sourceUrl` — official source or `null`
- `lastVerified` — ISO-8601 UTC or `null` (card-level display currently uses the county timestamp; per-row timestamps are reserved for a later pass)

Numeric measures are `number` or `null`. The UI never substitutes an estimate. Null tallies render as `00 / --`.

## Section shapes (high level)

- **projectOutcomes:** `projectName`, `projectType`, `status`, `decision`, `decisionDate`, `body`, `record: { yes, no, display }`
- **ballotMeasures:** `title`, `electionDate`, `jurisdiction`, `result`, `yes`, `no`, `totalBallots`, `turnout`, `threshold`
- **councilVotes:** `body`, `meetingDate`, `matter`, `motion`, `result`, `tally: { yes, no, abstain, absent, display }`, `rollCall: [{ member, vote }]`
- **sentimentTimeline:** `periodLabel`, `date`, `tone`, `volume`, `headline` (tone/volume are expected to be inferences)
- **redFlags:** `severity`, `title`, `summary`, `evidence`
- **communityBenefitPrecedents:** `projectName`, `year`, `commitment`, `status`
