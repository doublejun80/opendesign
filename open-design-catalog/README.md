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
- Locally installed official skills: 16
- Local workspace skills: example-design-brief, example-pptx-html-fidelity-audit, korean-executive-html-report, od-code-migration, od-default, od-design-refine, od-figma-migration, od-media-generation, od-new-generation, od-nextjs-export, od-plugin-authoring, od-plugin-contribute-open-design, od-plugin-publish-github, od-react-export, od-share-to-community, od-tune-collab, od-vue-export
- All templates: 286
- Slide/deck templates: 80

## Refresh

```bash
node scripts/sync-open-design-catalog.mjs
```
