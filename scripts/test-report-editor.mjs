import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import {
  createEditorServer,
  loadReport,
  saveReportContent,
  summarizeSlides,
  validateReportContent
} from './report-editor-core.mjs';

const root = process.cwd();
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'open-design-editor-tests-'));
const reportDir = path.join(tmpRoot, 'editable-report');
fs.mkdirSync(reportDir, { recursive: true });

const brief = {
  title: '편집기 테스트 보고서',
  audience: '임원 검토',
  decisionAsk: 'PoC 범위 승인',
  slides: [
    {
      kicker: 'EXECUTIVE ASK',
      title: '초기 제목',
      subtitle: '초기 부제',
      pattern: 'title'
    },
    {
      kicker: 'SUMMARY',
      title: '핵심 근거 3개',
      pattern: 'cards',
      cards: [
        { title: '근거 A', body: '반복 수정 감소', metric: '30%' },
        { title: '근거 B', body: '장표 삭제 직접 처리', metric: '5분' },
        { title: '근거 C', body: 'HTML 재생성 자동화', metric: '1회' }
      ]
    }
  ]
};

fs.writeFileSync(path.join(reportDir, 'content.json'), JSON.stringify(brief, null, 2), 'utf-8');
execFileSync(process.execPath, ['scripts/create-report.mjs', path.join(reportDir, 'content.json'), reportDir], {
  cwd: root,
  stdio: 'pipe'
});

const loaded = loadReport(reportDir, { rootDir: root });
assert.equal(loaded.content.title, '편집기 테스트 보고서');
assert.equal(loaded.slides.length, 2);
assert.equal(loaded.previewPath, '/report/index.html');

const summaries = summarizeSlides(loaded.content.slides);
assert.deepEqual(
  summaries.map((slide) => `${slide.number}:${slide.pattern}:${slide.title}`),
  ['1:title:초기 제목', '2:cards:핵심 근거 3개']
);

const validation = validateReportContent(loaded.content);
assert.equal(validation.ok, true);
assert.deepEqual(validation.errors, []);

const updated = structuredClone(loaded.content);
updated.title = '편집기 저장 검증';
updated.slides[0].title = '저장 후 제목 반영';
updated.slides[1].cards[0].body = '브라우저에서 직접 문구 변경';

const saved = saveReportContent(reportDir, updated, { rootDir: root });
assert.equal(saved.ok, true);
assert.equal(JSON.parse(fs.readFileSync(path.join(reportDir, 'slides.json'), 'utf-8'))[0].title, '저장 후 제목 반영');
const regeneratedHtml = fs.readFileSync(path.join(reportDir, 'index.html'), 'utf-8');
assert.match(regeneratedHtml, /편집기 저장 검증/);
assert.match(regeneratedHtml, /브라우저에서 직접 문구 변경/);

const server = await createEditorServer({
  reportDir,
  rootDir: root,
  host: '127.0.0.1',
  port: 0
});

try {
  const baseUrl = `http://127.0.0.1:${server.port}`;
  const editorHtml = await fetch(`${baseUrl}/`).then((response) => response.text());
  assert.match(editorHtml, /Open Design Report Editor/);

  const reportPayload = await fetch(`${baseUrl}/api/report`).then((response) => response.json());
  assert.equal(reportPayload.content.title, '편집기 저장 검증');
  assert.equal(reportPayload.patterns.includes('matrix'), true);

  const apiUpdated = structuredClone(reportPayload.content);
  apiUpdated.slides[0].subtitle = 'API 저장 부제';
  const saveResponse = await fetch(`${baseUrl}/api/save`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content: apiUpdated })
  }).then((response) => response.json());
  assert.equal(saveResponse.ok, true);

  const reportHtml = await fetch(`${baseUrl}/report/index.html`).then((response) => response.text());
  assert.match(reportHtml, /API 저장 부제/);
} finally {
  await server.close();
}

console.log('Report editor tests passed.');
