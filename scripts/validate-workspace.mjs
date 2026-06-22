import fs from 'node:fs';
import path from 'node:path';
import { validateBrief } from './report-schema.mjs';

const required = [
  'AGENTS.md',
  '.agents/skills/korean-executive-html-report/SKILL.md',
  '.agents/skills/korean-executive-html-report/open-design.json',
  'design-systems/korean-executive-report/DESIGN.md',
  'design-systems/korean-executive-report/tokens.css',
  'prompts/01_create_report.md',
  'examples/sample-report-brief.json',
  'scripts/create-report.mjs'
];

const args = process.argv.slice(2);
const briefIndex = args.indexOf('--brief');
const briefPath = briefIndex >= 0 ? args[briefIndex + 1] : 'examples/sample-report-brief.json';

let ok = true;

for (const file of required) {
  const exists = fs.existsSync(path.resolve(file));
  console.log(`${exists ? '✓' : '✗'} ${file}`);
  if (!exists) ok = false;
}

if (!briefPath) {
  console.error('\n--brief 옵션 뒤에 JSON 파일 경로가 필요합니다.');
  process.exit(1);
}

if (!fs.existsSync(path.resolve(briefPath))) {
  console.error(`\n브리프 파일을 찾을 수 없습니다: ${briefPath}`);
  process.exit(1);
}

try {
  const brief = JSON.parse(fs.readFileSync(path.resolve(briefPath), 'utf-8'));
  const errors = validateBrief(brief);
  if (errors.length > 0) {
    ok = false;
    console.error('\n브리프 구조 오류:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
  } else {
    console.log(`✓ ${briefPath} schema`);
  }
} catch (error) {
  ok = false;
  console.error(`\n브리프 JSON을 읽을 수 없습니다: ${briefPath}`);
  console.error(error.message);
}

if (!ok) {
  console.error('\nWorkspace validation failed.');
  process.exit(1);
}

console.log('\nWorkspace validation passed.');
