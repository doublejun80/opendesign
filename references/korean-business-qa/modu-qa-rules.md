# Modu-Style Korean Business Report QA Rules

Run these checks before final delivery of Korean report HTML.

## Copy QA

- Message contract: each slide must define reader, decision, reason, and action before
  title writing. If these are unclear, the slide is not ready for layout.
- Title naturalness: titles must read like Korean business judgment. Avoid literal
  translations and casual endings such as `바뀜`, `잠금`, `대기`, `가능`, `하는 것`,
  and standalone `현황`, `개요`, `이슈`.
- Workplace wording: replace `작업 경계` with `파일 역할` or `산출물 범위`,
  `접근 가능 기능` with `즉시 사용 가능 항목`, `닫힌 베타` with `제한 공개 항목`,
  `기능 채택` with `업무 적용` or `적용 후보`, and `적용 전 잠금` with
  `확인 후 적용`.
- Subtitle role: subtitle copy must add reason, scope, condition, or evidence, not
  rephrase the title.
- Subtitle rhythm: long Korean subtitles must use comma, middle dot, slash, or arrow
  separators when they contain three or more meaning chunks. Do not leave a dense
  run-on subtitle with no breathing points.
- Sentence endings: avoid `한다`, `이다`, `필요하다`, `요구한다`, `남긴다`,
  `우선이다` unless prose is explicitly requested.
- Awkward noun compounds: reject expressions such as `전망 판단`, `상황 판단`, and
  `원인 판단` when they can be rewritten as `후속 운영 기준`, `지속 조건`, `전환 기준`,
  `검토 기준`, or `관리 포인트`.
- Korean rhythm: keep meaning units together with `.ko-keep` or equivalent markup.
- AI slop: remove inflated words, generic slogans, repetitive summaries, and obvious
  machine-like parallel sentences.
- Audience fit: 실무자 자료는 `적용 방법`, `담당`, `제약`, `체크리스트` 중심.
  임원 자료는 `판단`, `근거`, `요청 의사결정` 중심.

## Layout QA

- One slide, one dominant message.
- No text overlap, no clipped images, no partial next slide in local preview.
- Footer safe area remains clear for source, page number, and SK logo.
- Default canvas background is white unless a dark/tinted style is explicitly selected.
- Slide background consistency: do not make only one slide dark or tinted when the rest
  of the deck is white, unless the user explicitly requested a separate cover style or
  a master reference requires it.
- Text spacing: do not use `space-between`, `1fr`, or large vertical gaps to spread
  Korean body text across a card. Keep related Korean text grouped near the top; use
  charts, numbers, tables, or intentional blank space for the remaining area.
- Contrast: avoid white or pale gray text on gray/translucent panels. Body text must
  have strong contrast against its immediate background.
- Step labels: short numbered labels should read as one unit. Avoid stacked number and
  label arrangements that create excessive vertical distance.
- Avoid repeated flat card grids. Each slide should have a message-specific dominant
  structure such as flow, matrix, timeline, evidence rail, split comparison, annotated
  screen, or classification map.
- Tables must be readable at 1920x1080 and after browser autoscale.
- Table headers are centered; body text is left-aligned; numeric cells are right-aligned;
  status chips are centered.
- Same-role columns must use the same alignment across a table.

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
