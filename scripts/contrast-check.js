const path = require('path');
const config = require(path.resolve(__dirname, '..', 'tailwind.config.js'));

function hexToRgb(hex) {
  hex = hex.replace('#','');
  if (hex.length === 3) hex = hex.split('').map(h => h+h).join('');
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function srgbToLin(c) {
  c = c / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const [r,g,b] = hexToRgb(hex);
  const R = srgbToLin(r);
  const G = srgbToLin(g);
  const B = srgbToLin(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(hex1, hex2) {
  const L1 = luminance(hex1);
  const L2 = luminance(hex2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

function safeGet(obj, key) {
  return obj && obj[key] ? obj[key] : undefined;
}

const colors = safeGet(config, 'theme') && safeGet(config.theme, 'extend') && safeGet(config.theme.extend, 'colors') || {};

const pairs = [
  { a: 'primary-dark', b: 'text-light', label: 'Banner background / light text' },
  { a: 'accent', b: 'primary-dark', label: 'Accent (orange) on primary-dark' },
  { a: 'accent', b: 'text-light', label: 'Accent on light text' },
  { a: 'background-light', b: 'text-dark', label: 'Light background / dark text' },
];

console.log('Contrast check for key pairs (WCAG ratios)');
console.log('Colors discovered in tailwind.config.js (extend.colors):');
console.log(Object.keys(colors).join(', '));
console.log('---');

pairs.forEach(p => {
  const colA = colors[p.a];
  const colB = colors[p.b];
  if (!colA || !colB) {
    console.log(`${p.label}: SKIPPED (missing ${!colA ? p.a : p.b})`);
    return;
  }
  const ratio = contrastRatio(colA, colB);
  const aa = ratio >= 4.5 ? 'PASS' : 'FAIL';
  const aaLarge = ratio >= 3 ? 'PASS (large text >=18pt or bold >=14pt)' : 'FAIL (large)';
  console.log(`${p.label}: ${p.a} (${colA}) vs ${p.b} (${colB}) -> ratio: ${ratio.toFixed(2)} -> ${aa}, ${aaLarge}`);
});

console.log('--- Done');
