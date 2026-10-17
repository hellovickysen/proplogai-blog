import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const out = path.resolve('public/images');
await mkdir(out, { recursive: true });
const ink = '#10214c', paper = '#fffaf0', cyan = '#55d8e7', yellow = '#ffe68e', red = '#a2394b', green = '#197651', muted = '#625b79';
const font = 'Comic Sans MS, Segoe Print, Trebuchet MS, sans-serif';
const t = (x,y,s,size=47,color=ink) => `<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-weight="600" font-size="${size}">${s}</text>`;
const b = (x,y,w,h,color='#fffdf8') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="${color}" stroke="${ink}" stroke-width="4"/>`;
const line = (x1,y1,x2,y2,color=cyan,width=11) => `<path d="M${x1} ${y1}Q${(x1+x2)/2} ${y1-7} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
const ruled = (w,h) => `<rect width="${w}" height="${h}" fill="${paper}"/>${Array.from({length:Math.ceil(h/115)},(_,i)=>`<path d="M0 ${120+i*115}H${w}" stroke="#dbe8e6" stroke-width="2"/>`).join('')}${Array.from({length:Math.floor(h/170)},(_,i)=>`<circle cx="34" cy="${112+i*170}" r="13" fill="#d7d1c5"/>`).join('')}`;
const page = (label,title,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${ruled(1200,1200)}${b(66,42,1088,1114,'none')}${t(104,118,label,34,muted)}${t(104,211,title,65)}${line(102,245,1090,245)}${body}</svg>`;

const blank = page('STEP 1 / BEFORE YOU PAY','WHAT DO I KNOW?',`
${t(107,323,'Write an honest answer on each line.',40,muted)}
${b(91,375,1018,148)}${t(125,439,'1  EXACT PROGRAM + RULE PAGE',42)}${line(124,481,1069,481,'#d7c9ff',8)}
${b(91,546,1018,148)}${t(125,612,'2  LOSS METHOD + RESET TIME',41)}${line(124,651,1069,651,cyan,8)}
${b(91,717,1018,148)}${t(125,783,'3  MY PLAN + TRADE RECORDS',42)}${line(124,823,1069,823,yellow,8)}
${b(91,888,1018,148)}${t(125,953,'4  ONE MISSING ANSWER',42)}${line(124,994,1069,994,'#d7c9ff',8)}
${t(110,1099,'Use NOT CHECKED or NOT RECORDED.',36,red)}`);

const rows = [['1','YES','+$80'],['2','YES','-$50'],['3','EARLY','+$45'],['4','YES','-$60']];
const trades = page('STEP 2 / READ YOUR RECORDS','XAUUSD · LONDON',`
${t(106,316,'Fictional breakout trades',40,muted)}${b(91,356,1018,582)}
${t(125,423,'TRADE',38)}${t(454,423,'PLAN?',38)}${t(828,423,'USD',38)}${line(120,454,1070,454,'#d7c9ff',8)}
${rows.map(([n,plan,result],i)=>{const y=552+i*112;return `${t(131,y,n,52)}${t(455,y,plan,47,plan==='EARLY'?red:green)}${t(824,y,result,50,result.startsWith('-')?red:ink)}${i<3?line(120,y+26,1070,y+26,'#e4e0d7',3):''}`}).join('')}
${b(92,977,1016,121,'#fff0ec')}${t(126,1051,'+$45 WON, BUT THE ENTRY WAS EARLY',38,red)}`);

const filled = page('STEP 3 / FILL THE SHEET','WHAT IS MISSING?',`
${b(91,311,1018,157,'#f1fcfc')}${t(126,378,'Recorded USD total',41)}${t(786,392,'+$15',69,green)}
${b(91,493,1018,157)}${t(126,564,'Followed own rule',41)}${t(813,577,'3 / 4',66)}
${b(91,675,1018,157,'#fff1ed')}${t(126,742,'Daily reset time',40)}${t(725,754,'UNKNOWN',45,red)}
${b(91,857,1018,219,'#f8f4ff')}${t(126,925,'NEXT CHECK:',39,muted)}${t(126,988,'Open the exact program rules.',41)}${t(126,1044,'Review the early entry.',41)}`);

const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">${ruled(1600,900)}${b(66,43,1468,816,'none')}${t(115,139,'PROP FIRM CHALLENGE',47,muted)}${t(115,282,'READY TO PAY?',117)}${line(113,329,1430,329,cyan,18)}${b(113,425,627,253,'#f1fcfc')}${b(825,425,627,253,'#fff3e2')}${t(159,505,'EXACT RULES?',59)}${t(869,505,'YOUR RECORDS?',55)}${t(159,619,'CHECK',78,green)}${t(870,619,'CHECK',78,ink)}${t(120,792,'One missing answer is worth finding first.',47,muted)}</svg>`;

for (const [name,svg] of [
  ['challenge-readiness-step-1-blank.webp',blank],
  ['challenge-readiness-step-2-trades.webp',trades],
  ['challenge-readiness-step-3-filled.webp',filled],
  ['cover-prop-firm-challenge-readiness-k11.webp',cover],
]) await sharp(Buffer.from(svg)).webp({quality:89}).toFile(path.join(out,name));
