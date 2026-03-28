/**
 * Locale patch generator for Color Tools.
 * Reads en.json and flattens to key-value. Uses translations from
 * translations.json (built from translations-rows.json if missing),
 * then writes 23 flat patch files in _keys.json order.
 * Run: node script.cjs (from project root or scripts/locale-patches)
 */

const fs = require('fs');
const path = require('path');

const PATCHES_DIR = path.resolve(__dirname, '.');
const ROOT = path.resolve(__dirname, '../..');
const LOCALES_DIR = path.join(ROOT, 'src/i18n/locales');
const KEYS_PATH = path.join(PATCHES_DIR, '_keys.json');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');
const TRANSLATIONS_PATH = path.join(PATCHES_DIR, 'translations.json');
const ROWS_PATH = path.join(PATCHES_DIR, 'translations-rows.json');

const LOCALES = [
  'ar', 'bn', 'es', 'fa', 'fr', 'he', 'hi', 'id', 'it', 'ms', 'nl', 'pl',
  'pt', 'pt-BR', 'ru', 'sw', 'ta', 'th', 'fil', 'tr', 'uk', 'ur', 'vi'
];

function flatten(obj, prefix = '') {
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v != null && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(result, flatten(v, key));
    } else {
      result[key] = String(v);
    }
  }
  return result;
}

function preservePlaceholders(s) {
  if (typeof s !== 'string') return s;
  return s
    .replace(/\{\{\s*value\s*\}\}/g, '{{value}}')
    .replace(/\{\{\s*count\s*\}\}/g, '{{count}}');
}

function buildTranslationsFromRows(keys, flatEn, rows) {
  const byLocale = {};
  for (let j = 0; j < LOCALES.length; j++) {
    const loc = LOCALES[j];
    byLocale[loc] = {};
    for (let i = 0; i < keys.length; i++) {
      const raw = rows[i][j];
      byLocale[loc][keys[i]] = preservePlaceholders(
        typeof raw === 'string' ? raw : flatEn[keys[i]]
      );
    }
  }
  return byLocale;
}

function main() {
  const keys = JSON.parse(fs.readFileSync(KEYS_PATH, 'utf8'));
  const enNested = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
  const flatEn = flatten(enNested);

  let translations;
  if (fs.existsSync(TRANSLATIONS_PATH)) {
    translations = JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, 'utf8'));
  } else if (fs.existsSync(ROWS_PATH)) {
    const rows = JSON.parse(fs.readFileSync(ROWS_PATH, 'utf8'));
    if (rows.length !== keys.length || (rows[0] && rows[0].length !== LOCALES.length)) {
      throw new Error('translations-rows.json must be 245 rows × 23 columns');
    }
    translations = buildTranslationsFromRows(keys, flatEn, rows);
    fs.writeFileSync(TRANSLATIONS_PATH, JSON.stringify(translations, null, 2) + '\n', 'utf8');
    console.log('Built', TRANSLATIONS_PATH, 'from translations-rows.json');
  } else {
    translations = {};
    for (const loc of LOCALES) translations[loc] = { ...flatEn };
  }

  for (const locale of LOCALES) {
    const patch = {};
    const localeTranslations = translations[locale] || {};
    for (const key of keys) {
      patch[key] = localeTranslations[key] !== undefined ? localeTranslations[key] : flatEn[key];
    }
    const outPath = path.join(PATCHES_DIR, `${locale}.json`);
    fs.writeFileSync(outPath, JSON.stringify(patch, null, 2) + '\n', 'utf8');
    console.log('Wrote', outPath);
  }
  console.log('Done. %s locale patch files written.', LOCALES.length);
}

main();
