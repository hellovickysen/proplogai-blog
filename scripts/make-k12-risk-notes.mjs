import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('public/images');
await mkdir(output, { recursive: true });
const navy = '#10214c';
const teal = '#34bbcb';
const lavender = '#d3bbff';
const orange = '#f9bd70';
const red = '#a83e53';
const green = '#176d57';
const paper = '#fffbf2';
const grey = '#625d72';
const font = 'Comic Sans MS, Segoe Print, Trebuchet MS, sans-serif';
const text = (x, y, value, size = 47, color = navy) => `<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-size="${size}" font-weight="600">${value}</text>`;
const box = (x, y, width, height, fill = '#fffef9') => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="28" fill="${fill}" stroke="${navy}" stroke-width="4"/>`;
const stroke = (pathData, color = teal, width = 10) => `<path d="${pathData}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const background = (width, height) => `<rect width="${width}" height="${height}" fill="${paper}"/>${Array.from({length: Math.ceil(height / 106)}, (_, index) => `<path d="M0 ${122 + index * 106}H${width}" stroke="#dce9e8" stroke-width="2"/>`).join('')}${Array.from({length: Math.floor(height / 170)}, (_, index) => `<circle cx="31" cy="${107 + index * 170}" r="12" fill="#d8d1c5"/>`).join('')}`;
const note = (label, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${background(1200, 1200)}${box(65, 43, 1090, 1113, 'none')}${text(105, 119, label, 35, grey)}${text(105, 210, title, 66)}${stroke('M105 244 Q590 225 1090 245', teal, 15)}${body}</svg>`;

const questions = note('STEP 1  /  BEFORE THE ORDER', 'THREE RISK QUESTIONS', `
${box(96, 317, 1008, 186, '#f0fbfb')}${text(130, 385, '1  THIS TRADE', 49)}${text(130, 455, 'What loss am I planning?', 46)}
${box(96, 540, 1008, 186, '#f7f1ff')}${text(130, 608, '2  TODAY', 49)}${text(130, 678, 'What is already at risk?', 46)}
${box(96, 763, 1008, 186, '#fff2df')}${text(130, 831, '3  EXACT ACCOUNT', 49)}${text(130, 901, 'What does my rule allow?', 46)}
${stroke('M161 1032 Q640 1002 1048 1032', orange, 20)}${text(153, 1114, 'Unknown? Write NOT CHECKED.', 43, red)}`);

const actual = note('STEP 2  /  AFTER THE TRADE', 'PLAN vs RESULT', `
${text(108, 336, 'FICTIONAL XAUUSD · LONDON', 43, grey)}
${box(95, 390, 1010, 144, '#f0fbfb')}${text(135, 477, 'Planned loss', 49)}${text(829, 482, '$50', 73)}
${text(171, 620, '+ $5 worse fill', 53, red)}${text(171, 701, '+ $3 costs', 53, red)}
${stroke('M158 734 Q621 752 1040 736', navy, 7)}
${box(95, 785, 1010, 161, '#fff1e9')}${text(135, 875, 'Recorded loss', 53)}${text(809, 885, '$58', 75, red)}
${stroke('M164 1010 Q659 994 1047 1015', teal, 18)}${text(141, 1100, 'A stop is a plan, not a price promise.', 39, grey)}`);

const account = note('STEP 3  /  COMPLETE THE CHECK', 'ONE NOTE · 3 LEVELS', `
${box(93, 306, 1014, 172, '#f0fbfb')}${text(129, 376, 'TRADE', 47)}${text(130, 440, '$50 planned / $58 recorded', 43)}
${box(93, 510, 1014, 172, '#f7f1ff')}${text(129, 581, 'TODAY', 47)}${text(130, 645, 'Add closed + open exposure', 42)}
${box(93, 714, 1014, 186, '#fff0e8')}${text(129, 785, 'EXACT ACCOUNT', 46)}${text(130, 855, 'Reset time: NOT CHECKED', 44, red)}
${stroke('M118 953 Q602 932 1081 950', orange, 17)}${text(130, 1029, 'NEXT: Read the official rule page.', 43, green)}${text(131, 1092, 'Do not guess the missing answer.', 39, grey)}`);

const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">${background(1600, 900)}${box(67, 45, 1467, 811, 'none')}${text(117, 138, 'FOREX RISK MANAGEMENT', 47, grey)}${text(117, 273, 'BEFORE YOU TRADE', 107)}${stroke('M120 319 Q802 296 1461 324', teal, 20)}${box(117, 411, 419, 244, '#f0fbfb')}${box(587, 411, 419, 244, '#f7f1ff')}${box(1056, 411, 419, 244, '#fff2df')}${text(161, 500, '1  TRADE', 59)}${text(636, 500, '2  TODAY', 59)}${text(1102, 500, '3  RULE', 59)}${text(159, 589, '$ LOSS?', 54, green)}${text(633, 589, 'OPEN?', 54, navy)}${text(1102, 589, 'CHECK?', 54, red)}${text(126, 767, 'XAUUSD · LONDON SESSION · PLAN FIRST', 50, grey)}</svg>`;

for (const [name, svg] of [
  ['risk-management-step-1-questions.webp', questions],
  ['risk-management-step-2-planned-actual.webp', actual],
  ['risk-management-step-3-account.webp', account],
  ['cover-prop-firm-risk-management-k12.webp', cover],
]) {
  await sharp(Buffer.from(svg)).webp({ quality: 89 }).toFile(path.join(output, name));
}
