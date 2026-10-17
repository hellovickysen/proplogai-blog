import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const out = path.resolve('public/images');
await mkdir(out, { recursive: true });

const ink = '#11234d';
const muted = '#566270';
const teal = '#196a62';
const red = '#9c4652';
const violet = '#6e57a4';
const cyan = '#5ed1d7';
const paper = '#fffaf0';
const font = 'Comic Sans MS, Segoe Print, Trebuchet MS, sans-serif';
const text = (x, y, value, size = 44, color = ink) => `<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-size="${size}" font-weight="600">${value}</text>`;
const box = (x, y, w, h, fill = '#fffef9') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="25" fill="${fill}" stroke="${ink}" stroke-width="4"/>`;
const line = (x1, y1, x2, y2, color = cyan, width = 14) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${y1 - 10} ${x2} ${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" fill="none"/>`;
const pageBg = `<rect width="1200" height="1200" fill="${paper}"/>${Array.from({ length: 11 }, (_, i) => `<path d="M0 ${143 + i * 100} H1200" stroke="#dce9e6" stroke-width="2"/>`).join('')}${Array.from({ length: 6 }, (_, i) => `<circle cx="32" cy="135" r="12" fill="#d9d3c8" transform="translate(0 ${i * 180})"/>`).join('')}`;
const page = (step, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${pageBg}${box(58, 38, 1090, 1120, 'none')}${text(98, 108, step, 33, muted)}${text(98, 202, title, 61)}${line(100, 240, 1070, 240)}${body}</svg>`;

const missing = page('STEP 1 / THE FIRST NOTE', 'ONLY THE RESULT?', `
${text(105, 320, 'Fictional XAUUSD · London · breakout', 39, muted)}
${box(93, 381, 1014, 230, '#fff5dc')}
${text(130, 467, 'NET RESULT', 41, violet)}
${text(130, 553, '+$18', 76)}
${line(130, 670, 1035, 670, '#e5c75d', 18)}
${text(107, 779, 'Did I wait for my planned check?', 45)}
${box(93, 835, 1014, 171, '#fff0ef')}
${text(130, 938, 'I did not write that down.', 48, red)}
${text(107, 1100, 'The dollars cannot answer this.', 41, muted)}`);

const action = page('STEP 2 / ADD THE DECISION', 'PLAN NEXT TO ACTION', `
${text(105, 315, 'Same fictional XAUUSD London trade', 39, muted)}
${box(93, 373, 1014, 246, '#f0fbf8')}
${text(130, 449, 'MY WRITTEN CHECK', 40, teal)}
${text(130, 530, 'Wait for the breakout candle', 47)}
${text(130, 589, 'to close beyond my marked level.', 47)}
${box(93, 655, 1014, 205, '#fff1ed')}
${text(130, 729, 'WHAT I DID', 40, red)}
${text(130, 811, 'Entered while the candle was open.', 44)}
${line(130, 913, 1035, 913, '#e5c75d', 17)}
${text(107, 1009, 'Plan followed? NO', 55, red)}
${text(107, 1110, 'The result is still +$18 net.', 40, muted)}`);

const complete = page('STEP 3 / THE COMPLETE RECORD', 'SIX USEFUL FIELDS', `
${text(105, 305, 'One fictional trade · not a trade signal', 38, muted)}
${box(93, 346, 1014, 666, '#fffef9')}
${text(128, 419, '1  WHEN / WHAT', 39, teal)}
${text(128, 469, '14 Oct 2026 · XAUUSD · London', 42)}
${text(128, 555, '2  SETUP / CHECK', 39, teal)}
${text(128, 605, 'Breakout · wait for candle close', 41)}
${text(128, 691, '3  PLAN / 4  ACTION', 39, teal)}
${text(128, 741, 'Stop &amp; size written · entered early', 41)}
${text(128, 827, '5  NET RESULT / 6  REVIEW', 39, teal)}
${text(128, 880, '+$18 · plan followed? NO', 45, red)}
${text(128, 948, 'Next review: why did I enter early?', 39)}
${line(130, 1058, 1035, 1058, '#e5c75d', 17)}
${text(107, 1114, 'Keep outcome and behaviour separate.', 39)}`);

const coverOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<rect x="58" y="22" width="1484" height="230" rx="32" fill="#fffaf0" fill-opacity="0.91"/>
${text(100, 110, 'TRADING JOURNAL FIELDS', 71)}
${text(100, 207, 'WHAT SHOULD YOU WRITE DOWN?', 74)}
${line(100, 239, 1480, 239, cyan, 17)}
${text(478, 560, 'RESULT', 44, violet)}
${text(478, 655, '+$18', 67)}
${text(810, 560, 'FOLLOWED PLAN?', 31, teal)}
${text(810, 655, 'NOT RECORDED', 31)}
</svg>`;

await sharp(path.resolve('scripts/assets/k19-journal-fields-cover-background.png'))
  .resize(1600, 900, { fit: 'cover' })
  .composite([{ input: Buffer.from(coverOverlay) }])
  .webp({ quality: 87 })
  .toFile(path.join(out, 'cover-trading-journal-fields-k19.webp'));

for (const [filename, svg] of [
  ['journal-fields-step-1-result.webp', missing],
  ['journal-fields-step-2-action.webp', action],
  ['journal-fields-step-3-complete.webp', complete],
]) {
  await sharp(Buffer.from(svg)).webp({ quality: 89 }).toFile(path.join(out, filename));
}

console.log('K19 cover and three progressive learning notes written.');
