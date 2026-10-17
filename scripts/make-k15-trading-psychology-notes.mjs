import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('public/images');
await mkdir(output, { recursive: true });

const ink = '#10214c';
const muted = '#526071';
const violet = '#7a5ab6';
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

const step1 = page('STEP 1 / BEFORE THE PRESSURE', 'MY XAUUSD PLAN', `
${t(104, 314, 'London session · fictional example', 40, muted)}
${box(92, 357, 1015, 145)}${t(126, 423, 'SETUP', 37, violet)}${t(126, 470, 'Breakout of my marked level', 43)}
${box(92, 525, 1015, 145)}${t(126, 592, 'WAIT FOR', 37, violet)}${t(126, 638, 'Breakout candle to close', 43)}
${box(92, 693, 1015, 145)}${t(126, 760, 'SIZE', 37, violet)}${t(126, 806, 'Use my written sizing method', 43)}
${box(92, 861, 1015, 159, '#f2f9f8')}${t(126, 927, 'IF I FEEL RUSHED', 37, green)}${t(126, 975, 'Check the full setup again', 43)}
${t(112, 1101, 'These are my checks, not market signals.', 38, muted)}`);

const step2 = page('STEP 2 / THE URGE APPEARS', 'PAUSE AT THE CHECK', `
${t(106, 315, 'First trade: -$50 net  ·  XAUUSD / London', 40, muted)}
${box(93, 366, 1015, 207, '#f6f0ff')}${t(128, 434, 'FEELING + URGE', 41, violet)}${t(128, 497, '"I want to make back the $50."', 47)}
${t(455, 654, '↓', 80, violet)}
${box(93, 695, 1015, 235, '#f0fafa')}${t(128, 763, 'PLAN CHECK', 41, green)}${t(128, 828, 'Has a fresh breakout candle', 46)}${t(128, 887, 'closed?  NOT CHECKED YET', 45, red)}
${mark(128, 955, 1052, 955, '#eccd65', 17)}
${t(114, 1050, 'The feeling is data. Check the setup.', 41, ink)}`);

const step3 = page('STEP 3 / RECORD THE DECISION', 'PLAN ≠ RESULT', `
${t(105, 312, 'Fictional second trade · XAUUSD / London', 40, muted)}
${box(93, 354, 1016, 180, '#f0fafa')}${t(127, 421, 'PLAN', 39, green)}${t(127, 487, 'Wait for the candle to close', 47)}
${box(93, 556, 1016, 180, '#f6f0ff')}${t(127, 622, 'URGE + ACTION', 39, violet)}${t(127, 689, 'Entered early after -$50', 47)}
${box(93, 759, 1016, 205, '#fff1ec')}${t(127, 826, 'REVIEW THESE SEPARATELY', 39, red)}${t(127, 884, 'Plan followed?  NO', 43)}${t(127, 939, 'Net result?  +$35', 43)}
${mark(129, 1013, 1051, 1013, '#eac65d', 17)}
${t(111, 1088, 'A win does not change the earlier choice.', 38)}`);

const coverOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<rect x="70" y="50" width="1460" height="242" rx="35" fill="#fffaf0" fill-opacity="0.83"/>
${t(106, 129, 'TRADING PSYCHOLOGY', 55, muted)}
${t(105, 243, 'PLAN OR URGE?', 111, ink)}
${mark(106, 272, 1480, 272, cyan, 19)}
</svg>`;

await sharp(path.resolve('scripts/assets/k15-trading-psychology-cover-background.png'))
  .resize(1600, 900, { fit: 'cover' })
  .composite([{ input: Buffer.from(coverOverlay) }])
  .webp({ quality: 87 })
  .toFile(path.join(output, 'cover-trading-psychology-prop-firm-k15.webp'));

for (const [name, svg] of [
  ['trading-psychology-step-1-plan.webp', step1],
  ['trading-psychology-step-2-urge.webp', step2],
  ['trading-psychology-step-3-review.webp', step3],
]) {
  await sharp(Buffer.from(svg)).webp({ quality: 89 }).toFile(path.join(output, name));
}

console.log('K15 cover and three progressive learning notes written.');
