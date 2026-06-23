# AI 에이전트 품질 가이드 실무 교육자료

`C:/Users/05507/Documents/ai_agent_quality Guide.docx`를 바탕으로 만든 실무사용자 교육용 HTML 덱이다.

산출물:

- `index.html`: 1920x1080 고정 캔버스 HTML 교육 덱
- `slides.json`: 장표별 역할, 핵심 메시지, 적용 패턴
- `content.json`: 원문 요약, Refero reference, MCP 검색 결과, 품질 체크
- `refero-reference-lock.json`: Refero Styles 기준 참조 잠금
- `refero-reference-board.html`: Refero 예시 보드

교육 흐름:

1. AI Agent 품질 기준 전환
2. 전통 QA와 AI Agent QA 비교
3. Shift-Left Testing 적용 위치
4. RaiT 8개 품질 지표
5. 위험도별 기준점과 릴리스 Gate
6. 테스트 플랜과 TC 설계
7. Criteria와 Judge Prompt 작성
8. Few-shot Judge와 피드백 루프
9. 입력-실행-판정-리포트 자동화
10. 프롬프트·골든셋·보안·비용 운영
11. TTFT/TTLT 성능 Gate
12. 실무 워크시트와 팀 적용 로드맵

Refero 적용:

- 기본 톤: Slite + Tailscale의 warm knowledge notebook
- 지표/루브릭: Seline Analytics와 Visitors/Calendly scorecard 패턴
- 프롬프트/로그: Linear/Resend의 dark command panel
- 한국어 본문: Relate의 Pretendard 기반 light SaaS 패턴

MCP 상태:

- Refero MCP endpoint 인증 확인 완료
- 서버 `tools/list`에서 `refero_search_styles`, `refero_search_screens`, `refero_search_flows` 등 8개 도구 확인
- 현재 Codex 세션의 lazy tool 목록에는 재시작 전까지 직접 노출되지 않아, JSON-RPC 직접 호출로 보강 검색 수행
