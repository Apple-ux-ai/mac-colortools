/**
 * 将 scripts/locale-patches/*.json 合并到 translations-table.json，然后执行 build。
 * 每个补丁文件名为 <locale>.json，内容为扁平 key -> 译文，如 { "common.language": "Langue", ... }
 * 运行：node scripts/apply-patches-to-table.cjs
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PATCHES_DIR = path.join(__dirname, 'locale-patches');
const TABLE_PATH = path.join(__dirname, 'translations-table.json');
const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');
const ZH_CN_PATH = path.join(LOCALES_DIR, 'zh-CN.json');

function flatten(obj, prefix = '', acc = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') acc[key] = v;
    else if (v && typeof v === 'object') flatten(v, key, acc);
  }
  return acc;
}

function main() {
  if (!fs.existsSync(PATCHES_DIR)) {
    console.log('No locale-patches dir. Create scripts/locale-patches/<locale>.json and re-run.');
    process.exit(1);
  }
  const table = JSON.parse(fs.readFileSync(TABLE_PATH, 'utf8'));
  const flatEn = flatten(JSON.parse(fs.readFileSync(EN_PATH, 'utf8')));
  const flatZhCN = flatten(JSON.parse(fs.readFileSync(ZH_CN_PATH, 'utf8')));
  const LOCALE_NAMES = new Set([
    'ar', 'bn', 'de', 'es', 'fa', 'fr', 'he', 'hi', 'id', 'it', 'ja', 'ko',
    'ms', 'nl', 'pl', 'pt', 'pt-BR', 'ru', 'sw', 'ta', 'th', 'fil', 'tr', 'uk', 'ur', 'vi'
  ]);
  const files = fs.readdirSync(PATCHES_DIR).filter((f) => f.endsWith('.json') && LOCALE_NAMES.has(f.replace(/\.json$/, '')));
  for (const f of files) {
    const locale = f.replace(/\.json$/, '');
    const patch = JSON.parse(fs.readFileSync(path.join(PATCHES_DIR, f), 'utf8'));
    for (const [key, value] of Object.entries(patch)) {
      if (!table[key]) {
        table[key] = {
          en: flatEn[key] || '',
          'zh-CN': flatZhCN[key] || flatEn[key] || '',
        };
      }
      table[key][locale] = value;
    }
    console.log('Applied:', locale);
  }
  fs.writeFileSync(TABLE_PATH, JSON.stringify(table, null, 2), 'utf8');
  console.log('Table updated. Running build...');
  spawnSync('node', [path.join(__dirname, 'build-locales-from-table.cjs')], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
  console.log('Done.');
}

main();
