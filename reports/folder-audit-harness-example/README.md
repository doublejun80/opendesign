# Open Design GitHub 감리 하네스 예시

Korean executive HTML report deck generated from a structured brief.

## Files

- `index.html`: browser-ready 1920x1080 autoscale deck
- `slides.json`: rendered slide data
- `content.json`: source brief and references
- `assets/`: local report assets

## QA

```bash
node scripts/export-deck.mjs reports/folder-audit-harness-example/index.html exports/folder-audit-harness-example --check-overflow --no-pdf
```
