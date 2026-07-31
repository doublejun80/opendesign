# Codex 원테이크 프롬프트: 이 워크스페이스를 처음부터 생성할 때

이미 이 압축 파일을 받은 경우에는 이 프롬프트를 다시 실행할 필요가 없습니다.  
다른 프로젝트에서 같은 구조를 재생성하고 싶을 때 사용하세요.

```text
Open Design + Codex 기반으로 한국어 임원보고/전략보고/검토보고용 16:9 HTML 덱 제작 워크스페이스를 만들어줘.

필수 목표:
- PPT 네이티브 대신 HTML/CSS/JS 기반 1920×1080 보고 패널을 생성한다.
- 한국어 보고 문법, 한글 타이포, 임원보고 구조를 Codex가 계속 기억하게 한다.
- Open Design 스타일의 SKILL.md, DESIGN.md, tokens.css, components.html, prompt, script 구조를 포함한다.
- Refero MCP를 기본 레퍼런스 경로로 고정하고, 스타일·화면·흐름 조사 프롬프트를 만든다.
- 샘플 보고 덱을 하나 생성한다.

생성할 폴더 구조:
open_design_korean_report_workspace/
  README.md
  AGENTS.md
  ONE_TAKE_USE_PROMPT.md
  MCP_SETUP.md
  package.json
  .agents/skills/korean-executive-html-report/
    SKILL.md
    open-design.json
    README.md
    agents/openai.yaml
    assets/base.html
    references/korean-report-grammar.md
    references/layout-patterns.md
    references/korean-typography.md
    references/quality-rubric.md
    references/reference-sources.md
    examples/example-brief.md
    tests/basic.prompt
  design-systems/korean-executive-report/
    manifest.json
    USAGE.md
    DESIGN.md
    tokens.css
    components.html
    preview/index.html
  craft/
    korean-report-logic.md
    korean-typography.md
    anti-ai-slop-ko.md
  prompts/
    01_create_report.md
    02_refine_report.md
    03_convert_export.md
    04_refero_reference_workflow.md
  examples/
    sample-report-brief.json
    sample-outline.md
  scripts/
    create-report.mjs
    export-deck.mjs
    validate-workspace.mjs
  reports/sample-executive-report/
    index.html
    slides.json
    content.json
    README.md
  exports/.gitkeep

각 파일에는 실제 사용 가능한 내용을 채워줘. 빈 파일만 만들지 마.
```
