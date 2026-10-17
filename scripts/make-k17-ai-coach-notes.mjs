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
const page = (step, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${background}${box(58, 38, 1090, 1120, 'none')}${t(98, 109, step, 34, muted)}${t(98, 203, title, 65)}${mark(100, 240, 1080, 240, cyan, 16)}${body}</svg>`;

const step1 = page('STEP 1 / YOUR RECORDED FACTS', 'START WITH THE JOURNAL', `
${t(105, 306, 'Fictional XAUUSD · London · breakout', 38, muted)}
${box(92, 351, 1016, 155)}${t(126, 415, 'SCOPE', 38, violet)}${t(126, 471, 'Six trades you actually logged', 42)}
${box(92, 529, 1016, 241, '#eff9f8')}${t(126, 595, 'YOUR WRITTEN CHECK', 38, green)}${t(126, 656, 'Wait for the breakout candle', 43)}${t(126, 716, 'to close before entering', 43)}
${box(92, 794, 1016, 170)}${t(126, 859, 'YOUR QUESTION', 38, violet)}${t(126, 919, 'Which entries were marked early?', 42)}
${t(111, 1061, 'A missing trade is not in this sample.', 38, muted)}`);

const step2 = page('STEP 2 / A POSSIBLE AI ANSWER', 'THREE MARKED EARLY?', `
${t(105, 307, 'A draft summary is a pointer, not proof.', 39, muted)}
${box(92, 354, 1016, 190, '#f6f0ff')}${t(126, 424, 'COACH SUMMARY', 38, violet)}${t(126, 494, '“3 of 6 records say early.”', 51)}
${box(92, 574, 1016, 252)}${t(126, 640, 'OPEN THE THREE RECORDS', 39, green)}${t(126, 704, 'Read the note and check the', 43)}${t(126, 766, 'saved label and screenshot.', 43)}
${mark(127, 890, 1052, 890, '#eac65d', 17)}
${t(109, 993, 'Could one label be wrong?', 49, red)}
${t(109, 1068, 'Do not change your plan yet.', 39, muted)}`);

const step3 = page('STEP 3 / VERIFY BEFORE DECIDING', 'CORRECT THE SUMMARY', `
${t(105, 307, 'One “early” label was entered by mistake.', 39, muted)}
${box(92, 357, 1016, 190, '#fff1ec')}${t(126, 428, 'FIRST SUMMARY', 38, red)}${t(126, 497, '3 of 6 marked early', 51)}
${box(92, 575, 1016, 223, '#eef9f5')}${t(126, 646, 'AFTER CHECKING THE RECORDS', 36, green)}${t(126, 710, '2 of 6 marked early', 51)}${t(126, 768, 'in this fictional sample', 39, muted)}
${mark(127, 867, 1052, 867, '#eac65d', 17)}
${t(108, 969, 'What can I review next?', 49)}
${t(108, 1042, 'No cause, signal or promise proved.', 37, muted)}`);

const coverOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<rect x="64" y="25" width="1472" height="214" rx="33" fill="#fffaf0" fill-opacity="0.9"/>
${t(102, 106, 'AI TRADING COACH', 62, ink)}
${t(102, 203, 'CHECK THE RECORDS', 85, ink)}
${mark(103, 231, 1480, 231, cyan, 18)}
</svg>`;

await sharp(path.resolve('scripts/assets/k17-ai-coach-cover-background.png'))
  .resize(1600, 900, { fit: 'cover' })
  .composite([{ input: Buffer.from(coverOverlay) }])
  .webp({ quality: 87 })
  .toFile(path.join(output, 'cover-ai-trading-coach-prop-firm-k17.webp'));

for (const [name, svg] of [
  ['ai-coach-step-1-records.webp', step1],
  ['ai-coach-step-2-draft.webp', step2],
  ['ai-coach-step-3-verified.webp', step3],
]) {
  await sharp(Buffer.from(svg)).webp({ quality: 89 }).toFile(path.join(output, name));
}

console.log('K17 cover and three progressive learning notes written.');
