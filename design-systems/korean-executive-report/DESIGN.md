# Korean Executive Report
Category: presentation

## 1. Visual Theme

Clean Korean executive report. Calm, structured, high-density but readable.  
The feeling should be closer to a premium consulting report than a decorative pitch deck.
However, it must not be visually plain. Use Open Design-style templates, Refero master
references, reference image rails, bento layouts, and strong editorial composition when
they clarify the decision.

When the user selects a Refero master reference, do not choose a competing visual
direction. Compare only implementation strategies that preserve that master sample's
taste. When no master reference is supplied and the user does not ask to choose a
direction, the agent must select the final visual direction. Internally compare several
plausible palettes, font systems, template genres, and reference mixes, then implement
the strongest one. Do not ask the user to pick visual options by default.

## 2. Color Palette

- Background: white by default
- Primary text: near-black / ink
- Secondary text: muted gray
- Accent: restrained blue or amber
- Risk: subdued red, not alarmist
- Success: muted green, not neon

Warm off-white, grid texture, dark canvas, and tinted backgrounds are opt-in styles.
Use them only when the user requests that tone or a selected master reference requires
it. Do not make one slide dark or tinted while the rest of the deck is white unless the
user explicitly asked for a separate cover treatment. The local browser preview
background must not accidentally appear gray or dim.
Use no more than two accents per slide.
If company colors are provided, use them first. If not, choose colors from the selected
reference direction and preserve their roles: CTA-only colors stay CTA/status-only, risk
colors stay risk-only, and decorative colors are omitted unless they improve reporting
clarity.
If a Refero master reference is supplied, its color discipline and accent roles override
the default palette unless they conflict with required brand usage.

## 3. Typography

Use Korean-friendly sans-serif stack:

```css
Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif
```

Title should be strong but not oversized.  
Korean body text needs comfortable line-height.
If no brand font is supplied, the agent chooses the Korean-friendly font stack and type
scale that best fits the report audience. Do not use a display font, serif, monospace,
or decorative typeface as the main Korean report font unless the selected reference and
report context justify it.
Default Korean report copy should be fragment-style, not sentence-style. Use compact
keywords, noun phrases, status labels, and slash-separated contrasts. Avoid endings such
as `한다`, `이다`, `필요하다`, `요구한다`, `남긴다`, `관리해야 한다`, and `우선이다`
unless the user explicitly asks for prose.
Slide titles must be Korean report judgment phrases, not literal English-to-Korean
translations. Before writing a title, define the slide's reader, decision, reason, and
action. Prefer endings such as `적용 방향`, `검토 기준`, `우선순위`, `전환 기준`,
`운영 기준`, `검증 범위`, `선행 확인`, `확대 조건`, and `보류 항목`.
Avoid translated or casual endings such as `바뀜`, `잠금`, `대기`, `가능`,
`하는 것`, and `할 것`. Rewrite source wording into Korean workplace language:
`작업 경계` becomes `파일 역할` or `산출물 범위`, `접근 가능 기능` becomes
`즉시 사용 가능 항목`, and `닫힌 베타` becomes `제한 공개 항목`.
Korean line breaks must preserve reading units across every text block, not only slide
titles. Keep phrases such as `작성 누락 방지`, `구매 검토 근거 확보`, and
`업무 콘솔 설계` together with `.ko-keep` or equivalent markup when a break
would feel unnatural. Short final-line tails such as `설계한다.` or `필요하다.`
are typography failures.
For dense Korean subtitles, break the rhythm with comma, middle dot, slash, or arrow
separators when three or more meaning chunks appear. Avoid long run-on subtitles with
no breathing points. Reject awkward noun compounds such as `전망 판단`; prefer
`후속 운영 기준`, `지속 조건`, `전환 기준`, or `관리 포인트` depending on the slide role.

## 4. Component Styling

Use:

- insight cards
- KPI strips
- option matrices
- phase roadmaps
- risk-control grids
- issue trees
- decision ask panels
- evidence footers
- visual hero slides with Refero, official brand, or user-provided image rails
- bento synthesis grids
- blueprint-style process frames
- editorial source/evidence panels
- source labels for Refero, official brand, or user-provided references
- simple semantic shapes for flow, decision, risk, and status
- bottom-right SK brand footer for SK AX/default Korean business reports

Avoid:

- stock photo hero pages
- full-slide bullet lists
- meaningless icon clouds
- excessive shadows
- childish gradients
- repeated flat card grids on every slide
- arbitrary table alignment
- low-contrast pale text on gray or translucent panels
- vertical spreading of Korean body text with `space-between`, `1fr`, or large gaps
- stacked number labels where the number and Korean label are separated by excessive
  vertical distance

## 5. Layout

Fixed 1920×1080 canvas.  
For browser preview, this fixed canvas must be wrapped in an autoscaling viewport so
the complete slide fits the current window. The slide itself stays 1920×1080 for
export fidelity; only the outer preview layer scales. Do not expose neighboring slides
in normal preview.

Use consistent margins:

- Outer margin: 84px to 112px
- Header zone: 120px to 180px
- Body grid: 2–4 columns depending on message
- Footer/source zone: 36px to 60px

### Korean Dense Layout Guardrails

- Related Korean text must stay visually grouped. Do not stretch three short lines from
  top to bottom just to fill a card.
- If a card has spare vertical space, leave it blank or use a number, chart, divider, or
  source label. Do not distribute body copy evenly across the height.
- Step labels should read as one unit, such as `1 개인 채널`; avoid placing the number
  high and the label far below.
- In KPI strips, use a white or very light cell background with dark text. Avoid white
  text on gray, translucent, or low-contrast backgrounds.
- If any browser comment or screenshot points to clipping, the deck is not complete
  even when automated overflow passes. Inspect the affected slide at the same viewport.

### Brand Footer

For SK AX and default internal Korean business reports, place the SK logo or SK AX lockup
at the bottom-right of every slide. Keep this as a quiet brand layer, separate from the
slide's main message. The footer area must remain clear of conclusion boxes, source
labels, charts, and page numbers.

Use `design-systems/korean-executive-report/assets/sk-logo.png` as the shared source
asset when available, copied into each report's local `assets/` folder. Use text fallback
only for internal drafts when the image asset is unavailable.

## 5-1. Default Workflow Structure

Default report generation follows this order:

1. Korean report logic and audience action
2. McKinsey-style slide role routing from `references/report-logic/`
3. Korean title/copy rewriting from `references/korean-business-qa/korean-report-writing-style.md`
4. Report production harness from `references/korean-business-qa/report-production-harness.md`
5. Table alignment rules from `references/korean-business-qa/korean-report-table-style.md`
6. Modu-style Korean business QA from `references/korean-business-qa/`
7. Optional layout references such as Guizang, only when the message benefits
8. HTML autoscale, Korean line-break audit, overflow export QA

Guizang remains a layout-reference library, not the default master style.

### Table Alignment

All table-like structures use role-based alignment:

- Header: center / middle
- Text body: left / middle
- Short label or status: center / middle
- Number: right / middle
- Chip text: center / middle

Do not mix alignments in the same role. If a table feels flat, convert the message into
a timeline, matrix, or classification board rather than changing alignment randomly.

### Button / Chip Centering

- 버튼, 칩, 배지, pill, 상태 라벨의 글자는 가로·세로 정중앙을 기본값으로 한다.
- HTML은 `inline-flex` 또는 Grid, `align-items: center`, `justify-content: center`,
  동일한 상하 패딩, `line-height: 1`을 사용한다.
- PPT/PPTX는 배경과 텍스트를 단일 도형으로 만들고 `center / middle`, text inset
  `0`을 적용한다. 별도 텍스트박스를 배경 위에 겹치지 않는다.
- 코드상 중앙값이어도 최종 렌더에서 글씨가 아래나 위로 치우쳐 보이면 실패다.
- 개별 요소에 `top`, `translateY`, 비대칭 패딩을 주는 임시 보정을 금지한다.

### Repeated Message Band Geometry

- 장표마다 반복되는 메시지 밴드, 결론 박스, 하단 콜아웃은 같은 외곽 크기와
  같은 제목·본문 슬롯을 사용한다.
- 제목과 본문을 하나의 그룹으로 보고 컨테이너 안에서 세로 중앙 정렬한다.
- 한글, 영어, 혼합 문구에 따라 높이, 패딩, 제목 크기, 본문 크기, 행간을 바꾸지 않는다.
- 긴 문구는 축약하거나 본문으로 이동한다. 한 인스턴스만 자동 높이 또는 별도 간격을
  적용하지 않는다.

### Main Content Vertical Balance

- 헤더 하단과 바텀 메시지 상단 사이를 메인 존으로 정의한다.
- 실제 핵심 콘텐츠 외곽을 메인 존 안에서 세로 중앙에 둔다.
- 시작점은 `zoneTop + (zoneHeight - contentHeight) / 2`로 계산한다.
- 배경 장식, 푸터, 페이지 번호, 브랜드 표식은 콘텐츠 높이에서 제외한다.
- 렌더 기준 위·아래 여백 차이는 최대 4px만 허용한다.
- 콘텐츠가 넘치면 문구 축약, 구조 변경, 장표 분리를 우선한다. 글꼴 축소나 하단 밀어내기로
  해결하지 않는다.

## 6. Depth

Use subtle borders and background layers.  
Shadow must be minimal and functional.

## 7. Do / Don't

Do:

- Lead with decision or implication.
- Make titles read like Korean business judgment, not translated product-copy.
- Separate facts, interpretation, and ask.
- Make one element dominant per slide.
- Show tradeoffs visually.
- Use white as the default report canvas.
- Vary the dominant structure by slide while keeping the same brand/type/footer layer.

Don't:

- Hide the conclusion in the body.
- Use casual or translated labels such as `바뀜`, `잠금`, `대기`, `작업 경계`,
  `접근 가능 기능`, or `닫힌 베타` as final report language.
- Use too many colors.
- Fill every gap.
- Let default browser gray show around or behind the deck.
- Make it look like a SaaS dashboard unless required.
- Copy ordinary reference screens directly.
- Reduce a user-selected Refero master sample to structure only.
- Use images or shapes as decoration without a reporting function.

## 8. Reference MCP Use

Refero, official brand sources, user-provided files, and explicitly requested additional
sources are reference suppliers, not final-output engines. A specific
Refero page or screenshot selected by the user as the desired mood is a deck-level master
reference, not a loose inspiration source.

For a Refero master reference, preserve:

- layout structure
- information density
- typography rhythm
- line, surface, and spacing feel
- color restraint
- image, diagram, and shape treatment
- polished sample atmosphere
- memorable visual devices

Do not lower the Refero influence just to make slides uniform. Use a separate
brand/report layer for consistency: SK AX logo placement, common metadata, color limits,
Korean typography rules, shared line weight, document-number system, and footer/source
area. Slide layouts must follow the user's scenario and report logic.

Final slides must convert report logic into Korean executive-report grammar: conclusion
first, evidence separated, decision ask visible. Ordinary references should be rebuilt
inside the deck. A Refero master should strongly determine the visual language while the
scenario determines each slide's logic.

## 9. Open Design Source Stack

Before generating a polished deck, consider these Open Design source categories:

| Source | Use |
|---|---|
| Templates | Choose the deck genre only when no Refero master already owns the visual language |
| Skills | Choose the working mode: design brief, refinement, export, media/reference generation |
| Systems | Choose or support the visual language; do not override a Refero master |
| Slides solution | Preserve the flow: outline → style → designed slide → export/revise |
| Discussions | Check community patterns and contribution direction when available |

The default Korean executive style should combine Premium + Enterprise + Publication
when no stronger user-selected reference exists. If a Refero master exists, start from
that master and add Open Design, official brand, user-provided, or explicitly requested
evidence only where it improves judgment without diluting the master visual language.

## 10. Responsive

Primary target is 1920×1080.  
Secondary target is PDF/PNG export.  
Mobile reflow is not required, but browser-window autoscale is required. A local HTML
deck should show exactly one full 16:9 slide at common window sizes, including 1366×768,
without horizontal body scroll or partial next-slide exposure.

## 11. Agent Prompt Guide

When generating a deck:

1. Convert source notes into a Korean executive outline first.
2. Route each slide through the report-logic reference, then run the Korean business
   QA gate before export.
3. Rewrite source facts into Korean report title/copy using the message contract:
   reader, decision, reason, action.
4. Run the Scenario Harness and three writer passes before layout.
5. If a Refero master exists, lock its visual taste before choosing slide layouts.
6. Choose each slide layout from the scenario and report logic, not from a fixed
   slide-number template.
7. Generate HTML only after the message structure is clear.
8. Keep final copy tight, Korean-native, and report-fragment style.
9. Place SK brand in the bottom-right footer for SK AX/default Korean reports.
10. Validate table alignment, background color, visual rhythm, sentence endings,
   Korean line breaks, title naturalness, visual density, Refero-master fidelity,
   and slide overflow.
11. Validate browser-window autoscale in addition to export overflow.
12. If a slide needs visual proof, use Refero, official brand, user-provided, or explicitly
   requested image URLs/screenshots in a slot that fits the selected visual language.
