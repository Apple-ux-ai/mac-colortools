/**
 * 依次为所有未完成的语言拉取翻译并更新 translations-table.json，然后从表构建 locale 文件。
 * 可选环境变量：MYMEMORY_EMAIL=your@email.com 提高每日限额（约 5 万字符）。
 * 运行：node scripts/fetch-all-locales.cjs
 * 说明：每次运行会跳过表里已满的 locale，只拉取仍为英文的；拉取完后自动执行 build-locales-from-table。
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TABLE_PATH = path.join(__dirname, 'translations-table.json');
const LOCALES = ['ar','bn','de','es','fa','fr','he','hi','id','it','ja','ko','ms','nl','pl','pt','pt-BR','ru','sw','ta','th','fil','tr','uk','ur','vi'];

function isLocaleFilled(table, locale) {
  if (!table || typeof table !== 'object') return false;
  let count = 0;
  for (const key of Object.keys(table)) {
    const val = table[key] && table[key][locale];
    if (val && val !== 'Language' && val !== 'Back' && val !== 'Close' && val !== 'Copy') count++;
  }
  return count > 200;
}

function main() {
  const table = fs.existsSync(TABLE_PATH)
    ? JSON.parse(fs.readFileSync(TABLE_PATH, 'utf8'))
    : {};
  const toFetch = LOCALES.filter((loc) => !isLocaleFilled(table, loc));
  if (toFetch.length === 0) {
    console.log('All locales already filled. Running build only.');
  } else {
    console.log('Locales to fetch:', toFetch.join(', '));
    for (const locale of toFetch) {
      console.log('\n--- Fetching', locale, '---');
      const r = spawnSync('node', [path.join(__dirname, 'fetch-translations.cjs'), locale], {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
      });
      if (r.status !== 0 && r.signal) break;
    }
  }
  console.log('\n--- Building locale files ---');
  spawnSync('node', [path.join(__dirname, 'build-locales-from-table.cjs')], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
  console.log('Done.');
}

main();
