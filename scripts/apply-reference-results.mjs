import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertValidBrief } from './report-schema.mjs';

const knownSources = new Set(['refero', 'open-design', 'manual', 'user']);

function usage() {
  return [
    'Usage:',
    '  node scripts/apply-reference-results.mjs <brief.json> <reference-results.json> [out.json] [--source refero]',
    '',
    'The reference-results file may be a raw MCP response array or an object with results/items/data.'
  ].join('\n');
}

function parseArgs(argv) {
  const positional = [];
  const options = { source: 'refero' };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--source') {
      options.source = argv[i + 1];
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else {
      positional.push(arg);
    }
  }

  return {
    briefPath: positional[0],
    resultsPath: positional[1],
    outPath: positional[2] || positional[0],
    options
  };
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function cleanString(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim();
}

function firstString(...values) {
  for (const value of values.flat()) {
    const text = cleanString(value);
    if (text) return text;
  }
  return '';
}

function truncate(text, limit = 150) {
  const clean = cleanString(text);
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, limit - 1)}…`;
}

function normalizeSource(source) {
  const normalized = cleanString(source).toLowerCase();
  if (knownSources.has(normalized)) return normalized;
  return 'manual';
}

function resultItems(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== 'object') return [];

  for (const key of ['results', 'items', 'data', 'documents', 'sources']) {
    if (Array.isArray(raw[key])) return raw[key];
  }

  if (raw.title || raw.name || raw.url || raw.link || raw.imageUrl || raw.image_url) {
    return [raw];
  }

  return [];
}

function normalizeImages(item, fallbackTitle) {
  const candidates = [
    item.imageUrl,
    item.image_url,
    item.screenshotUrl,
    item.screenshot_url,
    item.thumbnailUrl,
    item.thumbnail_url
  ];

  const imageObjects = [];

  for (const candidate of candidates) {
    const url = cleanString(candidate);
    if (url) imageObjects.push({ title: fallbackTitle, url });
  }

  for (const image of asArray(item.image || item.visual || item.images || item.visuals || item.screenshots)) {
    if (typeof image === 'string') {
      const url = cleanString(image);
      if (url) imageObjects.push({ title: fallbackTitle, url });
      continue;
    }

    if (image && typeof image === 'object') {
      const url = firstString(image.url, image.imageUrl, image.image_url, image.src, image.href);
      if (url) {
        imageObjects.push({
          title: firstString(image.title, image.name, image.label, fallbackTitle),
          url
        });
      }
    }
  }

  const seen = new Set();
  return imageObjects.filter(image => {
    if (seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
}

function normalizeTakeaways(item) {
  const list = [
    ...asArray(item.takeaways),
    ...asArray(item.insights),
    ...asArray(item.highlights)
  ].map(value => truncate(value, 120)).filter(Boolean);

  if (list.length > 0) return list.slice(0, 4);

  return [
    truncate(item.summary || item.description || item.snippet || item.content || item.text, 150)
  ].filter(Boolean);
}

export function normalizeReferenceResults(raw, options = {}) {
  const source = normalizeSource(options.source || raw?.source || 'refero');

  return resultItems(raw).map((item, index) => {
    const title = firstString(
      item.title,
      item.name,
      item.heading,
      item.label,
      item.url,
      item.link,
      `${source} reference ${index + 1}`
    );
    const url = firstString(item.url, item.link, item.href, item.sourceUrl, item.source_url);
    const images = normalizeImages(item, title);

    return {
      source,
      title,
      ...(url ? { url } : {}),
      takeaways: normalizeTakeaways(item),
      ...(images.length > 0 ? { images } : {})
    };
  }).filter(reference => reference.title);
}

function mergeList(existing = [], incoming = []) {
  const merged = [...existing];
  const seen = new Set(existing.map(item => `${item.source || ''}|${item.title || ''}|${item.url || ''}`));

  for (const item of incoming) {
    const key = `${item.source || ''}|${item.title || ''}|${item.url || ''}`;
    if (seen.has(key)) continue;
    merged.push(item);
    seen.add(key);
  }

  return merged;
}

function referenceVisuals(references) {
  const visuals = [];
  const seen = new Set();

  for (const reference of references) {
    for (const image of asArray(reference.images)) {
      if (!image?.url || seen.has(image.url)) continue;
      visuals.push({
        source: reference.source,
        title: image.title || reference.title,
        url: image.url
      });
      seen.add(image.url);
    }
  }

  return visuals;
}

export function mergeReferencesIntoBrief(brief, references, options = {}) {
  const maxVisuals = options.maxVisuals || 4;
  const merged = JSON.parse(JSON.stringify(brief));
  merged.references = mergeList(merged.references || [], references);

  const visualHero = (merged.slides || []).find(slide => slide.pattern === 'visual-hero');
  if (visualHero) {
    const existingVisuals = Array.isArray(visualHero.visuals) ? visualHero.visuals : [];
    visualHero.visuals = mergeList(existingVisuals, referenceVisuals(references)).slice(0, maxVisuals);
  }

  return merged;
}

function runCli(argv) {
  const { briefPath, resultsPath, outPath, options } = parseArgs(argv);

  if (options.help) {
    console.log(usage());
    return 0;
  }

  if (!briefPath || !resultsPath || !outPath || !options.source) {
    console.error(usage());
    return 1;
  }

  const brief = JSON.parse(fs.readFileSync(path.resolve(briefPath), 'utf-8'));
  const rawResults = JSON.parse(fs.readFileSync(path.resolve(resultsPath), 'utf-8'));
  const references = normalizeReferenceResults(rawResults, { source: options.source });
  const merged = mergeReferencesIntoBrief(brief, references);

  try {
    assertValidBrief(merged);
  } catch (error) {
    console.error('레퍼런스 적용 후 브리프 검증에 실패했습니다.');
    console.error(error.message);
    return 1;
  }

  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
  fs.writeFileSync(path.resolve(outPath), JSON.stringify(merged, null, 2), 'utf-8');
  console.log(`Applied ${references.length} ${normalizeSource(options.source)} reference(s) to ${outPath}`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(runCli(process.argv.slice(2)));
}
