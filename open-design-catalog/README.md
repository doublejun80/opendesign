# Open Design Catalog Snapshot

Local snapshot of the Open Design plugin catalog used by this workspace.

## Sources

- Skills: https://open-design.ai/ko/plugins/skills/
- Templates: https://open-design.ai/ko/plugins/templates/

## Generated Files

- `skills.json`: official instruction skill catalog plus local install status
- `templates.json`: all plugin templates from the catalog
- `templates-slide.json`: slide/deck templates most relevant to this report workspace

## Current Counts

- Official skills: 16
- Locally installed official skills: 0
- Local workspace skills: korean-executive-html-report
- All templates: 286
- Slide/deck templates: 80

## Refresh

```bash
node scripts/sync-open-design-catalog.mjs
```
