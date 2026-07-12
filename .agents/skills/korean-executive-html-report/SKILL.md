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
The 1920×1080 canvas must be wrapped in a viewport autoscale runtime so the browser
shows one complete slide at any window size instead of exposing the next slide or
horizontal scrollbars.

Required DOM shape:

```html
<div class="viewport">
  <main class="deck">
    <div class="track">
      <section class="slide" data-slide="1">...</section>
      <section class="slide" data-slide="2">...</section>
    </div>
  </main>
</div>
```

The `.deck` remains a 1920×1080 coordinate space. The outer `.viewport` scales it with
`transform: scale(...)`. Do not put raw 1920px slides directly in a `100vw` horizontal
scroll container for local preview, because that causes partial neighboring slides to
show on smaller browser windows.

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

## Default Korean Report Pipeline

Use this pipeline for every Korean business-report deck unless the user explicitly
requests another process.

1. Korean report logic first: identify audience, job-to-be-done, one-message-per-slide,
   and the action the reader should take after reading.
2. Apply the McKinsey-style template router from
   `references/report-logic/mckinsey-template-router.md` to choose the slide role:
   summary, issue tree, option matrix, roadmap, KPI, risk, or handoff.
3. Apply Korean report-writing rules from
   `references/korean-business-qa/korean-report-writing-style.md`. Build a message
   contract for every slide before writing the title: reader, decision, reason, action.
   Translate product/source facts into Korean business-report language, not literal
   Korean from English.
4. Run the report production harness from
   `references/korean-business-qa/report-production-harness.md`: one Scenario Harness
   plus three writer passes for strategy, Korean copy, and presentation editing.
5. Apply table alignment rules from
   `references/korean-business-qa/korean-report-table-style.md` whenever a table,
   matrix, roadmap row, or tabular grid appears.
6. Apply the modu-style Korean business QA gate from
   `references/korean-business-qa/modu-qa-rules.md` before finalizing copy and layout:
   audience fit, Korean phrasing, AI-slop removal, overflow risk, source separation,
   and handoff clarity.
7. Use Guizang and other layout libraries only as optional layout references when they
   help the specific slide message. They are not the default visual master and must not
   override Korean report grammar, SK AX brand placement, or the selected reference.
8. Build HTML with the autoscale runtime, export screenshots, run Korean line-break
   audit, and fix overflow before claiming completion.

Do not expose these pipeline names as large production labels in the final slides.
If a trace is useful, record it in `content.json` or README.

## SK AX Brand Layer

For SK AX or default Korean business-report work, place the SK logo or SK AX lockup in
the bottom-right footer area on every slide unless the user gives a different brand
rule. Treat it as a quiet operating layer, not a decorative header.

Implementation requirements:

- Use the shared asset `design-systems/korean-executive-report/assets/sk-logo.png`
  when available, copied into the report's local `assets/` folder.
- Place it with `.sk-brand-footer` or an equivalent class anchored to the lower right.
- Keep enough footer safe area so the logo never overlaps conclusions, sources, charts,
  or page numbers.
- If an official image is unavailable, use a text fallback such as `SK AX` only for
  internal drafts and record the fallback in `content.json`.

## Korean Writing Rules

- Use idiomatic Korean, not translated English prose.
- Put the conclusion in the slide title when possible.
- Keep the main sentence under 42 Korean characters when possible.
- Before writing any slide title, define the slide's message contract:
  `reader`, `decision`, `reason`, and `action`. If the contract is unclear, rewrite
  the slide logic before designing the visual.
- Titles must be Korean business-report judgment phrases, not translated English
  sentence structures. Prefer title endings such as `적용 방향`, `검토 기준`,
  `우선순위`, `전환 기준`, `운영 기준`, `검증 범위`, `선행 확인`,
  `확대 조건`, `보류 항목`, and `전달 포인트`.
- Avoid weak or translated title endings such as `바뀜`, `잠금`, `대기`, `가능`,
  `하는 것`, `할 것`, and standalone `이슈`, `현황`, or `개요`.
- Rewrite literal English structures into Korean workplace language:
  `작업 경계` → `파일 역할` or `산출물 범위`,
  `접근 가능 기능` → `즉시 사용 가능 항목`,
  `닫힌 베타` → `제한 공개 항목`,
  `적용 전 잠금` → `확인 후 적용`,
  `시작 전 잠글 것` → `확대 적용 전 선행 확인`,
  `기능 채택` → `업무 적용` or `적용 후보`.
- Subtitles must add condition, reason, scope, or evidence. They must not merely repeat
  the title in a longer sentence.
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

Default background is white. Use off-white, grid texture, dark canvas, or tinted
background only when the user asks for it or the selected master reference requires it.
The browser preview background must also be white or a clearly intentional neutral,
not accidental gray.

Avoid making every slide a repeated flat card grid. Keep the deck cohesive through
brand, type, spacing, and footer rules, but give each slide one message-specific
dominant structure: flow, matrix, timeline, evidence rail, split comparison, annotated
screen, or classification map.

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

## Table And Grid Alignment

For any table-like structure, align by cell role:

- Header cells: center / middle
- Text body cells: left / middle
- Short status labels: center / middle
- Numbers: right / middle with tabular numerals
- Chips and badges: center / middle inside the chip

### Centered Control Contract — Hard Requirement

- Center every button, chip, badge, pill, and status label both horizontally and
  vertically. Treat any visibly low or high label as a failed slide.
- Build HTML controls with `inline-flex` or Grid, `align-items: center`,
  `justify-content: center`, equal top/bottom padding, and `line-height: 1`.
  Do not use `top`, `translateY`, or asymmetric padding to nudge individual labels.
- Build PPT/PPTX controls as one shape containing its text. Set
  `alignment: center`, `verticalAlignment: middle`, and text insets to zero.
  Do not overlay a separate text box on a button background.
- Judge the rendered slide, not only the source properties. Rework the component when
  the rendered top and bottom whitespace are visibly asymmetric.
- Keep every control label intended as one line on one line, including buttons, chips,
  badges, pills, status labels, and phase `EXIT` labels. Shorten the copy before
  reducing font size. Any wrapped one-line control is a QA failure.

### Repeated Message Band Contract — Hard Requirement

- Give repeated message bands, conclusion boxes, and bottom callouts the same fixed
  frame and the same title/body slot geometry across every slide.
- Vertically center the combined title-and-body group inside the component. Do not
  top-align the group or push the second line downward with content-dependent spacing.
- Keep container height, padding, title size, body size, and title-to-body gap identical
  for Korean, English, and mixed-language copy. Never auto-size the component by language.
- Shorten or relocate copy that does not fit. Do not change one instance's component
  height or internal spacing to accommodate longer text.

### Main Content Vertical Balance — Hard Requirement

- Define the main zone as the space between the header boundary and the top edge of the
  bottom message band. Center the primary content bounding box vertically in that zone.
- Calculate `mainTop = zoneTop + (zoneHeight - mainContentHeight) / 2`. Do not place
  the main content by eye or anchor it to the top.
- Exclude decorative backgrounds, footers, page numbers, and brand marks when measuring
  the primary content bounding box.
- Keep rendered top and bottom whitespace within 4px of each other. Treat a larger
  difference as a failed slide.
- When content does not fit, shorten copy, change the structure, or split the slide.
  Do not reduce type or push the main content toward the bottom.

Do not mix left, center, and right alignment arbitrarily within the same column. If a
table becomes visually flat or crowded, convert it into a timeline, matrix, or card grid
instead of adding more text to cells.

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
- Use the standard `.viewport > .deck > .track > .slide` autoscale runtime from the
  design system unless a task explicitly targets raw export markup only.
- Include Korean typography defaults: `word-break: keep-all`, `overflow-wrap: normal`,
  `line-break: strict`, and `letter-spacing: 0` for slide text.
- Provide `.ko-keep { display: inline-block; white-space: nowrap; }` for Korean
  phrases that must not split, and reserve `.ko-allow-break` for URLs, IDs,
  filenames, and long English strings.
- Include print styles for PDF export.
- Include simple keyboard navigation if multiple slides are in one HTML. Keyboard
  navigation should move the `.track` by slide index, not rely on body-level horizontal
  scrolling in preview mode.
- Do not depend on external CDN assets unless explicitly requested.

## Slide Quality Checklist

Before finalizing, check:

1. Does every slide have a single top-line message?
2. Is the title a Korean judgment/action phrase rather than literal translation?
3. Did you remove translated wording such as `바뀜`, `잠금`, `대기`,
   `접근 가능`, and `작업 경계` unless quoted as source material?
4. Can a Korean executive or business reader understand the slide in 5 seconds?
5. Are numbers and decisions visually separated?
6. Does the report contain at least one visual structure beyond cards?
7. Is the Korean copy natural?
8. Is the copy in report-fragment style rather than schoolbook sentence style?
9. Are Korean line breaks native-looking, with no split eojeol or detached 조사?
10. If a Refero master reference was specified, did the deck preserve its visible taste,
   density, line/surface/spacing feel, typography rhythm, and memorable visual devices?
11. Are slide layouts driven by the user's scenario and report logic instead of a fixed
   pre-mapped genre list?
12. Does it still work if exported as PNG/PDF?
13. Are the source notes separated from final copy?
14. Does local browser preview autoscale to one full slide without exposing neighboring
    slides at common window sizes such as 1366×768?
15. Are table headers centered, body cells left-aligned, numeric cells right-aligned,
    and status chips centered according to their role?
16. Are all buttons, chips, badges, pills, and status labels visually centered in both
    axes in the rendered output?
17. Do repeated message bands and conclusion boxes use identical outer frames and
    title/body slots, with the copy group vertically centered regardless of language?
18. Is the primary content vertically centered between the header and bottom message
    band, with rendered top and bottom whitespace differing by no more than 4px?
19. Is the background intentionally white or intentionally designed, with no accidental
    gray/dim canvas?
20. Did the Scenario Harness and the three writer passes run before final export?

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
executive-report grammar and preserve only compact source labels in the final HTML.
For a Refero master reference, do not clone the original brand/content, but do preserve
the master sample's visual taste, density, rhythm, and memorable devices.
If images are useful, prefer Refero, official brand images, user-provided images, or local
reference assets from sources the user explicitly requested. Place them in image rails,
evidence panels, appendix thumbnails, or master-reference-compatible visual slots with
source labels.

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
