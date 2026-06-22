# Korean Executive Report
Category: presentation

## 1. Visual Theme

Clean Korean executive report. Calm, structured, high-density but readable.  
The feeling should be closer to a premium consulting report than a decorative pitch deck.
However, it must not be visually plain. Use Open Design-style templates, reference image rails, bento layouts, and strong editorial composition when they clarify the decision.

## 2. Color Palette

- Background: warm off-white or deep navy depending on slide role
- Primary text: near-black / ink
- Secondary text: muted gray
- Accent: restrained blue or amber
- Risk: subdued red, not alarmist
- Success: muted green, not neon

Use no more than two accents per slide.

## 3. Typography

Use Korean-friendly sans-serif stack:

```css
Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif
```

Title should be strong but not oversized.  
Korean body text needs comfortable line-height.

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
- visual hero slides with Lazyweb/Mobbin image rails
- bento synthesis grids
- blueprint-style process frames
- editorial source/evidence panels
- source labels for Lazyweb/Mobbin references
- simple semantic shapes for flow, decision, risk, and status

Avoid:

- stock photo hero pages
- full-slide bullet lists
- meaningless icon clouds
- excessive shadows
- childish gradients

## 5. Layout

Fixed 1920×1080 canvas.  
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
- Copy Lazyweb/Mobbin reference screens directly.
- Use images or shapes as decoration without a reporting function.

## 8. Reference MCP Use

Lazyweb and Mobbin are reference suppliers, not final-output engines.

Use Lazyweb for:

- broader context
- source discovery
- business vocabulary
- comparable cases

Use Mobbin for:

- card density
- comparison layouts
- approval/status flows
- meaningful shapes and image placement
- real shipped-product screenshot rails

Final slides must convert those references into Korean executive-report grammar: conclusion first, evidence separated, decision ask visible.

## 9. Open Design Source Stack

Before generating a polished deck, consider these Open Design source categories:

| Source | Use |
|---|---|
| Templates | Choose the deck genre: Bento, Blueprint, Swiss, Dark Technical, Editorial Longform |
| Skills | Choose the working mode: design brief, refinement, export, media/reference generation |
| Systems | Choose the visual language: Premium, Enterprise, Publication, Modern, Glassmorphism |
| Slides solution | Preserve the flow: outline → style → designed slide → export/revise |
| Discussions | Check community patterns and contribution direction when available |

The default Korean executive style should combine Premium + Enterprise + Publication, then add Mobbin/Lazyweb image evidence only where it improves judgment.

## 10. Responsive

Primary target is 1920×1080.  
Secondary target is PDF/PNG export.  
Mobile responsiveness is not required.

## 11. Agent Prompt Guide

When generating a deck:

1. Convert source notes into a Korean executive outline first.
2. Choose one visual pattern per slide.
3. Generate HTML only after the message structure is clear.
4. Keep final copy tight and Korean-native.
5. Validate visual density and slide overflow.
6. If a slide needs visual proof, use Lazyweb/Mobbin returned image URLs or screenshots as an image rail.
