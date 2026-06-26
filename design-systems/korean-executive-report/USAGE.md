# Korean Executive Report Design System Usage

Use this design system for Korean business report decks.

Recommended usage in prompts:

```text
Apply design-systems/korean-executive-report/DESIGN.md and tokens.css. Use a 1920x1080 canvas. Make the deck feel like a premium Korean executive report, not a startup pitch deck.
```

All local HTML decks must use the autoscale preview wrapper:

```text
.viewport > .deck > .track > .slide
```

The slide coordinate system remains 1920×1080, but the browser preview scales the deck
to fit the current window and must not expose neighboring slides.

Do not use this for consumer marketing posters unless the user asks for that tone.

## Default Workflow

Use the workspace references in this order for Korean report decks:

1. `references/report-logic/mckinsey-template-router.md`
   - choose slide role: summary, issue tree, option matrix, roadmap, KPI, risk, handoff
2. `references/korean-business-qa/korean-report-writing-style.md`
   - rewrite source facts into Korean report titles, subtitles, labels, and action copy
3. `references/korean-business-qa/report-production-harness.md`
   - run scenario, strategy writer, Korean copy editor, and presentation editor passes
4. `references/korean-business-qa/korean-report-table-style.md`
   - keep table headers, body cells, status labels, and numeric cells aligned by role
5. `references/korean-business-qa/modu-qa-rules.md`
   - check Korean tone, audience fit, source separation, overflow risk, and AI-slop
6. `references/layout-library/`
   - use Guizang or other layout libraries only as optional layout references

This workflow applies structure and QA. It does not copy the visual style, code, or
licensed assets of the external projects.

## SK Brand Footer

For SK AX or default internal Korean business reports, place the SK logo in the
bottom-right footer area on every slide:

```html
<div class="sk-brand-footer">
  <img src="assets/sk-logo.png" alt="SK" />
</div>
```

Use `design-systems/korean-executive-report/assets/sk-logo.png` as the shared source
asset and copy it into the report's `assets/` folder. Keep enough footer safe area so
the logo does not touch conclusion boxes, sources, or page numbers.

## Background And Table Defaults

- Report canvas background is white by default.
- Off-white, grid, tinted, or dark backgrounds are opt-in styles, not the default.
- Table headers are centered.
- Table body text is left-aligned.
- Numeric cells are right-aligned.
- Short status labels and chips are centered.
- If a table feels flat or overloaded, convert it into a timeline, matrix, or card
  classification structure.

## Reference Sources

When Refero, official brand, user-provided, or explicitly requested references are
available, summarize them in the report brief under `references`.

- `refero_master`: when the user selects one Refero sample as the desired mood, use it
  as the deck-level visual-language master. Preserve the sample's visible taste, density,
  typography rhythm, line/surface/spacing feel, color restraint, and memorable devices.
Do not copy ordinary reference screens. Extract patterns and rebuild them as Korean
executive-report slides. When a Refero master is specified, do not reduce it to patterns
only; keep its visual taste strong while the user's scenario decides each slide layout.
