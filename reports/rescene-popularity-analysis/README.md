# 리센느 인기 급상승 원인 분석

RESCENE / 리센느의 최근 인기 상승 이유를 수치 중심으로 정리한 5장짜리 한국어 기획보고서입니다.

## 파일

- `index.html`: 1920×1080 고정 캔버스 HTML 덱
- `slides.json`: 장표별 역할, 메시지 계약, 시각 패턴
- `content.json`: 원천 수치, 출처, 제작 하네스 기록
- `assets/`: QA 산출물 또는 후속 이미지 자산 보관 위치

## 보기

`index.html`은 외부 서버 없이 브라우저에서 바로 열 수 있습니다. 키보드 방향키, PageUp/PageDown, Home/End로 장표 이동이 가능합니다.

## 검증

```bash
node .agents/skills/korean-executive-html-report/scripts/korean-linebreak-audit.js reports/rescene-popularity-analysis/index.html
node scripts/export-deck.mjs reports/rescene-popularity-analysis/index.html reports/rescene-popularity-analysis/assets/qa --check-overflow --no-pdf
```

## 기준

- 분석 기준일: 2026-06-26
- 사용자 요청: 5장, 글자 밀도 높은 분석 보고서, 수치 표현 중심, SK 로고 제외
- 해석: “아이돌 리센스”를 현재 화제가 된 K-pop 걸그룹 `RESCENE / 리센느`로 해석
