import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const out = path.resolve('public/images');
await mkdir(out, { recursive: true });
const navy = '#14264b', muted = '#536071', teal = '#166f70', red = '#a34152';
const font = 'Comic Sans MS, Segoe Print, Trebuchet MS, sans-serif';
const t = (x, y, s, size = 43, color = navy) => `<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-size="${size}" font-weight="600">${s}</text>`;
const rect = (x, y, w, h, fill = '#fffdf7') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="${fill}" stroke="${navy}" stroke-width="4"/>`;
const bg = `<rect width="1200" height="1200" fill="#fffaf0"/>${Array.from({length:13},(_,i)=>`<path d="M0 ${142+i*83} H1200" stroke="#dce8e5" stroke-width="2"/>`).join('')}`;
const page = (step, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${bg}${rect(55,35,1090,1130,'none')}${t(100,103,step,32,muted)}${t(100,192,title,59)}<path d="M100 226 Q600 216 1090 230" fill="none" stroke="#72dce3" stroke-width="14" stroke-linecap="round"/>${body}</svg>`;

const days = [
  ['MON','−$40','2 trades','#fcefed'], ['TUE','+$75','3 trades','#e8faf3'],
  ['WED','−$110','4 trades','#fcefed'], ['THU','$0','0 trades','#f5f1e8'],
  ['FRI','+$35','2 trades','#e8faf3']
];
const cards = days.map(([day,pnl,trades,color],i)=>{
  const x=90+(i%2)*520, y=315+Math.floor(i/2)*215;
  return `${rect(x,y,480,180,color)}${t(x+28,y+58,day,36)}${t(x+255,y+65,pnl,46,pnl.includes('−')?red:teal)}${t(x+29,y+132,trades,32,muted)}`;
}).join('');
const first = page('STEP 1 / SEE THE WEEK','DAYS ARE RESULTS',`${t(100,278,'Fictional XAUUSD · London breakout',37,muted)}${cards}${t(100,1054,'Week: −$40 · 11 trades',43)}${t(100,1116,'Open Wednesday. Colour is not a verdict.',36,red)}`);
const rows=[['1','−$30','AFTER CLOSE','YES'],['2','−$20','BEFORE CLOSE','NO'],['3','−$35','AFTER CLOSE','YES'],['4','−$25','BEFORE CLOSE','NO']];
const second = page('STEP 2 / OPEN WEDNESDAY','FOUR TRADE RECORDS',`${t(100,286,'Written check: wait for candle close',37,muted)}${rows.map(([n,pnl,entry,follow],i)=>{const y=335+i*172;return `${rect(90,y,1020,145,i%2?'#fdf0ee':'#edfaf7')}${t(120,y+88,n,51)}${t(240,y+88,pnl,44,red)}${t(480,y+88,entry,35)}${t(930,y+88,follow,40,follow==='YES'?teal:red)}`}).join('')}${t(105,1080,'−$110 total · 2 of 4 followed',42)}${t(105,1130,'Reasons for early entries: not recorded',31,muted)}`);
const third = page('STEP 3 / WRITE ONE NOTE','WEDNESDAY REVIEW',`${t(104,286,'Fictional XAUUSD · London breakout',37,muted)}${rect(90,326,1020,750,'#fffefa')}${t(126,404,'RESULT',33,teal)}${t(126,462,'−$110 · 4 trades · fees not recorded',39)}${t(126,561,'MY CHECK',33,teal)}${t(126,619,'Wait for the candle close',42)}${t(126,718,'WHAT I SAW',33,teal)}${t(126,776,'2 followed · 2 entered early',41)}${t(126,856,'Missing: reasons for trades 2 and 4',34,red)}${t(126,957,'NEXT QUESTION',33,teal)}${t(126,1017,'Did I wait for my planned close?',38)}${t(106,1136,'A record, not a verdict about the market.',32,muted)}`);

// Generated art provides only texture/geometry. All words and figures are exact SVG overlay.
const coverOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">${t(72,99,'P&amp;L CALENDAR',71,'#ffffff')}${t(72,172,'READ THE DAY',68,'#ffffff')}${t(72,241,'BEHIND THE COLOUR',55,'#ffffff')}${t(920,529,'−$110',47,red)}</svg>`;
await sharp(path.resolve('scripts/assets/k22-pnl-calendar-cover-background.png')).resize(1600,900,{fit:'cover'}).composite([{input:Buffer.from(coverOverlay)}]).webp({quality:87}).toFile(path.join(out,'cover-prop-firm-pnl-calendar-k22.webp'));
for (const [name,svg] of [['pnl-calendar-step-1-days.webp',first],['pnl-calendar-step-2-trades.webp',second],['pnl-calendar-step-3-note.webp',third]]) {
  await sharp(Buffer.from(svg)).webp({quality:88}).toFile(path.join(out,name));
}
console.log('K22 cover and three learning notes written.');
