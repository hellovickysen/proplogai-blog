import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const out = path.resolve('public/images');
await mkdir(out, { recursive: true });

const ink = '#10214c';
const faded = '#635789';
const paper = '#fffaf0';
const cyan = '#58d9e8';
const violet = '#d7c9ff';
const yellow = '#ffe78d';
const green = '#187453';
const red = '#a3394b';
const font = 'Comic Sans MS, Segoe Print, Trebuchet MS, sans-serif';
const text = (x, y, value, size = 46, color = ink, weight = 600) =>
  `<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-size="${size}" font-weight="${weight}">${value}</text>`;
const box = (x, y, w, h, fill = '#fffdf8', stroke = ink, radius = 23) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="4"/>`;
const underline = (x1, y1, x2, y2, color = cyan, width = 13) =>
  `<path d="M${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 - 7} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
const paperLines = (height, width) => Array.from({ length: Math.ceil(height / 115) }, (_, i) =>
  `<path d="M0 ${120 + i * 115}H${width}" stroke="#d9e8e4" stroke-width="2"/>`).join('');
const holes = (height) => Array.from({ length: Math.floor(height / 180) }, (_, i) =>
  `<circle cx="35" cy="${115 + i * 180}" r="14" fill="#d7d1c5"/>`).join('');
const page = (label, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <rect width="1200" height="1200" fill="${paper}"/>${paperLines(1200, 1200)}${holes(1200)}
  ${box(67,38,1088,1115,'none','#cec8b9',28)}
  ${text(104,118,label,34,faded)}${text(104,214,title,69)}${underline(102,246,1094,246)}
  ${body}</svg>`;

const step1 = page('STEP 1 / BLANK WEEKLY SHEET', 'WHAT WILL I CHECK?', `
  ${text(108,322,'Use your journal, not memory.',43,faded)}
  ${box(92,382,1015,146)}${text(126,445,'1  WEEK + ACCOUNT',43)}${underline(125,482,1050,482,violet,9)}
  ${box(92,550,1015,146)}${text(126,614,'2  SETUP + WRITTEN RULE',43)}${underline(125,651,1050,651,cyan,9)}
  ${box(92,718,1015,146)}${text(126,781,'3  TRADES + $ RESULT',43)}${underline(125,818,1050,818,yellow,9)}
  ${box(92,886,1015,146)}${text(126,949,'4  PLAN COUNT + NEXT CHECK',43)}${underline(125,986,1050,986,violet,9)}
  ${text(113,1094,'Missing detail? Write: NOT RECORDED',39,red)}
`);

const trades = [
  ['MON', 'YES', '+$120'],
  ['TUE', 'EARLY', '+$75'],
  ['WED', 'YES', '-$60'],
  ['THU', 'YES', '+$90'],
  ['FRI A', 'EARLY', '-$80'],
  ['FRI B', 'YES', '+$50'],
];

const step2 = page('STEP 2 / READ THE RECORDS', 'XAUUSD · LONDON', `
  ${text(110,323,'Fictional week · one breakout plan',41,faded)}
  ${box(88,377,1025,626)}
  ${text(124,443,'TRADE',37)}${text(493,443,'PLAN?',37)}${text(836,443,'USD',37)}
  ${underline(120,465,1080,465,violet,8)}
  ${trades.map(([day, followed, result], i) => {
    const y = 548 + i * 86;
    const color = followed === 'EARLY' ? red : green;
    return `${text(128,y,day,42)}${text(500,y,followed,40,color)}${text(840,y,result,42,result.startsWith('-') ? red : ink)}${i<5?underline(122,y+20,1080,y+20,'#e5e1d8',3):''}`;
  }).join('')}
  ${text(110,1083,'4 of 6 followed plan  ·  result +$195',39,ink)}
`);

const step3 = page('STEP 3 / FINISH THE REVIEW', 'ONE WEEK · ONE CHECK', `
  ${box(91,310,1018,152,'#f1fcfc')}
  ${text(126,378,'Recorded result',42)}${text(720,388,'+$195',72,green)}
  ${box(91,484,1018,153)}
  ${text(126,555,'Followed the plan',42)}${text(752,568,'4 of 6',65,ink)}
  ${box(91,659,1018,166,'#fff3ed')}
  ${text(126,726,'Entered early',42)}${text(740,737,'2 of 6',65,red)}
  ${text(126,790,'TUE +$75     FRI A -$80',34,red)}
  ${box(91,851,1018,230,'#f9f5ff')}
  ${text(126,921,'NEXT WEEK, CHECK:',41,faded)}
  ${text(126,982,'Did I follow my own',46)}
  ${text(126,1042,'candle-close rule?',46)}
`);

const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <rect width="1600" height="900" fill="${paper}"/>${paperLines(900,1600)}${holes(900)}
  ${box(65,43,1470,820,'none','#cec8b9',32)}
  ${text(116,130,'XAUUSD · LONDON JOURNAL',41,faded)}
  ${text(116,241,'WEEKLY TRADING',97)}
  ${text(116,354,'REVIEW',108)}${underline(115,386,1460,386,cyan,17)}
  ${box(115,465,610,250,'#f1fcfc')}${box(805,465,610,250,'#fff3ed')}
  ${text(158,544,'FOLLOWED PLAN',53)}${text(850,544,'EARLY ENTRIES',53)}
  ${text(162,667,'4 of 6',104,green)}${text(865,667,'2 of 6',104,red)}
  ${text(125,807,'A positive record can still hide early entries.',43,faded)}
  </svg>`;

for (const [filename, svg] of [
  ['weekly-review-step-1-blank.webp', step1],
  ['weekly-review-step-2-records.webp', step2],
  ['weekly-review-step-3-complete.webp', step3],
  ['cover-weekly-trading-review-template-k10.webp', cover],
]) {
  await sharp(Buffer.from(svg)).webp({ quality: 89 }).toFile(path.join(out, filename));
}
