# Codex 원테이크 실행 프롬프트: 한국어 16:9 HTML 보고자료 생성

아래 프롬프트를 Codex에 그대로 붙여넣고, `<보고 시나리오>` 부분만 바꿔서 사용하세요.

```text
이 프로젝트 폴더의 AGENTS.md, .agents/skills/korean-executive-html-report/SKILL.md, design-systems/korean-executive-report/DESIGN.md, design-systems/korean-executive-report/tokens.css를 우선 적용해줘.

목표는 PPT 네이티브 파일이 아니라, 브라우저에서 바로 열리는 1920×1080 고정 16:9 HTML 보고 덱을 만드는 것이다.

보고 주제:
<보고 시나리오>

보고 대상:
- 임원/의사결정권자

산출물:
reports/<영문-slug>/index.html
reports/<영문-slug>/slides.json
reports/<영문-slug>/content.json
reports/<영문-slug>/README.md

작성 방식:
1. 먼저 6~8장 구조의 한국어 보고 아웃라인을 작성해줘.
2. 각 장표는 상단 1줄 결론, 본문 3개 이하 메시지 블록, 필요한 경우 비교/흐름/리스크/대안 매트릭스로 구성해줘.
3. 한국어는 번역투 없이 자연스럽게 써줘.
4. 전체 톤은 임원보고용으로 간결하고 고급스럽게 해줘.
5. HTML은 외부 서버 없이 로컬에서 열려야 하고, CSS는 index.html에 포함해도 된다.
6. 디자인 시스템은 korean-executive-report를 사용해줘.
7. 장표마다 `data-slide` 속성을 넣고, 키보드 좌우 이동이 되게 해줘.
8. 각 슬라이드는 1920×1080 캔버스 기준으로 잘리지 않게 만들어줘.
9. Open Design의 templates/skills/systems/slides 원칙을 적용해 단순 카드형이 아니라 조판된 덱으로 만들어줘.
10. `refero-design` Skill과 Refero MCP를 기본으로 사용해 스타일→화면→흐름 순서로 조사하고, 선택한 레퍼런스 잠금과 이미지 URL을 references 배열에 남겨줘.
11. 완료 후 브라우저에서 확인할 파일 경로와 수정 가능한 지점을 알려줘.

금지:
- 단순 텍스트 나열형 PPT
- 대시보드로만 해석하기
- 의미 없는 아이콘 남발
- 과한 그라데이션/3D/장식
- 한국어 제목을 영어식으로 억지 번역

먼저 파일 구조를 만들고, 이어서 실제 index.html과 slides.json을 작성해줘.
```
