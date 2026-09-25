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
  'consistency-rule', 'daily-drawdown-limit', 'fomo', 'overall-drawdown-limit', 'overtrading', 'prop-firm-challenge', 'revenge-trading',
  'setup-compliance', 'trade-review', 'trading-journal',
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
  for (const match of body.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g)) {
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
  ['prop-firm-trading-journal.md', ['/glossary/trading-journal', '/blogs/prop-firm-pnl-calendar', '/blogs/tracking-trading-emotions']],
  ['forex-journal-funded-accounts.md', ['/blogs/prop-firm-trading-journal']],
  ['prop-firm-consistency-calculator.md', ['/glossary/consistency-rule', '/tools/consistency-calculator']],
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
  ['revenge-trading-prop-firm.md', ['/glossary/revenge-trading']],
  ['daily-drawdown-calculator.md', ['/glossary/daily-drawdown-limit', '/glossary/overall-drawdown-limit']],
  ['ai-trading-coach-prop-firm.md', ['/blogs/ai-journal-pattern-detection', '/blogs/ai-trading-discipline']],
]);
for (const [fileName, destinations] of requiredRelationships) {
  const source = await readFile(path.join(contentRoot, fileName), 'utf8');
  for (const destination of destinations) {
    if (!source.includes(`](${destination})`)) failures.push(`${fileName}: missing required relationship ${destination}`);
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
