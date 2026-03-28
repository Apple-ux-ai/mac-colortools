/**
 * 生成其余 26 种语言包：从 en.json 复制为占位，便于后续机器翻译/人工校对。
 * 运行：node scripts/generate-locales.cjs
 * 说明：当前 26 个文件与 en 内容一致；可用机器翻译将 en.json 译为各语言后覆盖对应 locale 的 json，再按需人工校对。
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');

const OTHER_LOCALES = [
  'zh-TW', 'ar', 'bn', 'de', 'es', 'fa', 'fr', 'he', 'hi', 'id', 'it', 'ja', 'ko',
  'ms', 'nl', 'pl', 'pt', 'pt-BR', 'ru', 'sw', 'ta', 'th', 'fil', 'tr', 'uk', 'ur', 'vi'
];

const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));

OTHER_LOCALES.forEach((locale) => {
  const outPath = path.join(LOCALES_DIR, `${locale}.json`);
  fs.writeFileSync(outPath, JSON.stringify(en, null, 2), 'utf8');
  console.log('Written:', locale);
});

console.log('Done. Replace with machine-translated content as needed.');
