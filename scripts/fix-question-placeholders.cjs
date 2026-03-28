/**
 * 修复语言包中因编码/翻译失败导致的 "????" 占位符：
 * - 若某个翻译值包含连续 3 个及以上的 ASCII 问号 "?"，则用 en.json 同路径的文案兜底替换
 * - 保留其它正常翻译不变
 *
 * 运行：node scripts/fix-question-placeholders.cjs
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');

const TARGET_LOCALES = [
  'ar', 'bn', 'de', 'es', 'fa', 'fr', 'he', 'hi', 'id', 'it', 'ja', 'ko',
  'ms', 'nl', 'pl', 'pt', 'pt-BR', 'ru', 'sw', 'ta', 'th', 'fil', 'tr', 'uk', 'ur', 'vi',
  'zh-CN', 'zh-TW',
];

const PLACEHOLDER_RE = /\?{3,}/;

function deepFix(localeNode, enNode) {
  if (typeof localeNode === 'string') {
    if (PLACEHOLDER_RE.test(localeNode) && typeof enNode === 'string') return enNode;
    return localeNode;
  }
  if (!localeNode || typeof localeNode !== 'object' || Array.isArray(localeNode)) return localeNode;

  const out = {};
  for (const k of Object.keys(localeNode)) {
    out[k] = deepFix(localeNode[k], enNode ? enNode[k] : undefined);
  }
  return out;
}

function main() {
  const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
  let changedFiles = 0;
  for (const locale of TARGET_LOCALES) {
    const p = path.join(LOCALES_DIR, `${locale}.json`);
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, 'utf8');
    const obj = JSON.parse(raw);
    const fixed = deepFix(obj, en);
    const out = JSON.stringify(fixed, null, 2) + '\n';
    if (out !== raw && out !== raw + '\n') {
      fs.writeFileSync(p, out, 'utf8');
      changedFiles++;
      console.log('Fixed:', `${locale}.json`);
    }
  }
  console.log(`Done. Changed files: ${changedFiles}`);
}

main();

