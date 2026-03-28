import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const localesDir = path.join(projectRoot, "src", "i18n", "locales");
const srcDir = path.join(projectRoot, "src");

function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj ?? {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

function extractVars(str) {
  if (typeof str !== "string") return [];
  const re = /\{\{\s*([\w.-]+)\s*\}\}/g;
  const vars = [];
  for (let m = re.exec(str); m; m = re.exec(str)) vars.push(m[1]);
  return vars.sort();
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function walkFiles(dir, exts, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === "dist") continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, exts, out);
    else if (exts.has(path.extname(ent.name))) out.push(p);
  }
  return out;
}

function rel(p) {
  return path.relative(projectRoot, p).replaceAll("\\", "/");
}

const localeFiles = fs
  .readdirSync(localesDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

if (!localeFiles.includes("en.json")) {
  console.error("Missing base locale: en.json");
  process.exit(2);
}

const locales = {};
for (const f of localeFiles) {
  const p = path.join(localesDir, f);
  try {
    locales[f] = flatten(readJson(p));
  } catch (e) {
    console.error(`JSON parse failed: ${f} -> ${e?.message ?? e}`);
    process.exit(2);
  }
}

const en = locales["en.json"];
const enKeys = Object.keys(en).sort();
const enKeySet = new Set(enKeys);

const localeIssues = [];
for (const f of localeFiles) {
  const map = locales[f];
  const keys = new Set(Object.keys(map));

  const missing = enKeys.filter((k) => !keys.has(k));
  const extra = Object.keys(map).filter((k) => !enKeySet.has(k)).sort();
  const empty = Object.entries(map)
    .filter(([, v]) => v === "" || v === null || v === undefined)
    .map(([k]) => k)
    .sort();

  const varMismatch = [];
  for (const k of enKeys) {
    if (!keys.has(k)) continue;
    const expected = extractVars(en[k]);
    const actual = extractVars(map[k]);
    if (expected.join(",") !== actual.join(",")) {
      varMismatch.push({ key: k, expected, actual });
    }
  }

  if (missing.length || extra.length || empty.length || varMismatch.length) {
    localeIssues.push({
      locale: f,
      missing,
      extra,
      empty,
      varMismatch,
    });
  }
}

const codeExts = new Set([".ts", ".tsx", ".js", ".jsx"]);
const codeFiles = walkFiles(srcDir, codeExts);

const keyHits = new Map(); // key -> Set<file>
function addHit(key, file) {
  if (!key) return;
  if (!keyHits.has(key)) keyHits.set(key, new Set());
  keyHits.get(key).add(file);
}

const patterns = [
  // t("a.b") / t('a.b')
  /\bt\(\s*(['"])([^'"\n\\]+)\1/g,
  // i18n.t("a.b") / i18n.t('a.b')
  /\bi18n\.t\(\s*(['"])([^'"\n\\]+)\1/g,
  // <Trans i18nKey="a.b" /> or i18nKey={'a.b'}
  /\bi18nKey\s*=\s*(?:\{\s*)?(['"])([^'"\n\\]+)\1/g,
  // t(`a.b`) / i18nKey={`a.b`} (no ${...})
  /\bt\(\s*`([^`\n\\$]+)`/g,
  /\bi18nKey\s*=\s*(?:\{\s*)?`([^`\n\\$]+)`/g,
];

for (const f of codeFiles) {
  const s = fs.readFileSync(f, "utf8");
  for (const re of patterns) {
    for (let m = re.exec(s); m; m = re.exec(s)) {
      const key = m[2] ?? m[1];
      if (typeof key === "string" && key.trim()) addHit(key.trim(), f);
    }
    re.lastIndex = 0;
  }
}

const usedKeys = [...keyHits.keys()].sort();
const missingInEn = usedKeys.filter((k) => !enKeySet.has(k));

console.log(
  [
    `Base: en.json (keys=${enKeys.length})`,
    `Locales: ${localeFiles.length}`,
    `Scanned src files: ${codeFiles.length}`,
    `Unique i18n keys in code: ${usedKeys.length}`,
  ].join(" | "),
);

let hasProblems = false;

if (localeIssues.length) {
  hasProblems = true;
  console.log(`\nLocale files issues: ${localeIssues.length}`);
  for (const it of localeIssues) {
    console.log(`\n== ${it.locale} ==`);
    if (it.missing.length) console.log(`Missing(${it.missing.length}):`, it.missing.slice(0, 80).join(", "), it.missing.length > 80 ? "..." : "");
    if (it.extra.length) console.log(`Extra(${it.extra.length}):`, it.extra.slice(0, 80).join(", "), it.extra.length > 80 ? "..." : "");
    if (it.empty.length) console.log(`Empty(${it.empty.length}):`, it.empty.slice(0, 80).join(", "), it.empty.length > 80 ? "..." : "");
    if (it.varMismatch.length) {
      console.log(`VarMismatch(${it.varMismatch.length}):`);
      for (const v of it.varMismatch.slice(0, 40)) {
        console.log(
          `- ${v.key} expected[${v.expected.join("|")}] actual[${v.actual.join("|")}]`,
        );
      }
      if (it.varMismatch.length > 40) console.log("... more ...");
    }
  }
} else {
  console.log("Locale files OK: keys aligned, no empty, no placeholder mismatch.");
}

if (missingInEn.length) {
  hasProblems = true;
  console.log(`\nKeys referenced in code but missing in en.json: ${missingInEn.length}`);
  for (const k of missingInEn.slice(0, 120)) {
    const hits = [...keyHits.get(k)]
      .slice(0, 5)
      .map((p) => rel(p));
    console.log(`- ${k} => ${hits.join(", ")}`);
  }
  if (missingInEn.length > 120) console.log("... more ...");
} else {
  console.log("Code OK: no missing i18n keys (static analysis).");
}

process.exit(hasProblems ? 1 : 0);

