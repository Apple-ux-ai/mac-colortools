/**
 * generate-translations.cjs
 * 1. Reads scripts/locale-patches/_keys.json (245 flat keys) and src/i18n/locales/en.json (nested).
 *    Flattens en.json to get key -> English value.
 * 2. Uses embedded translation data from translations-rows.json: 245 rows × 23 locales
 *    (ar, bn, es, fa, fr, he, hi, id, it, ms, nl, pl, pt, pt-BR, ru, sw, ta, th, fil, tr, uk, ur, vi).
 *    Placeholders {{value}} and {{count}} are preserved in translated strings.
 * 3. Writes scripts/locale-patches/translations.json as { "ar": { "key": "..." }, ... } in _keys.json order.
 *
 * Run: node generate-translations.cjs
 */

const path = require('path');
const fs = require('fs');

const SCRIPT_DIR = path.resolve(__dirname);
const ROOT = path.resolve(SCRIPT_DIR, '../..');
const KEYS_PATH = path.join(SCRIPT_DIR, '_keys.json');
const EN_PATH = path.join(ROOT, 'src/i18n/locales/en.json');
const ROWS_PATH = path.join(SCRIPT_DIR, 'translations-rows.json');
const OUT_PATH = path.join(SCRIPT_DIR, 'translations.json');

/** Locale order for rows: 23 locales */
const LOCALES = [
  'ar', 'bn', 'es', 'fa', 'fr', 'he', 'hi', 'id', 'it', 'ms', 'nl', 'pl', 'pt', 'pt-BR',
  'ru', 'sw', 'ta', 'th', 'fil', 'tr', 'uk', 'ur', 'vi'
];

/**
 * Flatten nested object to dot keys.
 * @param {object} obj - Nested object
 * @param {string} [prefix=''] - Key prefix
 * @returns {Record<string, string>} Flat key -> value
 */
function flatten(obj, prefix = '') {
  const out = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(out, flatten(val, fullKey));
    } else if (typeof val === 'string') {
      out[fullKey] = val;
    }
  }
  return out;
}

/**
 * Normalize placeholder spacing so {{value}} and {{count}} are preserved exactly.
 * @param {string} s
 * @returns {string}
 */
function preservePlaceholders(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/\{\{\s*value\s*\}\}/g, '{{value}}').replace(/\{\{\s*count\s*\}\}/g, '{{count}}');
}

function main() {
  const keys = JSON.parse(fs.readFileSync(KEYS_PATH, 'utf8'));
  const enNested = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
  const enFlat = flatten(enNested);

  // Validate: every key exists in en
  for (const key of keys) {
    if (enFlat[key] === undefined) {
      throw new Error(`Key "${key}" not found in flattened en.json`);
    }
  }

  // Embedded data: 245 rows, each row = 23 strings in LOCALES order
  const rows = JSON.parse(fs.readFileSync(ROWS_PATH, 'utf8'));
  if (rows.length !== keys.length) {
    throw new Error(`Expected ${keys.length} rows, got ${rows.length}`);
  }
  if (rows[0] && rows[0].length !== LOCALES.length) {
    throw new Error(`Expected ${LOCALES.length} columns per row, got ${rows[0].length}`);
  }

  // Build byLocale: { "ar": { "common.language": "...", ... }, ... } in key order
  const byLocale = {};
  for (let j = 0; j < LOCALES.length; j++) {
    const loc = LOCALES[j];
    byLocale[loc] = {};
    for (let i = 0; i < keys.length; i++) {
      const raw = rows[i][j];
      byLocale[loc][keys[i]] = preservePlaceholders(typeof raw === 'string' ? raw : enFlat[keys[i]]);
    }
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(byLocale, null, 2), 'utf8');
  console.log(`Wrote ${OUT_PATH} (${LOCALES.length} locales × ${keys.length} keys).`);
}

main();
