# Export 프롬프트

```text
reports/<slug>/index.html을 기준으로 export 준비를 해줘.

요구:
1. PDF 출력용 @media print 스타일을 점검해줘.
2. 각 slide가 page-break-after: always로 분리되는지 확인해줘.
3. `scripts/export-deck.mjs`로 1920×1080 PNG/PDF export와 overflow 점검을 실행해줘.
4. PPTX가 꼭 필요하면 각 PNG를 한 장씩 삽입하는 wrapper PPTX 생성 방식을 제안해줘.
```
