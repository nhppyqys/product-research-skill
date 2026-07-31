#!/usr/bin/env node
// Pre-delivery check. Two passes:
//
//   1. Completion — every step in skills/product-research/contract.json.
//      The contract is the single source of truth for standards.
//   2. Hygiene   — internal method names, work-log phrasing, inline HTML, example bleed.
//
// Why this file exists: the method holds ~69 hard requirements across ~63 sections.
// Relying on someone to run a checklist at the end of a long document does not work —
// screenshots were skipped for 2 rounds, recent-changes for 3, and layered analysis was
// done once and never again. Prose has no enforcement. Code does.
//
//   node scripts/check-report.mjs <report.md> [--manifest <evidence.json>]
//   exit code 1 = something is unmet
//
// About the manifest: some requirements can't be read off the delivered text (how many
// paths were probed, how many case studies were read, whether the video channel was
// skimmed). Those describe the research, not the artifact, so only the researcher can
// declare them. The manifest is a separate file and never ships with the report.
// Without one, those steps report "undeclared" — neither pass nor fail, look at them.
//
// Patterns are bilingual (English + Chinese) because the method exists in both.

import { readFileSync, existsSync } from "node:fs";
import { basename, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CONTRACT = join(HERE, "..", "skills", "product-research", "contract.json");

// ---------- 卫生规则 ----------

const SOP_EXAMPLES = [
  "scrapecreators", "blotato", "repurpose.io", "linear.app",
  "opusclip", "ayrshare", "zernio", "postiz", "n8n",
];

const HYGIENE = [
  {
    id: "inline-html",
    level: "error",
    why: "Many renderers emit inline HTML literally; a base64 data URI printed as text destroys the first screen",
    find: (s) => matchLines(s, /<(br|div|span|img|sub|sup|table|tr|td|p)\b[^>]*>/gi),
  },
  {
    id: "method-leak",
    level: "error",
    why: "Internal method names and version strings do not belong in a deliverable",
    find: (s) => matchLines(s, /product_research_method|customer_proof|market_landscape|research_viewpoint|last_30_days|\bSOP\b|contract\.json/g),
  },
  {
    id: "internal-jargon",
    level: "error",
    why: "Internal jargon. The reader does not know what these words mean",
    find: (s) => matchLines(s, /高置信推断|低置信推断|中置信推断|观察事实|缺席即证据|形态判定|举证责任|三道闸门|最低完成标准|降级阶梯|high[- ]confidence inference|absence[- ]as[- ]evidence|shape judgement|fallback ladder|completion standard/gi),
  },
  {
    id: "worklog",
    level: "error",
    why: "Work log. The client is buying conclusions, not the story of how you got there",
    find: (s) => matchLines(s, /本轮(未|没)|上一版|上一轮|初版(我|写)|这一节是修订过的|我(漏|没点开|没去拿|把没抓到)|静态抓取|渲染后确认|爬取|抓取器|实测失败|this (report|section) has been revised|my (first|previous) version|(I|we) (missed|didn.t open|failed to)|not done this round|static scrape|after rendering|rather than simply listing/gi),
  },
  {
    id: "pending-table",
    level: "error",
    why: "Handing the work back. They came to you so they would not have to try it themselves",
    find: (s) => matchLines(s, /待测|建议自行试用|请自行验证|需用户自己|to be tested|try it yourself|please verify|reader should confirm/gi),
  },
  {
    id: "placeholder",
    level: "error",
    why: "Header placeholder was not replaced",
    find: (s) => matchLines(s, /\{\{[^}]+\}\}/g),
  },
  {
    // Branding is opt-in. Set BRAND_HEADER to a regex your header must match
    // (e.g. BRAND_HEADER='^!\\[Acme\\]') to make this rule active.
    id: "brand-header",
    level: "error",
    why: "Report is missing the configured brand header",
    find: (s) => {
      const pat = process.env.BRAND_HEADER;
      if (!pat) return [];
      return new RegExp(pat).test(s.trimStart())
        ? [] : [{ line: 1, text: "first line does not match BRAND_HEADER" }];
    },
  },
  {
    // Warning only, never a block: this cannot distinguish a name lifted from the method
    // document from one genuinely researched this round — only a human can. As a hard block
    // it once flagged three companies in one report that had all been researched that day.
    id: "example-bleed",
    level: "warn",
    why: "This name appears in the method document as an example. Confirm each: keep it if researched this round, delete it if lifted",
    find: (s) => SOP_EXAMPLES.flatMap((ex) => matchLines(s, new RegExp(ex.replace(".", "\\."), "gi"))),
  },
];

// ---------- 契约检查 ----------

const COUNTERS = {
  images: (s) => (s.match(/^!\[[^\]]*\]\((?!data:)/gm) || []).length,
  quotes: (s) => (s.match(/^>\s*\**\s*[「"“"']/gm) || []).length,
  datedQuotes: (s) => {
    // A quote counts as sourced only if a year and an attribution mark appear within
    // the next few lines.
    const lines = s.split("\n");
    let n = 0;
    lines.forEach((ln, i) => {
      if (!/^>\s*.*[「"“"']/.test(ln)) return;
      const window = lines.slice(i, i + 4).join(" ");
      if (/(19|20)\d\d/.test(window) && /—|--|——|·/.test(window)) n += 1;
    });
    return n;
  },
  claimRows: (s) => {
    const sec = section(s, /宣称与事实|宣称清单|它的宣称|claims?\s*(vs\.?|versus|and)\s*facts?|claims? list/i);
    return sec ? (sec.match(/^\|(?!\s*[-:]).+\|.+\|/gm) || []).length - 1 : 0;
  },
};

function section(s, headingRe) {
  const lines = s.split("\n");
  const start = lines.findIndex((l) => /^#{2,3} /.test(l) && headingRe.test(l));
  if (start < 0) return null;
  const level = (lines[start].match(/^#+/) || ["##"])[0].length;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#+) /);
    if (m && m[1].length <= level) { end = i; break; }
  }
  return lines.slice(start, end).join("\n");
}

function runContract(src, manifest, viewpointText) {
  const contract = JSON.parse(readFileSync(CONTRACT, "utf8"));
  const out = [];
  const skippedForShape = [];
  for (const step of contract.steps) {
    // Trim by viewpoint (layering is only required for founder / investor reports).
    if (step.appliesTo && !step.appliesTo.some((v) => viewpointText.includes(v))) continue;
    // Trim by product shape. Shape must be declared explicitly in the manifest and is
    // never guessed from the report text — keyword-guessing once fired the marketplace-only
    // steps on an ordinary SaaS report because the word "market" appeared. The cost of a
    // wrong guess is a false alarm, and false alarms teach people to ignore alarms.
    // With no shape declared, shape-specific steps are skipped and reported at the end.
    if (step.appliesToShape) {
      const shape = manifest?.shape;
      if (!shape) { skippedForShape.push(step.name); continue; }
      if (!step.appliesToShape.some((v) => shape.includes(v))) continue;
    }
    const c = step.check;
    let status = "pass";
    let detail = "";

    if (c.type === "manifest") {
      if (!manifest) { status = "undeclared"; detail = "must be declared in the evidence manifest"; }
      else {
        const v = manifest[c.field];
        const n = Array.isArray(v) ? v.length : (v ? 1 : 0);
        if (!v) { status = "fail"; detail = `manifest has no ${c.field}`; }
        else if (c.min && n < c.min) { status = "fail"; detail = `${c.field} has ${n}, needs ≥${c.min}`; }
        else detail = Array.isArray(v) ? `${n} item(s)` : "declared";
      }
    } else if (c.type === "regex") {
      if (!new RegExp(c.pattern).test(src)) { status = "fail"; detail = "not found in the report"; }
    } else if (c.type === "fields") {
      // Each field may be a synonym group; any hit counts. Literal matching is too brittle:
      // an all-remote company has no "HQ", and headcount may be phrased as "the whole company".
      const has = (f) => (Array.isArray(f) ? f : [f]).some((w) => src.includes(w));
      const miss = c.fields.filter((f) => !has(f)).map((f) => (Array.isArray(f) ? f[0] : f));
      const hit = c.fields.length - miss.length;
      if (hit < c.min) { status = "fail"; detail = `only ${hit}/${c.fields.length} fields, missing: ${miss.join(", ")}`; }
      else detail = `${hit}/${c.fields.length} fields` + (miss.length ? ` (missing ${miss.join(", ")})` : "");
    } else if (COUNTERS[c.type]) {
      const n = COUNTERS[c.type](src);
      if (n < c.min) { status = "fail"; detail = `found ${n}, needs ≥${c.min}`; }
      else detail = `${n}`;
    }

    if (manifest?.skipped?.[step.id]) {
      const reason = manifest.skipped[step.id];
      status = contract.failureReasons[reason?.reason] ? "skipped" : "fail";
      detail = status === "skipped"
        ? `exempt: ${reason.reason} — ${reason.note ?? ""}`
        : `invalid exemption reason; must be one of ${Object.keys(contract.failureReasons).join(" / ")}`;
    }
    out.push({ ...step, status, detail });
  }
  out.shapeNotice = skippedForShape;
  return out;
}

// ---------- 通用 ----------

function matchLines(s, re) {
  const out = [];
  s.split("\n").forEach((ln, i) => {
    const m = ln.match(re);
    if (m) out.push({ line: i + 1, text: m.slice(0, 3).join(" · "), ctx: ln.trim().slice(0, 78) });
  });
  return out;
}

// ---------- 主流程 ----------

const args = process.argv.slice(2);
const mIdx = args.indexOf("--manifest");
const manifestPath = mIdx >= 0 ? args[mIdx + 1] : null;
// The manifest path does not start with "--", so it has to be excluded explicitly or it
// gets treated as another report to check.
const files = args.filter((a, i) => !a.startsWith("--") && i !== mIdx + 1);

if (!files.length) {
  console.error("usage: node scripts/check-report.mjs <report.md> [--manifest <evidence.json>]");
  process.exit(2);
}

let failed = false;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  const auto = f.replace(/\.md$/, ".evidence.json");
  const mp = manifestPath ?? (existsSync(auto) ? auto : null);
  const manifest = mp ? JSON.parse(readFileSync(mp, "utf8")) : null;

  const hy = HYGIENE.flatMap((r) => r.find(src).map((h) => ({ ...r, ...h })));
  const errs = hy.filter((p) => p.level === "error");
  const warns = hy.filter((p) => p.level === "warn");
  const steps = runContract(src, manifest, src.slice(0, 1200));
  const bad = steps.filter((s) => s.status === "fail");
  const und = steps.filter((s) => s.status === "undeclared");

  console.log(`\n━━ ${basename(f)}${mp ? `  |  manifest: ${basename(mp)}` : "  |  no manifest"}`);
  console.log(`   ${steps.filter((s) => s.status === "pass" || s.status === "skipped").length}/${steps.length} met` +
    `   unmet ${bad.length}   undeclared ${und.length}   hygiene ${errs.length} error / ${warns.length} warn`);

  for (const s of steps) {
    const mark = { pass: "  ✓", fail: "  ✗", undeclared: "  ?", skipped: "  ⊘" }[s.status];
    if (s.status === "pass") continue;
    console.log(`${mark} [step ${s.step} · ${s.name}] ${s.detail}`);
    console.log(`      requires: ${s.requires}`);
    if (s.status === "fail" && s.fallback) console.log(`      ${s.fallback}`);
  }
  if (steps.shapeNotice?.length && !manifest?.shape) {
    console.log(`  i  no shape declared — skipped ${steps.shapeNotice.length} shape-specific step(s): ${[...new Set(steps.shapeNotice)].join(", ")}`);
  }
  for (const p of hy) {
    console.log(`${p.level === "error" ? "  ✗" : "  ·"} [${p.id}] line ${p.line}: ${p.text}`);
  }
  if (bad.length || errs.length) failed = true;
}

process.exit(failed ? 1 : 0);
