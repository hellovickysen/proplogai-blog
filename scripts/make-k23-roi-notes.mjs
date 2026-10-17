// Deterministic handwritten-style teaching notes: exact arithmetic stays editable here.
import sharp from 'sharp';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

const out = path.resolve('public/images');
await mkdir(out, { recursive: true });
const ink = '#14264b', muted = '#50627a', teal = '#117a79', red = '#ae4d5b', paper = '#fffaf0';
const font = 'Comic Sans MS, Segoe Print, Trebuchet MS, sans-serif';
const text = (x,y,value,size=42,color=ink,weight=650) => `<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-size="${size}" font-weight="${weight}">${value}</text>`;
const line = (x1,y1,x2,y2,color='#cbdedc',width=3) => `<path d="M${x1} ${y1} Q${(x1+x2)/2} ${(y1+y2)/2-4} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
const box = (x,y,w,h,fill='#fffefa',color=ink) => `<path d="M${x+18} ${y} L${x+w-17} ${y+3} Q${x+w} ${y+3} ${x+w} ${y+20} L${x+w-3} ${y+h-16} Q${x+w-4} ${y+h} ${x+w-20} ${y+h} L${x+19} ${y+h-2} Q${x} ${y+h-2} ${x} ${y+h-21} L${x+2} ${y+20} Q${x+2} ${y+2} ${x+18} ${y} Z" fill="${fill}" stroke="${color}" stroke-width="4"/>`;
const paperLines = (w,h) => `<rect width="${w}" height="${h}" fill="${paper}"/>${Array.from({length:Math.ceil(h/72)},(_,i)=>line(0,118+i*72,w,118+i*72,'#dbe7e3',2)).join('')}<path d="M73 0 V${h}" stroke="#efc3c5" stroke-width="3"/>`;
const note = (step,title,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${paperLines(1200,1200)}${box(42,36,1110,1124,'none')}${text(104,113,step,33,muted)}${text(104,202,title,64)}${line(102,229,1095,230,'#76dcdf',14)}${body}</svg>`;

const step1 = note('STEP 1 / ADD EVERY ATTEMPT','WHAT DID YOU PAY?',`${text(115,296,'Fictional prop-firm history',38,muted)}${[
  ['Challenge 1 · failed','$150'],['Challenge 2 · failed','$150'],['Reset for challenge 2','$75'],['Challenge 3 · passed','$200']
].map(([label,amount],i)=>{const y=342+i*151;return `${box(100,y,995,124,i%2?'#f5f8f4':'#fffefa')}${text(130,y+77,label,37)}${text(900,y+77,amount,44,red)}`}).join('')}${line(130,990,1054,990,ink,4)}${text(132,1063,'ALL COSTS',43)}${text(826,1063,'$575',62,teal)}${text(132,1121,'The failed attempts still cost money.',31,muted)}`);
const step2 = note('STEP 2 / SEPARATE STATUS','WHAT ARRIVED?',`${text(112,301,'Same fictional history · costs $575',38,muted)}${box(100,365,995,250,'#eaf9f1',teal)}${text(142,443,'PAYOUT RECEIVED',39,teal)}${text(142,545,'$600',85,ink)}${box(100,662,995,250,'#fff4ea',red)}${text(142,740,'SECOND PAYOUT · PENDING',36,red)}${text(142,842,'$300',78,ink)}${text(135,995,'Count $600 today.',52,teal)}${text(135,1068,'Add $300 only if it arrives.',43,red)}${text(135,1133,'Pending is not received.',34,muted)}`);
const step3 = note('STEP 3 / CALCULATE','TWO USEFUL NUMBERS',`${text(115,296,'Fictional amounts in USD',39,muted)}${box(102,358,995,266,'#f0fbf9',teal)}${text(140,433,'NET CASH',37,teal)}${text(140,510,'$600 − $575 = +$25',63)}${text(140,571,'What is left after counted costs',34,muted)}${box(102,675,995,268,'#fff3e8',ink)}${text(140,750,'ROI ON COUNTED COSTS',36,teal)}${text(140,825,'$25 ÷ $575 × 100',57)}${text(140,904,'= 4.35%',77,teal)}${text(128,1035,'This is a past cash result,',39)}${text(128,1090,'not a promise about your next account.',34,red)}`);

const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">${paperLines(1600,900)}<rect x="0" y="0" width="1600" height="142" fill="${ink}"/>${text(91,94,'PROP FIRM ROI',75,'#fffdf5')}${text(89,233,'Count every fee.',77)}${text(89,322,'Count money received.',68,teal)}${box(90,400,647,286,'#fffefa')}${text(128,468,'THREE CHALLENGES + RESET',32,muted)}${text(128,560,'−$575',82,red)}${text(128,629,'earlier costs included',34,muted)}${box(858,400,647,286,'#eefbf7',teal)}${text(897,468,'PAYOUT RECEIVED',36,teal)}${text(897,560,'+$600',82,ink)}${text(897,629,'pending money left out',34,muted)}${line(746,542,844,542,ink,10)}<path d="M826 524 l21 18 -21 18" fill="none" stroke="${ink}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>${box(455,730,690,113,'#fff4dd',ink)}${text(500,806,'+$25 net   ·   4.35% ROI',47,ink)}</svg>`;

for (const [name,svg] of [
  ['cover-prop-firm-roi-calculator-k23.webp',cover],
  ['prop-firm-roi-step-1-costs.webp',step1],
  ['prop-firm-roi-step-2-payout.webp',step2],
  ['prop-firm-roi-step-3-result.webp',step3],
]) {
  await sharp(Buffer.from(svg)).webp({quality:88}).toFile(path.join(out,name));
}
console.log('K23 WebP cover and three progressive learning notes written.');
