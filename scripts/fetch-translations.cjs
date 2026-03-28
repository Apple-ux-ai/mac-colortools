/**
 * 使用 MyMemory 免费 API 将 en 文案翻译成各语言并更新 translations-table.json。
 * 限制：约 5000 字符/天（匿名），可传 ?email= 提高限额。
 * 运行：node scripts/fetch-translations.cjs [locale]  例：node scripts/fetch-translations.cjs ja
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const TABLE_PATH = path.join(__dirname, 'translations-table.json');
const EN_PATH = path.join(__dirname, '../src/i18n/locales/en.json');
const LOCALES = ['ar','bn','de','es','fa','fr','he','hi','id','it','ja','ko','ms','nl','pl','pt','pt-BR','ru','sw','ta','th','fil','tr','uk','ur','vi'];
const LANG_PAIR = { 'pt-BR': 'pt', 'fil': 'tl' };

function flatten(obj, prefix, acc) {
  acc = acc || {};
  for (const k of Object.keys(obj)) {
    const key = prefix ? prefix + '.' + k : k;
    if (typeof obj[k] === 'string') acc[key] = obj[k];
    else if (obj[k] && typeof obj[k] === 'object') flatten(obj[k], key, acc);
  }
  return acc;
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let d = '';
      res.on('data', (c) => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translate(text, to) {
  const target = LANG_PAIR[to] || to;
  const langpair = `en|${target}`;
  const q = encodeURIComponent(text.slice(0, 500));
  const email = process.env.MYMEMORY_EMAIL ? `&de=${encodeURIComponent(process.env.MYMEMORY_EMAIL)}` : '';
  const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=${langpair}${email}`;
  const data = await get(url);
  if (data?.quotaFinished) throw new Error('QUOTA_FINISHED');
  const t = data?.responseData?.translatedText;
  if (t) return t;
  throw new Error(data?.responseDetails || 'No translation');
}

async function main() {
  const locale = process.argv[2];
  if (!locale || !LOCALES.includes(locale)) {
    console.log('Usage: node scripts/fetch-translations.cjs <locale>');
    console.log('Locales:', LOCALES.join(', '));
    process.exit(1);
  }
  const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
  const flat = flatten(en);
  const table = JSON.parse(fs.readFileSync(TABLE_PATH, 'utf8'));
  const keys = Object.keys(flat);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const text = flat[key];
    process.stdout.write(`[${locale}] ${i + 1}/${keys.length} ${key}\r`);
    try {
      const t = await translate(text, locale);
      if (!table[key]) table[key] = {};
      table[key][locale] = t;
    } catch (e) {
      if (e.message === 'QUOTA_FINISHED') {
        console.log(`\nQuota finished after ${i} strings. Progress saved. Re-run tomorrow or set ?email= in API.`);
        fs.writeFileSync(TABLE_PATH, JSON.stringify(table, null, 2), 'utf8');
        process.exit(0);
      }
      console.warn(`\nSkip ${key}: ${e.message}`);
    }
    if ((i + 1) % 20 === 0) fs.writeFileSync(TABLE_PATH, JSON.stringify(table, null, 2), 'utf8');
    await sleep(500);
  }
  fs.writeFileSync(TABLE_PATH, JSON.stringify(table, null, 2), 'utf8');
  console.log(`\nDone. Updated ${locale} in translations-table.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
