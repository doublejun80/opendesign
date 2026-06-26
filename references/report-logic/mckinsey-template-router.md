# McKinsey-Style Template Router For Korean HTML Reports

Purpose: choose the right slide role and information shape before visual styling.
This is a planning reference for HTML decks, not a requirement to create PPTX or copy
any external template.

## Default Routing

| Reporting need | Use this slide shape | Korean output pattern |
|---|---|---|
| One clear takeaway | Summary / statement | 한 줄 판단 + 근거 3개 |
| Problem decomposition | Issue tree | 쟁점 → 원인 → 확인 필요 |
| Option selection | Option matrix | A/B/C 비교 + 추천 방향 |
| Work plan | Roadmap / Gantt | 단계, 담당, 산출물, 일정 |
| Numeric trend | KPI dashboard | 핵심 수치 3~5개 + 해석 |
| Risk control | Risk-control table | 리스크, 통제, 오너, 시점 |
| Handoff | Implementation brief | 해야 할 일, 기준, 산출물 |

## Selection Rules

- Pick the slide role from the reader's next action, not from the source document shape.
- Prefer 5 to 8 slides for business reports; each slide gets one dominant message.
- Use matrix, roadmap, issue tree, KPI, and risk-control frames only when they clarify
  the work. Do not use a framework for decoration.
- If a user specifies a visual master reference, keep this router at the logic layer
  and let the reference decide the visible taste.

## Korean Adaptation

- Use compact Korean labels: `검토 필요`, `우선 적용`, `대기`, `실험`, `제외`.
- Replace long sentences with noun phrases and status labels.
- Keep line breaks by meaning unit across titles, cells, labels, and footers.
- End with a concrete next action or operating checklist when the audience is 실무자.

## Source

This local router is inspired by the public `seulee26/mckinsey-pptx` project and its
template-catalog idea. It does not copy its design, code, colors, templates, or output.
