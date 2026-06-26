# open-design 폴더 감리 보고서

작성일: 2026-06-27
대상 경로: `/Volumes/mac_dock/github/opendesign`
감리 기준: GitHub에는 생성 체계만 올리고, `reports/`와 `exports/`는 로컬 산출물로 관리

## 1. 한 줄 결론

이 저장소는 한국어 임원보고 HTML 덱을 만드는 “작업 체계”를 보관하는 곳이다. 실제 보고서 HTML, PNG, PDF, QA 스크린샷은 결과물이므로 GitHub 추적 대상에서 제외한다.

## 2. GitHub에 남길 것

| 구분 | 경로 | 판단 |
|---|---|---|
| 프로젝트 지침 | `AGENTS.md`, `README.md`, `prompts/` | 보고서 작성 규칙과 사용 흐름 |
| 스킬 | `.agents/skills/korean-executive-html-report/` | 한국어 임원보고 생성 절차 |
| 디자인 시스템 | `design-systems/korean-executive-report/` | 1920x1080 덱 토큰과 컴포넌트 기준 |
| 입력 예시 | `examples/*.json` | 보고서 생성 브리프와 레퍼런스 입력 |
| 생성/검증 도구 | `scripts/*.mjs` | HTML 생성, 스키마 검증, export, 회귀 테스트 |
| 카탈로그 | `open-design-catalog/*.json` | Open Design 템플릿/스킬 로컬 스냅샷 |

## 3. GitHub에서 뺄 것

| 경로 | 이유 | 처리 |
|---|---|---|
| `reports/` | HTML 덱, `slides.json`, `content.json`, 보고서별 README는 생성 결과물 | `.gitignore` 처리, Git 추적 제거 |
| `exports/` | PNG/PDF/export plan/overflow report 산출물 | `.gitignore` 처리 |
| `node_modules/` | 설치 의존성 | `.gitignore` 처리 |
| `.env` | 개인 환경값과 비밀값 가능성 | `.gitignore` 처리 |

## 4. 이번 감리에서 확인한 문제

| 우선순위 | 문제 | 조치 |
|---|---|---|
| P1 | GitHub에 보고서 결과물이 올라가 있어 repo 목적과 충돌 | `reports/` 전체 Git 추적 제거 |
| P1 | 테스트가 GitHub 내 reports 존재를 전제로 함 | 테스트를 임시 출력물 기준으로 변경 |
| P1 | 생성기와 최신 보고서 런타임 기준 혼재 | 생성기를 autoscale 런타임으로 통일 |
| P2 | `.gitignore`가 export 개별 확장자를 중복 나열 | `exports/`, `reports/` 단위 ignore로 정리 |
| P2 | 문서가 reports 추적 상태를 전제로 설명 | README와 감리 문서에 “reports는 로컬 산출물” 정책 반영 |

## 5. 로컬 사용 흐름

```bash
npm run validate
npm test
npm run sample
npm run sample:premium
node scripts/create-report.mjs examples/folder-audit-brief.json reports/folder-audit-harness-example
node scripts/export-deck.mjs reports/folder-audit-harness-example/index.html exports/folder-audit-harness-example --check-overflow --no-pdf
```

위 명령은 로컬 `reports/`와 `exports/`에 결과물을 만든다. 이 폴더들은 GitHub에 올라가지 않는다.

## 6. 검증 기준

| 명령 | 목적 |
|---|---|
| `npm run validate` | 필수 스킬/디자인/스크립트/브리프 존재와 브리프 스키마 확인 |
| `npm test` | 생성기, 레퍼런스 병합, export dry-run, autoscale 런타임 계약 확인 |
| `node scripts/export-deck.mjs ... --check-overflow` | 특정 로컬 보고서의 1920x1080 overflow 확인 |

## 7. 최종 판단

GitHub에는 “보고서를 만드는 방법”만 남기고, “만들어진 보고서”는 로컬 결과물로 두는 편이 맞다. 이 방식이 개인 경로, 외부 이미지, 고객/주제별 산출물, QA 스크린샷이 원격 저장소에 섞이는 문제를 막는다.
