/**
 * Builds translations-rows.json from nested locale files in src/i18n/locales/.
 * Each row = 23 locale values for one key (order: ar, bn, es, ...).
 * Run: node build-rows-from-locales.cjs
 * Then: node script.cjs to write the 23 patch files.
 */

const fs = require('fs');
const path = require('path');

const PATCHES_DIR = path.resolve(__dirname, '.');
const ROOT = path.resolve(__dirname, '../..');
const LOCALES_DIR = path.join(ROOT, 'src/i18n/locales');
const KEYS_PATH = path.join(PATCHES_DIR, '_keys.json');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');
const OUT_PATH = path.join(PATCHES_DIR, 'translations-rows.json');

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

function main() {
  const keys = JSON.parse(fs.readFileSync(KEYS_PATH, 'utf8'));
  const flatEn = flatten(JSON.parse(fs.readFileSync(EN_PATH, 'utf8')));

  const flatByLocale = { en: flatEn };
  for (const loc of LOCALES) {
    const p = path.join(LOCALES_DIR, `${loc}.json`);
    if (fs.existsSync(p)) {
      try {
        flatByLocale[loc] = flatten(JSON.parse(fs.readFileSync(p, 'utf8')));
      } catch (e) {
        flatByLocale[loc] = { ...flatEn };
      }
    } else {
      flatByLocale[loc] = { ...flatEn };
    }
  }

  const rows = keys.map((key) =>
    LOCALES.map((loc) => flatByLocale[loc][key] ?? flatEn[key] ?? '')
  );

  fs.writeFileSync(OUT_PATH, JSON.stringify(rows, null, 0) + '\n', 'utf8');
  console.log('Wrote', OUT_PATH, '(', keys.length, 'rows ×', LOCALES.length, 'cols)');
}

main();
