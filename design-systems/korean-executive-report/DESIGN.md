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

- Background: warm off-white or deep navy depending on slide role
- Primary text: near-black / ink
- Secondary text: muted gray
- Accent: restrained blue or amber
- Risk: subdued red, not alarmist
- Success: muted green, not neon

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
Korean line breaks must preserve reading units across every text block, not only slide
titles. Keep phrases such as `작성 누락 방지`, `구매 검토 근거 확보`, and
`업무 콘솔 설계` together with `.ko-keep` or equivalent markup when a break
would feel unnatural. Short final-line tails such as `설계한다.` or `필요하다.`
are typography failures.

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

Avoid:

- stock photo hero pages
- full-slide bullet lists
- meaningless icon clouds
- excessive shadows
- childish gradients

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

## 6. Depth

Use subtle borders and background layers.  
Shadow must be minimal and functional.

## 7. Do / Don't

Do:

- Lead with decision or implication.
- Separate facts, interpretation, and ask.
- Make one element dominant per slide.
- Show tradeoffs visually.

Don't:

- Hide the conclusion in the body.
- Use too many colors.
- Fill every gap.
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
2. If a Refero master exists, lock its visual taste before choosing slide layouts.
3. Choose each slide layout from the scenario and report logic, not from a fixed
   slide-number template.
4. Generate HTML only after the message structure is clear.
5. Keep final copy tight, Korean-native, and report-fragment style.
6. Validate sentence endings, Korean line breaks, visual density, Refero-master fidelity,
   and slide overflow.
7. Validate browser-window autoscale in addition to export overflow.
8. If a slide needs visual proof, use Refero, official brand, user-provided, or explicitly
   requested image URLs/screenshots in a slot that fits the selected visual language.
