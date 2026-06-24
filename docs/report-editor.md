# Open Design Report Editor

브라우저에서 기존 HTML 보고 덱의 원천 데이터(`content.json`, `slides.json`)를 구조화 편집하는 로컬 편집기입니다.

## 실행

```bash
npm run editor -- reports/sample-executive-report
```

기본 URL은 `http://127.0.0.1:4173/`입니다. 포트를 바꾸려면 다음처럼 실행합니다.

```bash
npm run editor -- reports/open-design-premium-report --port 4174
```

## 편집 범위

- 보고서 제목 수정
- 장표 추가, 복제, 삭제, 순서 변경
- 장표 패턴 변경
- `title`, `cards`, `split`, `matrix`, `roadmap`, `issue-tree`, `visual-hero`, `bento-synthesis`, `risk-control`, `appendix` 패턴별 필드 편집
- 저장 시 `content.json`, `slides.json`, `index.html` 자동 재생성

## 검증

편집기 상단 버튼에서 다음 검증을 실행할 수 있습니다.

- `스키마`: `content.json` 구조 검증
- `줄바꿈`: Korean line-break audit 실행
- `Overflow`: 1920x1080 기준 overflow QA 실행

명령줄 전체 회귀 테스트는 다음 명령으로 실행합니다.

```bash
npm test
```
