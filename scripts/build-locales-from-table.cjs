/**
 * 从翻译表生成 26 种语言的 locale JSON。
 * 翻译表为 scripts/translations-table.json：{ "key": { "ja": "...", "de": "...", ... }, ... }
 * 缺失 key/locale 时直接报错，禁止静默回退英文。运行：node scripts/build-locales-from-table.cjs
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');
const TABLE_PATH = path.join(__dirname, 'translations-table.json');

const TARGET_LOCALES = [
  'ar', 'bn', 'de', 'es', 'fa', 'fr', 'he', 'hi', 'id', 'it', 'ja', 'ko',
  'ms', 'nl', 'pl', 'pt', 'pt-BR', 'ru', 'sw', 'ta', 'th', 'fil', 'tr', 'uk', 'ur', 'vi'
];

function flatten(obj, prefix = '', acc = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') acc[key] = v;
    else if (v && typeof v === 'object') flatten(v, key, acc);
  }
  return acc;
}

function unflatten(flat) {
  const out = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let cur = out;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (!(p in cur)) cur[p] = {};
      cur = cur[p];
    }
    cur[parts[parts.length - 1]] = value;
  }
  return out;
}

function main() {
  const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
  const flatEn = flatten(en);
  const table = fs.existsSync(TABLE_PATH)
    ? JSON.parse(fs.readFileSync(TABLE_PATH, 'utf8'))
    : {};
  const missing = [];
  for (const locale of TARGET_LOCALES) {
    const flat = {};
    for (const [key, enVal] of Object.entries(flatEn)) {
      const row = table[key];
      if (!row) {
        missing.push(`${locale}: missing table row for ${key}`);
        continue;
      }
      if (!row[locale]) {
        missing.push(`${locale}: missing translation for ${key}`);
        continue;
      }
      flat[key] = row[locale];
    }
    if (missing.length > 0) {
      continue;
    }
    const out = unflatten(flat);
    fs.writeFileSync(
      path.join(LOCALES_DIR, `${locale}.json`),
      JSON.stringify(out, null, 2),
      'utf8'
    );
    console.log('Written:', locale + '.json');
  }
  if (missing.length > 0) {
    console.error('Missing translations detected. Build aborted.');
    console.error(missing.slice(0, 200).join('\n'));
    process.exit(1);
  }
  console.log('Done.');
}

main();
