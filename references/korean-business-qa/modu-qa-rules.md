# Modu-Style Korean Business Report QA Rules

Run these checks before final delivery of Korean report HTML.

## Copy QA

- Sentence endings: avoid `한다`, `이다`, `필요하다`, `요구한다`, `남긴다`,
  `우선이다` unless prose is explicitly requested.
- Korean rhythm: keep meaning units together with `.ko-keep` or equivalent markup.
- AI slop: remove inflated words, generic slogans, repetitive summaries, and obvious
  machine-like parallel sentences.
- Audience fit: 실무자 자료는 `적용 방법`, `담당`, `제약`, `체크리스트` 중심.
  임원 자료는 `판단`, `근거`, `요청 의사결정` 중심.

## Layout QA

- One slide, one dominant message.
- No text overlap, no clipped images, no partial next slide in local preview.
- Footer safe area remains clear for source, page number, and SK logo.
- Tables must be readable at 1920x1080 and after browser autoscale.

## Evidence QA

- Current facts, product announcements, prices, policies, and public references require
  official or primary-source verification.
- Put visible sources in small footer text only when useful. Keep detailed source notes
  in `content.json` and README.

## Export QA

Run:

```bash
node .agents/skills/korean-executive-html-report/scripts/korean-linebreak-audit.js reports/<slug>/index.html
node scripts/export-deck.mjs reports/<slug>/index.html reports/<slug>/assets/qa --check-overflow --no-pdf
```

Fix all reported Korean line-break, clipping, overflow, and image-crop failures before
claiming the deck is done.
