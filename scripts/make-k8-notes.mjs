import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

const out = path.resolve('public/images');
await mkdir(out, { recursive: true });
const navy = '#10214c';
const paper = '#fffaf0';
const cyan = '#5cdeeb';
const violet = '#c4afff';
const yellow = '#ffe58a';
const font = 'Comic Sans MS, Segoe Print, Trebuchet MS, sans-serif';
const line = (x1,y1,x2,y2,color=navy,width=4) => `<path d="M${x1} ${y1} Q ${(x1+x2)/2} ${(y1+y2)/2-3} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
const txt = (x,y,s,size=39,color=navy,weight=600) => `<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-size="${size}" font-weight="${weight}">${s}</text>`;
const box = (x,y,w,h,fill='none',stroke=navy) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${fill}" stroke="${stroke}" stroke-width="4"/>`;
const base = (step,title,inside) => `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000"><rect width="1000" height="1000" fill="${paper}"/><path d="M0 72H1000 M0 312H1000 M0 552H1000 M0 792H1000" stroke="#dce6e5" stroke-width="2"/><rect x="32" y="35" width="936" height="930" rx="30" fill="none" stroke="#d3c9b6" stroke-width="3"/>${txt(76,120,step,28,'#6d5b9d')}${txt(76,190,title,60)}${line(76,215,875,215,cyan,13)}${inside}</svg>`;
const panels = [
  ['ai-discipline-step-1-plan.webp',base('STEP 1 / WRITE THE PLAN','XAUUSD · LONDON',
    `${box(75,265,850,335,'#fffdf7')}${txt(112,340,'BREAKOUT ENTRY',43)}${txt(112,420,'Wait for candle to CLOSE',42)}${txt(112,482,'beyond the marked level.',42)}${line(130,535,822,535,violet,11)}${txt(93,690,'Before entry:',39)}${box(92,725,52,52,'none',navy)}${txt(171,767,'Has the candle closed?',41)}${txt(93,870,'Plan first. Result later.',38,'#6d5b9d')}`)],
  ['ai-discipline-step-2-trades.webp',base('STEP 2 / COMPARE TWO RECORDS','DECISION ≠ RESULT',
    `${box(68,272,864,255,'#fffdf7')}${txt(100,335,'TRADE A',42)}${txt(100,400,'Confirmation: YES',38)}${txt(100,467,'Result: −$50',40,'#a83245')}${box(68,557,864,255,'#fffdf7')}${txt(100,620,'TRADE B',42)}${txt(100,685,'Confirmation: NO',38)}${txt(100,752,'Result: +$80',40,'#21775b')}${txt(93,898,'A followed plan. B skipped it.',38,'#6d5b9d')}`)],
  ['ai-discipline-step-3-review.webp',base('STEP 3 / CHECK THE JOURNAL','REVIEW, THEN DECIDE',
    `${box(72,265,856,210,'#fffdf7')}${txt(104,335,'Planned loss: −$50',40)}${txt(104,408,'Unplanned win: +$80',40)}${line(104,440,838,440,yellow,14)}${box(72,510,856,270,'#fffdf7')}${txt(104,580,'Ask your journal:',42)}${txt(104,648,'When did I enter before',38)}${txt(104,705,'my own confirmation?',38)}${txt(90,878,'Check the original trade notes.',37,'#6d5b9d')}`)]
];
for (const [name,svg] of panels) {
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(path.join(out,name));
}
const coverSource = process.argv[2];
if (coverSource) {
  await sharp(coverSource).resize(1600,900,{fit:'cover'}).webp({quality:86}).toFile(path.join(out,'cover-ai-trading-discipline-k8.webp'));
}
