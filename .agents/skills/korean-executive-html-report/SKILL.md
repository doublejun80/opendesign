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

## Visual Direction Ownership

The user should not have to choose colors, fonts, template genre, or reference mix
unless they explicitly ask to participate in that choice. By default, the agent owns
the visual decision.

If the user specified a Refero master reference, do not choose a different visual
direction. Internally compare only implementation strategies that preserve the master
reference's taste.

If no Refero master is specified, internally compare about three visual directions, then
choose one final direction. Do not stop to ask the user to pick from options unless:

- the user explicitly asks for variants
- a brand/CI guide is missing and the choice would materially affect legal or brand compliance
- the user has asked to approve the visual direction before implementation

Score candidate directions against:

- fit for Korean executive reporting
- audience and decision context
- Korean readability and line-break stability
- business-system/product-UI feeling
- distinctiveness without decorative noise
- reference evidence from Open Design, Refero, official brand sources, user-supplied
  materials, or additional sources explicitly named by the user
- 1920x1080 overflow risk

For the chosen direction, lock:

- color palette and accent roles
- font stack and type hierarchy
- slide genre mix
- component density
- image/reference strategy
- explicit rejects

If no company brand guide is supplied, choose a conservative Korean-friendly font stack
and a reference-backed palette. Record the chosen direction and rejected alternatives in
`content.json` when references materially influenced the deck.

## Korean Writing Rules

- Use idiomatic Korean, not translated English prose.
- Put the conclusion in the slide title when possible.
- Keep the main sentence under 42 Korean characters when possible.
- Default to Korean executive-report fragments: keyword, noun phrase, slash-separated
  contrast, and compact status labels. Unless the user explicitly asks for prose,
  avoid sentence endings such as `한다`, `이다`, `필요하다`, `요구한다`, `남긴다`,
  `관리해야 한다`, and `우선이다` in titles, cards, tables, labels, process steps,
  footers, callouts, and mock UI copy.
- Prefer `검토 필요`, `근거 이력화`, `우선 적용`, `관리 포인트`, `증빙 첨부`,
  `정책 결정 후 반영` over full sentence forms.
- Design Korean line breaks before coding titles and cards. Never allow a Korean
  eojeol to split across lines, such as `작/성`, `가/이드`, `필/요한`, or `검/토`.
- Keep short semantic chunks together with `.ko-keep` or equivalent markup when
  they include spaces but must read as one unit: `구매 검토 근거`, `승인 판단`,
  `작성 누락 방지`, `정책 결정 후 반영`.
- Treat Korean report phrases as reading units, not just words split by spaces.
  Keep phrases such as `작성 누락 방지`, `구매 검토 근거 확보`, and
  `업무 콘솔 설계` together when a break would feel unnatural.
- Apply this to every Korean text block: titles, subtitles, cards, tables, labels,
  process steps, footers, callouts, and mock UI copy. It is not title-only.
- Do not leave a short predicate or tail alone on the final line of any text block,
  such as `설계한다.`, `우선이다.`, or `필요하다.`.
- Do not detach Korean postpositions from emphasized nouns. Include the
  postposition in the same emphasis span or rewrite the sentence.
- Avoid vague nouns such as “고도화”, “혁신”, “효율화” unless backed by a concrete operational effect.
- Use concrete verbs: 줄인다, 묶는다, 나눈다, 비교한다, 승인한다, 보류한다.
- Do not use decorative corporate slogans.
- Do not end every slide with a generic summary.
- Use full Korean prose only for explicitly requested narrative sections, direct
  quotes, legal/disclaimer copy, README text, or handoff paragraphs marked with
  `.ko-prose`.

## Visual Grammar

Use these patterns as a library, not a mandatory slide-number map. The user's scenario
and report logic decide each slide's structure. If a Refero master reference is specified,
adapt these patterns only when they can live inside that master visual language.

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
- Include Korean typography defaults: `word-break: keep-all`, `overflow-wrap: normal`,
  `line-break: strict`, and `letter-spacing: 0` for slide text.
- Provide `.ko-keep { display: inline-block; white-space: nowrap; }` for Korean
  phrases that must not split, and reserve `.ko-allow-break` for URLs, IDs,
  filenames, and long English strings.
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
6. Is the copy in report-fragment style rather than schoolbook sentence style?
7. Are Korean line breaks native-looking, with no split eojeol or detached 조사?
8. If a Refero master reference was specified, did the deck preserve its visible taste,
   density, line/surface/spacing feel, typography rhythm, and memorable visual devices?
9. Are slide layouts driven by the user's scenario and report logic instead of a fixed
   pre-mapped genre list?
10. Does it still work if exported as PNG/PDF?
11. Are the source notes separated from final copy?

Run the browser QA scripts before finalizing:

```bash
node .agents/skills/korean-executive-html-report/scripts/korean-linebreak-audit.js reports/<report-slug>/index.html
```

This check complements overflow QA. It catches rendered breaks inside Korean
eojeol such as `작성`, `가이드`, and `필요한`, suspicious semantic breaks such
as `작성 / 누락`, and short final-line tails across all major Korean text blocks.

## Refinement Behavior

When asked to revise:

- Fix the message structure before changing decoration.
- Split overloaded slides.
- Replace tables with comparison cards when possible.
- Improve Korean readability before adding visuals.
- Preserve the existing file structure.
- Explain which files changed.

## Reference Screen Behavior

If Refero, official brand, user-supplied, or explicitly requested references are provided,
use them as evidence and craft sources.

### Refero Grand Master Reference

When the user points to a specific Refero page, screenshot, or sample and says the mood
is desirable, treat that single source as a deck-level master reference. This is stronger
than normal inspiration.

Preserve the master reference's visible taste, not only its abstract structure:

- layout structure
- information density
- typography rhythm
- line/surface/spacing feel
- color restraint
- image, diagram, and shape treatment
- the polished atmosphere of the sample
- memorable visual devices from the sample

Do not say or behave as if only the structure should be extracted. The purpose of a paid
Refero sample is the visual quality and taste of the example.

For decks, keep consistency through a separate operating layer instead of lowering the
Refero influence:

- SK AX logo position and brand lockup
- common page metadata
- common color limits
- common Korean typography rules
- common line weight and document-number system
- common footer/source area

Slide layouts are decided by the user's scenario and reporting logic, not by a pre-baked
slide genre list. Never lock a future deck into fixed roles such as "slide 1 is a
technical datasheet, slide 2 is a comparison diagram" unless the scenario itself calls
for that. Each slide should be newly designed for its message while staying inside the
master reference's visual language.

If the Refero master and SK AX brand compete, keep SK AX as a small, consistent brand
layer and preserve the Refero taste in the body composition. Do not expose production
labels like "Refero style applied" in the final slide; record evidence in `content.json`.

For ordinary references that are not explicitly selected as a master, extract useful
patterns such as:

- card density
- information hierarchy
- layout rhythm
- typography balance
- comparison or flow pattern

Do not turn the report into a product dashboard unless the subject actually requires it.

## Reference Workflow

Use external reference tools according to role and priority.

If the user specified a Refero master reference, it owns the deck-level visual language.
Do not replace it with Open Design templates or other reference tools. Use other references
only when the user explicitly names them, or when they are official/user-supplied evidence
needed for brand or factual accuracy. They must not dilute the master reference's taste.

Refero is best for:

- visual taste and atmosphere
- typography rhythm
- line, surface, spacing, radius, shadow, and density rules
- diagram/image treatment
- memorable sample-specific devices

When a single Refero sample is selected as master, preserve its visible taste strongly
while letting the user scenario decide slide logic.

When references are used, add a `references` array to `content.json`:

```json
{
  "references": [
    {
      "source": "refero_master",
      "title": "master reference title or URL",
      "takeaways": ["visible taste, density, typography rhythm, line/surface/spacing rules to preserve"]
    },
    {
      "source": "official_brand_or_user_supplied",
      "title": "reference title or file",
      "takeaways": ["pattern or evidence to reuse"]
    },
    {
      "source": "explicitly_requested_reference",
      "title": "reference title",
      "takeaways": ["layout, shape, or image rule to reuse"]
    }
  ]
}
```

For ordinary reference screens, do not copy them directly. Convert them into Korean
executive-report grammar and keep source evidence in `content.json` only. Do not expose
visible source labels, source rails, MCP labels, or "Refero style applied" notes in the
final HTML slides.
For a Refero master reference, do not clone the original brand/content, but do preserve
the master sample's visual taste, density, rhythm, and memorable devices.
If images are useful, prefer Refero, official brand images, user-provided images, or local
reference assets from sources the user explicitly requested. Place them in image rails,
evidence panels, appendix thumbnails, or master-reference-compatible visual slots without
visible source labels.

## Open Design Source Stack

Before creating a final deck, consider these source pages and translate their principles into the local report:

- `https://open-design.ai/ko/plugins/templates/`
- `https://open-design.ai/ko/plugins/skills/`
- `https://open-design.ai/ko/plugins/systems/`
- `https://open-design.ai/ko/solutions/slides/`
- `https://github.com/nexu-io/open-design/discussions`

Apply them as:

1. Template: choose a visual genre such as Bento, Blueprint, Swiss, Dark Technical, or
   Editorial Longform only when no Refero master already owns the visual language.
2. Skill: choose working behavior such as design brief, refinement, media/reference generation, or export.
3. System: choose or support a visual language such as Premium, Enterprise, Publication,
   Modern, or Glassmorphism; do not override a Refero master.
4. Reference: use Refero, official brand sources, user-provided sources, or explicitly
   requested additional sources for real screen screenshots, visual taste, and image URLs.
   If a Refero master exists, it has priority over template/system defaults.
5. Output: render a designed HTML deck, not a text deck.

For polished Open Design-style decks, add these patterns when useful:

| Need | Pattern |
|---|---|
| Reference-backed visual proof | visual hero with Refero/official/user-provided image rail |
| Combining templates/skills/systems/references | bento synthesis grid |
| Process or architecture clarity | blueprint-style frame |
| Premium executive opening | dark editorial hero with reference devices |
