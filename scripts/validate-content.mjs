import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contentRoot = path.join(root, 'src', 'content', 'blog');
const scanRoots = [path.join(root, 'src'), path.join(root, 'public')];
const failures = [];

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(fullPath) : [fullPath];
  }));
  return files.flat();
}

function relative(file) {
  return path.relative(root, file).replaceAll('\\', '/');
}

function bodyAfterFrontmatter(source) {
  if (!source.startsWith('---')) return source;
  const end = source.indexOf('\n---', 3);
  return end === -1 ? source : source.slice(end + 4);
}

const articles = (await filesUnder(contentRoot))
  .filter((file) => /\.(md|mdx)$/i.test(file) && path.basename(file) !== '_template.md');
const articleSlugs = new Set(articles.map((file) => path.basename(file, path.extname(file))));
const approvedGlossarySlugs = new Set([
  'average-win-vs-average-loss', 'consistency-rule', 'daily-drawdown-limit', 'drawdown', 'equity-curve', 'expectancy', 'fomo', 'funded-account', 'overall-drawdown-limit', 'overtrading', 'performance-report', 'profit-factor', 'profit-target', 'prop-firm-challenge', 'revenge-trading', 'sharpe-ratio', 'win-rate',
  'emotion-tracking', 'rule-based-trading', 'setup-compliance', 'tilt', 'trade-review', 'trading-journal', 'trading-plan',
]);

for (const file of articles) {
  const source = await readFile(file, 'utf8');
  const body = bodyAfterFrontmatter(source);
  const lines = body.split(/\r?\n/);
  const heading = lines.findIndex((line) => /^#\s+/.test(line));
  if (heading !== -1) {
    failures.push(`${relative(file)}: body contains an H1 (line ${heading + 1} after frontmatter)`);
  }
  const title = source.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1];
  const firstContent = lines.find((line) => line.trim());
  const firstHeading = firstContent?.match(/^#{1,6}\s+(.*)$/)?.[1];
  if (title && firstHeading === title) {
    failures.push(`${relative(file)}: body repeats the frontmatter title as its first heading`);
  }
  const published = source.match(/^date:\s*(\d{4}-\d{2}-\d{2})\s*$/m)?.[1];
  const modified = source.match(/^updatedDate:\s*(\d{4}-\d{2}-\d{2})\s*$/m)?.[1];
  if (!published) failures.push(`${relative(file)}: missing ISO publication date`);
  if (modified && published && modified < published) {
    failures.push(`${relative(file)}: updatedDate precedes date`);
  }
  for (const match of body.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g)) {
    const href = match[1];
    if (href.length > 1 && href.endsWith('/')) failures.push(`${relative(file)}: internal link has a trailing slash: ${href}`);
    if (href.startsWith('/blogs/downloads/')) {
      const assetPath = path.join(root, 'public', href.slice('/blogs/'.length).split(/[?#]/)[0]);
      try {
        await readFile(assetPath);
      } catch {
        failures.push(`${relative(file)}: unknown download destination ${href}`);
      }
      continue;
    }
    if (href.startsWith('/blogs/')) {
      const slug = href.slice('/blogs/'.length).split(/[?#]/)[0];
      if (!articleSlugs.has(slug)) failures.push(`${relative(file)}: unknown blog destination ${href}`);
    }
    if (href.startsWith('/glossary/')) {
      const slug = href.slice('/glossary/'.length).split(/[?#]/)[0];
      if (!approvedGlossarySlugs.has(slug)) failures.push(`${relative(file)}: unverified glossary destination ${href}`);
    }
  }
}

const requiredRelationships = new Map([
  ['prop-firm-expense-tracking-guide.mdx', [
    '/glossary/funded-account',
    '/blogs/prop-firm-trading-journal',
    '/blogs/prop-firm-roi-calculator',
  ]],
  ['prop-firm-trading-journal.mdx', ['/glossary/trading-journal', '/blogs/prop-firm-pnl-calendar', '/glossary/emotion-tracking']],
  ['forex-journal-funded-accounts.md', ['/blogs/prop-firm-trading-journal']],
  ['prop-firm-consistency-calculator.mdx', [
    '/glossary/consistency-rule',
    '/tools/consistency-calculator',
    '/glossary/profit-target',
    '/glossary/daily-drawdown-limit',
    '/glossary/overall-drawdown-limit',
    '/blogs/prop-firm-challenge-readiness',
    '/glossary/trading-journal',
  ]],
  ['overtrading-prop-firm-challenges.mdx', [
    '/glossary/overtrading',
    '/glossary/prop-firm-challenge',
    '/blogs/trading-discipline-prop-firm',
    '/glossary/trade-review',
    '/glossary/setup-compliance',
    '/glossary/revenge-trading',
    '/glossary/fomo',
    '/blogs/trading-journal-template',
  ]],
  ['revenge-trading-prop-firm.mdx', [
    '/glossary/revenge-trading',
    '/glossary/tilt',
    '/glossary/overtrading',
    '/glossary/emotion-tracking',
    '/glossary/trading-plan',
    '/glossary/setup-compliance',
    '/glossary/trade-review',
    '/blogs/trading-psychology-prop-firm',
    '/blogs/tracking-trading-emotions',
    '/blogs/overtrading-prop-firm-challenges',
    '/blogs/trading-journal-template',
  ]],
  ['daily-drawdown-calculator.mdx', [
    '/glossary/daily-drawdown-limit',
    '/glossary/overall-drawdown-limit',
    '/glossary/drawdown',
    '/blogs/prop-firm-risk-management',
    '/glossary/trading-journal',
    '/blogs/overtrading-prop-firm-challenges',
  ]],
  ['ai-trading-coach-prop-firm.md', ['/blogs/ai-journal-pattern-detection', '/blogs/ai-trading-discipline']],
  ['trading-performance-metrics.mdx', [
    '/glossary/win-rate',
    '/glossary/average-win-vs-average-loss',
    '/glossary/profit-factor',
    '/glossary/expectancy',
    '/glossary/drawdown',
    '/glossary/equity-curve',
    '/glossary/performance-report',
    '/blogs/trading-journal-template',
    '/blogs/prop-firm-trading-journal',
    '/blogs/weekly-trading-review-template',
    '/blogs/monthly-trading-review-template',
    '/blogs/prop-firm-pnl-calendar',
  ]],
  ['trading-expectancy-calculator.mdx', [
    '/blogs/trading-performance-metrics',
    '/glossary/expectancy',
    '/glossary/win-rate',
    '/glossary/average-win-vs-average-loss',
    '/glossary/profit-factor',
    '/blogs/trading-journal-template',
    '/blogs/prop-firm-trading-journal',
    '/blogs/weekly-trading-review-template',
    '/blogs/monthly-trading-review-template',
  ]],
  ['trading-discipline-checklist.mdx', [
    '/blogs/trading-discipline-prop-firm',
    '/blogs/prop-firm-trading-rulebook',
    '/blogs/prop-firm-rules-guide',
    '/blogs/revenge-trading-prop-firm',
    '/blogs/overtrading-prop-firm-challenges',
    '/blogs/trading-journal-template',
    '/glossary/trading-plan',
    '/glossary/setup-compliance',
    '/glossary/rule-based-trading',
    '/glossary/revenge-trading',
    '/glossary/fomo',
  ]],
]);
for (const [fileName, destinations] of requiredRelationships) {
  const source = await readFile(path.join(contentRoot, fileName), 'utf8');
  for (const destination of destinations) {
    const relativeLink = `](${destination})`;
    const liveLink = `](https://proplogai.com${destination})`;
    if (!source.includes(relativeLink) && !source.includes(liveLink)) {
      failures.push(`${fileName}: missing required relationship ${destination}`);
    }
  }
}

const requiredAssets = new Map([
  ['prop-firm-expense-tracking-guide.mdx', [
    '/blogs/downloads/prop-firm-expense-log-template.csv',
  ]],
  ['how-emotions-affect-trading-decisions.mdx', [
    '/blogs/trading-psychology-prop-firm',
    '/blogs/tracking-trading-emotions',
    '/glossary/emotion-tracking',
    '/glossary/fomo',
    '/glossary/revenge-trading',
    '/blogs/overtrading-prop-firm-challenges',
  ]],
  ['overtrading-prop-firm-challenges.mdx', [
    '/blogs/images/overtrading-step-1-plan.webp',
    '/blogs/images/overtrading-step-2-trade.webp',
    '/blogs/images/overtrading-step-3-urge.webp',
    '/blogs/images/overtrading-full-review.webp',
  ]],
  ['how-emotions-affect-trading-decisions.mdx', [
    '/blogs/images/emotion-decision-step-1-plan.webp',
    '/blogs/images/emotion-decision-step-2-result.webp',
    '/blogs/images/emotion-decision-step-3-urge.webp',
    '/blogs/images/emotion-decision-full-review.webp',
  ]],
  ['daily-drawdown-calculator.mdx', [
    '/blogs/images/cover-daily-drawdown-calculator.webp',
  ]],
  ['prop-firm-consistency-calculator.mdx', [
    '/blogs/images/cover-prop-firm-consistency-calculator.webp',
    '/blogs/images/consistency-ratio-loss-note.webp',
    '/blogs/images/consistency-day-vs-trade-note.webp',
    '/blogs/images/consistency-ratio-change-example.webp',
    '/blogs/images/consistency-breach-decision-note.webp',
  ]],
  ['trading-performance-metrics.mdx', [
    '/blogs/images/cover-trading-performance-metrics.webp',
    '/blogs/images/trading-performance-step-1-sample.webp',
    '/blogs/images/trading-performance-step-2-win-size.webp',
    '/blogs/images/trading-performance-step-3-metrics.webp',
    '/blogs/images/trading-performance-final-check.webp',
  ]],
  ['trading-expectancy-calculator.mdx', [
    '/blogs/images/cover-trading-expectancy-calculator.webp',
    '/blogs/images/trading-expectancy-formula-note.webp',
  ]],
  ['trading-discipline-checklist.mdx', [
    '/blogs/images/cover-trading-discipline-checklist.webp',
    '/blogs/images/trading-discipline-checklist-step-1-session.webp',
    '/blogs/images/trading-discipline-checklist-step-2-wait.webp',
    '/blogs/images/trading-discipline-checklist-step-3-after-loss.webp',
    '/blogs/images/trading-discipline-checklist-full-outcome-guide.webp',
  ]],
  ['revenge-trading-prop-firm.mdx', [
    '/blogs/images/cover-revenge-trading-prop-firm.webp',
    '/blogs/images/revenge-trading-step-1-plan.webp',
    '/blogs/images/revenge-trading-step-2-urge.webp',
    '/blogs/images/revenge-trading-step-3-check.webp',
    '/blogs/images/revenge-trading-full-check.webp',
  ]],
]);
for (const [fileName, assets] of requiredAssets) {
  const source = await readFile(path.join(contentRoot, fileName), 'utf8');
  for (const asset of assets) {
    if (!source.includes(asset)) failures.push(`${fileName}: missing required teaching image ${asset}`);
    const assetPath = path.join(root, 'public', asset.slice('/blogs/'.length));
    try {
      await readFile(assetPath);
    } catch {
      failures.push(`${fileName}: missing teaching image file ${asset}`);
    }
  }
}

for (const file of articles.filter((item) => path.basename(item) !== 'trading-journal-benefits.md')) {
  const source = await readFile(file, 'utf8');
  if (source.includes('](/blogs/trading-journal-benefits)')) {
    failures.push(`${relative(file)}: still links to the journal consolidation candidate`);
  }
}

const forbiddenBrands = [
  /\bPropLog AI\b/g,
  /\bPropol AI(?: Coach)?\b/g,
  /\bPropol Coach\b/g,
  /\bPROPLOG AI\b/g,
];

for (const scanRoot of scanRoots) {
  for (const file of await filesUnder(scanRoot)) {
    if (!/\.(astro|html|js|jsx|json|md|mdx|svg|ts|tsx|txt|xml)$/i.test(file)) continue;
    const source = await readFile(file, 'utf8');
    const lines = source.split(/\r?\n/);
    for (const [index, line] of lines.entries()) {
      for (const pattern of forbiddenBrands) {
        pattern.lastIndex = 0;
        if (pattern.test(line)) failures.push(`${relative(file)}:${index + 1}: legacy brand spelling`);
      }
    }
  }
}

if (failures.length) {
  console.error(`Content validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Content validation passed: ${articles.length} published articles with valid date metadata, no body H1s, no legacy brand spellings.`);
