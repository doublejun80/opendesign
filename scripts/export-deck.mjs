import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const inputHtml = args[0] || 'reports/sample-executive-report/index.html';
const outDir = args[1] || 'exports/sample-executive-report';
const dryRun = args.includes('--dry-run');
const checkOverflow = args.includes('--check-overflow');
const skipPdf = args.includes('--no-pdf');
const skipPng = args.includes('--no-png');
const viewport = { width: 1920, height: 1080 };

function countSlidesFromHtml(html) {
  return [...html.matchAll(/<section\b[^>]*class=["'][^"']*\bslide\b[^"']*["'][^>]*>/g)].length;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
}

function usage() {
  console.log('Usage: node scripts/export-deck.mjs <input-html> <out-dir> [--dry-run] [--check-overflow] [--no-pdf] [--no-png]');
}

if (args.includes('--help') || args.includes('-h')) {
  usage();
  process.exit(0);
}

if (!fs.existsSync(inputHtml)) {
  console.error(`파일을 찾을 수 없습니다: ${inputHtml}`);
  process.exit(1);
}

const html = fs.readFileSync(inputHtml, 'utf-8');
const slideCount = countSlidesFromHtml(html);

if (slideCount === 0) {
  console.error('HTML에서 .slide 섹션을 찾지 못했습니다.');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const plan = {
  inputHtml: path.resolve(inputHtml),
  outDir: path.resolve(outDir),
  slideCount,
  viewport,
  outputs: {
    png: !skipPng,
    pdf: !skipPdf
  },
  overflowCheck: {
    enabled: checkOverflow,
    mode: dryRun ? 'planned' : 'playwright'
  }
};

writeJson(path.join(outDir, 'export-plan.json'), plan);

if (dryRun) {
  console.log(`Export dry run complete: ${path.join(outDir, 'export-plan.json')}`);
  process.exit(0);
}

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright를 찾을 수 없습니다.');
  console.error('다음 명령으로 설치하세요: npm install -D playwright && npx playwright install chromium');
  process.exit(1);
}

async function launchBrowser(chromiumBrowserType) {
  const attempts = [{ label: 'bundled chromium', options: {} }];
  if (process.env.OPEN_DESIGN_DISABLE_SYSTEM_BROWSER_FALLBACK !== '1') {
    attempts.push(
      { label: 'system Microsoft Edge', options: { channel: 'msedge' } },
      { label: 'system Chrome', options: { channel: 'chrome' } }
    );
  }

  const failures = [];
  for (const attempt of attempts) {
    try {
      const browserInstance = await chromiumBrowserType.launch(attempt.options);
      return { browserInstance, label: attempt.label };
    } catch (error) {
      failures.push(`${attempt.label}: ${error.message.split('\n')[0]}`);
    }
  }

  const error = new Error(failures.join('\n'));
  error.failures = failures;
  throw error;
}

let browser;
let browserLabel = 'unknown';
try {
  const launched = await launchBrowser(chromium);
  browser = launched.browserInstance;
  browserLabel = launched.label;
} catch (error) {
  console.error('Playwright 브라우저를 실행할 수 없습니다.');
  console.error('다음 명령으로 Chromium 브라우저를 설치하세요: npx playwright install chromium');
  console.error('또는 Microsoft Edge/Chrome이 설치된 환경에서 다시 실행하세요.');
  console.error(`원인: ${error.message}`);
  process.exit(1);
}

const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.resolve(inputHtml)).href, { waitUntil: 'load' });

const slides = await page.$$('.slide');
const exported = [];

if (!skipPng) {
  for (let i = 0; i < slides.length; i += 1) {
    const fileName = `slide-${String(i + 1).padStart(2, '0')}.png`;
    const filePath = path.join(outDir, fileName);
    await page.evaluate(index => {
      window.__openDesignDeck?.go?.(index, { updateHash: false });
      document.documentElement.style.setProperty('--kr-active-slide', String(index));
      document.documentElement.style.setProperty('--active-slide', String(index));
    }, i);
    await page.waitForTimeout(80);
    await slides[i].screenshot({ path: filePath });
    exported.push(fileName);
  }
}

let overflowReport = { enabled: checkOverflow, issues: [] };
if (checkOverflow) {
  overflowReport = await page.$$eval('.slide', nodes => ({
    enabled: true,
    issues: nodes.flatMap((slide, index) => {
      const slideRect = slide.getBoundingClientRect();
      const issues = [];
      if (slide.scrollWidth > slide.clientWidth + 1 || slide.scrollHeight > slide.clientHeight + 1) {
        issues.push({
          slide: index + 1,
          type: 'slide-scroll-overflow',
          scrollWidth: slide.scrollWidth,
          clientWidth: slide.clientWidth,
          scrollHeight: slide.scrollHeight,
          clientHeight: slide.clientHeight
        });
      }
      for (const element of slide.querySelectorAll('*')) {
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const outside = rect.left < slideRect.left - 1
          || rect.top < slideRect.top - 1
          || rect.right > slideRect.right + 1
          || rect.bottom > slideRect.bottom + 1;
        if (outside) {
          issues.push({
            slide: index + 1,
            type: 'element-outside-slide',
            tag: element.tagName.toLowerCase(),
            className: element.className || '',
            rect: {
              left: Math.round(rect.left - slideRect.left),
              top: Math.round(rect.top - slideRect.top),
              right: Math.round(rect.right - slideRect.left),
              bottom: Math.round(rect.bottom - slideRect.top)
            }
          });
        }
      }
      return issues;
    })
  }));
  writeJson(path.join(outDir, 'overflow-report.json'), overflowReport);
}

if (!skipPdf) {
  await page.pdf({
    path: path.join(outDir, 'deck.pdf'),
    width: `${viewport.width}px`,
    height: `${viewport.height}px`,
    printBackground: true,
    preferCSSPageSize: false
  });
  exported.push('deck.pdf');
}

await browser.close();

writeJson(path.join(outDir, 'export-manifest.json'), {
  ...plan,
  browser: browserLabel,
  exported,
  overflowIssues: overflowReport.issues.length
});

if (overflowReport.issues.length > 0) {
  console.error(`Export completed with ${overflowReport.issues.length} overflow issue(s). See ${path.join(outDir, 'overflow-report.json')}`);
  process.exit(2);
}

console.log(`Export completed: ${outDir}`);
