import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const out = path.resolve('public/images');
await mkdir(out, { recursive: true });

const ink = '#12264e';
const muted = '#536071';
const teal = '#196d69';
const red = '#a34654';
const violet = '#69539f';
const cyan = '#6cdae1';
const paper = '#fffaf0';
const font = 'Comic Sans MS, Segoe Print, Trebuchet MS, sans-serif';
const text = (x, y, value, size = 44, color = ink) => `<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-size="${size}" font-weight="600">${value}</text>`;
const box = (x, y, w, h, fill = '#fffef9') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="${fill}" stroke="${ink}" stroke-width="4"/>`;
const stroke = (x1, y1, x2, y2, color = cyan, width = 15) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${y1 - 8} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
const paperLines = Array.from({ length: 12 }, (_, i) => `<path d="M0 ${143 + i * 86} H1200" stroke="#dae9e7" stroke-width="2"/>`).join('');
const bg = `<rect width="1200" height="1200" fill="${paper}"/>${paperLines}${Array.from({ length: 6 }, (_, i) => `<circle cx="33" cy="133" r="12" fill="#d9d3c8" transform="translate(0 ${i * 180})"/>`).join('')}`;
const page = (step, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${bg}${box(62, 36, 1080, 1128, 'none')}${text(100, 109, step, 33, muted)}${text(100, 207, title, 60)}${stroke(100, 240, 1080, 240)}${body}</svg>`;

const weekCard = (x, y, label, trades, result, color) => `${box(x, y, 480, 170, color)}${text(x + 30, y + 57, label, 37)}${text(x + 30, y + 119, `${trades} trades`, 43)}${text(x + 275, y + 119, result, 46, teal)}`;

const first = page('STEP 1 / GATHER THE WEEKS', 'FOUR WEEKLY NOTES', `
${text(110, 312, 'Fictional XAUUSD · London breakout', 38, muted)}
${weekCard(98, 365, 'WEEK 1', 5, '+$60', '#f6f1ff')}
${weekCard(620, 365, 'WEEK 2', 5, '+$100', '#effaf7')}
${weekCard(98, 574, 'WEEK 3', 6, '−$40', '#fff0ec')}
${weekCard(620, 574, 'WEEK 4', 4, '+$30', '#fff7dd')}
${box(98, 825, 1002, 167, '#fffef9')}
${text(132, 893, 'First gather the records.', 46)}
${text(132, 957, 'The $ results do not explain the actions.', 38, muted)}
${text(108, 1084, 'Next: compare the same written check.', 39, violet)}`);

const second = page('STEP 2 / KEEP TWO ANSWERS', 'CHECK ≠ RESULT', `
${text(108, 311, 'Same fictional XAUUSD month', 39, muted)}
${box(96, 360, 1006, 260, '#eaf9f6')}
${text(130, 430, 'WRITTEN CHECK', 36, teal)}
${text(130, 500, 'Wait for the candle close', 47)}
${text(130, 572, 'Followed: 4 + 3 + 5 + 2 = 14 of 20', 41)}
${box(96, 660, 1006, 233, '#f6f1ff')}
${text(130, 730, 'RECORDED USD RESULT', 36, violet)}
${text(130, 814, '+$60 + $100 − $40 + $30 = +$150', 39)}
${stroke(130, 958, 1035, 958, '#e2c766', 16)}
${text(108, 1045, 'Fees were not recorded.', 44, red)}
${text(108, 1113, 'A green month does not prove plan-following.', 35, muted)}`);

const third = page('STEP 3 / COMPLETE THE REVIEW', 'ONE MONTHLY NOTE', `
${text(108, 314, 'XAUUSD · London · breakout · fictional', 37, muted)}
${box(91, 348, 1015, 710, '#fffefb')}
${text(129, 416, 'MY WRITTEN CHECK', 34, teal)}
${text(129, 472, 'Wait for the candle close', 42)}
${text(129, 557, 'WHAT I RECORDED', 34, violet)}
${text(129, 616, '20 trades · 14 followed my check', 42)}
${text(129, 676, '+$150 recorded · fees missing', 41)}
${text(129, 761, 'WHAT TO REOPEN', 34, red)}
${text(129, 818, 'Early entries in weeks 2 and 4', 41)}
${stroke(129, 867, 1035, 867, '#e2c766', 15)}
${text(129, 934, 'NEXT MONTH', 34, teal)}
${text(129, 994, 'Did I wait for my planned close?', 40)}
${text(109, 1111, 'A question to check, not a prediction.', 39, muted)}`);

const coverOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
${text(95, 105, 'MONTHLY TRADING', 73, '#ffffff')}
${text(95, 190, 'REVIEW', 79, '#ffffff')}
${text(170, 386, 'W1', 37)}${text(505, 386, 'W2', 37)}
${text(170, 600, 'W3', 37)}${text(505, 600, 'W4', 37)}
${text(955, 368, 'ONE MONTH', 37, violet)}
${text(955, 453, '20 trades', 47)}
${text(955, 533, '14 followed plan', 42, teal)}
${text(955, 613, '+$150 recorded', 43)}
${text(955, 691, 'What to check next?', 33, red)}
</svg>`;

await sharp(path.resolve('scripts/assets/k21-monthly-review-cover-background.png'))
  .resize(1600, 900, { fit: 'cover' })
  .composite([{ input: Buffer.from(coverOverlay) }])
  .webp({ quality: 87 })
  .toFile(path.join(out, 'cover-monthly-trading-review-template-k21.webp'));

for (const [filename, svg] of [
  ['monthly-review-step-1-weeks.webp', first],
  ['monthly-review-step-2-checks.webp', second],
  ['monthly-review-step-3-complete.webp', third],
]) {
  await sharp(Buffer.from(svg)).webp({ quality: 89 }).toFile(path.join(out, filename));
}

console.log('K21 cover and three progressive learning notes written.');
