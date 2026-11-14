/* SitingDash Ohio pilot — render-only front end (schema sitingdash-pilot 0.1.x / 0.2.x).
   Displays only what is in the JSON feed. The single derived value is a yes-percentage computed from
   yes/no when the feed has no yesPct, and it is labeled "computed".

   Data path: ?data=data/<file>.json (relative, under data/ only), default data/ohio-pilot.json,
   then data/pilot-placeholder.json. If fetch is unavailable (file:// open), it loads the inline copy in
   data/ohio-pilot.inline.js. If that also fails, it says so instead of showing anything made up. */

"use strict";

const DEFAULT_DATA = "data/ohio-pilot.json";
const PLACEHOLDER_DATA = "data/pilot-placeholder.json";
const INLINE_SCRIPT = "data/ohio-pilot.inline.js";
const TZ = "America/Los_Angeles";
const VERIFIED_PREFIX = "LAST VERIFIED: ";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- small helpers ---------- */

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const isBlank = (v) => v === null || v === undefined || v === "";
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

function show(value, { placeholder = false, empty = "—" } = {}) {
  if (isBlank(value)) return `<span class="dash">${esc(empty)}</span>`;
  return `<span class="${placeholder ? "sample" : ""}">${esc(value)}</span>`;
}

function safeUrl(u) {
  return typeof u === "string" && /^https?:\/\/[^\s]+$/i.test(u.trim()) ? u.trim() : null;
}

function shortUrl(u) {
  try {
    const url = new URL(u);
    const path = url.pathname.length > 38 ? url.pathname.slice(0, 36) + "…" : url.pathname;
    return url.hostname.replace(/^www\./, "") + (path === "/" ? "" : path);
  } catch (_) {
    return u;
  }
}

function link(u, text) {
  const href = safeUrl(u);
  if (!href) return esc(u);
  return `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" title="${esc(href)}">${esc(text || shortUrl(href))}</a>`;
}

/* lastVerified: date-only → as given; timestamp → calendar date in America/Los_Angeles, labeled PT. */
const ptDate = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const ptDateTime = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

function verifiedText(value) {
  if (isBlank(value)) return "AWAITING DATA";
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return `${ptDate.format(d)} PT`;
  }
  return s; // unrecognized: show as given
}

function timestampPT(value) {
  if (isBlank(value)) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${ptDateTime.format(d).replace(",", "")} PT`;
}

function classBadge(sourceClass, prefix = "") {
  const p = prefix ? `${esc(prefix)} ` : "";
  if (sourceClass === "fact") return `<span class="badge fact">${p}Fact</span>`;
  if (sourceClass === "inference") return `<span class="badge inference">${p}Inference</span>`;
  return `<span class="badge await">${p}Class —</span>`;
}

function statusBadge(value) {
  if (isBlank(value)) return `<span class="badge await">—</span>`;
  const v = String(value);
  let tone = "status";
  if (/denied|reject|withdrawn|not_adopted|failed/i.test(v)) tone = "neg";
  else if (/pending|proposed|unverified|unknown|progress/i.test(v)) tone = "pending";
  else if (/moratorium|in_effect|in force|ban/i.test(v)) tone = "hot";
  return `<span class="badge ${tone}">${esc(v.replace(/_/g, " "))}</span>`;
}

function severityBadge(value) {
  const v = isBlank(value) ? null : String(value).toLowerCase();
  if (!v) return `<span class="badge sev-none" title="Severity not rated. Severity is an inference when present.">SEV —</span>`;
  const cls = ["high", "medium", "low"].includes(v) ? `sev-${v}` : "sev-none";
  return `<span class="badge ${cls}" title="Severity is an analyst inference">SEV ${esc(v)}</span>`;
}

function verifiedChip(row) {
  return `<span class="verified-chip">${VERIFIED_PREFIX}${esc(verifiedText(row.lastVerified))}</span>`;
}

function allSources(row) {
  const list = [];
  if (row.sourceUrl) list.push(row.sourceUrl);
  if (Array.isArray(row.sourceUrls)) list.push(...row.sourceUrls);
  return [...new Set(list.filter((u) => typeof u === "string" && u.trim()).map((u) => u.trim()))];
}

function sourcesHtml(row) {
  const urls = allSources(row);
  if (!urls.length) return `<span class="src-none">NO SOURCE URL IN FEED</span>`;
  return `<span class="src-label">SRC</span> ` + urls.map((u, i) => `<span class="src-item">[${i + 1}] ${link(u)}</span>`).join(" ");
}

function noteLines(notes) {
  if (isBlank(notes)) return [];
  if (Array.isArray(notes)) return notes.filter((n) => !isBlank(n)).map(String);
  return String(notes).split(/\s+\|\s+/).filter(Boolean);
}

function notesHtml(row) {
  const lines = noteLines(row.notes);
  if (!lines.length) return "";
  return `<details class="notes"><summary>Notes (${lines.length === 1 ? "1 line" : lines.length + " lines"})</summary>
    <ul>${lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ul></details>`;
}

/* A string that holds a JSON object is rendered as a key/value list; anything else as text. */
function maybeStructured(value) {
  if (isBlank(value)) return show(value);
  if (typeof value === "object") return kvList(value);
  const s = String(value).trim();
  if (/^[\[{]/.test(s)) {
    try { return kvList(JSON.parse(s)); } catch (_) { /* fall through */ }
  }
  return esc(s);
}

function kvList(obj) {
  if (obj === null || obj === undefined) return show(null);
  if (Array.isArray(obj)) return `<ul class="kv">${obj.map((v) => `<li>${typeof v === "object" ? kvList(v) : esc(v)}</li>`).join("")}</ul>`;
  if (typeof obj !== "object") return esc(obj);
  const items = Object.entries(obj).map(([k, v]) =>
    `<li><span class="k">${esc(k.replace(/_/g, " "))}:</span> ${v !== null && typeof v === "object" ? kvList(v) : show(v)}</li>`);
  return `<ul class="kv">${items.join("")}</ul>`;
}

function rowMeta(row, extra = "") {
  return `<div class="row-meta">
    <div class="row-meta-line">${classBadge(row.sourceClass)} ${verifiedChip(row)}
      ${row.sourceRecordId ? `<span class="rec-id">${esc(row.sourceRecordId)}${row.sourceFactType ? " · " + esc(row.sourceFactType) : ""}</span>` : ""}</div>
    <div class="row-sources">${sourcesHtml(row)}</div>
    ${extra}
    ${notesHtml(row)}
  </div>`;
}

function recId(row) {
  return row && row.id ? ` id="rec-${esc(row.id)}"` : "";
}

/* ---------- section state ---------- */

function sectionState(rows) {
  if (!rows || !rows.length) return "empty";
  if (rows.every((r) => r.placeholder)) return "placeholder";
  return "live";
}

function setStamp(sectionId, state, meta) {
  const stamp = $(`#${sectionId} .stamp`);
  if (!stamp) return;
  stamp.classList.remove("live", "empty");
  if (state === "live") {
    stamp.textContent = `SITINGINTEL · ${String(meta?.dataState || "data").replace(/_/g, " ")}`;
    stamp.classList.add("live");
  } else if (state === "empty") {
    stamp.textContent = "NO RECORDS IN FEED";
    stamp.classList.add("empty");
  } else {
    stamp.textContent = "AWAITING SITINGINTEL DATA";
  }
}

function emptyNote(what) {
  return `<p class="loading-note empty-state">No ${esc(what)} in the SitingIntel feed for this county. Nothing is shown rather than guessing.</p>`;
}

/* ---------- renderers ---------- */

function tallyText(t) {
  if (!t) return null;
  const hasNums = isNum(t.yes) || isNum(t.no);
  if (!isBlank(t.display) && !(t.display === "00 / --" && !hasNums)) return String(t.display);
  if (hasNums) return `${isNum(t.yes) ? t.yes : "—"} / ${isNum(t.no) ? t.no : "—"}`;
  return null;
}

function milestonesHtml(row) {
  if (!Array.isArray(row.milestones) || !row.milestones.length) return "";
  const items = row.milestones.map((m) => `<tr>
      <td>${show(m.date)}${m.dateNote ? ` <span class="muted">(${esc(m.dateNote)})</span>` : ""}</td>
      <td>${show(m.type)}</td><td>${show(m.body)}</td><td>${show(m.description)}</td><td>${show(m.result)}</td>
      <td>${classBadge(m.sourceClass)}</td><td>${m.sourceUrl ? link(m.sourceUrl) : show(null)}</td></tr>`).join("");
  return `<table class="roll milestones"><thead><tr><th>Date</th><th>Milestone</th><th>Body</th><th>What</th><th>Result</th><th>Class</th><th>Src</th></tr></thead><tbody>${items}</tbody></table>`;
}

function renderOutcomes(county, meta) {
  const list = county.projectOutcomes || [];
  setStamp("sec-outcomes", sectionState(list), meta);
  if (!list.length) {
    $("#body-outcomes").innerHTML = `<tr class="empty-row"><td colspan="8">${emptyNote("project outcomes")}</td></tr>`;
    return;
  }
  $("#body-outcomes").innerHTML = list.map((row) => {
    const name = row.projectName || row.label || "[SAMPLE SHAPE]";
    const tally = tallyText(row.record);
    return `<tr class="main-row"${recId(row)}>
      <td class="strong">${show(name, { placeholder: row.placeholder })}</td>
      <td>${show(row.projectType)}</td>
      <td>${statusBadge(row.status)}</td>
      <td>${show(row.decision)}</td>
      <td class="nowrap">${show(row.decisionDate)}</td>
      <td>${show(row.body)}</td>
      <td class="num">${tally ? `<span class="score">${esc(tally)}</span>` : `<span class="dash" title="No recorded vote in feed">—</span>`}</td>
      <td>${classBadge(row.sourceClass)}</td>
    </tr>
    <tr class="detail-row"><td colspan="8">${rowMeta(row, milestonesHtml(row))}</td></tr>`;
  }).join("");
}

function certBadge(row, hasVotes) {
  if (row.certification === "certified") return `<span class="badge cert-ok">CERTIFIED</span>`;
  if (row.certification === "unofficial") return `<span class="badge cert-unofficial">UNOFFICIAL</span>`;
  if (!isBlank(row.certification)) return `<span class="badge await">${esc(row.certification)}</span>`;
  if (!hasVotes) return "";
  const text = `${row.result || ""} ${noteLines(row.notes).join(" ")}`;
  if (/unofficial|preliminary/i.test(text)) {
    return `<span class="badge cert-unofficial" title="No certification field; the record's result/notes text says unofficial or preliminary">UNOFFICIAL (per source text)</span>`;
  }
  return `<span class="badge await">CERTIFICATION NOT STATED</span>`;
}

function pctFmt(n) {
  return `${Number(n).toFixed(2).replace(/\.?0+$/, "")}%`;
}

function renderBallots(county, meta) {
  const list = county.ballotMeasures || [];
  setStamp("sec-ballots", sectionState(list), meta);
  if (!list.length) { $("#out-ballots").innerHTML = emptyNote("ballot measures"); return; }

  $("#out-ballots").innerHTML = `<div class="ballot-list">${list.map((row) => {
    const title = row.title || row.label || "[SAMPLE SHAPE]";
    const yes = isNum(row.yes) ? row.yes : null;
    const no = isNum(row.no) ? row.no : null;
    let yesPct = isNum(row.yesPct) ? row.yesPct : null;
    let noPct = isNum(row.noPct) ? row.noPct : null;
    let pctSource = yesPct !== null || noPct !== null ? "pct per source" : null;
    if (!pctSource && yes !== null && no !== null && yes + no > 0) {
      yesPct = (yes / (yes + no)) * 100;
      noPct = (no / (yes + no)) * 100;
      pctSource = "computed from yes/no";
    }
    const hasVotes = yes !== null || no !== null || yesPct !== null || noPct !== null;
    const bar = (label, count, pct, cls) => `<div class="tally-row">
        <span class="lbl">${label}</span>
        <span class="track${pct !== null ? " live" : ""}" aria-hidden="true"><i class="fill ${cls}" style="width:${pct !== null ? Math.max(0, Math.min(100, pct)).toFixed(2) : 0}%"></i></span>
        <span class="val">${count !== null ? esc(count.toLocaleString("en-US")) : `<span class="dash">—</span>`}</span>
        <span class="pct">${pct !== null ? esc(pctFmt(pct)) : `<span class="dash">—</span>`}</span>
      </div>`;
    const caption = hasVotes
      ? `${pctSource ? esc(pctSource.toUpperCase()) : "PCT NOT IN FEED"}${(yes === null && no === null) ? " · raw counts not in feed" : ""}`
      : "No vote counts in feed";
    const facts = [
      ["Ballots", isNum(row.totalBallots) ? row.totalBallots.toLocaleString("en-US") : null],
      ["Turnout", isNum(row.turnout) ? row.turnout : null],
      ["Pass threshold", row.threshold],
      ["Subject threshold", row.subjectThreshold],
    ].map(([k, v]) => `<span><span class="k">${k}</span> ${show(v)}</span>`).join("");
    return `<article class="ballot"${recId(row)}>
      <div class="ballot-top">
        <div>
          <h3>${show(title, { placeholder: row.placeholder })}</h3>
          <div class="ballot-meta">Election ${show(row.electionDate)} · ${show(row.jurisdiction)}</div>
          <div class="ballot-result">Result ${statusBadge(row.result)} ${certBadge(row, hasVotes)}</div>
          ${row.certificationNote ? `<div class="muted small">${esc(row.certificationNote)}</div>` : ""}
        </div>
      </div>
      <div class="tally">${bar("Yes", yes, yesPct, "yes")}${bar("No", no, noPct, "no")}</div>
      <div class="track-caption${hasVotes ? " live" : ""}">${caption}</div>
      <div class="ballot-facts">${facts}</div>
      ${rowMeta(row)}
    </article>`;
  }).join("")}</div>`;
}

function renderCouncil(county, meta) {
  const list = county.councilVotes || [];
  setStamp("sec-council", sectionState(list), meta);
  if (!list.length) { $("#out-council").innerHTML = emptyNote("council votes"); return; }

  $("#out-council").innerHTML = list.map((row) => {
    const title = row.matter || row.label || "[SAMPLE SHAPE]";
    const tally = tallyText(row.tally);
    const t = row.tally || {};
    const nums = [["Y", t.yes], ["N", t.no], ["ABST", t.abstain], ["ABS", t.absent], ["REC", t.recused]]
      .filter(([, v]) => isNum(v)).map(([k, v]) => `<span class="cell"><b>${esc(v)}</b>${k}</span>`).join("");
    const roll = Array.isArray(row.rollCall) && row.rollCall.length
      ? `<table class="roll"><thead><tr><th>Member</th><th>Vote</th></tr></thead><tbody>${row.rollCall.map((seat) =>
          `<tr><td>${show(seat.member || seat.label, { placeholder: seat.placeholder || row.placeholder })}</td>
           <td>${isBlank(seat.vote) ? `<span class="dash" title="Not recorded in feed">—</span>` : `<span class="vote v-${esc(String(seat.vote).toLowerCase())}">${esc(seat.vote)}</span>`}</td></tr>`).join("")}</tbody></table>`
      : `<p class="muted small">Roll call not reported in feed.</p>`;
    const extras = [
      ["Motion text", row.motionText], ["Moved by", row.movedBy], ["Seconded by", row.secondedBy],
      ["Recused", Array.isArray(row.recused) && row.recused.length ? row.recused.join(", ") : null],
    ].filter(([, v]) => !isBlank(v)).map(([k, v]) => `<span><span class="k">${k}</span> ${esc(v)}</span>`).join("");
    return `<article class="vote-block"${recId(row)}>
      <div class="ballot-top">
        <div>
          <h3>${show(title, { placeholder: row.placeholder })}</h3>
          <div class="ballot-meta">${show(row.body)} · ${show(row.meetingDate)}${row.motion ? ` · Motion ${esc(row.motion)}` : ""}</div>
          <div class="ballot-result">Result ${statusBadge(row.result)}</div>
        </div>
        <div class="scorebox">
          <div class="score big">${tally ? esc(tally) : `<span class="dash">—</span>`}</div>
          ${nums ? `<div class="cells">${nums}</div>` : ""}
        </div>
      </div>
      ${extras ? `<div class="ballot-facts">${extras}</div>` : ""}
      ${roll}
      ${rowMeta(row)}
    </article>`;
  }).join("");
}

function renderSentiment(county, meta) {
  const list = (county.sentimentTimeline || []).slice();
  setStamp("sec-sentiment", sectionState(list), meta);
  if (!list.length) { $("#body-sentiment").innerHTML = `<tr class="empty-row"><td colspan="6">${emptyNote("sentiment entries")}</td></tr>`; return; }
  list.sort((a, b) => {
    if (isBlank(a.date)) return isBlank(b.date) ? 0 : 1;
    if (isBlank(b.date)) return -1;
    return String(a.date).localeCompare(String(b.date));
  });
  $("#body-sentiment").innerHTML = list.map((row) => {
    const tone = isBlank(row.tone) ? null : String(row.tone);
    const toneCls = tone ? `tone-${tone.toLowerCase().replace(/[^a-z]/g, "")}` : "";
    return `<tr class="main-row"${recId(row)}>
      <td class="nowrap">${show(row.date)}</td>
      <td>${show(row.periodLabel, { placeholder: row.placeholder })}</td>
      <td>${tone ? `<span class="badge tone ${toneCls}">${esc(tone)}</span>` : show(null)}<br>${classBadge(row.toneClass || "inference", "Tone")}</td>
      <td class="num">${show(row.volume)}</td>
      <td>${show(row.headline)}</td>
      <td>${classBadge(row.sourceClass)}</td>
    </tr>
    <tr class="detail-row"><td colspan="6">${rowMeta(row)}</td></tr>`;
  }).join("");
}

function evidenceHtml(evidence, known) {
  if (isBlank(evidence)) return `<span class="dash">No evidence listed in feed</span>`;
  const tokens = Array.isArray(evidence) ? evidence.map(String) : String(evidence).split(/\s*;\s+|\s+;\s*/);
  return tokens.filter((t) => t.trim()).map((tok) => {
    const t = tok.trim();
    if (safeUrl(t)) return `<span class="ev-item">${link(t)}</span>`;
    if (known.has(t)) return `<span class="ev-item"><a href="#" class="ref" data-ref="${esc(t)}">↳ ${esc(t)}</a></span>`;
    return `<span class="ev-item">${esc(t)}</span>`;
  }).join("");
}

function renderFlags(county, meta, known) {
  const list = county.redFlags || [];
  setStamp("sec-flags", sectionState(list), meta);
  if (!list.length) { $("#out-flags").innerHTML = emptyNote("red flags"); return; }
  $("#out-flags").innerHTML = `<div class="flag-list">${list.map((row) => `<article class="flag sev-${esc(String(row.severity || "none").toLowerCase())}"${recId(row)}>
      <div class="flag-sev">${severityBadge(row.severity)}${row.severityBasis ? `<div class="muted small">${esc(row.severityBasis)}</div>` : ""}</div>
      <div>
        <h3>${show(row.title, { placeholder: row.placeholder })}</h3>
        <p>${row.summary ? esc(row.summary) : `<span class="dash">No summary in feed</span>`}</p>
        <div class="evidence"><span class="src-label">EVIDENCE</span> ${evidenceHtml(row.evidence, known)}</div>
        ${rowMeta(row)}
      </div>
    </article>`).join("")}</div>`;
}

function renderBenefits(county, meta) {
  const list = county.communityBenefitPrecedents || [];
  setStamp("sec-benefits", sectionState(list), meta);
  if (!list.length) { $("#body-benefits").innerHTML = `<tr class="empty-row"><td colspan="6">${emptyNote("community benefit precedents")}</td></tr>`; return; }
  $("#body-benefits").innerHTML = list.map((row) => `<tr class="main-row"${recId(row)}>
      <td class="strong">${show(row.label || row.projectName, { placeholder: row.placeholder })}</td>
      <td>${show(row.projectName)}</td>
      <td class="nowrap">${show(row.year)}</td>
      <td class="wide">${maybeStructured(row.commitment)}${row.terms && typeof row.terms === "object" ? `<div class="terms"><span class="src-label">TERMS</span>${kvList(row.terms)}</div>` : ""}</td>
      <td>${statusBadge(row.status)}</td>
      <td>${classBadge(row.sourceClass)}</td>
    </tr>
    <tr class="detail-row"><td colspan="6">${rowMeta(row)}</td></tr>`).join("");
}

function renderActions(county, meta) {
  const list = county.regulatoryActions || [];
  setStamp("sec-actions", sectionState(list), meta);
  if (!list.length) { $("#body-actions").innerHTML = `<tr class="empty-row"><td colspan="8">${emptyNote("regulatory actions")}</td></tr>`; return; }
  $("#body-actions").innerHTML = list.map((row) => {
    const type = isBlank(row.actionType) ? null : String(row.actionType);
    const hot = type && /moratori|ban|prohibit/i.test(type);
    return `<tr class="main-row${hot ? " hot" : ""}"${recId(row)}>
      <td class="strong">${show(row.title || row.label, { placeholder: row.placeholder })}</td>
      <td>${show(row.jurisdiction)}</td>
      <td>${type ? `<span class="badge ${hot ? "hot" : "type"}">${esc(type.replace(/_/g, " "))}</span>` : show(null)}</td>
      <td>${show(row.date)}${row.dateNote ? `<div class="muted small">${esc(row.dateNote)}</div>` : ""}</td>
      <td>${statusBadge(row.status)}${row.statusNote ? `<div class="muted small">${esc(row.statusNote)}</div>` : ""}${row.expires ? `<div class="muted small">expires ${esc(row.expires)}</div>` : ""}</td>
      <td>${maybeStructured(row.voteSummary)}</td>
      <td>${row.effect ? esc(row.effect) : `<span class="dash" title="No effect field; see notes">—</span>`}</td>
      <td>${classBadge(row.sourceClass)}</td>
    </tr>
    <tr class="detail-row"><td colspan="8">${rowMeta(row)}</td></tr>`;
  }).join("");
}

/* ---------- page chrome ---------- */

function renderBanner(payload, how) {
  const meta = payload?.meta || {};
  const banner = $("#feed-banner");
  const placeholder = meta.status === "awaiting_sitingintel_data" || meta.dataState === "placeholder";
  banner.classList.toggle("placeholder", placeholder);
  banner.classList.toggle("partial", !placeholder);
  const status = String(meta.status || "unknown").replace(/_/g, " ");
  const state = String(meta.dataState || "unknown").replace(/_/g, " ");
  const gen = timestampPT(meta.generatedAt);
  banner.innerHTML = `<span class="pulse" aria-hidden="true"></span>
    <div>
      <strong>FEED: ${esc(status.toUpperCase())} · ${esc(state.toUpperCase())}.</strong>
      ${placeholder ? "Every card below is a sample-shaped layout only; figures are placeholders, not real results." : ""}
      ${meta.disclaimer ? esc(meta.disclaimer) : ""}
      <div class="banner-sub">${gen ? `Generated ${esc(gen)} · ` : ""}${meta.source?.system ? `Source system ${esc(meta.source.system)} · ` : ""}${esc(how)}</div>
    </div>`;
  $("#src-state").textContent = `${status} · ${state}`;
  const schema = payload?.schema;
  $("#foot-meta").textContent = `${schema ? `schema ${schema.name} @ ${schema.version}` : "schema unknown"} · renderer supports 0.1.x–0.2.x · ${how}`;
}

function countyFromHash(data) {
  const raw = (location.hash || "").replace(/^#/, "").trim();
  const ids = data.counties.map((c) => c.id);
  if (ids.includes(raw)) return raw;
  return data.meta?.pilot?.defaultCountyId && ids.includes(data.meta.pilot.defaultCountyId) ? data.meta.pilot.defaultCountyId : ids[0];
}

function getCounty(data, id) {
  return data.counties.find((c) => c.id === id) || data.counties[0];
}

const SECTION_KEYS = ["projectOutcomes", "ballotMeasures", "councilVotes", "sentimentTimeline", "redFlags", "communityBenefitPrecedents", "regulatoryActions"];

function renderCounty(data, countyId) {
  const county = getCounty(data, countyId);
  const fullName = `${county.name}, ${county.state}`;
  $("#county-name").textContent = fullName;
  $("#county-verified").textContent = VERIFIED_PREFIX + verifiedText(county.lastVerified);
  document.title = `SitingDash — ${fullName}`;
  $$("#county-switch [data-county]").forEach((btn) => {
    btn.setAttribute("aria-selected", btn.getAttribute("data-county") === county.id ? "true" : "false");
  });

  const known = new Set();
  SECTION_KEYS.forEach((k) => (county[k] || []).forEach((r) => r && r.id && known.add(r.id)));

  const meta = data.meta;
  renderOutcomes(county, meta);
  renderActions(county, meta);
  renderBallots(county, meta);
  renderCouncil(county, meta);
  renderSentiment(county, meta);
  renderFlags(county, meta, known);
  renderBenefits(county, meta);
  $$("[data-verified]").forEach((el) => {
    el.textContent = `COUNTY FEED ${VERIFIED_PREFIX}${verifiedText(county.lastVerified)} · per-row dates shown on each record`;
  });

  if (location.hash.replace(/^#/, "") !== county.id) history.replaceState(null, "", `#${county.id}`);
}

function bindUi(data) {
  $("#county-switch").addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-county]");
    if (!btn) return;
    const id = btn.getAttribute("data-county");
    if (location.hash.replace(/^#/, "") !== id) location.hash = id;
    else renderCounty(data, id);
  });
  window.addEventListener("hashchange", () => renderCounty(data, countyFromHash(data)));
  document.addEventListener("click", (ev) => {
    const a = ev.target.closest("a.ref[data-ref]");
    if (!a) return;
    ev.preventDefault();
    const el = document.getElementById(`rec-${a.getAttribute("data-ref")}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("flash");
      setTimeout(() => el.classList.remove("flash"), 1600);
    }
  });
  const toggle = $("#notes-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-pressed") !== "true";
      toggle.setAttribute("aria-pressed", open ? "true" : "false");
      toggle.textContent = open ? "Collapse all notes" : "Expand all notes";
      $$("details.notes").forEach((d) => { d.open = open; });
    });
  }
}

/* ---------- loading ---------- */

function requestedDataPath() {
  const raw = new URLSearchParams(location.search).get("data");
  if (!raw) return { path: null, rejected: null };
  const ok = /^data\/[A-Za-z0-9_\-./]+\.json$/.test(raw) && !raw.includes("..") && !raw.includes("//");
  return ok ? { path: raw, rejected: null } : { path: null, rejected: raw };
}

function validPayload(p) {
  return p && Array.isArray(p.counties) && p.counties.length > 0;
}

function loadInlineScript() {
  return new Promise((resolve) => {
    if (window.SITINGDASH_INLINE) return resolve(window.SITINGDASH_INLINE);
    const s = document.createElement("script");
    s.src = INLINE_SCRIPT;
    s.onload = () => resolve(window.SITINGDASH_INLINE || null);
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
}

async function loadData() {
  const { path, rejected } = requestedDataPath();
  const notes = [];
  if (rejected) notes.push(`ignored ?data=${rejected} (must be a .json path under data/)`);
  const candidates = [...new Set([path, DEFAULT_DATA, PLACEHOLDER_DATA].filter(Boolean))];
  if (location.protocol !== "file:") {
    for (const url of candidates) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        if (!validPayload(payload)) throw new Error("missing counties[]");
        if (url !== candidates[0]) notes.push(`${candidates[0]} unavailable`);
        return { payload, how: [`loaded ${url}`, ...notes].join(" · ") };
      } catch (err) {
        console.warn(`SitingDash: could not load ${url}:`, err.message || err);
      }
    }
  }
  const inline = await loadInlineScript();
  if (validPayload(inline)) {
    return { payload: inline, how: [`inline copy of ${DEFAULT_DATA} (${location.protocol === "file:" ? "file:// open" : "fetch failed"})`, ...notes].join(" · ") };
  }
  return { payload: null, how: "no data could be loaded" };
}

function renderNoData() {
  $("#feed-banner").classList.add("placeholder");
  $("#feed-banner").innerHTML = `<span class="pulse" aria-hidden="true"></span><div><strong>NO DATA LOADED.</strong>
    The SitingIntel feed could not be read. Serve this folder over HTTP (for example <code>python3 -m http.server</code>) and reload.
    Nothing below is real data.</div>`;
  $("#src-state").textContent = "NO DATA LOADED";
  ["#body-outcomes", "#body-actions", "#body-sentiment", "#body-benefits"].forEach((sel) => {
    const cols = $(sel).closest("table").querySelectorAll("thead th").length;
    $(sel).innerHTML = `<tr class="empty-row"><td colspan="${cols}">No data loaded.</td></tr>`;
  });
  ["#out-ballots", "#out-council", "#out-flags"].forEach((sel) => { $(sel).innerHTML = `<p class="loading-note">No data loaded.</p>`; });
}

loadData().then(({ payload, how }) => {
  if (!payload) { renderNoData(); return; }
  renderBanner(payload, how);
  bindUi(payload);
  renderCounty(payload, countyFromHash(payload));
}).catch((err) => {
  console.error(err);
  renderNoData();
});
