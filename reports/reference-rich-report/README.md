# 레퍼런스 기반 보고 덱 검토

Korean executive HTML report deck generated from a structured brief.

## Files

- `index.html`: browser-ready 1920x1080 autoscale deck
- `slides.json`: rendered slide data
- `content.json`: source brief and references
- `assets/`: local report assets

## QA

```bash
node scripts/export-deck.mjs reports/reference-rich-report/index.html exports/reference-rich-report --check-overflow --no-pdf
```
