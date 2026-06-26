# Open Design 기반 임원보고 덱 고도화

Korean executive HTML report deck generated from a structured brief.

## Files

- `index.html`: browser-ready 1920x1080 autoscale deck
- `slides.json`: rendered slide data
- `content.json`: source brief and references
- `assets/`: local report assets

## QA

```bash
node scripts/export-deck.mjs reports/open-design-premium-report/index.html exports/open-design-premium-report --check-overflow --no-pdf
```
