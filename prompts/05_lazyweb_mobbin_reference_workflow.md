# Lazyweb / Mobbin 레퍼런스 활용 프롬프트

```text
Lazyweb MCP와 Mobbin MCP가 연결되어 있다면 아래 순서로 참고 자료를 모아줘.

[보고 주제]
...

[보고 대상]
...

[찾을 것]
1. Lazyweb: 주제 맥락, 의사결정 기준, 비교 사례, 근거 수치 후보
2. Mobbin: 카드 밀도, 비교 매트릭스, 승인/상태 흐름, 도형/이미지 사용 방식
3. Open Design: 템플릿, 스킬, 시스템, 슬라이드 솔루션에서 적용할 장표 장르와 시각 시스템

[주의]
- 원본 화면을 복제하지 말고 정보 구조만 추출해줘.
- Lazyweb/Mobbin의 이미지 URL이 있으면 반드시 `images` 또는 장표 `visuals`에 남겨줘.
- Mobbin의 도형과 이미지는 장식이 아니라 판단 흐름, 비교, 상태, 리스크를 설명할 때만 써줘.
- 최종 결과는 한국어 임원보고용 1920×1080 HTML 덱이어야 해.
- Open Design 템플릿/스킬/시스템을 적용하지 않은 단순 카드형 덱으로 끝내지 마.

[출력 형식]
content.json 또는 입력 브리프에 아래 형태의 references 배열을 추가해줘.

{
  "references": [
    {
      "source": "lazyweb",
      "title": "참고한 맥락 또는 자료명",
      "takeaways": ["보고서에 반영할 구조/근거 1", "보고서에 반영할 구조/근거 2"],
      "images": [{"title": "화면명", "url": "Lazyweb imageUrl"}]
    },
    {
      "source": "mobbin",
      "title": "참고한 화면 패턴명",
      "takeaways": ["도형/카드/이미지 사용 원칙 1", "비교/상태 흐름 원칙 2"],
      "images": [{"title": "화면명", "url": "Mobbin imageUrl"}]
    },
    {
      "source": "open-design",
      "title": "적용할 템플릿/스킬/시스템",
      "takeaways": ["Bento Insight Grid", "Premium + Enterprise + Publication"]
    }
  ]
}

이후 reports/<slug>/index.html을 생성할 때 reference source label이 하단에 표시되게 하고, 이미지가 필요한 장표에는 `visual-hero` 또는 `bento-synthesis` 패턴을 사용해줘.
```
