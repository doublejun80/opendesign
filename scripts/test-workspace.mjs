import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const root = process.cwd();
const node = process.execPath;
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'open-design-tests-'));

function run(args, options = {}) {
  return spawnSync(node, args, {
    cwd: root,
    encoding: 'utf-8',
    ...options
  });
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
}

function assertIncludes(haystack, needle, message) {
  assert.ok(haystack.includes(needle), `${message}\nExpected to include: ${needle}`);
}

function assertHorizontalDeckRuntime(html, label) {
  assertIncludes(html, 'id="deck"', `${label} should expose a deck runtime root`);
  assertIncludes(html, 'scroll-snap-type: x mandatory;', `${label} should use horizontal scroll snapping`);
  assertIncludes(html, 'overflow-y: hidden;', `${label} should prevent vertical document-style scrolling`);
  assertIncludes(html, 'scroll-snap-align: start;', `${label} should snap each slide as one screen`);
  assertIncludes(html, "inline: 'start'", `${label} should move keyboard navigation horizontally`);
  assertIncludes(html, "location.hash", `${label} should support hash deep links`);
}

const richBrief = {
  title: '레퍼런스 기반 보고 덱 검증',
  audience: '전략 담당 임원',
  decisionAsk: '제한 범위 PoC 승인',
  tone: '한국 대기업 임원보고용',
  facts: [
    '비교 검토 시간이 평균 5일 소요',
    '대안별 판단 기준이 문서마다 다름'
  ],
  references: [
    {
      source: 'lazyweb',
      title: 'B2B approval workflow examples',
      takeaways: ['좌우 대비형 검토 흐름', '상태 라벨 밀도']
    },
    {
      source: 'mobbin',
      title: 'Decision matrix screen pattern',
      takeaways: ['추천안을 한 컬럼에 고정', '도형은 판단 흐름 표시용으로 제한']
    }
  ],
  slides: [
    {
      kicker: 'ISSUE TREE',
      title: '문제는 자료 부족보다 판단 기준의 분산입니다',
      pattern: 'issue-tree',
      root: '판단 지연',
      branches: [
        { title: '자료 수집', items: ['출처 분산', '최신성 확인 지연'] },
        { title: '비교 기준', items: ['항목 불일치', '가중치 미정'] },
        { title: '승인 흐름', items: ['책임자 확인 지연', '근거 누락'] }
      ]
    },
    {
      kicker: 'VISUAL SYSTEM',
      title: '레퍼런스 화면은 별도 이미지 레일로 보여주고, 판단 메시지는 분리합니다',
      pattern: 'visual-hero',
      subtitle: 'Open Design 템플릿 원칙과 Mobbin/Lazyweb 화면 자료를 같은 캔버스에서 결합합니다.',
      points: ['템플릿은 장표 구조를 고정', '이미지는 근거와 분위기 제공', '결론은 본문이 아니라 제목에 배치'],
      visuals: [
        {
          source: 'mobbin',
          title: 'KYC verification screen',
          url: 'https://framerusercontent.com/images/JVUac5pbNNM6iJYJShMDHhTUPUc.png?height=2556&width=1180'
        },
        {
          source: 'mobbin',
          title: 'Plan selection screen',
          url: 'https://framerusercontent.com/images/xX0wjzJWFUGCJkCfpsH9KNuhIk.png?height=2436&width=1125'
        }
      ]
    },
    {
      kicker: 'BENTO SYNTHESIS',
      title: '템플릿·스킬·시스템은 따로 쓰지 않고 한 장표 안에서 역할을 나눕니다',
      pattern: 'bento-synthesis',
      tiles: [
        { label: 'Templates', value: '슬라이드 구조', body: 'Open Design 템플릿 카탈로그에서 장표 장르를 선택합니다.' },
        { label: 'Skills', value: '작업 방식', body: '디자인 브리프, 정교화, export 같은 실행 규칙을 적용합니다.' },
        { label: 'Systems', value: '시각 언어', body: 'Premium, Enterprise, Publication 계열을 보고서 성격에 맞게 조합합니다.' },
        { label: 'References', value: '실제 화면', body: 'Lazyweb/Mobbin 자료는 이미지 레일과 근거 라벨로만 사용합니다.' }
      ]
    },
    {
      kicker: 'RISK & CONTROL',
      title: 'PoC는 범위를 좁히고 통제 기준을 먼저 고정해야 합니다',
      pattern: 'risk-control',
      risks: [
        { risk: '레퍼런스 오해석', control: '출처와 적용 원칙을 분리 기록', owner: '전략팀' },
        { risk: '장표 과밀', control: '슬라이드당 메시지 3개 이하 유지', owner: '작성자' },
        { risk: '이미지 장식화', control: '의사결정 흐름을 설명할 때만 사용', owner: '디자인 검토' }
      ]
    },
    {
      kicker: 'APPENDIX',
      title: '레퍼런스는 화면 복제가 아니라 구조 추출 근거로만 씁니다',
      pattern: 'appendix',
      notes: [
        { label: 'Lazyweb', value: '맥락과 자료 탐색' },
        { label: 'Mobbin', value: 'UI 패턴과 도형 구조 참고' },
        { label: '적용 원칙', value: '한국어 임원보고 문법으로 재구성' }
      ]
    }
  ]
};

const richBriefPath = path.join(tmpRoot, 'rich-brief.json');
const richOutDir = path.join(tmpRoot, 'rich-report');
writeJson(richBriefPath, richBrief);

const createResult = run(['scripts/create-report.mjs', richBriefPath, richOutDir]);
assert.equal(createResult.status, 0, createResult.stderr || createResult.stdout);

const generatedHtml = fs.readFileSync(path.join(richOutDir, 'index.html'), 'utf-8');
assertHorizontalDeckRuntime(generatedHtml, 'generated report');
assertIncludes(generatedHtml, 'class="issue-tree', 'issue-tree pattern should render a dedicated issue tree layout');
assertIncludes(generatedHtml, 'class="visual-hero', 'visual-hero pattern should render a high-impact visual layout');
assertIncludes(generatedHtml, '<img src="https://framerusercontent.com/images/JVUac5pbNNM6iJYJShMDHhTUPUc.png', 'visual layouts should render reference images');
assertIncludes(generatedHtml, 'class="bento-synthesis', 'bento-synthesis pattern should render a bento layout');
assertIncludes(generatedHtml, 'class="risk-grid', 'risk-control pattern should render a dedicated risk grid layout');
assertIncludes(generatedHtml, 'class="appendix-grid', 'appendix pattern should render a dedicated appendix layout');
assertIncludes(generatedHtml, 'source-label source-lazyweb', 'Lazyweb references should be preserved as source labels');
assertIncludes(generatedHtml, 'source-label source-mobbin', 'Mobbin references should be preserved as source labels');

const lazywebRawPath = path.join(tmpRoot, 'lazyweb-results.json');
writeJson(lazywebRawPath, {
  query: 'AI 구매 자동화 도입 검토',
  results: [
    {
      title: 'AI procurement automation examples',
      url: 'https://example.com/procurement-ai',
      summary: '구매 요청, 공급사 비교, 승인 흐름을 한 번에 묶어 검토하는 사례입니다.',
      imageUrl: 'https://example.com/procurement-flow.png',
      takeaways: ['승인 단계와 책임자를 같이 보여줌', '비교 근거를 하단 출처로 분리']
    },
    {
      name: 'Supplier risk review pattern',
      link: 'https://example.com/supplier-risk',
      description: '공급사 리스크와 통제 방안을 같은 행에서 비교합니다.',
      images: [
        { title: 'Supplier risk grid', url: 'https://example.com/supplier-risk.png' }
      ]
    }
  ]
});

const lazywebBaseBriefPath = path.join(tmpRoot, 'lazyweb-base-brief.json');
writeJson(lazywebBaseBriefPath, {
  title: 'Lazyweb 레퍼런스 적용 검증',
  slides: [
    {
      title: '외부 레퍼런스는 구조화된 근거로만 사용합니다',
      pattern: 'visual-hero',
      points: ['맥락은 Lazyweb에서 확인', '이미지는 근거 레일로만 배치', '결론은 제목에 유지'],
      visuals: []
    }
  ]
});

const lazywebMergedBriefPath = path.join(tmpRoot, 'lazyweb-merged-brief.json');
const lazywebApplyResult = run([
  'scripts/apply-reference-results.mjs',
  lazywebBaseBriefPath,
  lazywebRawPath,
  lazywebMergedBriefPath,
  '--source',
  'lazyweb'
]);
assert.equal(lazywebApplyResult.status, 0, lazywebApplyResult.stderr || lazywebApplyResult.stdout);

const lazywebMergedBrief = JSON.parse(fs.readFileSync(lazywebMergedBriefPath, 'utf-8'));
assert.equal(lazywebMergedBrief.references.length, 2, 'Lazyweb results should become report references');
assert.equal(lazywebMergedBrief.references[0].source, 'lazyweb', 'references should preserve the Lazyweb source');
assert.equal(lazywebMergedBrief.references[0].images[0].url, 'https://example.com/procurement-flow.png', 'imageUrl should be normalized into reference images');
assert.equal(lazywebMergedBrief.references[1].images[0].url, 'https://example.com/supplier-risk.png', 'nested images should be preserved');
assert.equal(lazywebMergedBrief.slides[0].visuals.length, 2, 'Lazyweb images should populate an existing visual-hero rail');
assert.equal(lazywebMergedBrief.slides[0].visuals[0].source, 'lazyweb', 'visual rail entries should keep their source label');

const lazywebValidateResult = run(['scripts/validate-workspace.mjs', '--brief', lazywebMergedBriefPath]);
assert.equal(lazywebValidateResult.status, 0, lazywebValidateResult.stderr || lazywebValidateResult.stdout);

const referenceAdapter = await import('./apply-reference-results.mjs');
assert.deepEqual(
  referenceAdapter.normalizeReferenceResults({ results: [{ title: 'Import-safe reference' }] }, { source: 'lazyweb' }),
  [{ source: 'lazyweb', title: 'Import-safe reference', takeaways: [] }],
  'reference adapter should be importable without running the CLI'
);

const invalidBriefPath = path.join(tmpRoot, 'invalid-brief.json');
writeJson(invalidBriefPath, {
  title: '잘못된 브리프',
  slides: [
    { title: '지원하지 않는 패턴', pattern: 'unknown-pattern' }
  ]
});

const invalidResult = run(['scripts/validate-workspace.mjs', '--brief', invalidBriefPath]);
assert.notEqual(invalidResult.status, 0, 'validate-workspace should reject unsupported slide patterns');
assertIncludes(invalidResult.stderr + invalidResult.stdout, 'unknown-pattern', 'validation error should name the unsupported pattern');

const exportOut = path.join(tmpRoot, 'export-plan');
const exportResult = run([
  'scripts/export-deck.mjs',
  path.join(richOutDir, 'index.html'),
  exportOut,
  '--dry-run',
  '--check-overflow'
]);
assert.equal(exportResult.status, 0, exportResult.stderr || exportResult.stdout);
const plan = JSON.parse(fs.readFileSync(path.join(exportOut, 'export-plan.json'), 'utf-8'));
assert.equal(plan.slideCount, 5, 'export dry run should count slides');
assert.equal(plan.viewport.width, 1920, 'export plan should use a 1920px viewport');
assert.equal(plan.viewport.height, 1080, 'export plan should use a 1080px viewport');
assert.equal(plan.overflowCheck.enabled, true, 'export plan should record overflow checking');

const missingBrowserDir = path.join(tmpRoot, 'missing-browsers');
fs.mkdirSync(missingBrowserDir, { recursive: true });
const missingBrowserResult = run(
  [
    'scripts/export-deck.mjs',
    path.join(richOutDir, 'index.html'),
    path.join(tmpRoot, 'missing-browser-export'),
    '--no-pdf'
  ],
  {
    env: {
      ...process.env,
      PLAYWRIGHT_BROWSERS_PATH: missingBrowserDir,
      OPEN_DESIGN_DISABLE_SYSTEM_BROWSER_FALLBACK: '1'
    }
  }
);
assert.notEqual(missingBrowserResult.status, 0, 'export should fail when Playwright browsers are unavailable');
assertIncludes(
  missingBrowserResult.stderr + missingBrowserResult.stdout,
  'npx playwright install chromium',
  'missing browser failure should include the install command'
);
assert.equal(
  (missingBrowserResult.stderr + missingBrowserResult.stdout).includes('triggerUncaughtException'),
  false,
  'missing browser failure should be handled without an uncaught exception stack'
);

assert.equal(fs.existsSync(path.join(root, 'index.html')), false, 'root index.html should not remain as a sample deck');
assert.equal(
  fs.existsSync(path.join(root, 'reports', 'sample-executive-report', 'index.html')),
  true,
  'sample deck should live under reports/sample-executive-report'
);

for (const reportName of fs.readdirSync(path.join(root, 'reports'))) {
  const reportHtmlPath = path.join(root, 'reports', reportName, 'index.html');
  if (!fs.existsSync(reportHtmlPath)) continue;
  assertHorizontalDeckRuntime(
    fs.readFileSync(reportHtmlPath, 'utf-8'),
    `reports/${reportName}/index.html`
  );
}

execFileSync(node, ['scripts/validate-workspace.mjs'], { cwd: root, stdio: 'pipe' });
console.log('Workspace behavior tests passed.');
