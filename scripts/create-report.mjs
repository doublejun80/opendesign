import fs from 'node:fs';
import path from 'node:path';
import { assertValidBrief } from './report-schema.mjs';

const input = process.argv[2] || 'examples/sample-report-brief.json';
const outDir = process.argv[3] || 'reports/sample-executive-report';

const brief = JSON.parse(fs.readFileSync(input, 'utf-8'));

try {
  assertValidBrief(brief);
} catch (error) {
  console.error('보고서 브리프 검증에 실패했습니다.');
  console.error(error.message);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(outDir, 'assets'), { recursive: true });
fs.writeFileSync(path.join(outDir, 'assets', '.gitkeep'), '', { flag: 'a' });

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const slugClass = (value = 'manual') => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9-]+/g, '-')
  .replace(/^-|-$/g, '') || 'manual';

function renderSourceLabels() {
  if (brief.showSourcesOnSlide !== true) return '';
  if (!Array.isArray(brief.references) || brief.references.length === 0) return '';

  const labels = brief.references.map(reference => `
    <span class="source-label source-${slugClass(reference.source)}">${escapeHtml(reference.source)} · ${escapeHtml(reference.title)}</span>`).join('');

  return `<div class="source-strip" aria-label="reference sources">${labels}</div>`;
}

function renderFooter(i) {
  return `
  ${renderSourceLabels()}
  <div class="footer-note"><span>${escapeHtml(brief.title)}</span><span>${i + 1}/${brief.slides.length}</span></div>`;
}

function renderHeader(slide, fallback = 'EXECUTIVE REPORT') {
  return `
  <div class="kicker">${escapeHtml(slide.kicker || fallback)}</div>
  <h1 class="title">${escapeHtml(slide.title)}</h1>`;
}

function slideTitle(slide, i) {
  return `
<section class="slide dark" data-slide="${i}">
${renderHeader(slide, 'EXECUTIVE ASK')}
  <p class="subtitle">${escapeHtml(slide.subtitle || brief.decisionAsk || '')}</p>
  <div class="title-meta">
    <span>${escapeHtml(brief.audience || '보고 대상 미정')}</span>
    <span>${new Date().toISOString().slice(0, 10)}</span>
  </div>${renderFooter(i)}
</section>`;
}

function slideCards(slide, i) {
  const cards = (slide.cards || []).map(card => `
    <article class="card solid">
      ${card.metric ? `<div class="metric">${escapeHtml(card.metric)}</div>` : ''}
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.body)}</p>
    </article>`).join('');

  return `
<section class="slide" data-slide="${i}">
${renderHeader(slide, 'SUMMARY')}
  <div class="grid-3 body-area">${cards}</div>${renderFooter(i)}
</section>`;
}

function slideSplit(slide, i) {
  const left = (slide.leftItems || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
  const right = (slide.rightItems || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');

  return `
<section class="slide" data-slide="${i}">
${renderHeader(slide, 'SITUATION')}
  <div class="split body-area">
    <article class="card solid split-card muted"><h3>${escapeHtml(slide.leftTitle || 'As-Is')}</h3><ul>${left}</ul></article>
    <div class="arrow">→</div>
    <article class="card solid split-card strong"><h3>${escapeHtml(slide.rightTitle || 'To-Be')}</h3><ul>${right}</ul></article>
  </div>${renderFooter(i)}
</section>`;
}

function slideMatrix(slide, i) {
  const columns = slide.columns || [];
  const head = [`<div class="cell head">구분</div>`, ...columns.map((column, index) => `<div class="cell head ${index === slide.recommendedIndex ? 'recommend' : ''}">${escapeHtml(column)}</div>`)].join('');
  const rows = (slide.rows || []).map(row => `<div class="row"><div class="cell head">${escapeHtml(row.label)}</div>${row.values.map((value, index) => `<div class="cell ${index === slide.recommendedIndex ? 'recommend' : ''}">${escapeHtml(value)}</div>`).join('')}</div>`).join('');

  return `
<section class="slide" data-slide="${i}">
${renderHeader(slide, 'OPTION MATRIX')}
  <div class="matrix body-area"><div class="row">${head}</div>${rows}</div>${renderFooter(i)}
</section>`;
}

function slideRoadmap(slide, i) {
  const phases = (slide.phases || []).map((phase, index) => `
    <article class="phase">
      <div class="phase-num">PHASE ${index + 1}</div>
      <h3>${escapeHtml(phase.title)}</h3>
      <p>${escapeHtml(phase.body)}</p>
    </article>`).join('');

  return `
<section class="slide" data-slide="${i}">
${renderHeader(slide, 'ROADMAP')}
  <div class="roadmap body-area">${phases}</div>${renderFooter(i)}
</section>`;
}

function slideIssueTree(slide, i) {
  const branches = (slide.branches || []).map(branch => `
    <article class="issue-branch">
      <h3>${escapeHtml(branch.title)}</h3>
      <ul>${(branch.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </article>`).join('');

  return `
<section class="slide" data-slide="${i}">
${renderHeader(slide, 'ISSUE TREE')}
  <div class="issue-tree body-area">
    <div class="issue-root">
      <span class="small-label">핵심 쟁점</span>
      <strong>${escapeHtml(slide.root)}</strong>
    </div>
    <div class="issue-branches">${branches}</div>
  </div>${renderFooter(i)}
</section>`;
}

function slideVisualHero(slide, i) {
  const points = (slide.points || []).map((point, index) => `
      <li><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(point)}</li>`).join('');

  const visuals = (slide.visuals || []).map((visual, index) => `
      <figure class="visual-shot shot-${index + 1}">
        <img src="${escapeHtml(visual.url)}" alt="${escapeHtml(visual.title)}" />
        <figcaption>${escapeHtml(visual.source)} · ${escapeHtml(visual.title)}</figcaption>
      </figure>`).join('');

  return `
<section class="slide visual dark" data-slide="${i}">
${renderHeader(slide, 'VISUAL SYSTEM')}
  <div class="visual-hero body-area">
    <div class="visual-copy">
      <p>${escapeHtml(slide.subtitle || '')}</p>
      <ul>${points}</ul>
    </div>
    <div class="visual-rail" aria-label="reference images">${visuals}</div>
  </div>${renderFooter(i)}
</section>`;
}

function slideBentoSynthesis(slide, i) {
  const tiles = (slide.tiles || []).map((tile, index) => `
    <article class="bento-tile tile-${index + 1}">
      <span>${escapeHtml(tile.label)}</span>
      <strong>${escapeHtml(tile.value)}</strong>
      <p>${escapeHtml(tile.body)}</p>
    </article>`).join('');

  return `
<section class="slide bento-slide" data-slide="${i}">
${renderHeader(slide, 'BENTO SYNTHESIS')}
  <div class="bento-synthesis body-area">${tiles}</div>${renderFooter(i)}
</section>`;
}

function slideRiskControl(slide, i) {
  const rows = (slide.risks || []).map((item, index) => `
    <article class="risk-row">
      <div class="risk-index">${String(index + 1).padStart(2, '0')}</div>
      <div>
        <span class="small-label">Risk</span>
        <strong>${escapeHtml(item.risk)}</strong>
      </div>
      <div>
        <span class="small-label">Control</span>
        <p>${escapeHtml(item.control)}</p>
      </div>
      <div class="owner">${escapeHtml(item.owner || '담당 미정')}</div>
    </article>`).join('');

  return `
<section class="slide" data-slide="${i}">
${renderHeader(slide, 'RISK & CONTROL')}
  <div class="risk-grid body-area">${rows}</div>${renderFooter(i)}
</section>`;
}

function slideAppendix(slide, i) {
  const notes = (slide.notes || []).map(note => `
    <article class="appendix-item">
      <span>${escapeHtml(note.label || '근거')}</span>
      <strong>${escapeHtml(note.value || note)}</strong>
    </article>`).join('');

  return `
<section class="slide" data-slide="${i}">
${renderHeader(slide, 'APPENDIX')}
  <div class="appendix-grid body-area">${notes}</div>${renderFooter(i)}
</section>`;
}

function renderSlide(slide, i) {
  switch (slide.pattern) {
    case 'title': return slideTitle(slide, i);
    case 'cards': return slideCards(slide, i);
    case 'split': return slideSplit(slide, i);
    case 'matrix': return slideMatrix(slide, i);
    case 'roadmap': return slideRoadmap(slide, i);
    case 'issue-tree': return slideIssueTree(slide, i);
    case 'visual-hero': return slideVisualHero(slide, i);
    case 'bento-synthesis': return slideBentoSynthesis(slide, i);
    case 'risk-control': return slideRiskControl(slide, i);
    case 'appendix': return slideAppendix(slide, i);
    default: return slideCards(slide, i);
  }
}

const tokenPath = path.resolve('design-systems/korean-executive-report/tokens.css');
const tokenCss = fs.existsSync(tokenPath) ? fs.readFileSync(tokenPath, 'utf-8') : '';

const css = `
${tokenCss}

:root {
  --kr-radius-sm: 12px;
  --kr-radius-md: 18px;
  --kr-radius-lg: 26px;
  --kr-deck-scale: 1;
  --kr-active-slide: 0;
}

body {
  margin: 0;
  background: #d8d8d8;
  font-family: var(--kr-font-sans);
  color: var(--kr-ink);
  height: 100vh;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.viewport {
  width: calc(var(--kr-slide-w) * var(--kr-deck-scale, 1));
  height: calc(var(--kr-slide-h) * var(--kr-deck-scale, 1));
  overflow: hidden;
  position: relative;
}

.deck {
  width: var(--kr-slide-w);
  height: var(--kr-slide-h);
  margin: 0;
  overflow: hidden;
  transform: scale(var(--kr-deck-scale, 1));
  transform-origin: top left;
}

.deck:focus { outline: none; }
.deck::-webkit-scrollbar { display: none; }

.deck > .track {
  width: max-content;
  height: var(--kr-slide-h);
  display: flex;
  transform: translateX(calc(var(--kr-active-slide, 0) * -1 * var(--kr-slide-w)));
  transition: transform 280ms ease;
}

.slide {
  position: relative;
  flex: 0 0 var(--kr-slide-w);
  width: var(--kr-slide-w);
  height: var(--kr-slide-h);
  padding: var(--kr-margin-y) var(--kr-margin-x);
  background: linear-gradient(135deg, rgba(255,255,255,.38), rgba(255,255,255,0) 44%), var(--kr-bg);
  overflow: hidden;
  page-break-after: always;
}

.slide::after {
  content: "";
  position: absolute;
  right: 72px;
  top: 72px;
  width: 240px;
  height: 240px;
  border: 1px solid rgba(36, 87, 197, .14);
  border-radius: 50%;
  opacity: .42;
  pointer-events: none;
}

.slide.dark {
  color: white;
  background: linear-gradient(135deg, #101722 0%, #172133 64%, #101722 100%);
}

.slide.visual {
  background:
    linear-gradient(115deg, rgba(10,16,28,.96) 0%, rgba(17,24,39,.92) 46%, rgba(36,87,197,.48) 100%),
    #101722;
}

.slide.bento-slide {
  background:
    linear-gradient(135deg, rgba(255,255,255,.72) 0%, rgba(236,241,255,.62) 54%, rgba(255,244,219,.62) 100%),
    var(--kr-bg);
}

.slide.dark::after { border-color: rgba(152,183,255,.22); }

.kicker {
  position: relative;
  z-index: 1;
  font-size: 25px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--kr-blue);
  font-weight: 850;
  margin-bottom: 18px;
}

.dark .kicker { color: #98b7ff; }

.title {
  position: relative;
  z-index: 1;
  font-size: 62px;
  line-height: 1.14;
  letter-spacing: 0;
  font-weight: 850;
  margin: 0;
  max-width: 1450px;
  word-break: keep-all;
}

.subtitle {
  position: relative;
  z-index: 1;
  font-size: 30px;
  line-height: 1.52;
  color: var(--kr-muted);
  max-width: 1180px;
  margin-top: 24px;
  word-break: keep-all;
}

.dark .subtitle { color: rgba(255,255,255,.72); }

.title-meta {
  position: absolute;
  left: var(--kr-margin-x);
  right: var(--kr-margin-x);
  bottom: 150px;
  display: flex;
  gap: 18px;
  font-size: 24px;
  color: rgba(255,255,255,.68);
}

.title-meta span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.18);
  padding: 12px 18px;
  border-radius: 999px;
  line-height: 1;
}

.body-area { margin-top: 54px; position: relative; z-index: 1; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }

.card,
.issue-branch,
.risk-row,
.appendix-item,
.phase {
  background: var(--kr-card-solid);
  border: 1px solid var(--kr-line);
  border-radius: var(--kr-radius-lg);
  box-shadow: var(--kr-shadow-soft);
}

.card { padding: 34px 36px; min-height: 430px; }
.card h3 { font-size: 32px; line-height: 1.25; margin: 18px 0 14px; letter-spacing: 0; word-break: keep-all; }
.card p { font-size: 27px; line-height: 1.52; color: var(--kr-muted); margin: 0; word-break: keep-all; }
.metric { font-size: 84px; line-height: .95; letter-spacing: 0; font-weight: 900; color: var(--kr-blue); }

.split { display: grid; grid-template-columns: 1fr 90px 1fr; gap: 28px; align-items: stretch; }
.split-card { min-height: 520px; }
.split-card h3 { font-size: 42px; margin-bottom: 30px; }
ul { padding-left: 30px; margin: 0; }
li { font-size: 31px; line-height: 1.65; margin-bottom: 12px; word-break: keep-all; }
.arrow { display: grid; place-items: center; font-size: 64px; color: var(--kr-blue); font-weight: 900; }
.strong { background: var(--kr-blue-soft); border-color: rgba(36,87,197,.28); }

.matrix { display: grid; border: 1px solid var(--kr-line); border-radius: 24px; overflow: hidden; background: rgba(255,255,255,.62); }
.matrix .row { display: grid; grid-template-columns: 1.15fr repeat(3, 1fr); }
.matrix .cell { padding: 26px 28px; border-right: 1px solid var(--kr-line); border-bottom: 1px solid var(--kr-line); font-size: 25px; line-height: 1.42; word-break: keep-all; }
.matrix .cell:last-child { border-right: 0; }
.matrix .head { font-weight: 850; background: rgba(255,255,255,.78); }
.matrix .recommend { background: var(--kr-blue-soft); color: var(--kr-blue); font-weight: 850; }

.roadmap { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
.phase { min-height: 445px; padding: 32px; }
.phase-num { font-size: 22px; color: var(--kr-blue); font-weight: 900; margin-bottom: 18px; }
.phase h3 { font-size: 32px; margin: 0 0 18px; word-break: keep-all; }
.phase p { font-size: 25px; line-height: 1.48; color: var(--kr-muted); word-break: keep-all; }

.issue-tree { display: grid; grid-template-columns: 360px 1fr; gap: 34px; align-items: stretch; }
.issue-root {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 520px;
  padding: 42px;
  color: white;
  background: var(--kr-navy);
  border-radius: var(--kr-radius-lg);
}
.issue-root strong { font-size: 48px; line-height: 1.18; margin-top: 18px; word-break: keep-all; }
.issue-branches { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.issue-branch { padding: 34px; min-height: 520px; }
.issue-branch h3 { font-size: 32px; margin: 0 0 26px; word-break: keep-all; }
.issue-branch li { font-size: 27px; line-height: 1.48; }

.visual-hero {
  display: grid;
  grid-template-columns: .86fr 1.14fr;
  gap: 54px;
  align-items: stretch;
}

.visual-copy {
  min-height: 560px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 18px;
}

.visual-copy p {
  max-width: 680px;
  margin: 0 0 42px;
  font-size: 31px;
  line-height: 1.5;
  color: rgba(255,255,255,.74);
  word-break: keep-all;
}

.visual-copy ul {
  display: grid;
  gap: 16px;
  padding: 0;
  list-style: none;
}

.visual-copy li {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 18px;
  align-items: center;
  margin: 0;
  padding: 20px 22px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 18px;
  background: rgba(255,255,255,.08);
  color: rgba(255,255,255,.88);
  font-size: 26px;
  line-height: 1.34;
}

.visual-copy li span {
  color: #ffd166;
  font-weight: 900;
  font-size: 24px;
}

.visual-rail {
  position: relative;
  min-height: 610px;
}

.visual-shot {
  position: absolute;
  width: 295px;
  margin: 0;
  padding: 12px;
  border-radius: 34px;
  background: rgba(255,255,255,.9);
  box-shadow: 0 28px 70px rgba(0,0,0,.34);
}

.visual-shot img {
  display: block;
  width: 100%;
  height: 470px;
  object-fit: cover;
  object-position: top;
  border-radius: 24px;
  background: #f5f5f7;
}

.visual-shot figcaption {
  padding: 12px 6px 2px;
  color: rgba(17,24,39,.72);
  font-size: 15px;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shot-1 { left: 34px; top: 12px; transform: rotate(-5deg); }
.shot-2 { left: 318px; top: 88px; transform: rotate(3deg); }
.shot-3 { right: 18px; top: 28px; transform: rotate(6deg); }
.shot-4 { right: 232px; bottom: 0; transform: rotate(-2deg); }

.bento-synthesis {
  display: grid;
  grid-template-columns: 1.25fr .82fr .82fr;
  grid-template-rows: 260px 260px;
  gap: 22px;
}

.bento-tile {
  position: relative;
  overflow: hidden;
  padding: 30px;
  border: 1px solid rgba(22,25,31,.12);
  border-radius: 22px;
  background: rgba(255,255,255,.82);
  box-shadow: 0 18px 40px rgba(17,24,39,.08);
}

.bento-tile::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  right: -34px;
  bottom: -34px;
  border: 1px solid rgba(36,87,197,.18);
  transform: rotate(18deg);
}

.bento-tile span {
  display: block;
  font-size: 20px;
  color: var(--kr-blue);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.bento-tile strong {
  display: block;
  margin-top: 18px;
  font-size: 42px;
  line-height: 1.08;
  word-break: keep-all;
}

.bento-tile p {
  max-width: 560px;
  margin: 18px 0 0;
  font-size: 24px;
  line-height: 1.42;
  color: var(--kr-muted);
  word-break: keep-all;
}

.tile-1 {
  grid-row: span 2;
  color: white;
  background:
    linear-gradient(140deg, rgba(17,24,39,.98), rgba(36,87,197,.82)),
    var(--kr-navy);
}
.tile-1 span, .tile-1 p { color: rgba(255,255,255,.74); }
.tile-2 { background: #fff7e6; }
.tile-3 { background: #e9eefc; }
.tile-4 { grid-column: span 2; background: #ffffff; }

.risk-grid { display: grid; gap: 18px; }
.risk-row {
  display: grid;
  grid-template-columns: 78px 1.05fr 1.7fr 190px;
  gap: 24px;
  align-items: center;
  padding: 25px 30px;
}
.risk-index { font-size: 34px; color: var(--kr-blue); font-weight: 900; }
.risk-row strong { display: block; font-size: 28px; line-height: 1.3; word-break: keep-all; }
.risk-row p { margin: 6px 0 0; font-size: 25px; line-height: 1.42; color: var(--kr-muted); word-break: keep-all; }
.owner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: end;
  box-sizing: border-box;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--kr-blue-soft);
  color: var(--kr-blue);
  font-size: 22px;
  line-height: 1;
  font-weight: 850;
}

.appendix-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.appendix-item { min-height: 210px; padding: 30px; }
.appendix-item span, .small-label { display: block; font-size: 20px; line-height: 1.3; color: var(--kr-muted); font-weight: 850; text-transform: uppercase; letter-spacing: .04em; }
.appendix-item strong { display: block; margin-top: 16px; font-size: 30px; line-height: 1.34; word-break: keep-all; }

.source-strip {
  position: absolute;
  left: var(--kr-margin-x);
  bottom: 76px;
  display: flex;
  gap: 10px;
  max-width: 1320px;
  flex-wrap: wrap;
  z-index: 2;
}

.source-label {
  display: inline-flex;
  align-items: center;
  max-width: 420px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 16px;
  line-height: 1.25;
  color: var(--kr-muted);
  background: rgba(255,255,255,.72);
  border: 1px solid var(--kr-line);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .source-label { color: rgba(255,255,255,.74); background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.14); }
.source-lazyweb { border-color: rgba(36,87,197,.32); }
.source-mobbin { border-color: rgba(183,121,31,.32); }

.footer-note {
  position: absolute;
  left: var(--kr-margin-x);
  right: var(--kr-margin-x);
  bottom: 38px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  font-size: 19px;
  color: rgba(104,112,124,.86);
  z-index: 2;
}

.dark .footer-note { color: rgba(255,255,255,.56); }

@media print {
  body { background: white; height: auto; overflow: visible; }
  .viewport {
    width: var(--kr-slide-w);
    height: auto;
    overflow: visible;
  }
  .deck {
    display: block;
    width: var(--kr-slide-w);
    height: auto;
    margin: 0;
    overflow: visible;
    transform: none;
  }
  .deck > .track {
    display: block;
    width: var(--kr-slide-w);
    height: auto;
    transform: none;
    transition: none;
  }
  .slide {
    flex: none;
    page-break-after: always;
    break-after: page;
  }
}
`;

const js = `
const root = document.documentElement;
const deck = document.querySelector('.deck');
const slides = [...document.querySelectorAll('.slide')];
let current = 0;

function clampSlide(n) {
  return Math.max(0, Math.min(slides.length - 1, n));
}

function setScale() {
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  root.style.setProperty('--kr-deck-scale', String(Math.max(0.1, scale)));
}

function replaceHash() {
  try {
    history.replaceState(null, '', \`#/\${current + 1}\`);
  } catch {
    // Ignore srcdoc/file-history restrictions.
  }
}

function indexFromHash() {
  const match = location.hash.match(/^#\\/?(\\d+)$/);
  if (!match) return null;
  return clampSlide(Number(match[1]) - 1);
}

function show(n, options = {}) {
  const { updateHash = true } = options;
  const parsed = Number.isFinite(Number(n)) ? Number(n) : 0;
  current = clampSlide(parsed);
  root.style.setProperty('--kr-active-slide', String(current));
  slides.forEach((slide, index) => {
    slide.setAttribute('aria-hidden', index === current ? 'false' : 'true');
  });
  if (updateHash) replaceHash();
}

window.addEventListener('keydown', event => {
  if (event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
    event.preventDefault();
    show(current + 1);
  }
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
    event.preventDefault();
    show(current - 1);
  }
  if (event.key === 'Home') {
    event.preventDefault();
    show(0);
  }
  if (event.key === 'End') {
    event.preventDefault();
    show(slides.length - 1);
  }
});

window.addEventListener('hashchange', () => {
  const hashed = indexFromHash();
  if (hashed !== null) show(hashed, { updateHash: false });
});

window.addEventListener('resize', setScale);
document.fonts?.ready?.then(setScale).catch(() => {});
window.__openDesignDeck = { go: show, count: slides.length, get current() { return current; } };

setScale();
const hashed = indexFromHash();
if (hashed !== null) {
  show(hashed, { updateHash: false });
} else {
  show(0, { updateHash: false });
}
deck?.focus({ preventScroll: true });
`;

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(brief.title)}</title>
<style>${css}</style>
</head>
<body>
<div class="viewport">
  <main class="deck" tabindex="0" aria-label="Korean executive report deck">
    <div class="track">
${brief.slides.map(renderSlide).join('\n')}
    </div>
  </main>
</div>
<script>${js}</script>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
fs.writeFileSync(path.join(outDir, 'slides.json'), JSON.stringify(brief.slides, null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'content.json'), JSON.stringify(brief, null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'README.md'), `# ${brief.title}

Korean executive HTML report deck generated from a structured brief.

## Files

- \`index.html\`: browser-ready 1920x1080 autoscale deck
- \`slides.json\`: rendered slide data
- \`content.json\`: source brief and references
- \`assets/\`: local report assets

## QA

\`\`\`bash
node scripts/export-deck.mjs ${path.join(outDir, 'index.html')} exports/${path.basename(outDir)} --check-overflow --no-pdf
\`\`\`
`, 'utf-8');
console.log(`Generated ${path.join(outDir, 'index.html')}`);
