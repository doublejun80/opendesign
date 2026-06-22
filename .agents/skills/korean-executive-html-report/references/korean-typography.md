# Korean Typography Rules

## Recommended font stack

```css
font-family: Pretendard, "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif;
```

## Size guide for 1920×1080

| Element | Recommended size |
|---|---:|
| Slide kicker | 24–30px |
| Main title | 52–76px |
| Section title | 34–44px |
| Body | 26–34px |
| Caption | 20–24px |
| Large number | 72–124px |

## Korean line-height

- Title: 1.08–1.18
- Body: 1.42–1.58
- Table/caption: 1.35–1.48

## Line breaking

Korean report slides must not rely on browser default CJK wrapping.
Default browser wrapping can split a Korean eojeol in the middle, which reads
as careless native Korean typography.

### Hard rules

- Never allow a Korean eojeol to split across lines: `작성 가/이드`, `작/성`,
  `필/요한`, `검/토` are failures.
- Do not leave a Korean postposition visually detached from its noun or emphasized
  phrase. Prefer `근거 확보를 우선한다` over `근거 확보가 우선이다` when highlight
  color would separate `확보` and `가`.
- Keep short semantic chunks together with markup when they must read as one unit:
  `작성 누락 방지`, `구매 검토 근거`, `승인 판단`, `정책 결정 후 반영`.
- Treat Korean report phrases as reading units, not just whitespace-separated words.
  `작성 누락 방지`, `구매 검토 근거 확보`, `업무 콘솔 설계` should stay
  together when a break would change the reading rhythm.
- Apply these rules to every Korean text block: title, subtitle, card, table cell,
  label, process step, footer, callout, and mock UI copy. This is not title-only.
- Do not leave a short predicate or tail alone on the final line of any text block:
  `설계한다.`, `우선이다.`, `필요하다.` should not be the only final-line text.
- If a card is too narrow, rewrite the Korean shorter or widen the card. Do not
  solve it by allowing syllable-level breaks.
- For slide titles, choose manual `<br>` positions before writing CSS. Break only
  between complete clauses or semantic chunks.

### Required CSS baseline

```css
:where(.slide, .slide *) {
  word-break: keep-all;
  overflow-wrap: normal;
  line-break: strict;
  letter-spacing: 0;
}

.ko-keep {
  display: inline-block;
  white-space: nowrap;
}

.ko-allow-break {
  word-break: break-word;
  overflow-wrap: anywhere;
}
```

Use `.ko-keep` for Korean phrases that include spaces but should stay together.
Use `.ko-allow-break` only for URLs, long file names, IDs, or English technical
strings. Do not use it on Korean prose.

### QA requirement

After rendering the deck, run a browser-based Korean line-break audit. It must
fail if two adjacent Hangul syllables in the same eojeol are rendered on different
lines, if a suspicious semantic phrase is broken after a short Korean token, or
if any major text block ends with a short lonely tail. Passing a slide-level
overflow check is not enough.
