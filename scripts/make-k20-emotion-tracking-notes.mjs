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
const lines = Array.from({ length: 12 }, (_, i) => `<path d="M0 ${143 + i * 86} H1200" stroke="#dae9e7" stroke-width="2"/>`).join('');
const bg = `<rect width="1200" height="1200" fill="${paper}"/>${lines}${Array.from({ length: 6 }, (_, i) => `<circle cx="33" cy="133" r="12" fill="#d9d3c8" transform="translate(0 ${i * 180})"/>`).join('')}`;
const page = (step, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${bg}${box(62, 36, 1080, 1128, 'none')}${text(100, 109, step, 33, muted)}${text(100, 207, title, 61)}${stroke(100, 240, 1080, 240)}${body}</svg>`;

const first = page('STEP 1 / BEFORE ENTRY', 'THE URGE', `
${text(110, 318, 'Fictional XAUUSD · London breakout', 39, muted)}
${box(92, 370, 1014, 177, '#f6f1ff')}
${text(127, 432, 'FEELING', 36, violet)}
${text(127, 508, 'Rushed', 59)}
${box(92, 580, 1014, 176, '#fff0ec')}
${text(127, 641, 'URGE', 36, red)}
${text(127, 717, 'Enter while the candle is open', 44)}
${box(92, 790, 1014, 198, '#eaf9f6')}
${text(127, 851, 'MY WRITTEN CHECK', 36, teal)}
${text(127, 925, 'Wait for the candle to close', 45)}
${text(106, 1082, 'Feeling is a note. Plan is a fact.', 40, muted)}`);

const second = page('STEP 2 / AFTER THE TRADE', 'ACTION ≠ RESULT', `
${text(110, 317, 'Same fictional XAUUSD London trade', 39, muted)}
${box(92, 371, 1014, 246, '#fff0ec')}
${text(127, 440, 'ACTION', 37, red)}
${text(127, 523, 'I entered before the close.', 47)}
${text(127, 586, 'Plan followed? NO', 43)}
${box(92, 653, 1014, 239, '#effaf7')}
${text(127, 724, 'RESULT AFTER EXIT', 37, teal)}
${text(127, 813, '+$18 net', 72)}
${stroke(130, 948, 1040, 948, '#e2c766', 18)}
${text(106, 1036, 'A win does not change the action.', 42)}
${text(106, 1112, 'A loss would not prove the cause.', 39, muted)}`);

const third = page('STEP 3 / COMPLETE NOTE', 'REVIEW THE DECISION', `
${text(108, 314, 'XAUUSD · London · breakout · fictional', 37, muted)}
${box(91, 348, 1015, 709, '#fffefb')}
${text(129, 418, 'BEFORE ENTRY', 36, violet)}
${text(129, 478, 'Rushed · wanted to enter early', 42)}
${text(129, 561, 'WRITTEN CHECK', 36, teal)}
${text(129, 620, 'Wait for the candle close', 44)}
${text(129, 704, 'ACTION', 36, red)}
${text(129, 764, 'Entered early · plan followed? NO', 42)}
${text(129, 847, 'AFTER EXIT', 36, teal)}
${text(129, 907, '+$18 net · felt relieved', 43)}
${stroke(129, 972, 1035, 972, '#e2c766', 15)}
${text(109, 1111, 'Next: does this action repeat?', 44)}`);

const coverOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
${text(116, 106, 'TRACK YOUR', 80, '#ffffff')}
${text(116, 203, 'TRADING EMOTIONS', 83, '#ffffff')}
${stroke(112, 226, 1455, 226, cyan, 17)}
${text(930, 450, 'FEELING', 40, violet)}
${text(930, 515, 'Rushed', 54)}
${text(930, 568, 'PLAN', 35, teal)}
${text(930, 618, 'Wait for the close', 31)}
</svg>`;

await sharp(path.resolve('scripts/assets/k20-emotion-tracking-cover-background.png'))
  .resize(1600, 900, { fit: 'cover' })
  .composite([{ input: Buffer.from(coverOverlay) }])
  .webp({ quality: 87 })
  .toFile(path.join(out, 'cover-tracking-trading-emotions-k20.webp'));

for (const [filename, svg] of [
  ['emotion-tracking-step-1-urge.webp', first],
  ['emotion-tracking-step-2-action.webp', second],
  ['emotion-tracking-step-3-review.webp', third],
]) {
  await sharp(Buffer.from(svg)).webp({ quality: 89 }).toFile(path.join(out, filename));
}

console.log('K20 cover and three progressive learning notes written.');
