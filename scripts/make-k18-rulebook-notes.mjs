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
const page = (step, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${pageBg}${box(58, 38, 1090, 1120, 'none')}${text(98, 108, step, 33, muted)}${text(98, 202, title, 62)}${line(100, 240, 1070, 240)}${body}</svg>`;

const vague = page('STEP 1 / THE VAGUE NOTE', 'WHAT DOES “GOOD” MEAN?', `
${text(106, 312, 'Fictional XAUUSD · London · breakout', 38, muted)}
${box(94, 364, 1013, 229, '#fff5dc')}${text(130, 438, 'MY OLD RULE', 39, violet)}${text(130, 511, '“Only take good breakouts.”', 51)}
${line(130, 661, 1030, 661, '#e5c75d', 18)}
${text(107, 770, 'Price moves beyond my level.', 48)}
${text(107, 845, 'The candle is still open.', 48)}
${box(94, 913, 1013, 148, '#fff0ef')}${text(130, 1009, 'Do I enter or wait?', 52, red)}
${text(105, 1115, 'This sentence does not answer.', 39, muted)}`);

const written = page('STEP 2 / WRITE THE CHECK', 'MY RULE, VERSION 1', `
${text(106, 314, 'Fictional XAUUSD London breakout', 39, muted)}
${box(94, 364, 1013, 496, '#f0fbf8')}
${text(130, 433, '1  Mark my level before the session', 43)}
${text(130, 516, '2  Wait for the candle to close', 43)}
${text(130, 587, '    beyond that level', 43)}
${text(130, 671, '3  Write my stop and check size', 43)}
${text(130, 742, '    before any entry', 43)}
${line(129, 790, 1030, 790, cyan, 15)}
${text(130, 836, 'If a check is missing: no setup yet.', 42, teal)}
${box(94, 897, 1013, 154, '#fff5dc')}
${text(130, 966, 'These are this trader’s own checks,', 40)}
${text(130, 1022, 'not a firm rule or trade signal.', 40)}
${text(105, 1118, 'Firm terms are checked separately.', 38, muted)}`);

const reviewed = page('STEP 3 / DECIDE AND RECORD', 'CHECK THE WRITTEN RULE', `
${text(106, 310, 'Candle still open? Check incomplete.', 41, muted)}
${box(94, 359, 1013, 188, '#f0fbf8')}
${text(130, 428, 'RULE', 38, teal)}
${text(130, 493, 'Wait for the candle to close.', 47)}
${box(94, 578, 1013, 195, '#fff2ee')}
${text(130, 645, 'RECORD A · EARLY ENTRY', 37, red)}
${text(130, 710, 'Rule: NO    Net P&amp;L: +$28', 43)}
${box(94, 802, 1013, 195, '#eff9f5')}
${text(130, 869, 'RECORD B · CHECKS COMPLETE', 37, teal)}
${text(130, 934, 'Rule: YES   Net P&amp;L: −$22', 43)}
${line(130, 1055, 1030, 1055, '#e5c75d', 17)}
${text(106, 1120, 'A result cannot rewrite the old rule.', 38)}`);

const coverOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<rect x="60" y="24" width="1480" height="222" rx="32" fill="#fffaf0" fill-opacity="0.91"/>
${text(99, 107, 'TRADING RULEBOOK', 64)}
${text(99, 207, 'WRITE A RULE YOU CAN CHECK', 76)}
${line(100, 236, 1470, 236, cyan, 17)}
</svg>`;

await sharp(path.resolve('scripts/assets/k18-rulebook-cover-background.png'))
  .resize(1600, 900, { fit: 'cover' })
  .composite([{ input: Buffer.from(coverOverlay) }])
  .webp({ quality: 87 })
  .toFile(path.join(out, 'cover-prop-firm-trading-rulebook-k18.webp'));

for (const [filename, svg] of [
  ['rulebook-step-1-vague.webp', vague],
  ['rulebook-step-2-written.webp', written],
  ['rulebook-step-3-review.webp', reviewed],
]) {
  await sharp(Buffer.from(svg)).webp({ quality: 89 }).toFile(path.join(out, filename));
}

console.log('K18 cover and three progressive learning notes written.');
