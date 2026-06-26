# Korean Report Table Style Rules

표는 자료를 넣는 박스가 아니라 비교와 판단을 빠르게 읽게 하는 장치다.
정렬 기준이 셀마다 흔들리면 장표 품질이 바로 떨어지므로, 모든 HTML 보고서 표는 아래 규칙을 기본값으로 둔다.

## Alignment Contract

| 셀 역할 | 가로 정렬 | 세로 정렬 | 설명 |
|---|---:|---:|---|
| Header | center | middle | 컬럼 제목은 중앙 정렬 |
| Text body | left | middle | 설명, 항목명, 확인 내용은 앞정렬 |
| Short label | center | middle | `Week 1`, `A`, `B`, `보류` 같은 짧은 상태값 |
| Number | right | middle | 금액, 건수, 비율, 기간 등 숫자 |
| Status chip | center | middle | 칩 내부 텍스트 |

## CSS Baseline

```css
.report-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.report-table th {
  text-align: center;
  vertical-align: middle;
}

.report-table td {
  text-align: left;
  vertical-align: middle;
}

.report-table .is-label,
.report-table .is-status {
  text-align: center;
}

.report-table .is-number {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
```

## Korean Report Defaults

- 헤더는 행 높이를 충분히 확보하고 중앙 정렬한다.
- 본문은 앞정렬한다. 결과물·소유자·확인 내용도 기본은 앞정렬이다.
- 짧은 기간/상태값만 중앙 정렬할 수 있다.
- 숫자는 끝정렬한다.
- 한 표 안에서 같은 역할의 열은 같은 정렬을 유지한다.
- 표 안의 텍스트도 의미 단위 줄바꿈 규칙을 따른다.
- 셀 내부 텍스트가 많아지면 표를 유지하지 말고 카드/매트릭스/타임라인으로 바꾼다.

## QA

1. 헤더가 모두 중앙 정렬인가?
2. 본문 설명 셀이 앞정렬인가?
3. 숫자만 끝정렬인가?
4. 같은 역할의 열이 같은 정렬을 쓰는가?
5. 표가 장표의 핵심 구조인가, 아니면 카드/타임라인으로 바꾸는 편이 나은가?
