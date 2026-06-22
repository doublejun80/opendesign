# MCP / Open Design / Codex 설정 메모

## 1. Open Design 설치 방식

Open Design은 데스크톱 앱 방식과 에이전트 CLI 설치 방식을 모두 염두에 둡니다.
Codex에 붙일 때는 Open Design 문서의 Codex 에이전트 설정을 우선 확인하세요.

일반적인 흐름:

```bash
# Open Design CLI가 설치되어 있다면
od mcp install codex

# 또는 Open Design install script 사용
curl -fsSL https://open-design.ai/install.sh | sh -s codex
```

환경마다 설치 방식이 바뀔 수 있으므로 실제 명령은 Open Design 공식 문서를 우선합니다.

## 2. Codex MCP 예시 설정

Codex MCP 설정은 보통 `~/.codex/config.toml`에서 관리합니다. 예시는 다음과 같습니다.

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

위 설정은 예시입니다. 실제 `od mcp serve` 명령이 설치 환경에서 지원되는지 확인해야 합니다.

## 3. 레퍼런스 MCP 연결 위치

Mobbin/Lazyweb/Refero 같은 레퍼런스 공급원은 이 워크스페이스의 출력 엔진이 아닙니다. 다음 용도로만 붙입니다.

- 정보 밀도 참고
- 카드 구조 참고
- 서비스 화면/플로우 패턴 참고
- 대안 비교/체크아웃/승인/검색/온보딩 같은 흐름 참고

보고서 자체의 구조는 `korean-executive-html-report` 스킬이 정합니다.

## 3-1. Lazyweb / Mobbin 연결 원칙

현재 Codex 세션에서 Lazyweb/Mobbin 도구가 노출되어 있으면 다음 역할로 사용합니다.

| MCP | 우선 용도 | 보고서 반영 방식 |
|---|---|---|
| Lazyweb | 주제 맥락, 사례, 용어, 근거 자료 탐색 | `references.source = "lazyweb"`로 요약 |
| Mobbin | 도형, 이미지, 상태 라벨, 비교 화면, 카드 밀도 참고 | `references.source = "mobbin"`로 요약 |

두 MCP 모두 최종 HTML에 원본 화면을 그대로 복제하지 않습니다. 추출 대상은 정보 구조, 여백, 라벨링, 도형 연결 방식, 이미지 사용 목적입니다.

브리프에는 다음 형태로 넣습니다.

```json
{
  "references": [
    {
      "source": "lazyweb",
      "title": "시장/업무 맥락 검색 결과",
      "takeaways": ["임원에게 필요한 판단 기준", "반복되는 근거 수치"]
    },
    {
      "source": "mobbin",
      "title": "비교/승인 화면 패턴",
      "takeaways": ["추천안을 한 컬럼으로 강조", "상태 라벨을 도형과 연결"]
    }
  ]
}
```

MCP 설정 예시는 실제 설치된 서버 이름과 명령에 맞게 조정합니다.

```toml
[mcp_servers.lazyweb]
command = "<lazyweb-mcp-command>"
args = ["<serve-or-start>"]
startup_timeout_sec = 20

[mcp_servers.mobbin]
transport = "http"
url = "https://api.mobbin.com/mcp"
startup_timeout_sec = 20
```

Codex 도구 목록에 Lazyweb/Mobbin 호출 도구가 노출되면, 먼저 MCP 원시 응답을 JSON으로 저장한 뒤 브리프에 병합합니다.

```bash
npm run references:apply -- <brief.json> <lazyweb-results.json> <merged-brief.json> --source lazyweb
npm run references:apply -- <merged-brief.json> <mobbin-results.json> <merged-brief.json> --source mobbin
node scripts/create-report.mjs <merged-brief.json> reports/<report-slug>
```

`scripts/apply-reference-results.mjs`는 `results`, `items`, `data` 배열과 `imageUrl`, `image_url`, `images[].url`을 받아 `references[].images[]`로 정규화합니다. 브리프에 `visual-hero` 장표가 있으면 이미지 URL을 장표 `visuals`에도 최대 4개까지 채웁니다.

Lazyweb 설치 예시는 다음과 같습니다.

```bash
curl -fsSL https://www.lazyweb.com/install.sh | bash
```

Lazyweb 수동 설정의 핵심은 Streamable HTTP URL `https://www.lazyweb.com/mcp`와 `~/.lazyweb/lazyweb_mcp_token`의 Bearer 토큰입니다. Lazyweb 도구가 반환하는 `imageUrl` 또는 `image_url`은 그대로 `content.json.references[].images[]` 또는 장표 `visuals[]`에 기록합니다.

Mobbin은 Pro/Team 이상에서 MCP를 제공하며, 공개 안내 기준 Remote MCP URL은 `https://api.mobbin.com/mcp`입니다. 인증이 필요한 환경에서는 MCP 메뉴에서 OAuth 로그인을 완료한 뒤 사용합니다.

## 4. 출력 확인 MCP

품질 검수는 Playwright 또는 Chrome DevTools MCP가 있으면 좋습니다.

검수 기준:

- 1920×1080 캔버스에서 잘리는 영역 없음
- 한글 줄바꿈 깨짐 없음
- 인쇄/PDF 모드에서 슬라이드 단위 유지
- 핵심 결론이 5초 안에 읽힘
