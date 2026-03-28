const fs = require('fs');
const p = 'src/modules/calc/ColorMixer.tsx';
let s = fs.readFileSync(p, 'utf8');
const bad = /<p>2、输入[^<]+<\/p>/;
s = s.replace(bad, "<p>{t('calcMix.about2')}</p>");
fs.writeFileSync(p, s);
console.log('Done');
