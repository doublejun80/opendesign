# Refero 레퍼런스 적용 프롬프트

```text
`refero-design` Skill과 Refero MCP를 사용해 아래 보고서의 시각 레퍼런스를 조사하고 적용해줘.

보고 주제:
...

보고 대상:
...

조사할 장표 역할:
- 전체 시각 언어와 타이포 리듬
- 비교·승인·리스크·우선순위 등 필요한 화면 구조
- 다단계 업무 흐름이 있을 때만 flow

작업 순서:
1. `refero_search_styles`로 시각 방향 3~5개 조사
2. `refero_get_style`로 주 레퍼런스 1개를 잠그고, 유지할 특성 3~5개 기록
3. `refero_search_screens`와 `refero_get_screen`으로 장표별 화면 패턴 조사
4. 필요할 때만 `refero_search_flows`와 `refero_get_flow`으로 흐름 구조 조사
5. 한국어 보고 문법에 맞춰 재조판하고, 화면 원본은 그대로 복제하지 않음
6. `content.json.references`에 source, URL, 적용 원칙, 배제한 요소를 기록

주의:
- Refero는 단순 구조 참고가 아니라 시각 언어·밀도·타이포·선/면/여백의 기준이다.
- 이미지와 도형은 장식이 아니라 판단 흐름, 비교 기준, 리스크, 상태를 설명할 때만 사용한다.
- 최종 결과는 1920×1080 한국어 HTML 보고 덱이며, 슬라이드 내 제작 메타는 노출하지 않는다.
```
