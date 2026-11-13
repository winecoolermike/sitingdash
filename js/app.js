/* SitingDash Ohio pilot — render-only front end.
   Does not invent values. null / missing fields display as — or 00 / --.
   Loads data/pilot-placeholder.json when served over HTTP; falls back to the
   inlined copy so the page still works from a file:// open. */

"use strict";

const DATA_URL = "data/pilot-placeholder.json";
const FALLBACK = {
  "schema": {
    "name": "sitingdash-pilot",
    "version": "0.1.0",
    "notes": "Draft contract for SitingIntel JSON output. Numeric fields are number or null. The display layer renders null as \u2014 (or 00 / -- in tally columns) and never invents values. Records with placeholder: true are sample-shaped layout only and must be labeled as such."
  },
  "meta": {
    "product": "SitingDash",
    "pilot": {
      "id": "ohio",
      "label": "Ohio Pilot",
      "defaultCountyId": "licking-oh"
    },
    "status": "awaiting_sitingintel_data",
    "dataState": "placeholder",
    "generatedAt": null,
    "source": {
      "system": "SitingIntel",
      "attribution": null,
      "feed": null
    },
    "disclaimer": "This file is a sample-shaped placeholder for the Ohio pilot. It does not contain real project outcomes, vote tallies, council records, sentiment, or red flags."
  },
  "counties": [
    {
      "id": "licking-oh",
      "name": "Licking County",
      "state": "OH",
      "fips": "39089",
      "lastVerified": null,
      "projectOutcomes": [
        {
          "id": "licking-oh-outcome-slot-01",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Project slot 01",
          "projectName": null,
          "projectType": null,
          "status": null,
          "decision": null,
          "decisionDate": null,
          "body": null,
          "record": {
            "yes": null,
            "no": null,
            "display": "00 / --"
          },
          "sourceUrl": null,
          "sourceClass": null,
          "lastVerified": null
        },
        {
          "id": "licking-oh-outcome-slot-02",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Project slot 02",
          "projectName": null,
          "projectType": null,
          "status": null,
          "decision": null,
          "decisionDate": null,
          "body": null,
          "record": {
            "yes": null,
            "no": null,
            "display": "00 / --"
          },
          "sourceUrl": null,
          "sourceClass": null,
          "lastVerified": null
        },
        {
          "id": "licking-oh-outcome-slot-03",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Project slot 03",
          "projectName": null,
          "projectType": null,
          "status": null,
          "decision": null,
          "decisionDate": null,
          "body": null,
          "record": {
            "yes": null,
            "no": null,
            "display": "00 / --"
          },
          "sourceUrl": null,
          "sourceClass": null,
          "lastVerified": null
        }
      ],
      "ballotMeasures": [
        {
          "id": "licking-oh-ballot-slot-01",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Measure slot 01",
          "title": null,
          "electionDate": null,
          "jurisdiction": null,
          "result": null,
          "yes": null,
          "no": null,
          "totalBallots": null,
          "turnout": null,
          "threshold": null,
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        },
        {
          "id": "licking-oh-ballot-slot-02",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Measure slot 02",
          "title": null,
          "electionDate": null,
          "jurisdiction": null,
          "result": null,
          "yes": null,
          "no": null,
          "totalBallots": null,
          "turnout": null,
          "threshold": null,
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        },
        {
          "id": "licking-oh-ballot-slot-03",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Measure slot 03",
          "title": null,
          "electionDate": null,
          "jurisdiction": null,
          "result": null,
          "yes": null,
          "no": null,
          "totalBallots": null,
          "turnout": null,
          "threshold": null,
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        }
      ],
      "councilVotes": [
        {
          "id": "licking-oh-council-slot-01",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Vote slot 01",
          "body": null,
          "meetingDate": null,
          "matter": null,
          "motion": null,
          "result": null,
          "tally": {
            "yes": null,
            "no": null,
            "abstain": null,
            "absent": null,
            "display": "00 / --"
          },
          "rollCall": [
            {
              "member": null,
              "vote": null,
              "placeholder": true,
              "label": "[SAMPLE SHAPE] Seat 01"
            },
            {
              "member": null,
              "vote": null,
              "placeholder": true,
              "label": "[SAMPLE SHAPE] Seat 02"
            },
            {
              "member": null,
              "vote": null,
              "placeholder": true,
              "label": "[SAMPLE SHAPE] Seat 03"
            }
          ],
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        },
        {
          "id": "licking-oh-council-slot-02",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Vote slot 02",
          "body": null,
          "meetingDate": null,
          "matter": null,
          "motion": null,
          "result": null,
          "tally": {
            "yes": null,
            "no": null,
            "abstain": null,
            "absent": null,
            "display": "00 / --"
          },
          "rollCall": [
            {
              "member": null,
              "vote": null,
              "placeholder": true,
              "label": "[SAMPLE SHAPE] Seat 01"
            },
            {
              "member": null,
              "vote": null,
              "placeholder": true,
              "label": "[SAMPLE SHAPE] Seat 02"
            },
            {
              "member": null,
              "vote": null,
              "placeholder": true,
              "label": "[SAMPLE SHAPE] Seat 03"
            }
          ],
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        }
      ],
      "sentimentTimeline": [
        {
          "id": "licking-oh-sentiment-slot-01",
          "placeholder": true,
          "periodLabel": "[SAMPLE SHAPE] Period 01",
          "date": null,
          "tone": null,
          "volume": null,
          "headline": null,
          "sourceClass": "inference",
          "lastVerified": null
        },
        {
          "id": "licking-oh-sentiment-slot-02",
          "placeholder": true,
          "periodLabel": "[SAMPLE SHAPE] Period 02",
          "date": null,
          "tone": null,
          "volume": null,
          "headline": null,
          "sourceClass": "inference",
          "lastVerified": null
        },
        {
          "id": "licking-oh-sentiment-slot-03",
          "placeholder": true,
          "periodLabel": "[SAMPLE SHAPE] Period 03",
          "date": null,
          "tone": null,
          "volume": null,
          "headline": null,
          "sourceClass": "inference",
          "lastVerified": null
        },
        {
          "id": "licking-oh-sentiment-slot-04",
          "placeholder": true,
          "periodLabel": "[SAMPLE SHAPE] Period 04",
          "date": null,
          "tone": null,
          "volume": null,
          "headline": null,
          "sourceClass": "inference",
          "lastVerified": null
        }
      ],
      "redFlags": [
        {
          "id": "licking-oh-flag-slot-01",
          "placeholder": true,
          "severity": null,
          "title": "[SAMPLE SHAPE] Flag slot 01",
          "summary": null,
          "evidence": null,
          "sourceClass": null,
          "sourceUrl": null,
          "lastVerified": null
        },
        {
          "id": "licking-oh-flag-slot-02",
          "placeholder": true,
          "severity": null,
          "title": "[SAMPLE SHAPE] Flag slot 02",
          "summary": null,
          "evidence": null,
          "sourceClass": null,
          "sourceUrl": null,
          "lastVerified": null
        },
        {
          "id": "licking-oh-flag-slot-03",
          "placeholder": true,
          "severity": null,
          "title": "[SAMPLE SHAPE] Flag slot 03",
          "summary": null,
          "evidence": null,
          "sourceClass": null,
          "sourceUrl": null,
          "lastVerified": null
        }
      ],
      "communityBenefitPrecedents": [
        {
          "id": "licking-oh-benefit-slot-01",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Precedent slot 01",
          "projectName": null,
          "year": null,
          "commitment": null,
          "status": null,
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        },
        {
          "id": "licking-oh-benefit-slot-02",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Precedent slot 02",
          "projectName": null,
          "year": null,
          "commitment": null,
          "status": null,
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        }
      ]
    },
    {
      "id": "delaware-oh",
      "name": "Delaware County",
      "state": "OH",
      "fips": "39041",
      "lastVerified": null,
      "projectOutcomes": [
        {
          "id": "delaware-oh-outcome-slot-01",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Project slot 01",
          "projectName": null,
          "projectType": null,
          "status": null,
          "decision": null,
          "decisionDate": null,
          "body": null,
          "record": {
            "yes": null,
            "no": null,
            "display": "00 / --"
          },
          "sourceUrl": null,
          "sourceClass": null,
          "lastVerified": null
        },
        {
          "id": "delaware-oh-outcome-slot-02",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Project slot 02",
          "projectName": null,
          "projectType": null,
          "status": null,
          "decision": null,
          "decisionDate": null,
          "body": null,
          "record": {
            "yes": null,
            "no": null,
            "display": "00 / --"
          },
          "sourceUrl": null,
          "sourceClass": null,
          "lastVerified": null
        },
        {
          "id": "delaware-oh-outcome-slot-03",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Project slot 03",
          "projectName": null,
          "projectType": null,
          "status": null,
          "decision": null,
          "decisionDate": null,
          "body": null,
          "record": {
            "yes": null,
            "no": null,
            "display": "00 / --"
          },
          "sourceUrl": null,
          "sourceClass": null,
          "lastVerified": null
        }
      ],
      "ballotMeasures": [
        {
          "id": "delaware-oh-ballot-slot-01",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Measure slot 01",
          "title": null,
          "electionDate": null,
          "jurisdiction": null,
          "result": null,
          "yes": null,
          "no": null,
          "totalBallots": null,
          "turnout": null,
          "threshold": null,
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        },
        {
          "id": "delaware-oh-ballot-slot-02",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Measure slot 02",
          "title": null,
          "electionDate": null,
          "jurisdiction": null,
          "result": null,
          "yes": null,
          "no": null,
          "totalBallots": null,
          "turnout": null,
          "threshold": null,
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        },
        {
          "id": "delaware-oh-ballot-slot-03",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Measure slot 03",
          "title": null,
          "electionDate": null,
          "jurisdiction": null,
          "result": null,
          "yes": null,
          "no": null,
          "totalBallots": null,
          "turnout": null,
          "threshold": null,
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        }
      ],
      "councilVotes": [
        {
          "id": "delaware-oh-council-slot-01",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Vote slot 01",
          "body": null,
          "meetingDate": null,
          "matter": null,
          "motion": null,
          "result": null,
          "tally": {
            "yes": null,
            "no": null,
            "abstain": null,
            "absent": null,
            "display": "00 / --"
          },
          "rollCall": [
            {
              "member": null,
              "vote": null,
              "placeholder": true,
              "label": "[SAMPLE SHAPE] Seat 01"
            },
            {
              "member": null,
              "vote": null,
              "placeholder": true,
              "label": "[SAMPLE SHAPE] Seat 02"
            },
            {
              "member": null,
              "vote": null,
              "placeholder": true,
              "label": "[SAMPLE SHAPE] Seat 03"
            }
          ],
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        },
        {
          "id": "delaware-oh-council-slot-02",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Vote slot 02",
          "body": null,
          "meetingDate": null,
          "matter": null,
          "motion": null,
          "result": null,
          "tally": {
            "yes": null,
            "no": null,
            "abstain": null,
            "absent": null,
            "display": "00 / --"
          },
          "rollCall": [
            {
              "member": null,
              "vote": null,
              "placeholder": true,
              "label": "[SAMPLE SHAPE] Seat 01"
            },
            {
              "member": null,
              "vote": null,
              "placeholder": true,
              "label": "[SAMPLE SHAPE] Seat 02"
            },
            {
              "member": null,
              "vote": null,
              "placeholder": true,
              "label": "[SAMPLE SHAPE] Seat 03"
            }
          ],
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        }
      ],
      "sentimentTimeline": [
        {
          "id": "delaware-oh-sentiment-slot-01",
          "placeholder": true,
          "periodLabel": "[SAMPLE SHAPE] Period 01",
          "date": null,
          "tone": null,
          "volume": null,
          "headline": null,
          "sourceClass": "inference",
          "lastVerified": null
        },
        {
          "id": "delaware-oh-sentiment-slot-02",
          "placeholder": true,
          "periodLabel": "[SAMPLE SHAPE] Period 02",
          "date": null,
          "tone": null,
          "volume": null,
          "headline": null,
          "sourceClass": "inference",
          "lastVerified": null
        },
        {
          "id": "delaware-oh-sentiment-slot-03",
          "placeholder": true,
          "periodLabel": "[SAMPLE SHAPE] Period 03",
          "date": null,
          "tone": null,
          "volume": null,
          "headline": null,
          "sourceClass": "inference",
          "lastVerified": null
        },
        {
          "id": "delaware-oh-sentiment-slot-04",
          "placeholder": true,
          "periodLabel": "[SAMPLE SHAPE] Period 04",
          "date": null,
          "tone": null,
          "volume": null,
          "headline": null,
          "sourceClass": "inference",
          "lastVerified": null
        }
      ],
      "redFlags": [
        {
          "id": "delaware-oh-flag-slot-01",
          "placeholder": true,
          "severity": null,
          "title": "[SAMPLE SHAPE] Flag slot 01",
          "summary": null,
          "evidence": null,
          "sourceClass": null,
          "sourceUrl": null,
          "lastVerified": null
        },
        {
          "id": "delaware-oh-flag-slot-02",
          "placeholder": true,
          "severity": null,
          "title": "[SAMPLE SHAPE] Flag slot 02",
          "summary": null,
          "evidence": null,
          "sourceClass": null,
          "sourceUrl": null,
          "lastVerified": null
        },
        {
          "id": "delaware-oh-flag-slot-03",
          "placeholder": true,
          "severity": null,
          "title": "[SAMPLE SHAPE] Flag slot 03",
          "summary": null,
          "evidence": null,
          "sourceClass": null,
          "sourceUrl": null,
          "lastVerified": null
        }
      ],
      "communityBenefitPrecedents": [
        {
          "id": "delaware-oh-benefit-slot-01",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Precedent slot 01",
          "projectName": null,
          "year": null,
          "commitment": null,
          "status": null,
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        },
        {
          "id": "delaware-oh-benefit-slot-02",
          "placeholder": true,
          "label": "[SAMPLE SHAPE] Precedent slot 02",
          "projectName": null,
          "year": null,
          "commitment": null,
          "status": null,
          "sourceUrl": null,
          "sourceClass": "fact",
          "lastVerified": null
        }
      ]
    }
  ]
};

const AWAITING = "AWAITING DATA";
const VERIFIED_PREFIX = "LAST VERIFIED: ";
const PLACEHOLDER_STAMP = "AWAITING SITINGINTEL DATA";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function dash(value) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function display(value, { placeholder = false, empty = "—" } = {}) {
  if (value === null || value === undefined || value === "") {
    return `<span class="dash">${escapeHtml(empty)}</span>`;
  }
  const cls = placeholder ? "sample" : "";
  return `<span class="${cls}">${escapeHtml(value)}</span>`;
}

function lastVerifiedLabel(iso) {
  if (!iso) return VERIFIED_PREFIX + AWAITING;
  return VERIFIED_PREFIX + String(iso);
}

function classBadge(sourceClass) {
  if (sourceClass === "fact") return `<span class="badge fact">Fact</span>`;
  if (sourceClass === "inference") return `<span class="badge inference">Inference</span>`;
  return `<span class="badge await">Class —</span>`;
}

function statusBadge(value) {
  if (!value) return `<span class="badge await">AWAITING</span>`;
  return `<span class="badge status">${escapeHtml(value)}</span>`;
}

function severityBadge(value) {
  if (!value) return `<span class="badge severity">SEV —</span>`;
  return `<span class="badge severity">${escapeHtml(value)}</span>`;
}

function tallyDisplay(record) {
  if (record && record.display) return escapeHtml(record.display);
  if (record && (record.yes != null || record.no != null)) {
    const yes = record.yes == null ? "00" : record.yes;
    const no = record.no == null ? "--" : record.no;
    return escapeHtml(`${yes} / ${no}`);
  }
  return "00 / --";
}

function setVerified(root, iso) {
  $$("[data-verified]", root).forEach((el) => {
    el.textContent = lastVerifiedLabel(iso);
  });
}

function countyFromHash(data) {
  const raw = (location.hash || "").replace(/^#/, "").trim();
  const ids = data.counties.map((c) => c.id);
  if (ids.includes(raw)) return raw;
  return data.meta?.pilot?.defaultCountyId || ids[0];
}

function getCounty(data, id) {
  return data.counties.find((c) => c.id === id) || data.counties[0];
}

function renderOutcomes(county) {
  const rows = (county.projectOutcomes || []).map((row) => {
    const name = row.label || row.projectName || "[SAMPLE SHAPE]";
    return `<tr>
      <td>${display(name, { placeholder: row.placeholder })}</td>
      <td>${display(row.projectType)}</td>
      <td>${statusBadge(row.status)}</td>
      <td>${display(row.decision)}</td>
      <td>${display(row.decisionDate)}</td>
      <td>${display(row.body)}</td>
      <td class="num"><span class="dash">${tallyDisplay(row.record)}</span></td>
      <td>${classBadge(row.sourceClass)}</td>
    </tr>`;
  }).join("");
  $("#body-outcomes").innerHTML = rows || `<tr class="empty-row"><td colspan="8">No outcome slots in the placeholder feed.</td></tr>`;
}

function renderBallots(county) {
  const items = (county.ballotMeasures || []).map((row) => {
    const title = row.label || row.title || "[SAMPLE SHAPE]";
    return `<article class="ballot">
      <div class="ballot-top">
        <div>
          <h3>${display(title, { placeholder: row.placeholder })}</h3>
          <div class="ballot-meta">
            Election ${dash(row.electionDate)}
            · ${dash(row.jurisdiction)}
            · Result ${dash(row.result)}
          </div>
        </div>
        ${classBadge(row.sourceClass)}
      </div>
      <div class="tally">
        <div class="tally-row"><span class="lbl">Yes</span><span class="track" aria-hidden="true"><i class="fill"></i></span><span class="val">${row.yes == null ? "00" : escapeHtml(row.yes)}</span></div>
        <div class="tally-row"><span class="lbl">No</span><span class="track" aria-hidden="true"><i class="fill"></i></span><span class="val">${row.no == null ? "--" : escapeHtml(row.no)}</span></div>
      </div>
      <div class="track-caption">No tally yet · sample-shaped bar only</div>
    </article>`;
  }).join("");
  $("#out-ballots").innerHTML = items || `<p class="loading-note">No ballot slots in the placeholder feed.</p>`;
}

function renderCouncil(county) {
  const items = (county.councilVotes || []).map((row) => {
    const title = row.label || row.matter || "[SAMPLE SHAPE]";
    const seats = (row.rollCall || []).map((seat) => {
      const name = seat.label || seat.member || "[SAMPLE SHAPE] Seat";
      return `<tr>
        <td>${display(name, { placeholder: seat.placeholder || row.placeholder })}</td>
        <td>${display(seat.vote, { empty: "—" })}</td>
      </tr>`;
    }).join("");
    return `<article class="vote-block">
      <div class="ballot-top">
        <div>
          <h3>${display(title, { placeholder: row.placeholder })}</h3>
          <div class="ballot-meta">
            ${dash(row.body)} · ${dash(row.meetingDate)} · Motion ${dash(row.motion)} · Result ${dash(row.result)}
          </div>
        </div>
        <div>${classBadge(row.sourceClass)} <span class="badge await">${tallyDisplay(row.tally)}</span></div>
      </div>
      <table class="roll">
        <thead><tr><th>Member</th><th>Vote</th></tr></thead>
        <tbody>${seats}</tbody>
      </table>
    </article>`;
  }).join("");
  $("#out-council").innerHTML = items || `<p class="loading-note">No council slots in the placeholder feed.</p>`;
}

function renderSentiment(county) {
  const nodes = (county.sentimentTimeline || []).map((row) => {
    return `<div class="t-node">
      <div class="t-dot" aria-hidden="true"></div>
      <h3>${escapeHtml(row.periodLabel || "[SAMPLE SHAPE]")}</h3>
      <p>Date ${dash(row.date)}</p>
      <p>Tone ${dash(row.tone)} · Vol ${dash(row.volume)}</p>
      <p>${row.headline ? escapeHtml(row.headline) : "—"}</p>
      <p style="margin-top:6px">${classBadge(row.sourceClass)}</p>
    </div>`;
  }).join("");
  $("#out-sentiment").innerHTML = `<div class="timeline">${nodes}</div>`;
}

function renderFlags(county) {
  const items = (county.redFlags || []).map((row) => {
    return `<article class="flag">
      <div class="flag-sev">${severityBadge(row.severity)}</div>
      <div>
        <h3>${display(row.title, { placeholder: row.placeholder })}</h3>
        <p>${row.summary ? escapeHtml(row.summary) : "Evidence and summary awaiting SitingIntel."}</p>
        <p style="margin-top:6px">${classBadge(row.sourceClass)}</p>
      </div>
    </article>`;
  }).join("");
  $("#out-flags").innerHTML = `<div class="flag-list">${items}</div>`;
}

function renderBenefits(county) {
  const rows = (county.communityBenefitPrecedents || []).map((row) => {
    const name = row.label || row.projectName || "[SAMPLE SHAPE]";
    return `<tr>
      <td>${display(name, { placeholder: row.placeholder })}</td>
      <td>${display(row.projectName)}</td>
      <td>${display(row.year)}</td>
      <td>${display(row.commitment)}</td>
      <td>${statusBadge(row.status)}</td>
      <td>${classBadge(row.sourceClass)}</td>
    </tr>`;
  }).join("");
  $("#body-benefits").innerHTML = rows || `<tr class="empty-row"><td colspan="6">No precedent slots in the placeholder feed.</td></tr>`;
}

function renderCounty(data, countyId) {
  const county = getCounty(data, countyId);
  const fullName = `${county.name}, ${county.state}`;
  $("#county-name").textContent = fullName;
  $("#county-verified").textContent = lastVerifiedLabel(county.lastVerified);
  document.title = `SitingDash — ${fullName}`;

  $$("#county-switch [data-county]").forEach((btn) => {
    const on = btn.getAttribute("data-county") === county.id;
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });

  renderOutcomes(county);
  renderBallots(county);
  renderCouncil(county);
  renderSentiment(county);
  renderFlags(county);
  renderBenefits(county);
  setVerified(document, county.lastVerified);

  if (location.hash.replace(/^#/, "") !== county.id) {
    history.replaceState(null, "", `#${county.id}`);
  }
}

function bindCountySwitch(data) {
  $("#county-switch").addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-county]");
    if (!btn) return;
    const id = btn.getAttribute("data-county");
    location.hash = id;
    renderCounty(data, id);
  });
  window.addEventListener("hashchange", () => {
    renderCounty(data, countyFromHash(data));
  });
}

function describeSource(payload, how) {
  const schema = payload?.schema;
  const schemaLine = schema ? `${schema.name} @ ${schema.version}` : "schema unknown";
  const state = payload?.meta?.status === "awaiting_sitingintel_data"
    ? PLACEHOLDER_STAMP
    : (payload?.meta?.status || "unknown status");
  $("#src-state").textContent = `${state} · ${how}`;
  $("#foot-meta").textContent = `${schemaLine} · feed ${how}`;
}

async function loadData() {
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`${DATA_URL} ${res.status}`);
    const payload = await res.json();
    if (!payload || !Array.isArray(payload.counties) || !payload.counties.length) {
      throw new Error("placeholder JSON missing counties[]");
    }
    return { payload, how: "loaded data/pilot-placeholder.json" };
  } catch (err) {
    console.warn("SitingDash falling back to inlined placeholder:", err);
    return { payload: FALLBACK, how: "inline fallback (file open or fetch failed)" };
  }
}

loadData().then(({ payload, how }) => {
  describeSource(payload, how);
  bindCountySwitch(payload);
  renderCounty(payload, countyFromHash(payload));
}).catch((err) => {
  $("#src-state").textContent = "COULD NOT BOOT PLACEHOLDER";
  console.error(err);
});
