import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.join(process.cwd(), 'dist');
const failures = [];

function structuredDataFrom(html, file) {
  const blocks = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const nodes = [];
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block[1]);
      nodes.push(...(Array.isArray(parsed['@graph']) ? parsed['@graph'] : [parsed]));
    } catch {
      failures.push(`${file}: invalid JSON-LD`);
    }
  }
  return nodes;
}

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(fullPath) : [fullPath];
  }));
  return files.flat();
}

const pages = (await filesUnder(root)).filter((file) => file.endsWith('index.html') && file !== path.join(root, 'index.html'));
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const relativeFile = path.relative(root, file);
  const slug = relativeFile.split(path.sep)[0];
  const expectedCanonical = `https://proplogai.com/blogs/${slug}`;
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) failures.push(`${relativeFile}: expected 1 H1, found ${h1Count}`);
  if (/PropLog AI|Propol AI|Propol Coach|PROPLOG AI/i.test(html)) failures.push(`${relativeFile}: legacy brand spelling`);
  if (!/<time\s+datetime="\d{4}-\d{2}-\d{2}"/i.test(html)) failures.push(`${relativeFile}: missing visible ISO date`);
  if (!/<meta\s+property="article:published_time"\s+content="\d{4}-\d{2}-\d{2}"/i.test(html)) failures.push(`${relativeFile}: missing article:published_time`);
  if (!html.includes(`<link rel="canonical" href="${expectedCanonical}">`)) failures.push(`${relativeFile}: canonical must match the no-slash public URL`);
  if (!html.includes(`<meta property="og:url" content="${expectedCanonical}">`)) failures.push(`${relativeFile}: og:url must match the no-slash public URL`);
  const nodes = structuredDataFrom(html, relativeFile);
  const types = new Set(nodes.flatMap((node) => Array.isArray(node['@type']) ? node['@type'] : [node['@type']]));
  if (!types.has('BlogPosting')) failures.push(`${relativeFile}: missing BlogPosting schema`);
  if (!types.has('BreadcrumbList')) failures.push(`${relativeFile}: missing BreadcrumbList schema`);
  const article = nodes.find((node) => node['@type'] === 'BlogPosting');
  if (article && (!article.headline || !article.description || !/^\d{4}-\d{2}-\d{2}$/.test(article.datePublished ?? '') || !article.mainEntityOfPage)) {
    failures.push(`${relativeFile}: incomplete BlogPosting schema`);
  }
  const breadcrumbs = nodes.find((node) => node['@type'] === 'BreadcrumbList');
  if (breadcrumbs && (!Array.isArray(breadcrumbs.itemListElement) || breadcrumbs.itemListElement.length !== 3)) {
    failures.push(`${relativeFile}: BreadcrumbList must contain 3 items`);
  }
}

if (pages.length === 0) failures.push('expected at least one article page');

const collectionHtml = await readFile(path.join(root, 'index.html'), 'utf8');
if (!collectionHtml.includes('<link rel="canonical" href="https://proplogai.com/blogs">')) failures.push('index.html: canonical must use the no-slash public URL');
const collectionNodes = structuredDataFrom(collectionHtml, 'index.html');
const collection = collectionNodes.find((node) => node['@type'] === 'CollectionPage');
if (!collection || collection.mainEntity?.['@type'] !== 'ItemList' || collection.mainEntity.numberOfItems !== pages.length) {
  failures.push('index.html: incomplete CollectionPage or ItemList schema');
}

if (failures.length) {
  console.error(`Build validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Build validation passed: blog collection schema plus ${pages.length} article pages with visible dates, article metadata, BlogPosting and BreadcrumbList schema, exactly one H1, and no legacy brand spellings.`);
