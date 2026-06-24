const state = {
  report: null,
  content: null,
  patterns: [],
  current: 0,
  dirty: false
};

const nodes = {
  deckTitle: document.getElementById('deckTitle'),
  reportPath: document.getElementById('reportPath'),
  saveState: document.getElementById('saveState'),
  slideList: document.getElementById('slideList'),
  activeSlideTitle: document.getElementById('activeSlideTitle'),
  reportPreview: document.getElementById('reportPreview'),
  previewViewport: document.getElementById('previewViewport'),
  slidePattern: document.getElementById('slidePattern'),
  editorForm: document.getElementById('editorForm'),
  patternPill: document.getElementById('patternPill'),
  saveButton: document.getElementById('saveButton'),
  reloadButton: document.getElementById('reloadButton'),
  addSlideButton: document.getElementById('addSlideButton'),
  schemaButton: document.getElementById('schemaButton'),
  linebreakButton: document.getElementById('linebreakButton'),
  overflowButton: document.getElementById('overflowButton'),
  qaOutput: document.getElementById('qaOutput')
};

const patternDefaults = {
  title: () => ({ kicker: 'EXECUTIVE ASK', title: '새 장표 제목', subtitle: '핵심 요청', pattern: 'title' }),
  cards: () => ({
    kicker: 'SUMMARY',
    title: '핵심 근거 3개',
    pattern: 'cards',
    cards: [
      { title: '근거 1', body: '핵심 설명', metric: '1' },
      { title: '근거 2', body: '핵심 설명', metric: '2' },
      { title: '근거 3', body: '핵심 설명', metric: '3' }
    ]
  }),
  split: () => ({
    kicker: 'SITUATION',
    title: 'As-Is / To-Be 비교',
    pattern: 'split',
    leftTitle: 'As-Is',
    leftItems: ['현재 상태'],
    rightTitle: 'To-Be',
    rightItems: ['변경 방향']
  }),
  matrix: () => ({
    kicker: 'OPTION MATRIX',
    title: '대안 비교',
    pattern: 'matrix',
    columns: ['대안 A', '대안 B', '대안 C'],
    rows: [{ label: '추천', values: ['보류', '추천', '검토'] }],
    recommendedIndex: 1
  }),
  roadmap: () => ({
    kicker: 'ROADMAP',
    title: '실행 로드맵',
    pattern: 'roadmap',
    phases: [{ title: '1단계', body: '기준 정리' }]
  }),
  'issue-tree': () => ({
    kicker: 'ISSUE TREE',
    title: '쟁점 구조',
    pattern: 'issue-tree',
    root: '핵심 쟁점',
    branches: [{ title: '원인', items: ['세부 항목'] }]
  }),
  'visual-hero': () => ({
    kicker: 'VISUAL SYSTEM',
    title: '시각 근거',
    subtitle: '레퍼런스 이미지와 판단 메시지 분리',
    pattern: 'visual-hero',
    points: ['핵심 포인트'],
    visuals: [{ source: 'manual', title: 'reference', url: '' }]
  }),
  'bento-synthesis': () => ({
    kicker: 'BENTO SYNTHESIS',
    title: '종합 판단',
    pattern: 'bento-synthesis',
    tiles: [{ label: 'Key', value: '핵심', body: '요약 설명' }]
  }),
  'risk-control': () => ({
    kicker: 'RISK & CONTROL',
    title: '리스크와 통제',
    pattern: 'risk-control',
    risks: [{ risk: '리스크', control: '통제 방안', owner: '담당' }]
  }),
  appendix: () => ({
    kicker: 'APPENDIX',
    title: '근거 자료',
    pattern: 'appendix',
    notes: [{ label: '근거', value: '상세 내용' }]
  })
};

function clone(value) {
  return structuredClone(value);
}

function currentSlide() {
  return state.content?.slides?.[state.current] || null;
}

function pathParts(path) {
  return String(path).split('.').filter(Boolean).map((part) => /^\d+$/.test(part) ? Number(part) : part);
}

function getAt(target, path) {
  return pathParts(path).reduce((value, part) => value?.[part], target);
}

function setAt(target, path, value) {
  const parts = pathParts(path);
  let cursor = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    cursor = cursor[parts[i]];
  }
  cursor[parts.at(-1)] = value;
}

function markDirty() {
  state.dirty = true;
  nodes.saveState.textContent = 'Unsaved';
}

function createEl(tag, className = '', text = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function field(label, path, options = {}) {
  const wrapper = createEl('label', 'field');
  const labelText = createEl('span', '', label);
  const input = document.createElement(options.multiline ? 'textarea' : 'input');
  input.dataset.path = path;
  input.value = getAt(currentSlide(), path) ?? '';
  if (options.type) input.type = options.type;
  wrapper.append(labelText, input);
  return wrapper;
}

function numberField(label, path, options = {}) {
  const wrapper = field(label, path, { type: 'number' });
  const input = wrapper.querySelector('input');
  input.min = options.min ?? 0;
  input.max = options.max ?? 99;
  return wrapper;
}

function group(title, children = [], actions = []) {
  const section = createEl('section', 'form-group');
  const header = createEl('div', 'group-header');
  header.append(createEl('h3', '', title));
  if (actions.length) {
    const actionWrap = createEl('div', 'mini-actions');
    actionWrap.append(...actions);
    header.append(actionWrap);
  }
  section.append(header, ...children);
  return section;
}

function miniButton(label, action, detail = '', className = '') {
  const button = createEl('button', `mini-button ${className}`.trim(), label);
  button.type = 'button';
  button.dataset.action = action;
  if (detail) button.dataset.detail = detail;
  return button;
}

function arrayGroup(title, arrayPath, itemBuilder, addValue) {
  const slide = currentSlide();
  const items = getAt(slide, arrayPath) || [];
  const addButton = miniButton('+ 추가', 'add-array-item', arrayPath);
  addButton.dataset.value = JSON.stringify(addValue);

  const children = items.length
    ? items.map((item, index) => {
      const itemNode = createEl('div', 'array-item');
      const actions = createEl('div', 'mini-actions');
      actions.append(
        miniButton('위', 'move-array-item', `${arrayPath}.${index}.-1`),
        miniButton('아래', 'move-array-item', `${arrayPath}.${index}.1`),
        miniButton('삭제', 'remove-array-item', `${arrayPath}.${index}`, 'danger')
      );
      itemNode.append(actions, ...itemBuilder(index, item));
      return itemNode;
    })
    : [createEl('div', 'empty-state', '항목이 없습니다.')];

  return group(title, children, [addButton]);
}

function stringListGroup(title, arrayPath, placeholder = '항목') {
  return arrayGroup(
    title,
    arrayPath,
    (index) => [field(`${placeholder} ${index + 1}`, `${arrayPath}.${index}`)],
    ''
  );
}

function ensurePatternFields(slide, pattern) {
  const defaults = patternDefaults[pattern]?.() || patternDefaults.cards();
  slide.pattern = pattern;
  for (const [key, value] of Object.entries(defaults)) {
    if (slide[key] === undefined) slide[key] = clone(value);
  }
}

function renderPatternOptions() {
  nodes.slidePattern.innerHTML = '';
  for (const pattern of state.patterns) {
    const option = document.createElement('option');
    option.value = pattern;
    option.textContent = pattern;
    nodes.slidePattern.append(option);
  }
}

function renderSlideList() {
  nodes.slideList.innerHTML = '';
  state.content.slides.forEach((slide, index) => {
    const button = createEl('button', `slide-thumb ${index === state.current ? 'active' : ''}`);
    button.type = 'button';
    button.dataset.index = String(index);
    const number = createEl('span', 'slide-number', String(index + 1).padStart(2, '0'));
    const copy = createEl('span', 'thumb-copy');
    copy.append(
      createEl('span', 'thumb-title', slide.title || '(제목 없음)'),
      createEl('span', 'thumb-meta', `${slide.kicker || 'NO KICKER'} · ${slide.pattern || 'cards'}`)
    );
    button.append(number, copy);
    nodes.slideList.append(button);
  });
}

function renderSharedFields() {
  const slide = currentSlide();
  nodes.activeSlideTitle.textContent = slide?.title || '장표 선택';
  nodes.patternPill.textContent = slide?.pattern || 'pattern';
  nodes.slidePattern.value = slide?.pattern || 'cards';

  return group('장표 기본 정보', [
    field('키커', 'kicker'),
    field('상단 결론 제목', 'title', { multiline: true }),
    field('보조 문구', 'subtitle', { multiline: true })
  ], [
    miniButton('위로', 'move-slide', '-1'),
    miniButton('아래로', 'move-slide', '1'),
    miniButton('복제', 'duplicate-slide'),
    miniButton('삭제', 'delete-slide', '', 'danger')
  ]);
}

function renderCards() {
  return arrayGroup('카드', 'cards', (index) => [
    field('수치', `cards.${index}.metric`),
    field('제목', `cards.${index}.title`),
    field('본문', `cards.${index}.body`, { multiline: true })
  ], { title: '새 카드', body: '핵심 설명', metric: '' });
}

function renderSplit() {
  return [
    group('좌우 제목', [
      field('왼쪽 제목', 'leftTitle'),
      field('오른쪽 제목', 'rightTitle')
    ]),
    stringListGroup('왼쪽 항목', 'leftItems'),
    stringListGroup('오른쪽 항목', 'rightItems')
  ];
}

function renderMatrix() {
  const slide = currentSlide();
  const matrixRows = [
    stringListGroup('컬럼', 'columns', '컬럼'),
    numberField('추천 컬럼 Index', 'recommendedIndex', { min: 0, max: Math.max(0, (slide.columns || []).length - 1) }),
    arrayGroup('행', 'rows', (index, row) => [
      field('행 라벨', `rows.${index}.label`),
      ...(row.values || []).map((_, valueIndex) => field(`값 ${valueIndex + 1}`, `rows.${index}.values.${valueIndex}`))
    ], { label: '새 행', values: (slide.columns || []).map(() => '') })
  ];
  return matrixRows;
}

function renderRoadmap() {
  return arrayGroup('단계', 'phases', (index) => [
    field('단계 제목', `phases.${index}.title`),
    field('단계 설명', `phases.${index}.body`, { multiline: true })
  ], { title: '새 단계', body: '실행 내용' });
}

function renderIssueTree() {
  return [
    group('루트 쟁점', [field('핵심 쟁점', 'root', { multiline: true })]),
    arrayGroup('브랜치', 'branches', (index) => [
      field('브랜치 제목', `branches.${index}.title`),
      stringListGroup(`브랜치 ${index + 1} 항목`, `branches.${index}.items`)
    ], { title: '새 브랜치', items: ['세부 항목'] })
  ];
}

function renderVisualHero() {
  return [
    stringListGroup('포인트', 'points', '포인트'),
    arrayGroup('이미지 레일', 'visuals', (index) => [
      field('출처', `visuals.${index}.source`),
      field('제목', `visuals.${index}.title`),
      field('URL', `visuals.${index}.url`)
    ], { source: 'manual', title: 'reference', url: '' })
  ];
}

function renderBento() {
  return arrayGroup('Bento 타일', 'tiles', (index) => [
    field('라벨', `tiles.${index}.label`),
    field('값', `tiles.${index}.value`),
    field('본문', `tiles.${index}.body`, { multiline: true })
  ], { label: 'Key', value: '핵심', body: '요약 설명' });
}

function renderRiskControl() {
  return arrayGroup('리스크', 'risks', (index) => [
    field('Risk', `risks.${index}.risk`, { multiline: true }),
    field('Control', `risks.${index}.control`, { multiline: true }),
    field('Owner', `risks.${index}.owner`)
  ], { risk: '리스크', control: '통제 방안', owner: '담당' });
}

function renderAppendix() {
  return arrayGroup('근거', 'notes', (index) => [
    field('라벨', `notes.${index}.label`),
    field('값', `notes.${index}.value`, { multiline: true })
  ], { label: '근거', value: '상세 내용' });
}

function renderPatternFields() {
  const slide = currentSlide();
  if (!slide) return [];
  switch (slide.pattern) {
    case 'cards': return [renderCards()];
    case 'split': return renderSplit();
    case 'matrix': return renderMatrix();
    case 'roadmap': return [renderRoadmap()];
    case 'issue-tree': return renderIssueTree();
    case 'visual-hero': return renderVisualHero();
    case 'bento-synthesis': return [renderBento()];
    case 'risk-control': return [renderRiskControl()];
    case 'appendix': return [renderAppendix()];
    case 'title':
    default:
      return [];
  }
}

function renderForm() {
  nodes.editorForm.innerHTML = '';
  if (!currentSlide()) {
    nodes.editorForm.append(createEl('div', 'empty-state', '장표가 없습니다.'));
    return;
  }
  nodes.editorForm.append(renderSharedFields(), ...renderPatternFields());
}

function renderAll() {
  nodes.deckTitle.value = state.content.title || '';
  nodes.reportPath.textContent = state.report.relativeReportDir;
  renderSlideList();
  renderPatternOptions();
  renderForm();
  updatePreviewScale();
}

function refreshPreview() {
  nodes.reportPreview.src = `/report/index.html?ts=${Date.now()}#/${state.current + 1}`;
}

function setCurrent(index) {
  state.current = Math.max(0, Math.min(state.content.slides.length - 1, index));
  renderAll();
  refreshPreview();
}

async function loadReport() {
  nodes.saveState.textContent = 'Loading';
  const report = await fetch('/api/report').then((response) => response.json());
  state.report = report;
  state.content = report.content;
  state.patterns = report.patterns;
  state.current = Math.min(state.current, Math.max(0, state.content.slides.length - 1));
  state.dirty = false;
  nodes.saveState.textContent = report.validation.ok ? 'Saved' : 'Schema issue';
  renderAll();
  refreshPreview();
}

async function saveReport() {
  nodes.saveButton.disabled = true;
  nodes.saveState.textContent = 'Saving';
  const response = await fetch('/api/save', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content: state.content })
  });
  const payload = await response.json();
  nodes.saveButton.disabled = false;

  if (!payload.ok) {
    nodes.saveState.textContent = 'Save failed';
    nodes.qaOutput.textContent = (payload.errors || []).join('\n');
    return;
  }

  state.report = payload.report;
  state.content = payload.report.content;
  state.dirty = false;
  nodes.saveState.textContent = 'Saved';
  renderAll();
  refreshPreview();
}

async function runQa(check) {
  nodes.qaOutput.textContent = `${check} 실행 중...`;
  const response = await fetch('/api/qa', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ checks: [check] })
  });
  const payload = await response.json();
  nodes.qaOutput.textContent = payload.results
    .map((result) => [
      `[${result.ok ? 'PASS' : 'FAIL'}] ${result.label}`,
      result.stdout.trim(),
      result.stderr.trim()
    ].filter(Boolean).join('\n'))
    .join('\n\n');
}

function addSlide() {
  const slide = patternDefaults.cards();
  state.content.slides.push(slide);
  markDirty();
  setCurrent(state.content.slides.length - 1);
}

function moveInArray(array, index, delta) {
  const next = index + delta;
  if (next < 0 || next >= array.length) return false;
  const [item] = array.splice(index, 1);
  array.splice(next, 0, item);
  return true;
}

function handleFormAction(button) {
  const slide = currentSlide();
  const action = button.dataset.action;
  const detail = button.dataset.detail || '';

  if (action === 'move-slide') {
    if (moveInArray(state.content.slides, state.current, Number(detail))) {
      state.current += Number(detail);
      markDirty();
      renderAll();
    }
  }

  if (action === 'duplicate-slide') {
    state.content.slides.splice(state.current + 1, 0, clone(slide));
    state.current += 1;
    markDirty();
    renderAll();
  }

  if (action === 'delete-slide') {
    if (state.content.slides.length <= 1) return;
    if (!confirm('선택한 장표를 삭제할까요?')) return;
    state.content.slides.splice(state.current, 1);
    state.current = Math.min(state.current, state.content.slides.length - 1);
    markDirty();
    renderAll();
    refreshPreview();
  }

  if (action === 'add-array-item') {
    const array = getAt(slide, detail);
    array.push(JSON.parse(button.dataset.value));
    markDirty();
    renderForm();
  }

  if (action === 'remove-array-item') {
    const parts = detail.split('.');
    const index = Number(parts.pop());
    const array = getAt(slide, parts.join('.'));
    array.splice(index, 1);
    markDirty();
    renderForm();
  }

  if (action === 'move-array-item') {
    const parts = detail.split('.');
    const delta = Number(parts.pop());
    const index = Number(parts.pop());
    const array = getAt(slide, parts.join('.'));
    if (moveInArray(array, index, delta)) {
      markDirty();
      renderForm();
    }
  }
}

nodes.slideList.addEventListener('click', (event) => {
  const button = event.target.closest('.slide-thumb');
  if (!button) return;
  setCurrent(Number(button.dataset.index));
});

nodes.editorForm.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  handleFormAction(button);
});

nodes.editorForm.addEventListener('input', (event) => {
  const input = event.target.closest('[data-path]');
  if (!input) return;
  const value = input.type === 'number' ? Number(input.value) : input.value;
  setAt(currentSlide(), input.dataset.path, value);
  markDirty();
  renderSlideList();
  nodes.activeSlideTitle.textContent = currentSlide().title || '장표 선택';
});

nodes.deckTitle.addEventListener('input', () => {
  state.content.title = nodes.deckTitle.value;
  markDirty();
});

nodes.slidePattern.addEventListener('change', () => {
  ensurePatternFields(currentSlide(), nodes.slidePattern.value);
  markDirty();
  renderAll();
});

nodes.addSlideButton.addEventListener('click', addSlide);
nodes.reloadButton.addEventListener('click', loadReport);
nodes.saveButton.addEventListener('click', saveReport);
nodes.schemaButton.addEventListener('click', () => runQa('validate'));
nodes.linebreakButton.addEventListener('click', () => runQa('linebreak'));
nodes.overflowButton.addEventListener('click', () => runQa('overflow'));

window.addEventListener('resize', updatePreviewScale);

function updatePreviewScale() {
  const stage = document.querySelector('.preview-stage');
  if (!stage) return;
  const scale = Math.max(.25, Math.min(.62, (stage.clientWidth - 72) / 1920, (stage.clientHeight - 72) / 1080));
  stage.style.setProperty('--preview-scale', scale.toFixed(3));
  nodes.previewViewport.style.setProperty('--preview-scale', scale.toFixed(3));
}

await loadReport();
