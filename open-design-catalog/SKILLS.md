# Open Design 설치 스킬 목록

이 문서는 현재 `opendesign` 프로젝트에 설치된 Open Design 공식 지시 스킬을 사람이 읽기 쉬운 형태로 정리한 목록이다.

## 요약

- 공식 출처: https://open-design.ai/ko/plugins/skills/
- 공식 스킬 수: 16
- 로컬 설치된 공식 스킬 수: 16
- 설치 위치: `.agents/skills/`

## 공식 스킬

| 번호 | 스킬 | 제목 | 설명 | 설치 경로 | 출처 |
|---:|---|---|---|---|---|
| 001 | `od-code-migration` | 코드 마이그레이션 (기본 시나리오) | code-migration taskKind을 위한 기본 레퍼런스 파이프라인. patch-edit ↔ build-test devloop과 diff-review 핸드오프 포함. | `.agents/skills/od-code-migration` | [open-design.ai](https://open-design.ai/plugins/od-code-migration/) |
| 002 | `od-plugin-contribute-open-design` | Open Design에 플러그인 기여 | GitHub CLI를 사용하여 로컬 Open Design 플러그인을 Open Design 커뮤니티 카탈로그에 추가하는 풀 리퀘스트를 엽니다. | `.agents/skills/od-plugin-contribute-open-design` | [open-design.ai](https://open-design.ai/plugins/od-plugin-contribute-open-design/) |
| 003 | `od-default` | 기본 디자인 라우터 | Home의 자유 입력 프롬프트를 위한 숨겨진 폴백 시나리오. 어떤 작업을 만들지 사용자에게 묻고 해당 디자인 플로로 이어집니다. | `.agents/skills/od-default` | [open-design.ai](https://open-design.ai/plugins/od-default/) |
| 004 | `example-design-brief` | 디자인 브리프 | I-Lang 프로토콜 형식으로 작성된 구조화된 디자인 브리프를 구체적인 디자인 사양으로 파싱합니다. 팔레트, 타이포그래피, 레이아웃, 무드, 밀도 및 제약 조건과 같은 명시적 차원을 요구하여 '전문적으로 만들어주세요'와 같은 모호한 요청의 애매함을 제거합니다. 트리거 키워드: design brief, create a design brief, ilang brief, structured brief. | `.agents/skills/example-design-brief` | [open-design.ai](https://open-design.ai/plugins/example-design-brief/) |
| 005 | `od-design-refine` | 디자인 정교화 | 기존 Open Design 산출물을 집중적인 비평, 작은 패치, 핸드오프 요약으로 개선하는 베이스라인 Refine 플러그인. | `.agents/skills/od-design-refine` | [open-design.ai](https://open-design.ai/plugins/od-design-refine/) |
| 006 | `od-nextjs-export` | Next.js로 내보내기 | 수락된 Open Design 산출물을 Next.js App Router 핸드오프로 변환하는 입문용 다운스트림 익스포트 플러그인. | `.agents/skills/od-nextjs-export` | [open-design.ai](https://open-design.ai/plugins/od-nextjs-export/) |
| 007 | `od-react-export` | React로 내보내기 | 수락된 Open Design 산출물을 React 컴포넌트 핸드오프로 변환하는 입문용 다운스트림 익스포트 플러그인. | `.agents/skills/od-react-export` | [open-design.ai](https://open-design.ai/plugins/od-react-export/) |
| 008 | `od-vue-export` | Vue로 내보내기 | 수락된 Open Design 산출물을 Vue 3 단일 파일 컴포넌트 핸드오프로 변환하는 입문용 다운스트림 익스포트 플러그인. | `.agents/skills/od-vue-export` | [open-design.ai](https://open-design.ai/plugins/od-vue-export/) |
| 009 | `od-figma-migration` | Figma 마이그레이션 (기본 시나리오) | figma-migration taskKind을 위한 기본 레퍼런스 파이프라인. | `.agents/skills/od-figma-migration` | [open-design.ai](https://open-design.ai/plugins/od-figma-migration/) |
| 010 | `od-media-generation` | 미디어 생성 (기본 시나리오) | 이미지, 비디오, 오디오 프로젝트를 위한 기본 시나리오 플러그인. 프로젝트 종류에 따라 media-* atom으로 라우팅하고 결과를 라이브 산출물로 감쌉니다. | `.agents/skills/od-media-generation` | [open-design.ai](https://open-design.ai/plugins/od-media-generation/) |
| 011 | `od-new-generation` | 새로 생성 (기본 시나리오) | new-generation taskKind을 위한 기본 레퍼런스 파이프라인. | `.agents/skills/od-new-generation` | [open-design.ai](https://open-design.ai/plugins/od-new-generation/) |
| 012 | `od-plugin-authoring` | 플러그인 작성 | My plugins에 추가할 수 있는 로컬 Open Design 플러그인 폴더를 만드는 가이드 시나리오. | `.agents/skills/od-plugin-authoring` | [open-design.ai](https://open-design.ai/plugins/od-plugin-authoring/) |
| 013 | `example-pptx-html-fidelity-audit` | Pptx Html 충실도 감사 | python-pptx 내보내기와 원본 HTML 덱의 충실도를 감사하고 레이아웃 및 콘텐츠 편차(바닥글 오버플로, 잘린 콘텐츠, 이탤릭체 누락, 스타일 손실, 간격 오류)를 식별하여 엄격한 바닥글 및 커서 흐름 레이아웃 규칙으로 재내보내기합니다. | `.agents/skills/example-pptx-html-fidelity-audit` | [open-design.ai](https://open-design.ai/plugins/example-pptx-html-fidelity-audit/) |
| 014 | `od-plugin-publish-github` | GitHub에 플러그인 게시 | GitHub CLI를 사용하여 로컬 Open Design 플러그인용 공개 GitHub 리포지토리를 생성합니다. | `.agents/skills/od-plugin-publish-github` | [open-design.ai](https://open-design.ai/plugins/od-plugin-publish-github/) |
| 015 | `od-share-to-community` | 커뮤니티에 공유 | Package the work the user just finished into an Open Design plugin and route them to the existing Add-to-My-plugins / Open-Design-PR buttons. Triggered by the post-completion 'Share to Open Design' submission action. | `.agents/skills/od-share-to-community` | [open-design.ai](https://open-design.ai/plugins/od-share-to-community/) |
| 016 | `od-tune-collab` | 튜닝 & 협업 (기본 시나리오) | tune-collab taskKind을 위한 기본 레퍼런스 파이프라인. | `.agents/skills/od-tune-collab` | [open-design.ai](https://open-design.ai/plugins/od-tune-collab/) |

## 프로젝트 전용 스킬

| 스킬 | 용도 | 설치 경로 |
|---|---|---|
| `korean-executive-html-report` | 이 프로젝트의 한국어 임원보고/전략보고 HTML 덱 생성 전용 스킬 | `.agents/skills/korean-executive-html-report` |

## 참고

- 이 스킬들은 전역 `~/.codex/skills`가 아니라 이 저장소 내부에 설치되어 있다.
- 다른 Codex 프로젝트에서는 자동으로 보이지 않는다. 다른 프로젝트에서도 쓰려면 해당 프로젝트에 복사하거나 전역 설치가 필요하다.
- 저장소를 새로 pull한 뒤에는 Codex를 재시작하거나 새 세션을 열어야 새 로컬 스킬 목록이 반영된다.

## 갱신

```bash
node scripts/sync-open-design-catalog.mjs
```
