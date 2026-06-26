# Report Production Harness

한국어 HTML 보고서는 한 번에 쓰고 끝내는 방식이 아니라, 시나리오 설계와 3단계 작가 감수를 통과한 결과물로 만든다.
이 하네스는 실제 사람을 호출하는 것이 아니라, 에이전트가 매번 내부적으로 수행해야 하는 역할 분담 규칙이다.

## Harness Roles

| 역할 | 책임 | 산출물 |
|---|---|---|
| Scenario Harness | 보고 목적, 대상, 의사결정, 장표 흐름 설계 | slide contract |
| Writer 1: Strategy Writer | 각 장표의 판단 메시지와 논리 구조 정리 | one-message-per-slide |
| Writer 2: Korean Copy Editor | 번역투 제거, 제목/소제목/라벨 한국 보고어로 재작성 | Korean-native copy |
| Writer 3: Presentation Editor | 레이아웃 리듬, 표 정렬, 배경, 시각 장치, 반복감 점검 | visual/edit QA |

## Operating Sequence

1. Scenario Harness
   - 누가 읽는가
   - 무엇을 판단하는가
   - 읽고 무엇을 해야 하는가
   - 장표 1장당 메시지 1개가 맞는가

2. Strategy Writer
   - 제목이 결론/판단/조치로 읽히는가
   - 근거가 2~3개로 정리되는가
   - 장표 순서가 보고 논리에 맞는가

3. Korean Copy Editor
   - 영어 직역, 어색한 명사구, 불필요한 서술어 제거
   - `한다/이다/필요하다`식 문장형 종결 제거
   - 의미 단위 줄바꿈 후보 지정

4. Presentation Editor
   - 장표마다 같은 카드 반복으로 보이지 않는가
   - 표/카드/흐름/매트릭스 중 메시지에 맞는 구조인가
   - 표 헤더/본문/숫자/상태값 정렬이 일관적인가
   - 배경은 기본 흰색이며 색은 역할을 갖는가
   - 이미지와 아이콘은 장식이 아니라 판단 근거인가

## Required Output

`content.json`에는 필요한 경우 아래 형태로 내부 적용 기록을 남긴다.

```json
{
  "production_harness": {
    "scenario": "audience, decision, flow checked",
    "writer_1_strategy": "one-message-per-slide checked",
    "writer_2_korean_copy": "literal translation removed",
    "writer_3_presentation": "alignment, background, visual rhythm checked"
  }
}
```

최종 장표에는 `Scenario Harness`, `Writer 1` 같은 제작 메타 문구를 노출하지 않는다.
