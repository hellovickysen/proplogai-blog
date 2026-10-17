import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('public/images');
await mkdir(output, { recursive: true });

const ink = '#10214c';
const muted = '#526071';
const violet = '#7659ad';
const red = '#a34550';
const green = '#196b58';
const cyan = '#55cbd4';
const paper = '#fffaf1';
const font = 'Comic Sans MS, Segoe Print, Trebuchet MS, sans-serif';
const t = (x, y, value, size = 42, color = ink) => `<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-size="${size}" font-weight="600">${value}</text>`;
const box = (x, y, w, h, fill = '#fffefa') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="25" fill="${fill}" stroke="${ink}" stroke-width="4"/>`;
const mark = (x1, y1, x2, y2, color = cyan, width = 13) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${y1 - 8} ${x2} ${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" fill="none"/>`;
const background = `<rect width="1200" height="1200" fill="${paper}"/>${Array.from({ length: 11 }, (_, i) => `<path d="M0 ${145 + i * 100} H1200" stroke="#dce9e8" stroke-width="2"/>`).join('')}${Array.from({ length: 6 }, (_, i) => `<circle cx="31" cy="135" r="12" fill="#d9d3c8" transform="translate(0 ${i * 180})"/>`).join('')}`;
const page = (step, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${background}${box(58, 38, 1090, 1120, 'none')}${t(98, 109, step, 34, muted)}${t(98, 203, title, 67)}${mark(100, 240, 1080, 240, cyan, 16)}${body}</svg>`;

const step1 = page('STEP 1 / BEFORE THE SESSION', 'MY WRITTEN PLAN', `
${t(105, 314, 'XAUUSD · London · fictional example', 39, muted)}
${box(92, 354, 1016, 146)}${t(126, 417, 'SETUP', 37, violet)}${t(126, 468, 'Breakout beyond my marked level', 40)}
${box(92, 520, 1016, 146)}${t(126, 583, 'CONFIRMATION', 37, violet)}${t(126, 634, 'Wait for the candle to close', 42)}
${box(92, 686, 1016, 146)}${t(126, 750, 'SIZE', 37, violet)}${t(126, 800, 'Use my written sizing method', 42)}
${box(92, 852, 1016, 155, '#eff9f8')}${t(126, 916, 'IF I FEEL RUSHED', 37, green)}${t(126, 966, 'Check the full setup again', 42)}
${t(110, 1091, 'My conditions. No price prediction.', 37, muted)}`);

const step2 = page('STEP 2 / AT THE DECISION', 'WHAT IS TRUE NOW?', `
${t(106, 313, 'XAUUSD moves beyond the marked level', 40, muted)}
${box(93, 359, 1015, 167, '#f6f0ff')}${t(128, 425, 'I FEEL AN URGE', 40, violet)}${t(128, 486, '"If I wait, I might miss it."', 45)}
${t(481, 616, '↓', 80, violet)}
${box(93, 652, 1015, 251, '#f0fafa')}${t(128, 720, 'MY WRITTEN CHECK', 41, green)}${t(128, 783, 'Has the breakout candle closed?', 43)}${t(128, 849, 'NOT YET', 54, red)}
${mark(127, 953, 1052, 953, '#eac65d', 17)}
${t(108, 1053, 'A feeling is real. The check is still open.', 38)}`);

const step3 = page('STEP 3 / REVIEW TWO POSSIBILITIES', 'PLAN ≠ RESULT', `
${t(105, 310, 'Two separate fictional XAUUSD outcomes', 39, muted)}
${box(92, 352, 1017, 263, '#eef9f5')}${t(127, 418, 'A / WAITED FOR THE CLOSE', 40, green)}${t(127, 482, 'Plan followed?  YES', 43)}${t(127, 548, 'Net result?  -$35', 43)}
${box(92, 637, 1017, 263, '#fff1ec')}${t(127, 703, 'B / ENTERED EARLY', 40, red)}${t(127, 767, 'Plan followed?  NO', 43)}${t(127, 833, 'Net result?  +$40', 43)}
${mark(128, 958, 1052, 958, '#eac65d', 17)}
${t(109, 1058, 'Keep your action and result separate.', 39)}`);

const coverOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<rect x="70" y="32" width="1460" height="225" rx="35" fill="#fffaf0" fill-opacity="0.84"/>
${t(106, 108, 'TRADING DISCIPLINE', 53, muted)}
${t(105, 219, 'PLAN · CHECK · REVIEW', 86, ink)}
${mark(106, 248, 1480, 248, cyan, 19)}
</svg>`;

await sharp(path.resolve('scripts/assets/k16-trading-discipline-cover-background.png'))
  .resize(1600, 900, { fit: 'cover' })
  .composite([{ input: Buffer.from(coverOverlay) }])
  .webp({ quality: 87 })
  .toFile(path.join(output, 'cover-trading-discipline-prop-firm-k16.webp'));

for (const [name, svg] of [
  ['trading-discipline-step-1-plan.webp', step1],
  ['trading-discipline-step-2-check.webp', step2],
  ['trading-discipline-step-3-review.webp', step3],
]) {
  await sharp(Buffer.from(svg)).webp({ quality: 89 }).toFile(path.join(output, name));
}

console.log('K16 cover and three progressive learning notes written.');
