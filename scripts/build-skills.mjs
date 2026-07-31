// Generates the skill catalog and a runtime module from skills/<pack>/*.md.
//
// Output paths: skills/catalog.json and dist/skills.generated.ts
// (override the latter with SKILLS_MODULE_OUT).
//
// One folder under skills/ is one pack. Every pack has exactly one entry skill
// (`entry: true` in its frontmatter); the rest are members the entry pulls in at
// named steps.
//
// Only entry skills go into the resident catalog. That is the whole point: keyword
// routing used to let the model pick a member instead of the entry, so the same
// request could land on a stale sub-method. Members are now unreachable by keyword
// and can only be loaded because the entry told the model to.
//
// Folders starting with "_" are ignored (archive, work in progress).
//
// Token counts use the same conservative estimator as check-cost-envelope.mjs, so the
// numbers printed here are directly comparable with the per-profile input budgets.

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

// --check verifies the committed output matches the sources instead of rewriting them.
const checkOnly = process.argv.includes("--check");

const SKILLS_DIR = "skills";
const CATALOG_OUT = "skills/catalog.json";
const MODULE_OUT = process.env.SKILLS_MODULE_OUT ?? "dist/skills.generated.ts";

// Size is reported, not enforced. The old hard cap was invented to fit one particular
// runtime's observation truncation; that is a deployment concern, not a rule for whoever
// is writing the method. Set SKILL_MAX_TOKENS only if a specific deployment needs a gate.
const MAX_BODY_TOKENS = process.env.SKILL_MAX_TOKENS
  ? Number(process.env.SKILL_MAX_TOKENS)
  : Infinity;
// The resident lines ride in every context of every profile, loaded or not.
// Triggers are runtime routing metadata and stay out of the prompt.
const MAX_CATALOG_TOKENS = process.env.SKILL_CATALOG_MAX_TOKENS
  ? Number(process.env.SKILL_CATALOG_MAX_TOKENS)
  : Infinity;

const estimateTokens = (value) => {
  let tokens = 0;
  for (const char of String(value ?? "")) {
    if (/\s/u.test(char)) tokens += 0.1;
    else if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(char)) tokens += 1;
    else tokens += 0.5;
  }
  return Math.ceil(tokens);
};

function parseSkill(file, raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing frontmatter`);
  const meta = {};
  for (const line of match[1].split("\n")) {
    const field = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!field) continue;
    const [, key, value] = field;
    meta[key] = value.startsWith("[")
      ? value.slice(1, -1).split(",").map((item) => item.trim()).filter(Boolean)
      : value.trim();
  }
  for (const key of ["name", "version", "description"]) {
    if (!meta[key]?.length) throw new Error(`${file}: frontmatter is missing ${key}`);
  }
  const entry = meta.entry === "true";
  // Only entries are keyword-routable, so only entries need triggers. Members are
  // pulled by name from inside the entry method; requiring triggers on them would
  // invite someone to write routable-looking keywords that can never fire.
  if (entry && !meta.triggers?.length) {
    throw new Error(`${file}: entry skills need triggers`);
  }
  return { ...meta, triggers: meta.triggers ?? [], file, entry, body: match[2].trim() };
}

const packDirs = (await readdir(SKILLS_DIR, { withFileTypes: true }))
  .filter((d) => d.isDirectory() && !d.name.startsWith("_") && d.name !== "assets")
  .map((d) => d.name)
  .sort();
if (!packDirs.length) throw new Error("no skill packs found under skills/");

const skills = [];
const packs = [];
for (const pack of packDirs) {
  const files = (await readdir(join(SKILLS_DIR, pack)))
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .sort();
  const members = [];
  for (const file of files) {
    const rel = join(pack, file);
    const skill = parseSkill(rel, await readFile(join(SKILLS_DIR, rel), "utf8"));
    skill.pack = pack;
    skills.push(skill);
    members.push(skill);
  }
  const entries = members.filter((s) => s.entry);
  if (entries.length !== 1) {
    throw new Error(
      `skills/${pack}: expected exactly one skill with "entry: true", found ${entries.length}` +
        (entries.length ? ` (${entries.map((s) => s.name).join(", ")})` : ""),
    );
  }
  packs.push({
    id: pack,
    entry: entries[0].name,
    members: members.filter((s) => !s.entry).map((s) => s.name),
  });
}
if (!skills.length) throw new Error("no skills found");

const duplicates = skills.map((s) => s.name).filter((n, i, a) => a.indexOf(n) !== i);
if (duplicates.length) throw new Error(`duplicate skill ids: ${[...new Set(duplicates)].join(", ")}`);

const errors = [];
for (const skill of skills) {
  const tokens = estimateTokens(skill.body);
  skill.tokens = tokens;
  if (Number.isFinite(MAX_BODY_TOKENS) && tokens > MAX_BODY_TOKENS) {
    errors.push(`${skill.file}: body is ${tokens} tokens, over the ${MAX_BODY_TOKENS} cap`);
  }
}

const catalog = {
  version: 3,
  packs,
  skills: skills.map((skill) => ({
    id: skill.name,
    pack: skill.pack,
    entry: skill.entry,
    description: skill.description,
    triggers: skill.entry ? skill.triggers : [],
  })),
};
const catalogJson = `${JSON.stringify(catalog, null, 2)}\n`;
// Only entries are advertised. Members are pulled by name from inside the entry method.
const catalogPrompt = skills
  .filter((skill) => skill.entry)
  .map((skill) => `- ${skill.name}: ${skill.description}`)
  .join("\n");
const catalogTokens = estimateTokens(catalogPrompt);
if (Number.isFinite(MAX_CATALOG_TOKENS) && catalogTokens > MAX_CATALOG_TOKENS) {
  errors.push(`resident catalog is ${catalogTokens} tokens, over the ${MAX_CATALOG_TOKENS} cap`);
}

if (errors.length) {
  for (const error of errors) console.error(`error  ${error}`);
  process.exit(1);
}

const module = `// Generated by scripts/build-skills.mjs from skills/*.md. Do not edit.

export type SkillId = ${skills.map((skill) => JSON.stringify(skill.name)).join(" | ")};

export interface SkillEntry {
  id: SkillId;
  pack: string;
  /** True for the one skill per pack that a request may be routed to. */
  entry: boolean;
  description: string;
  /** Empty for members: only entries are keyword-routable. */
  triggers: string[];
  tokens: number;
}

export const SKILL_CATALOG: readonly SkillEntry[] = ${JSON.stringify(
  skills.map((skill) => ({
    id: skill.name,
    pack: skill.pack,
    entry: skill.entry,
    description: skill.description,
    triggers: skill.entry ? skill.triggers : [],
    tokens: skill.tokens,
  })),
  null,
  2,
)} as const;

/**
 * One folder under skills/ is one pack: a single entry plus the members it pulls in.
 * Route a request to an entry; never route to a member.
 */
export const SKILL_PACKS: readonly { id: string; entry: SkillId; members: SkillId[] }[] =
  ${JSON.stringify(packs, null, 2)} as const;

/**
 * Resident in every agent context (${catalogTokens} tokens): entry skills only, so a
 * keyword match can never land on a member. The model reads these lines and calls
 * load_skill; the entry method then names the members it needs at each step.
 */
export const SKILL_CATALOG_PROMPT = ${JSON.stringify(catalogPrompt)};

/** Loaded on demand by the load_skill tool, then cached in task state. */
export const SKILL_BODIES: Record<SkillId, string> = {
${skills.map((skill) => `  ${JSON.stringify(skill.name)}: ${JSON.stringify(skill.body)},`).join("\n")}
};

/** Tolerates the display name: the model asked for "Product Teardown" and lost a round. */
export function loadSkill(id: string): string | null {
  const normalized = String(id ?? "").trim().toLowerCase().replace(/[\\s-]+/g, "_");
  return Object.hasOwn(SKILL_BODIES, normalized) ? SKILL_BODIES[normalized as SkillId] : null;
}
`;

if (checkOnly) {
  for (const [path, expected] of [[CATALOG_OUT, catalogJson], [MODULE_OUT, module]]) {
    const actual = await readFile(path, "utf8").catch(() => null);
    if (actual !== expected) {
      console.error(`error  ${path} is stale; run npm run build:skills`);
      process.exit(1);
    }
  }
} else {
  await mkdir(dirname(MODULE_OUT), { recursive: true });
  await writeFile(CATALOG_OUT, catalogJson);
  await writeFile(MODULE_OUT, module);
}

console.log(
  `resident catalog: ${catalogTokens} tokens · ${packs.length} pack(s) · ${skills.length} skills`,
);
for (const pack of packs) {
  console.log(`\n  skills/${pack.id}/`);
  for (const skill of skills.filter((s) => s.pack === pack.id)) {
    const mark = skill.entry ? "entry " : "  └─   ";
    console.log(
      `    ${mark}${skill.name.padEnd(24)} ${String(skill.tokens).padStart(5)} tokens`,
    );
  }
}
