# open-design 전체 폴더 감리 보고서

작성일: 2026-06-27
대상 경로: `/Volumes/mac_dock/github/opendesign`
감리 방식: 4역할 코드 감리 하네스

## 1. 한 줄 결론

이 폴더는 한국어 임원보고 HTML 덱 생성 체계가 잘 잡혀 있으나, 일부 보고서와 생성기·테스트 스크립트가 서로 다른 런타임 기준을 쓰고 있어 “생성은 되지만 검수 기준이 흔들리는” 상태였다.

## 2. 4역할 감리 하네스

| 역할 | 점검 범위 | 핵심 판단 |
|---|---|---|
| 구조 감리 | Git 상태, 폴더 역할, 추적·미추적 산출물 | 추적 파일 체계는 양호, 실험 보고서와 QA 산출물은 격리 필요 |
| 런타임 감리 | `index.html`, `create-report.mjs`, `export-deck.mjs` | 구형 scroll-snap 방식과 신형 autoscale 방식 혼재 |
| 검증 감리 | `npm test`, `npm run validate`, 스키마 | 테스트가 미추적 보고서까지 검사해 실패 가능성 발생 |
| 보고서 감리 | 한국어 조판, 1920x1080 장표 구조 | 최신 보고서는 방향 양호, 샘플 생성기는 런타임 통일 필요 |

## 3. 잘된 것

| 구분 | 판단 |
|---|---|
| 프로젝트 기준 | `AGENTS.md`가 한국어 임원보고 문법, 산출 구조, GitHub 반영 원칙을 명확히 정의 |
| 스킬 체계 | `.agents/skills/korean-executive-html-report/`가 생성 절차와 QA 기준을 보유 |
| 디자인 시스템 | `design-systems/korean-executive-report/`에 토큰, 컴포넌트, 프리뷰가 분리 |
| 생성 파이프라인 | `examples/*.json` → `scripts/create-report.mjs` → `reports/<slug>/` 흐름이 반복 가능 |
| 검증 기반 | `validate-workspace.mjs`, `report-schema.mjs`, `export-deck.mjs`로 입력·출력 검증 가능 |
| 최신 산출물 | `reports/rescene-popularity-analysis/`는 autoscale 런타임과 QA 인터페이스를 이미 적용 |

## 4. 못된 것 / 중복 / 불필요

| 우선순위 | 항목 | 근거 | 처리 |
|---|---|---|---|
| P1 | 런타임 기준 혼재 | 구형 보고서에 `width: 100vw`, `overflow-x: auto`, `scroll-snap-type` 잔존 | 생성기와 추적 보고서 런타임 통일 |
| P1 | 테스트 범위 과확장 | `npm test`가 미추적 보고서까지 검사해 로컬 실험물에 영향 | Git 추적 보고서 중심으로 검사 기준 보정 |
| P2 | export 산출물 ignore 중복 | `.gitignore`가 `exports/*.png`, `exports/**/*.png`처럼 중복 패턴 보유 | `exports/` 단일 격리 규칙으로 정리 |
| P2 | QA 스크린샷 노출 가능성 | `reports/**/assets/qa/`가 실험 보고서에 생성됨 | 보고서 QA 산출물 ignore 추가 |
| P2 | 오래된 폴더 분석 문서 | 이전 문서가 Windows 경로와 “Git 저장소 아님” 판단을 포함 | 현재 저장소 기준으로 재작성 |
| P3 | 미추적 보고서 다수 | `vendor-designation-*`, `deal-support-*`, `figma-config-*` 등 실험 산출물 존재 | 삭제하지 않고 목록화, 추후 선별 반영 |

## 5. 수정 완료

| 파일 | 수정 내용 |
|---|---|
| `.gitignore` | export 산출물과 QA 스크린샷 격리 규칙 정리 |
| `scripts/create-report.mjs` | scroll-snap 런타임 제거, `viewport > deck > track` autoscale 구조 적용 |
| `scripts/test-workspace.mjs` | autoscale 런타임 검증 기준 적용, Git 추적 보고서 중심 검사로 변경 |
| `scripts/export-deck.mjs` | PNG export 전 `window.__openDesignDeck.go()` 호출로 대상 장표 활성화 |
| `reports/ai-agent-quality-training/index.html` | 수작업형 교육 덱 본문 유지, 런타임 껍질만 autoscale로 교체 |
| `reports/sample-executive-report/index.html` | 생성기 재실행으로 최신 런타임 반영 |
| `reports/reference-rich-report/index.html` | 생성기 재실행으로 최신 런타임 반영 |
| `reports/open-design-premium-report/index.html` | 생성기 재실행으로 최신 런타임 반영 |
| `examples/folder-audit-brief.json` | 전체 폴더 감리 하네스 예시 입력 추가 |
| `reports/folder-audit-harness-example/` | 2장짜리 감리 예시 보고서 생성 |

## 6. 삭제하지 않은 항목

아래 항목은 미추적 상태이지만 사용자가 만든 실험물 또는 이전 생성 산출물일 수 있어 자동 삭제하지 않았다.

```text
docs/superpowers/plans/
references/layout-library/applied-skill-examples/
references/layout-library/korean-business-report-candidates/
references/layout-library/open-source-layout-candidates/
reports/deal-support-agent-skax-executive/
reports/figma-config-2026-practitioner-brief/
reports/guizang-layout-practice/
reports/vendor-designation-july-launch-lazyweb/
reports/vendor-designation-july-launch-refero/
reports/vendor-designation-july-launch-refero-master/
reports/vendor-designation-july-launch-refero-specsheet-test/
reports/vendor-designation-july-launch-refero-v2/
reports/vendor-designation-july-launch-skax-brand-test/
```

## 7. 예시 보고서

새 예시 보고서는 전체 폴더 감리 결과를 2장으로 압축한 검증용 산출물이다.

```text
reports/folder-audit-harness-example/
  index.html
  slides.json
  content.json
  README.md
```

구성은 다음과 같다.

| 장표 | 역할 | 메시지 |
|---|---|---|
| 1 | Folder Audit | 생성 체계는 강하지만 런타임 기준 혼재가 병목 |
| 2 | 4-Person Harness | 구조, 런타임, 산출물, 한글 조판을 분리 검수 |

## 8. 남은 정리 후보

| 후보 | 권장 조치 |
|---|---|
| 미추적 보고서 폴더 | 실제 보존 대상, 폐기 대상, PR 반영 대상을 사용자 기준으로 분류 |
| 대형 이미지 산출물 | 원본 보존 필요 여부 확인 후 `assets/` 또는 외부 참조로 정리 |
| 오래된 실험 보고서 | 최신 autoscale 런타임으로 마이그레이션하거나 archive 폴더로 이동 |
| 라인브레이크 감사 자동화 | 별도 `korean-linebreak-audit` 스크립트가 필요하면 QA 단계에 추가 |

## 9. 최종 판단

현재 저장소의 핵심 문제는 “보고서를 못 만드는 것”이 아니라 생성기, 테스트, 수작업 보고서가 같은 화면 런타임 규칙을 공유하지 않은 점이었다. 이번 수정으로 Git 추적 대상 기준의 생성·검증·export 경로는 한 기준으로 정렬되었고, 미추적 실험물은 삭제 대신 격리와 후속 분류 대상으로 남겼다.

## 10. GitHub origin/main 감리 결과 조치 전

원격 기준은 `origin/main` 커밋 `d2ddba5`로 별도 detached worktree에서 확인했다. 로컬 미추적 파일은 제외하고 GitHub에 올라간 추적 파일만 점검했다.

| 항목 | 결과 |
|---|---|
| 원격 저장소 | `https://github.com/doublejun80/opendesign.git` |
| 기준 커밋 | `d2ddba5 Refine RESCENE report typography and QA rules` |
| 추적 파일 | 129개 |
| 추적 보고서 | 5개 |
| `npm run validate` | 통과 |
| `npm test` | 실패 |

### 10.1 GitHub에 올라간 보고서 인벤토리

| 경로 | 성격 | 파일 완성도 | 감리 판단 |
|---|---|---|---|
| `reports/sample-executive-report/` | 기본 샘플 | 4종 파일 완비 | 구형 scroll-snap 런타임 |
| `reports/reference-rich-report/` | 레퍼런스 샘플 | 4종 파일 완비 | 4장 구성, 기본 규칙보다 짧음 |
| `reports/open-design-premium-report/` | 고급 샘플 | 4종 파일 완비 | 외부 이미지 URL 의존 |
| `reports/rescene-popularity-analysis/` | 실제 분석 보고서 | 4종 파일 + assets 완비 | 최신 autoscale 런타임, 테스트 기준과 충돌 |
| `reports/ai-agent-quality-training/` | 교육자료 | 6개 추적 파일 | 16장 교육 덱, 개인 경로와 제작 메타 노출 |

### 10.2 GitHub 기준 핵심 문제

| 우선순위 | 문제 | 근거 |
|---|---|---|
| P1 | 테스트와 보고서 런타임 계약 충돌 | `test-workspace.mjs`는 `id="deck"`와 scroll-snap을 요구하지만 `rescene`은 viewport/track autoscale 구조 |
| P1 | 생성기와 최신 스킬 기준 불일치 | 원격 `create-report.mjs`는 구형 가로 스크롤 덱을 생성, 디자인 시스템은 autoscale 구조 보유 |
| P2 | 보고서 유형 혼재 | 샘플, 실제 분석 보고서, 16장 교육자료가 모두 `reports/` 같은 계층에 존재 |
| P2 | 개인 로컬 경로 노출 | `ai-agent-quality-training/content.json`에 `C:/Users/.../ai_agent_quality Guide.docx` 기록 |
| P2 | 제작 메타 노출 | 교육 덱 화면과 레퍼런스 lock 파일에 Refero MCP 상태 설명 포함 |
| P3 | README 설명력 부족 | 샘플 보고서 README가 반복 보일러플레이트에 가까움 |

### 10.3 GitHub 기준 정리 판단

GitHub에 올라간 상태는 폴더 구조와 필수 파일 측면에서는 양호하지만, 검증 체계는 실패 상태였다. 우선순위는 새 디자인을 더 만드는 것이 아니라 원격 기준에서 `create-report.mjs`, `test-workspace.mjs`, 추적 보고서 5개의 런타임 계약을 하나로 맞추는 것이었다. 이후 교육자료는 정식 임원보고와 분리하고, 개인 경로·제작 메타·외부 이미지 의존성을 정리해야 한다.

## 11. 조치 후 검증 결과

GitHub 감리에서 나온 P1 항목은 로컬 수정본에 반영했다.

| 항목 | 조치 |
|---|---|
| 생성기 런타임 | `scripts/create-report.mjs`를 `viewport > deck > track` autoscale 구조로 변경 |
| 테스트 기준 | `scripts/test-workspace.mjs`를 autoscale 런타임 계약 검사로 변경 |
| export 보정 | `scripts/export-deck.mjs`가 장표별 screenshot 전에 deck navigation을 호출 |
| 기존 샘플 보고서 | `sample`, `reference-rich`, `premium` 보고서를 새 생성기로 재생성 |
| 교육 덱 | `ai-agent-quality-training` 본문 유지, 런타임 껍질만 autoscale 구조로 교체 |
| RESCENE 덱 | 공통 `--kr-deck-scale`, `--kr-active-slide`, hash deep link 계약 적용 |
| 예시 보고서 | `reports/folder-audit-harness-example/` 2장 GitHub 감리 예시 생성 |

검증 결과는 다음과 같다.

| 명령 | 결과 |
|---|---|
| `npm test` | 통과 |
| `npm run validate` | 통과 |
| `node scripts/export-deck.mjs reports/folder-audit-harness-example/index.html exports/folder-audit-harness-example --check-overflow --no-pdf` | 통과, overflow 0건 |
| `git ls-files 'reports/*/index.html' \| xargs rg 'width: 100vw\|overflow-x: auto\|scroll-snap-type\|id="deck"'` | 매치 없음 |
