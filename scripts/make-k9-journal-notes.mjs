import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const out = path.resolve('public/images');
await mkdir(out, { recursive: true });

const ink = '#10214c';
const muted = '#635789';
const paper = '#fffaf0';
const cyan = '#57dce8';
const violet = '#d6c7ff';
const yellow = '#ffe58a';
const green = '#187453';
const red = '#a63c50';
const font = 'Comic Sans MS, Segoe Print, Trebuchet MS, sans-serif';
const text = (x, y, value, size = 48, color = ink, weight = 600) =>
  `<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-size="${size}" font-weight="${weight}">${value}</text>`;
const box = (x, y, w, h, fill = '#fffdf7', stroke = ink, radius = 26) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="4"/>`;
const line = (x1, y1, x2, y2, color = ink, width = 5) =>
  `<path d="M${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 - 5} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
const page = (label, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <rect width="1200" height="1200" fill="${paper}"/>
  <path d="M0 105H1200 M0 375H1200 M0 645H1200 M0 915H1200" stroke="#dce7e3" stroke-width="2"/>
  ${box(36,35,1128,1130,'none','#d4c9b6',32)}
  ${text(88,125,label,34,muted)}
  ${text(88,215,title,67)}
  ${line(85,245,1100,245,cyan,15)}
  ${body}
  </svg>`;

const step1 = page('STEP 1 / ASK ONE QUESTION', 'XAUUSD · LONDON', `
  ${text(90,330,'Did I enter early after a loss?',48)}
  ${box(70,390,510,620)}${box(620,390,510,620)}
  ${text(105,470,'AFTER LOSS',48)}${text(655,470,'OTHER',48)}
  ${line(100,498,535,498,violet,12)}${line(650,498,1085,498,cyan,12)}
  ${['A1   YES','A2   YES','A3   YES  ?','A4   NO'].map((s,i)=>text(115,590+i*107,s,50,i===2?red:ink)).join('')}
  ${['B1   YES','B2   NO','B3   NO','B4   NO'].map((s,i)=>text(665,590+i*107,s,50)).join('')}
  ${text(90,1095,'8 fictional breakout records · early labels as first logged',34,muted)}
`);

const step2 = page('STEP 2 / COUNT THE LABELS', 'CHECK THE NUMBERS', `
  ${box(74,320,1052,190,'#eef9f9')}
  ${text(115,405,'Your journal first says:',45)}
  ${text(115,470,'A1, A2, A3 = early   ·   B1 = early',40,muted)}
  ${box(75,580,490,365)}${box(635,580,490,365)}
  ${text(110,660,'AFTER LOSS',44)}${text(670,660,'OTHER',44)}
  ${line(110,685,515,685,violet,12)}${line(670,685,1074,685,cyan,12)}
  ${text(125,825,'3 of 4',96,red)}${text(685,825,'1 of 4',96,green)}
  ${text(100,1070,'A count is a question to check, not a conclusion.',38,muted)}
`);

const step3 = page('STEP 3 / OPEN THE ORIGINAL NOTE', 'ONE LABEL WAS WRONG', `
  ${box(76,320,1048,230,'#eef9f9')}
  ${text(115,410,'A3: the candle had already closed.',47)}
  ${text(115,488,'Change its early label: YES  →  NO',48,red)}
  ${box(76,615,1048,270)}
  ${text(110,697,'AFTER LOSS',42)}${text(665,697,'OTHER',42)}
  ${text(120,815,'2 of 4',89,green)}${text(675,815,'1 of 4',89,green)}
  ${line(575,710,575,850,violet,5)}
  ${text(95,1015,'Check the record before you trust the summary.',40,muted)}
  ${line(95,1040,1030,1040,yellow,14)}
`);

const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="${paper}"/>
  <path d="M0 145H1600 M0 375H1600 M0 605H1600 M0 835H1600" stroke="#dce7e3" stroke-width="2"/>
  ${box(40,40,1520,820,'none','#d4c9b6',32)}
  ${text(90,132,'XAUUSD · LONDON JOURNAL',43,muted)}
  ${text(90,238,'CHECK THE JOURNAL',96)}
  ${line(92,270,1500,270,cyan,17)}
  ${box(88,330,665,390)}${box(835,330,665,390)}
  ${text(130,410,'AFTER A LOSS',58)}${text(875,410,'OTHER TRADES',58)}
  ${text(138,515,'A1   A2   A3   A4',52)}${text(888,515,'B1   B2   B3   B4',52)}
  ${text(138,630,'YES  YES  ?  NO',53,red)}${text(888,630,'YES  NO  NO  NO',51,green)}
  ${text(94,800,'One wrong label changes the story.',51,muted)}
  </svg>`;

for (const [filename, svg] of [
  ['ai-journal-pattern-step-1-records.webp', step1],
  ['ai-journal-pattern-step-2-count.webp', step2],
  ['ai-journal-pattern-step-3-correct.webp', step3],
  ['cover-ai-journal-pattern-detection-k9.webp', cover],
]) {
  await sharp(Buffer.from(svg)).webp({ quality: 89 }).toFile(path.join(out, filename));
}
