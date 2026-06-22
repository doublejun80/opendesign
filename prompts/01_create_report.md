# 보고자료 생성 프롬프트

```text
Use AGENTS.md and the korean-executive-html-report skill.
Apply design-systems/korean-executive-report.

다음 내용을 기반으로 한국어 임원보고용 16:9 HTML 덱을 만들어줘.

[보고 주제]
...

[보고 대상]
...

[핵심 자료]
...

[반드시 포함할 수치]
...

[Lazyweb/Mobbin 레퍼런스]
- Lazyweb:
- Mobbin:

[Open Design 적용]
- Templates:
- Skills:
- Systems:
- Slides solution:

[의사결정 요청]
...

[원하는 장표 수]
6장

출력:
reports/<slug>/index.html
reports/<slug>/slides.json
reports/<slug>/content.json
reports/<slug>/README.md

진행 순서:
1. 먼저 장표별 한 줄 결론을 작성
2. 장표별 시각 패턴을 선택
3. Open Design 템플릿/스킬/시스템 적용 방식을 명시
4. 레퍼런스가 있으면 references 배열로 요약하고 이미지 URL을 남김
5. HTML 덱 생성
6. 자체 품질 체크 결과 제시
```
