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

## Reference Sources

When Refero, official brand, user-provided, or explicitly requested references are
available, summarize them in the report brief under `references`.

- `refero_master`: when the user selects one Refero sample as the desired mood, use it
  as the deck-level visual-language master. Preserve the sample's visible taste, density,
  typography rhythm, line/surface/spacing feel, color restraint, and memorable devices.
Do not copy ordinary reference screens. Extract patterns and rebuild them as Korean
executive-report slides. When a Refero master is specified, do not reduce it to patterns
only; keep its visual taste strong while the user's scenario decides each slide layout.
