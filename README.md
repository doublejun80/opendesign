# Open Design Korean Report Workspace

Codex에서 한국어 임원보고/전략보고/검토보고를 **PPT 네이티브가 아니라 16:9 HTML 패널**로 만들기 위한 전용 워크스페이스입니다.

이 폴더는 두 가지 목적을 동시에 만족하도록 구성했습니다.

1. **예쁜 보고자료 템플릿**: 바로 열어볼 수 있는 고품질 1920×1080 HTML 덱을 만든다.
2. **반복 가능한 작업 체계**: 브리프, 스킬, 디자인 시스템, 생성 스크립트, export 스크립트를 고정해 같은 품질로 반복 생산한다.

구체적으로는 다음 목표를 가집니다.

1. 한국어 보고자료 문법을 Codex가 계속 기억하게 한다.
2. Open Design 방식의 `SKILL.md`, `DESIGN.md`, `tokens.css`, `components.html` 구조를 둔다.
3. 결과물을 `1920×1080` 고정 HTML 덱으로 생성한다.
4. Playwright 기반으로 PNG/PDF export를 준비한다.
5. Mobbin/Lazyweb/Refero 같은 레퍼런스 공급원은 선택적으로 붙이고, 보고서 출력 엔진은 HTML/CSS 중심으로 고정한다.

## 빠른 시작

```bash
cd open_design_korean_report_workspace
npm run validate
npm test
npm run sample
npm run sample:premium
npm run references:apply -- examples/sample-report-brief.json examples/lazyweb-reference-results.json /tmp/lazyweb-brief.json --source lazyweb
npm run export:sample -- --dry-run --check-overflow
```

생성 결과:

```text
reports/sample-executive-report/index.html
reports/sample-executive-report/slides.json
```

브라우저에서 `reports/sample-executive-report/index.html`을 열면 샘플 한국어 보고 덱을 볼 수 있습니다. 루트 `index.html`은 두지 않고, 실제 덱은 항상 `reports/<slug>/` 아래에 둡니다.

## Codex에서 쓰는 방식

1. 이 폴더를 Codex가 접근하는 프로젝트 폴더에 넣습니다.
2. Codex에서 이 폴더를 열고 `AGENTS.md`가 적용되는지 확인합니다.
3. `ONE_TAKE_USE_PROMPT.md`의 프롬프트를 붙여넣고 보고자료 주제를 넣습니다.
4. 결과가 마음에 안 들면 `prompts/02_refine_report.md` 방식으로 수정 요청합니다.

## 핵심 파일

| 파일 | 역할 |
|---|---|
| `AGENTS.md` | Codex 프로젝트 지침. 한국어 보고자료의 기본 규칙을 고정합니다. |
| `.agents/skills/korean-executive-html-report/SKILL.md` | Codex/Open Design용 보고자료 생성 스킬입니다. |
| `design-systems/korean-executive-report/DESIGN.md` | 한글 타이포, 색상, 간격, 장표 구조 규칙입니다. |
| `design-systems/korean-executive-report/tokens.css` | 16:9 HTML 패널 공통 디자인 토큰입니다. |
| `prompts/01_create_report.md` | 보고자료 최초 생성 프롬프트입니다. |
| `prompts/02_refine_report.md` | 생성물 수정 프롬프트입니다. |
| `prompts/05_lazyweb_mobbin_reference_workflow.md` | Lazyweb/Mobbin 레퍼런스를 보고서 입력으로 정리하는 프롬프트입니다. |
| `scripts/create-report.mjs` | JSON 브리프를 HTML 덱으로 바꾸는 예시 스크립트입니다. |
| `scripts/apply-reference-results.mjs` | Lazyweb/Mobbin MCP 원시 결과를 `references`와 `visuals`로 병합합니다. |
| `scripts/report-schema.mjs` | 지원 패턴과 브리프 구조를 검증하는 스키마 도우미입니다. |
| `scripts/export-deck.mjs` | Playwright 기반 PNG/PDF export와 overflow 점검을 수행합니다. |
| `scripts/test-workspace.mjs` | 생성기, 검증기, export dry-run을 확인하는 회귀 테스트입니다. |
| `examples/lazyweb-reference-results.json` | Lazyweb MCP 결과 형태를 흉내 낸 레퍼런스 병합 예시입니다. |
| `reports/sample-executive-report/index.html` | 실제 렌더링 가능한 샘플 HTML 덱입니다. |
| `reports/open-design-premium-report/index.html` | Open Design 템플릿/스킬/시스템과 Mobbin 이미지 레퍼런스를 반영한 고급 샘플 덱입니다. |

## 권장 워크플로우

```text
보고 시나리오 입력
→ Codex가 6~8장 아웃라인 작성
→ korean-executive-html-report 스킬 적용
→ design-systems/korean-executive-report 디자인 시스템 적용
→ 1920×1080 HTML 덱 생성
→ 브라우저 검수
→ Codex에 자연어 수정 요청
→ PNG/PDF/PPTX export
```

## Lazyweb / Mobbin 레퍼런스 사용

Lazyweb과 Mobbin MCP가 연결되어 있다면 결과를 그대로 복제하지 말고 `content.json` 또는 입력 브리프의 `references` 배열로 요약해 넣습니다.

```json
{
  "references": [
    {
      "source": "lazyweb",
      "title": "approval workflow examples",
      "takeaways": ["승인 흐름 단계", "자료 근거 배치"]
    },
    {
      "source": "mobbin",
      "title": "decision matrix pattern",
      "takeaways": ["추천안 강조 컬럼", "상태 라벨과 도형 연결"]
    }
  ]
}
```

생성된 HTML은 이 정보를 하단 출처 라벨로 남깁니다. Mobbin에서 가져온 도형과 이미지는 장식이 아니라 비교, 승인 흐름, 상태, 리스크를 설명할 때만 사용합니다.

Lazyweb/Mobbin MCP가 원시 JSON을 반환했다면 아래처럼 먼저 브리프에 병합합니다. `imageUrl`, `image_url`, `images[].url`은 `references[].images[]`로 보존되고, 기존 `visual-hero` 장표가 있으면 이미지 레일 `visuals`에도 자동으로 채워집니다.

```bash
npm run references:apply -- <brief.json> <lazyweb-results.json> <merged-brief.json> --source lazyweb
node scripts/create-report.mjs <merged-brief.json> reports/<report-slug>
```

Mobbin MCP가 연결되면 같은 스크립트에 `--source mobbin`을 넣어 사용합니다.

## Open Design 스타일 적용

보고 덱 생성 시 다음 Open Design 페이지를 함께 확인합니다.

- Templates: https://open-design.ai/ko/plugins/templates/
- Skills: https://open-design.ai/ko/plugins/skills/
- Systems: https://open-design.ai/ko/plugins/systems/
- Slides: https://open-design.ai/ko/solutions/slides/
- Discussions: https://github.com/nexu-io/open-design/discussions

적용 방식은 다음과 같습니다.

1. Templates에서 장표 장르를 고릅니다.
2. Skills에서 작업 방식을 고릅니다.
3. Systems에서 시각 언어를 고릅니다.
4. Lazyweb/Mobbin에서 실제 화면 이미지와 패턴을 가져옵니다.
5. 최종 HTML은 `visual-hero`, `bento-synthesis`, `matrix`, `roadmap` 등으로 조판합니다.

## 출력 원칙

- 결과물은 기본적으로 `index.html` 하나로 열려야 합니다.
- 각 슬라이드는 `1920×1080` 고정 캔버스를 기준으로 합니다.
- 한국어 줄바꿈, 숫자 강조, 제목-본문 밀도, 의사결정 문법을 우선합니다.
- 불필요한 3D, 과한 그라데이션, 의미 없는 아이콘 남발은 금지합니다.
- PPTX는 최종 배포용 래퍼로만 봅니다. 원본은 HTML/CSS/JSON입니다.
