const fs = require('fs');
const p = 'src/modules/calc/ContrastChecker.tsx';
let s = fs.readFileSync(p, 'utf8');
const bad = /<p>1、此工具综合了[^<]+<\/p>/;
s = s.replace(bad, "<p>{t('calcContrast.about1')}</p>");
fs.writeFileSync(p, s);
console.log('Done');
