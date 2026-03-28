/**
 * 从 en.json 生成其余语言包：优先使用 scripts/translations-data/<locale>.json 的已有翻译，
 * 缺失的 key 用 en 占位。也可用 LibreTranslate API 批量翻译（需设置环境变量）。
 * 运行：node scripts/translate-locales.cjs [locale]
 * 环境变量（可选）：LIBRETRANSLATE_URL、LIBRETRANSLATE_API_KEY
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales');
const DATA_DIR = path.join(__dirname, 'translations-data');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');

const TARGET_LOCALES = [
  'ar', 'bn', 'de', 'es', 'fa', 'fr', 'he', 'hi', 'id', 'it', 'ja', 'ko',
  'ms', 'nl', 'pl', 'pt', 'pt-BR', 'ru', 'sw', 'ta', 'th', 'fil', 'tr', 'uk', 'ur', 'vi'
];

const LOCALE_TO_LIBRE = { 'fil': 'tl', 'pt-BR': 'pt' };

function deepMergeKeys(base, override) {
  const out = {};
  for (const k of Object.keys(base)) {
    if (override && typeof override[k] === 'string') {
      out[k] = override[k];
    } else if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) {
      out[k] = deepMergeKeys(base[k], override && override[k]);
    } else {
      out[k] = base[k];
    }
  }
  return out;
}

async function main() {
  const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
  const only = process.argv[2];
  const locales = only ? (TARGET_LOCALES.includes(only) ? [only] : []) : TARGET_LOCALES;
  if (locales.length === 0) {
    console.log('Usage: node scripts/translate-locales.cjs [locale]');
    console.log('Locales:', TARGET_LOCALES.join(', '));
    process.exit(1);
  }
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  for (const locale of locales) {
    const dataPath = path.join(DATA_DIR, `${locale}.json`);
    let merged = en;
    if (fs.existsSync(dataPath)) {
      const partial = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      merged = deepMergeKeys(en, partial);
    }
    const outPath = path.join(LOCALES_DIR, `${locale}.json`);
    fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), 'utf8');
    console.log('Written:', locale + '.json');
  }
  console.log('Done. Add or edit files in scripts/translations-data/ then re-run to merge.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
