# Refero MCP / Open Design / Codex 설정 메모

## 1. Open Design 설치 방식

Open Design은 데스크톱 앱 방식과 에이전트 CLI 설치 방식을 모두 염두에 둡니다.
Codex에 붙일 때는 Open Design 문서의 Codex 에이전트 설정을 우선 확인하세요.

```bash
od mcp install codex
```

환경마다 설치 방식이 바뀔 수 있으므로 실제 명령은 Open Design 공식 문서를 우선합니다.

## 2. Codex MCP 예시 설정

Codex MCP 설정은 보통 `~/.codex/config.toml`에서 관리합니다.

```toml
[mcp_servers.open_design]
command = "od"
args = ["mcp", "serve"]
startup_timeout_sec = 20

[mcp_servers.playwright]
command = "npx"
args = ["@playwright/mcp@latest"]
startup_timeout_sec = 20
```

## 3. Refero 기본 레퍼런스 경로

이 워크스페이스에서 시각 리서치의 기본 MCP는 Refero다. 다른 레퍼런스 MCP는 기본
경로나 대체 경로로 사용하지 않으며, 사용자가 직접 요청한 경우에만 검토한다.

보고서 구조와 한국어 문법은 `korean-executive-html-report` Skill이 맡고, Refero는
실제 서비스 레퍼런스에서 다음 요소를 조사해 품질을 높이는 역할을 맡는다.

- 스타일: 색상 역할, 타이포 리듬, 여백, 선과 면, 정보 밀도
- 화면: 비교, 승인, 검토, 리스크, 체크리스트 등 구체적 UI 패턴
- 흐름: 사용자·승인자·운영자 사이의 다단계 업무 흐름

### 3-1. 전역 설정

```toml
[mcp_servers.refero]
enabled = true
url = "https://api.refero.design/mcp"
```

Bearer token을 직접 발급받아 쓰는 환경이라면 토큰은 저장소에 절대 커밋하지 않고
로컬 설정에만 둔다.

```toml
[mcp_servers.refero.http_headers]
Authorization = "Bearer <token>"
```

OAuth 방식이면 `http_headers` 블록을 생략하고, Codex 재시작 후 Refero 도구를 처음
호출할 때 열리는 인증 흐름을 완료한다.

### 3-2. 보고서 적용 순서

1. `refero_search_styles`로 후보 3~5개를 조사한다.
2. `refero_get_style`로 선택한 주 레퍼런스의 색상·타이포·간격·표면 규칙을 확인한다.
3. `refero_search_screens`와 `refero_get_screen`으로 장표에 필요한 화면 구조를 조사한다.
4. 다단계 프로세스 장표일 때만 `refero_search_flows`와 `refero_get_flow`를 사용한다.
5. 한 개의 주 레퍼런스를 잠그고, 보조 레퍼런스는 특정 장치만 제한적으로 차용한다.
6. `content.json.references`에 URL, 적용 요소, 배제한 요소를 남긴다.
7. HTML 렌더 결과를 레퍼런스 잠금과 비교하고, overflow와 한국어 조판을 함께 점검한다.

Refero 화면을 그대로 복제하지 않는다. 최종 보고서는 한국어 보고 문법과 SK AX 운영
레이어 안에서 새로 조판한다.

### 3-3. 브리프 병합

Refero MCP 원시 응답을 JSON으로 저장했다면 다음 명령으로 브리프에 병합한다.

```bash
npm run references:apply -- <brief.json> <refero-results.json> <merged-brief.json> --source refero
node scripts/create-report.mjs <merged-brief.json> reports/<report-slug>
```

`scripts/apply-reference-results.mjs`는 `results`, `items`, `data` 배열과
`imageUrl`, `image_url`, `images[].url`을 받아 `references[].images[]`로 정규화한다.
기존 `visual-hero` 장표가 있으면 이미지 URL을 장표 `visuals`에도 최대 4개까지 채운다.

## 4. 출력 확인 MCP

품질 검수는 Playwright 또는 Chrome DevTools MCP가 있으면 좋습니다.

검수 기준:

- 1920×1080 캔버스에서 잘리는 영역 없음
- 한글 줄바꿈 깨짐 없음
- 인쇄/PDF 모드에서 슬라이드 단위 유지
- 핵심 결론이 5초 안에 읽힘
