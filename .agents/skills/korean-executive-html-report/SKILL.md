---
name: korean-executive-html-report
description: Create polished Korean executive/business report decks as editable 1920x1080 HTML panels instead of native PPT. Use this when the user asks for 임원보고, 전략보고, 검토보고, 보고자료, 제안서, 비교분석, 의사결정 자료, or PPT-style infographic reports in Korean.
od:
  mode: create
  task: presentation
  preview: true
  example_prompt: "한국어 임원보고용 6장 HTML 덱을 만들어줘. 주제는 AI 구매 자동화 도입 검토야."
  design_system: korean-executive-report
  craft:
    requires:
      - korean-report-logic
      - korean-typography
      - anti-ai-slop-ko
  inputs:
    - brief
    - source_notes
    - data_points
    - optional_reference_screens
  outputs:
    primary: index.html
    secondary:
      - slides.json
      - content.json
      - README.md
  capabilities:
    - outline
    - html-deck
    - infographic
    - korean-copywriting
    - executive-summary
    - export-ready
---

# Korean Executive HTML Report Skill

## Purpose

Create a polished Korean business report deck as a set of editable 16:9 HTML panels.
This skill is not a dashboard generator. It is for general executive/business reporting:

- 임원보고
- 전략보고
- 검토보고
- 의사결정 요청자료
- 제안/승인 요청자료
- 시장/경쟁사 비교
- 투자/비용/리스크 검토
- 프로젝트 착수/중간/종료 보고

## Default Output

Create the following output structure.

```text
reports/<report-slug>/
  index.html
  slides.json
  content.json
  README.md
  assets/
```

`index.html` must open locally without a server.

## Canvas

Use a fixed presentation canvas.

```text
width: 1920px
height: 1080px
aspect-ratio: 16 / 9
```

Each slide should be one `.slide` section with `data-slide`.

## Report Structure

Use 5 to 8 slides unless the user requests otherwise.

Recommended sequence:

1. Title / Executive message
2. One-page summary
3. Situation / why now
4. Issue structure or As-Is / To-Be
5. Options / comparison matrix
6. Execution roadmap
7. Risks and controls
8. Decision ask / next step

Do not force all eight slides if the material is short.

## Korean Writing Rules

- Use idiomatic Korean, not translated English prose.
- Put the conclusion in the slide title when possible.
- Keep the main sentence under 42 Korean characters when possible.
- Avoid vague nouns such as “고도화”, “혁신”, “효율화” unless backed by a concrete operational effect.
- Use concrete verbs: 줄인다, 묶는다, 나눈다, 비교한다, 승인한다, 보류한다.
- Do not use decorative corporate slogans.
- Do not end every slide with a generic summary.

## Visual Grammar

Prefer these patterns:

| Need | Pattern |
|---|---|
| 핵심 메시지 3개 | 3-card insight row |
| 선택지 비교 | option matrix |
| 전후 비교 | As-Is / To-Be split |
| 원인 분해 | issue tree |
| 실행 계획 | phase roadmap |
| 리스크 관리 | risk-control grid |
| 수치 강조 | number-led KPI strip |
| 복잡한 설명 | numbered flow |

Avoid:

- full-page bullet lists
- decorative icons with no meaning
- huge stock photos
- meaningless gradient blobs
- cramped tables with tiny text

## HTML/CSS Requirements

- Use semantic HTML sections.
- Keep style tokens aligned with `design-systems/korean-executive-report/tokens.css`.
- Use CSS grid and flex for robust alignment.
- Include print styles for PDF export.
- Include simple keyboard navigation if multiple slides are in one HTML.
- Do not depend on external CDN assets unless explicitly requested.

## Slide Quality Checklist

Before finalizing, check:

1. Does every slide have a single top-line message?
2. Can a Korean executive understand the slide in 5 seconds?
3. Are numbers and decisions visually separated?
4. Does the report contain at least one visual structure beyond cards?
5. Is the Korean copy natural?
6. Does it still work if exported as PNG/PDF?
7. Are the source notes separated from final copy?

## Refinement Behavior

When asked to revise:

- Fix the message structure before changing decoration.
- Split overloaded slides.
- Replace tables with comparison cards when possible.
- Improve Korean readability before adding visuals.
- Preserve the existing file structure.
- Explain which files changed.

## Reference Screen Behavior

If Mobbin/Lazyweb/Refero references are provided, extract only design patterns:

- card density
- information hierarchy
- layout rhythm
- typography balance
- comparison or flow pattern

Do not turn the report into a product dashboard unless the subject actually requires it.

## Lazyweb / Mobbin Reference Workflow

Use Lazyweb and Mobbin as reference suppliers only.

Lazyweb is best for:

- business context
- comparable examples
- terminology
- evidence candidates

Mobbin is best for:

- card density
- comparison layouts
- approval and status flows
- semantic shapes
- image placement patterns

When references are used, add a `references` array to `content.json`:

```json
{
  "references": [
    {
      "source": "lazyweb",
      "title": "reference title",
      "takeaways": ["pattern or evidence to reuse"]
    },
    {
      "source": "mobbin",
      "title": "reference title",
      "takeaways": ["layout, shape, or image rule to reuse"]
    }
  ]
}
```

Do not copy reference screens. Convert them into Korean executive-report grammar and preserve only compact source labels in the final HTML.
If images are useful, prefer real Lazyweb/Mobbin returned `imageUrl` values. Place them in image rails, evidence panels, or appendix thumbnails with source labels.

## Open Design Source Stack

Before creating a final deck, consider these source pages and translate their principles into the local report:

- `https://open-design.ai/ko/plugins/templates/`
- `https://open-design.ai/ko/plugins/skills/`
- `https://open-design.ai/ko/plugins/systems/`
- `https://open-design.ai/ko/solutions/slides/`
- `https://github.com/nexu-io/open-design/discussions`

Apply them as:

1. Template: choose a visual genre such as Bento, Blueprint, Swiss, Dark Technical, or Editorial Longform.
2. Skill: choose working behavior such as design brief, refinement, media/reference generation, or export.
3. System: choose visual language such as Premium, Enterprise, Publication, Modern, or Glassmorphism.
4. Reference: use Lazyweb/Mobbin for real screen screenshots and image URLs.
5. Output: render a designed HTML deck, not a text deck.

For polished Open Design-style decks, add these patterns when useful:

| Need | Pattern |
|---|---|
| Reference-backed visual proof | visual hero with Lazyweb/Mobbin image rail |
| Combining templates/skills/systems/references | bento synthesis grid |
| Process or architecture clarity | blueprint-style frame |
| Premium executive opening | dark editorial hero with reference devices |
