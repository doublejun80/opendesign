import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

import { supportedPatterns, validateBrief } from './report-schema.mjs';

const editorDir = path.resolve('editor');

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.svg', 'image/svg+xml; charset=utf-8']
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
}

function normalizePathForUrl(filePath) {
  return filePath.split(path.sep).join('/');
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function sendJson(response, status, value) {
  const body = JSON.stringify(value, null, 2);
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  response.end(body);
}

function sendText(response, status, text) {
  response.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
  response.end(text);
}

function serveFile(response, filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    sendText(response, 404, 'Not found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    'content-type': mimeTypes.get(ext) || 'application/octet-stream',
    'cache-control': 'no-store'
  });
  fs.createReadStream(filePath).pipe(response);
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf-8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

export function resolveReportDir(input = 'reports/sample-executive-report', options = {}) {
  const rootDir = path.resolve(options.rootDir || process.cwd());
  return path.resolve(rootDir, input);
}

export function summarizeSlides(slides = []) {
  return slides.map((slide, index) => ({
    number: index + 1,
    pattern: slide.pattern || 'cards',
    kicker: slide.kicker || '',
    title: slide.title || '(제목 없음)',
    subtitle: slide.subtitle || ''
  }));
}

export function validateReportContent(content) {
  const errors = validateBrief(content);
  return {
    ok: errors.length === 0,
    errors
  };
}

export function loadReport(reportDir, options = {}) {
  const rootDir = path.resolve(options.rootDir || process.cwd());
  const absoluteReportDir = path.resolve(reportDir);
  const contentPath = path.join(absoluteReportDir, 'content.json');
  const slidesPath = path.join(absoluteReportDir, 'slides.json');
  const htmlPath = path.join(absoluteReportDir, 'index.html');

  if (!fs.existsSync(contentPath)) {
    throw new Error(`content.json not found: ${contentPath}`);
  }

  const content = readJson(contentPath);
  if (!Array.isArray(content.slides) && fs.existsSync(slidesPath)) {
    content.slides = readJson(slidesPath);
  }
  if (!Array.isArray(content.slides)) content.slides = [];

  const relativeReportDir = normalizePathForUrl(path.relative(rootDir, absoluteReportDir));

  return {
    rootDir,
    reportDir: absoluteReportDir,
    relativeReportDir,
    contentPath,
    slidesPath,
    htmlPath,
    previewPath: '/report/index.html',
    patterns: [...supportedPatterns],
    content,
    slides: content.slides,
    slideSummaries: summarizeSlides(content.slides),
    validation: validateReportContent(content)
  };
}

export function saveReportContent(reportDir, content, options = {}) {
  const rootDir = path.resolve(options.rootDir || process.cwd());
  const absoluteReportDir = path.resolve(reportDir);
  const contentToSave = structuredClone(content);
  if (!Array.isArray(contentToSave.slides)) contentToSave.slides = [];

  const validation = validateReportContent(contentToSave);
  if (!validation.ok) {
    return {
      ok: false,
      errors: validation.errors
    };
  }

  const contentPath = path.join(absoluteReportDir, 'content.json');
  const slidesPath = path.join(absoluteReportDir, 'slides.json');
  writeJson(contentPath, contentToSave);
  writeJson(slidesPath, contentToSave.slides);

  try {
    execFileSync(process.execPath, ['scripts/create-report.mjs', contentPath, absoluteReportDir], {
      cwd: rootDir,
      stdio: 'pipe',
      encoding: 'utf-8'
    });
  } catch (error) {
    return {
      ok: false,
      errors: [error.stderr || error.stdout || error.message]
    };
  }

  return {
    ok: true,
    report: loadReport(absoluteReportDir, { rootDir })
  };
}

function runCommand(label, args, options = {}) {
  const result = spawnSync(process.execPath, args, {
    cwd: options.rootDir || process.cwd(),
    encoding: 'utf-8',
    timeout: options.timeoutMs || 120000
  });

  return {
    label,
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

export function runReportQa(reportDir, options = {}) {
  const rootDir = path.resolve(options.rootDir || process.cwd());
  const absoluteReportDir = path.resolve(reportDir);
  const report = loadReport(absoluteReportDir, { rootDir });
  const checks = options.checks || ['validate'];
  const results = [];

  if (checks.includes('validate')) {
    const validation = validateReportContent(report.content);
    results.push({
      label: 'schema',
      ok: validation.ok,
      status: validation.ok ? 0 : 1,
      stdout: validation.ok ? 'Report schema validation passed.' : '',
      stderr: validation.errors.join('\n')
    });
  }

  if (checks.includes('linebreak')) {
    results.push(runCommand('korean-linebreak', [
      '.agents/skills/korean-executive-html-report/scripts/korean-linebreak-audit.js',
      report.htmlPath
    ], { rootDir }));
  }

  if (checks.includes('overflow')) {
    const slug = path.basename(absoluteReportDir);
    const outDir = path.join(rootDir, 'exports', `editor-qa-${slug}`);
    results.push(runCommand('overflow', [
      'scripts/export-deck.mjs',
      report.htmlPath,
      outDir,
      '--check-overflow',
      '--no-png',
      '--no-pdf'
    ], { rootDir, timeoutMs: 180000 }));
  }

  return {
    ok: results.every((result) => result.ok),
    results
  };
}

function resolveEditorAsset(urlPath) {
  const normalized = urlPath === '/' ? '/report-editor.html' : urlPath;
  const relative = normalized.replace(/^\/+/, '');
  const filePath = path.resolve(editorDir, relative);
  if (!isInside(editorDir, filePath)) return null;
  return filePath;
}

function resolveReportAsset(reportDir, urlPath) {
  const relative = decodeURIComponent(urlPath.replace(/^\/report\/?/, '')) || 'index.html';
  const filePath = path.resolve(reportDir, relative);
  if (!isInside(path.resolve(reportDir), filePath)) return null;
  return filePath;
}

export async function createEditorServer(options = {}) {
  const rootDir = path.resolve(options.rootDir || process.cwd());
  const reportDir = resolveReportDir(options.reportDir, { rootDir });
  const host = options.host || '127.0.0.1';
  const port = Number(options.port ?? 4173);

  const server = http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', `http://${host}:${port || 4173}`);

      if (request.method === 'GET' && requestUrl.pathname === '/api/report') {
        sendJson(response, 200, loadReport(reportDir, { rootDir }));
        return;
      }

      if (request.method === 'POST' && requestUrl.pathname === '/api/save') {
        const body = await readRequestBody(request);
        const saved = saveReportContent(reportDir, body.content, { rootDir });
        sendJson(response, saved.ok ? 200 : 422, saved);
        return;
      }

      if (request.method === 'POST' && requestUrl.pathname === '/api/qa') {
        const body = await readRequestBody(request);
        const qa = runReportQa(reportDir, { rootDir, checks: body.checks || ['validate'] });
        sendJson(response, qa.ok ? 200 : 422, qa);
        return;
      }

      if (request.method === 'GET' && requestUrl.pathname.startsWith('/report/')) {
        const filePath = resolveReportAsset(reportDir, requestUrl.pathname);
        if (!filePath) {
          sendText(response, 403, 'Forbidden');
          return;
        }
        serveFile(response, filePath);
        return;
      }

      if (request.method === 'GET') {
        const filePath = resolveEditorAsset(requestUrl.pathname);
        if (!filePath) {
          sendText(response, 403, 'Forbidden');
          return;
        }
        serveFile(response, filePath);
        return;
      }

      sendText(response, 405, 'Method not allowed');
    } catch (error) {
      sendJson(response, 500, {
        ok: false,
        errors: [error.message]
      });
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });

  const address = server.address();
  const actualPort = typeof address === 'object' && address ? address.port : port;

  return {
    host,
    port: actualPort,
    url: `http://${host}:${actualPort}/`,
    reportDir,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    })
  };
}
