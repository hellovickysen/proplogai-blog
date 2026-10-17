import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('public/images');
await mkdir(output, { recursive: true });
const ink = '#10214c';
const muted = '#5f6175';
const red = '#a13e52';
const green = '#196b58';
const cyan = '#46c6d5';
const paper = '#fffaf0';
const font = 'Comic Sans MS, Segoe Print, Trebuchet MS, sans-serif';
const t = (x, y, value, size = 46, color = ink) => `<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-size="${size}" font-weight="600">${value}</text>`;
const rect = (x, y, w, h, fill = '#fffdf8') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="${fill}" stroke="${ink}" stroke-width="4"/>`;
const line = (x1, y1, x2, y2, color = cyan, width = 10) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${y1 - 8} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
const background = () => `<rect width="1200" height="1200" fill="${paper}"/>${Array.from({ length: 12 }, (_, i) => `<path d="M0 ${130 + i * 100} H1200" stroke="#dce9e8" stroke-width="2"/>`).join('')}${Array.from({ length: 7 }, (_, i) => `<circle cx="34" cy="108" r="12" fill="#d9d3c8" transform="translate(0 ${i * 170})"/>`).join('')}`;
const page = (step, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${background()}${rect(64, 42, 1090, 1113, 'none')}${t(102, 115, step, 34, muted)}${t(102, 206, title, 66)}${line(101, 244, 1089, 244, cyan, 14)}${body}</svg>`;

const step1 = page('STEP 1 / BEFORE THE TRADE', 'CHECK THIS ACCOUNT', `
${t(104, 326, 'Copy these from your own firm:', 41, muted)}
${rect(91, 363, 1018, 137)}${t(126, 423, 'FIRM + PROGRAM + STAGE', 43)}${line(126, 463, 1070, 463, '#e8d189', 7)}
${rect(91, 522, 1018, 137)}${t(126, 582, 'OFFICIAL RULE SOURCE', 43)}${line(126, 622, 1070, 622, cyan, 7)}
${rect(91, 681, 1018, 137)}${t(126, 741, 'RESET TIME + TIME ZONE', 42)}${line(126, 781, 1070, 781, '#d4c2f5', 7)}
${rect(91, 840, 1018, 148, '#fff1eb')}${t(126, 904, 'RELEVANT RULE TODAY', 43)}${t(126, 959, 'NOT CHECKED YET', 42, red)}
${t(108, 1080, 'An empty answer is not a safe answer.', 38, red)}`);

const step2 = page('STEP 2 / KEEP THREE LINES APART', 'XAUUSD · LONDON', `
${t(105, 320, 'Fictional breakout journal entry', 40, muted)}
${rect(90, 369, 1020, 164, '#effbfb')}${t(124, 436, 'PLANNED LOSS', 43)}${t(808, 472, '$50', 76, ink)}
${rect(90, 555, 1020, 164, '#fff1ea')}${t(124, 622, 'ACTUAL NET LOSS', 43)}${t(806, 659, '$58', 76, red)}
${rect(90, 742, 1020, 194, '#f7f1ff')}${t(124, 810, 'FIRM STATUS', 43)}${t(124, 872, 'VERIFY WITH THE FIRM', 47, green)}
${line(121, 992, 1070, 992, '#f4c565', 18)}
${t(120, 1070, '$8 more lost than the plan.', 42, muted)}`);

const coverOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<rect x="73" y="68" width="1420" height="264" rx="31" fill="#fffaf0" fill-opacity="0.78"/>
${t(112, 146, 'FUNDED ACCOUNT JOURNAL', 46, muted)}
${t(111, 252, 'WHAT DID YOU CHECK?', 99, ink)}
${line(112, 290, 1424, 290, cyan, 19)}
</svg>`;

await sharp(path.resolve('scripts/assets/k14-funded-journal-cover-background.png'))
  .resize(1600, 900, { fit: 'cover' })
  .composite([{ input: Buffer.from(coverOverlay) }])
  .webp({ quality: 87 })
  .toFile(path.join(output, 'cover-forex-journal-funded-accounts-k14.webp'));

for (const [name, svg] of [
  ['funded-journal-step-1-check.webp', step1],
  ['funded-journal-step-2-entry.webp', step2],
]) {
  await sharp(Buffer.from(svg)).webp({ quality: 89 }).toFile(path.join(output, name));
}
