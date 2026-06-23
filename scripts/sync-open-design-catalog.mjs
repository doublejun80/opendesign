#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'open-design-catalog');
const BASE_URL = 'https://open-design.ai';
const SKILLS_URL = `${BASE_URL}/ko/plugins/skills/`;
const TEMPLATES_URL = `${BASE_URL}/ko/plugins/templates/`;

function decodeHtml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function absoluteUrl(url) {
  if (!url) return null;
  return new URL(url, BASE_URL).href;
}

function slugFromUrl(url, fallback) {
  if (!url) return fallback;
  return url.split('/').filter(Boolean).pop() || fallback;
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function localSkillNames() {
  const skillsDir = path.join(ROOT, '.agents', 'skills');
  try {
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  } catch {
    return [];
  }
}

function parseSkills(html, installedLocalSkills) {
  return [...html.matchAll(/<li class="catalog-row catalog-row-skill">([\s\S]*?)<\/li>/g)].map((match) => {
    const card = match[1];
    const href = card.match(/<a href="([^"]+)"/)?.[1] || '';
    const index = decodeHtml(card.match(/<span class="row-index">([\s\S]*?)<\/span>/)?.[1] || '');
    const name = decodeHtml(card.match(/<span class="row-name">([\s\S]*?)<\/span>/)?.[1] || '');
    const description = decodeHtml(card.match(/<span class="row-desc">([\s\S]*?)<\/span>/)?.[1] || '');
    const tags = [...card.matchAll(/<span class="meta-tag(?: muted)?">([\s\S]*?)<\/span>/g)].map((tag) => decodeHtml(tag[1]));
    const previewImage = card.match(/<img src="([^"]+)"/)?.[1] || null;
    const slug = slugFromUrl(href, `skill-${index}`);

    return {
      index,
      slug,
      name,
      description,
      tags,
      url: absoluteUrl(href),
      previewImage: absoluteUrl(previewImage),
      installedLocally: installedLocalSkills.includes(slug),
      localInstallPath: installedLocalSkills.includes(slug) ? `.agents/skills/${slug}` : null
    };
  });
}

function parseTemplates(html) {
  return [...html.matchAll(/<article class="tpl-card" data-mode="([^"]+)">([\s\S]*?)<\/article>/g)].map((match, idx) => {
    const mode = match[1];
    const card = match[2];
    const href = card.match(/<a class="tpl-media" href="([^"]+)"/)?.[1]
      || card.match(/<a class="tpl-excerpt" href="([^"]+)"/)?.[1]
      || '';
    const slug = slugFromUrl(href, `template-${idx + 1}`);
    const title = decodeHtml(card.match(/<h3 class="tpl-excerpt-title">([\s\S]*?)<\/h3>/)?.[1] || '');
    const description = decodeHtml(card.match(/<p class="tpl-excerpt-body">([\s\S]*?)<\/p>/)?.[1] || '');
    const mediaKind = decodeHtml(card.match(/<span class="tpl-media-kind">([\s\S]*?)<\/span>/)?.[1] || '');
    const author = decodeHtml(card.match(/<span class="tpl-author">([\s\S]*?)<\/span>/)?.[1] || '');
    const provider = decodeHtml(card.match(/<span class="tpl-meta-date">([\s\S]*?)<\/span>/)?.[1] || '');
    const poster = card.match(/poster="([^"]+)"/)?.[1] || card.match(/<img[^>]+src="([^"]+)"/)?.[1] || null;
    const video = card.match(/data-src="([^"]+\.mp4[^"]*)"/)?.[1] || null;
    const bandColor = card.match(/tpl-band[^>]*style="background:([^;"]+)/)?.[1] || null;

    return {
      index: idx + 1,
      slug,
      title,
      mode,
      mediaKind,
      author,
      provider,
      description,
      url: absoluteUrl(href),
      preview: {
        poster: absoluteUrl(poster),
        video: absoluteUrl(video)
      },
      bandColor
    };
  });
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function md(value = '') {
  return String(value).replace(/\|/g, '\\|').trim();
}

async function writeJson(fileName, value) {
  await fs.writeFile(path.join(OUT_DIR, fileName), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const [skillsHtml, templatesHtml, installedLocalSkills] = await Promise.all([
    fetchText(SKILLS_URL),
    fetchText(TEMPLATES_URL),
    localSkillNames()
  ]);

  const skills = parseSkills(skillsHtml, installedLocalSkills);
  const templates = parseTemplates(templatesHtml);
  const slideTemplates = templates.filter((template) => template.mode === 'deck' || template.mediaKind === '슬라이드');

  const generatedAt = new Date().toISOString();

  await writeJson('skills.json', {
    source: SKILLS_URL,
    generatedAt,
    officialCount: skills.length,
    installedLocalSkills,
    installedOfficialCount: skills.filter((skill) => skill.installedLocally).length,
    skills
  });

  await writeJson('templates.json', {
    source: TEMPLATES_URL,
    generatedAt,
    totalCount: templates.length,
    counts: {
      byMode: countBy(templates, 'mode'),
      byMediaKind: countBy(templates, 'mediaKind')
    },
    templates
  });

  await writeJson('templates-slide.json', {
    source: TEMPLATES_URL,
    generatedAt,
    purpose: 'Korean executive/report deck reference candidates',
    selectionRule: 'mode === "deck" or mediaKind === "슬라이드"',
    totalCount: slideTemplates.length,
    templates: slideTemplates
  });

  const markdown = [
    '# Open Design Catalog Snapshot',
    '',
    'Local snapshot of the Open Design plugin catalog used by this workspace.',
    '',
    '## Sources',
    '',
    `- Skills: ${SKILLS_URL}`,
    `- Templates: ${TEMPLATES_URL}`,
    '',
    '## Generated Files',
    '',
    '- `skills.json`: official instruction skill catalog plus local install status',
    '- `SKILLS.md`: human-readable skill list with title, description, source, and install path',
    '- `templates.json`: all plugin templates from the catalog',
    '- `templates-slide.json`: slide/deck templates most relevant to this report workspace',
    '',
    '## Current Counts',
    '',
    `- Official skills: ${skills.length}`,
    `- Locally installed official skills: ${skills.filter((skill) => skill.installedLocally).length}`,
    `- Local workspace skills: ${installedLocalSkills.join(', ') || '(none)'}`,
    `- All templates: ${templates.length}`,
    `- Slide/deck templates: ${slideTemplates.length}`,
    '',
    '## Refresh',
    '',
    '```bash',
    'node scripts/sync-open-design-catalog.mjs',
    '```',
    ''
  ].join('\n');

  await fs.writeFile(path.join(OUT_DIR, 'README.md'), markdown, 'utf8');

  const skillsMarkdown = [
    '# Open Design 설치 스킬 목록',
    '',
    '이 문서는 현재 `opendesign` 프로젝트에 설치된 Open Design 공식 지시 스킬을 사람이 읽기 쉬운 형태로 정리한 목록이다.',
    '',
    '## 요약',
    '',
    `- 공식 출처: ${SKILLS_URL}`,
    `- 공식 스킬 수: ${skills.length}`,
    `- 로컬 설치된 공식 스킬 수: ${skills.filter((skill) => skill.installedLocally).length}`,
    '- 설치 위치: `.agents/skills/`',
    '',
    '## 공식 스킬',
    '',
    '| 번호 | 스킬 | 제목 | 설명 | 설치 경로 | 출처 |',
    '|---:|---|---|---|---|---|',
    ...skills.map((skill) => [
      `| ${md(skill.index)}`,
      `\`${md(skill.slug)}\``,
      md(skill.name),
      md(skill.description),
      skill.localInstallPath ? `\`${md(skill.localInstallPath)}\`` : 'Not installed',
      `[open-design.ai](${skill.url}) |`
    ].join(' | ')),
    '',
    '## 프로젝트 전용 스킬',
    '',
    '| 스킬 | 용도 | 설치 경로 |',
    '|---|---|---|',
    '| `korean-executive-html-report` | 이 프로젝트의 한국어 임원보고/전략보고 HTML 덱 생성 전용 스킬 | `.agents/skills/korean-executive-html-report` |',
    '',
    '## 참고',
    '',
    '- 이 스킬들은 전역 `~/.codex/skills`가 아니라 이 저장소 내부에 설치되어 있다.',
    '- 다른 Codex 프로젝트에서는 자동으로 보이지 않는다. 다른 프로젝트에서도 쓰려면 해당 프로젝트에 복사하거나 전역 설치가 필요하다.',
    '- 저장소를 새로 pull한 뒤에는 Codex를 재시작하거나 새 세션을 열어야 새 로컬 스킬 목록이 반영된다.',
    '',
    '## 갱신',
    '',
    '```bash',
    'node scripts/sync-open-design-catalog.mjs',
    '```',
    ''
  ].join('\n');

  await fs.writeFile(path.join(OUT_DIR, 'SKILLS.md'), skillsMarkdown, 'utf8');

  console.log(JSON.stringify({
    skills: skills.length,
    installedOfficialSkills: skills.filter((skill) => skill.installedLocally).length,
    installedLocalSkills,
    templates: templates.length,
    slideTemplates: slideTemplates.length,
    output: path.relative(ROOT, OUT_DIR)
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
