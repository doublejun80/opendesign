# Guizang Layout Library Design

## 목적

Guizang PPT Skill은 한국어 임원보고의 메인 제작 스킬로 사용하지 않는다.  
이 프로젝트에서는 Guizang의 시각 스타일을 복제하지 않고, 장표 구조를 고르는 참고 라이브러리로만 사용한다.

핵심 목표는 다음과 같다.

- 한국어 임원보고 스킬이 보고 논리에 맞는 레이아웃 후보를 빠르게 고르게 한다.
- Guizang의 레이아웃 이름과 배치 원칙만 추출한다.
- 색상, 폰트, 여백, 카드 스타일, 장식 요소는 한국어 보고서 디자인 시스템으로 대체한다.
- 이미지나 도식이 프레임 안에서 잘려 보이는 문제를 금지 규칙에 명시한다.

## 적용 범위

새로운 메인 스킬을 만들지 않는다.  
다음 위치에 참고 문서만 추가한다.

```text
references/
  layout-library/
    guizang-layout-map.md
    guizang-do-not-copy.md
```

`guizang-layout-map.md`는 사용할 수 있는 레이아웃 이름과 한국어 보고자료 적용처를 정리한다.  
`guizang-do-not-copy.md`는 원본 스타일 복제 금지와 한국어 보고서 품질 실패 조건을 정리한다.

## 우선순위

보고서 제작 시 판단 순서는 다음을 따른다.

1. 한국어 임원보고 문법
2. SK AX 및 한국어 보고서 디자인 시스템
3. Refero MCP가 지정된 경우 실제 레퍼런스 감도
4. Guizang layout-library의 레이아웃 후보
5. Open Design / open-slide / HTML 구현
6. 1920x1080 overflow, 한국어 줄바꿈, 이미지 잘림 검수

Guizang 레이아웃은 4번 보조 계층이다. 보고 논리와 한국어 가독성을 앞서지 않는다.

## 레이아웃 맵 내용

`guizang-layout-map.md`에는 최소 다음 구조를 포함한다.

| 레이아웃 | 용도 | 한국어 보고자료 적용 |
|---|---|---|
| Statement | 핵심 판단 1개를 크게 제시 | 1장 결론, 의사결정 요청 |
| Duo Compare | A/B 비교 | As-Is / To-Be, 기존안 / 개선안 |
| KPI Tower | 3~5개 핵심 숫자 강조 | 기대효과, 비용절감, 일정, 리스크 수치 |
| Loop Diagram | 반복 구조 또는 운영 사이클 | 검토 → 실행 → 모니터링 → 개선 |
| Image Hero | 큰 이미지와 짧은 메시지 | 서비스 컨셉, 화면 예시, 방향성 제시 |
| Closing Manifesto | 마지막 메시지와 실행 요청 | 결재 요청, 다음 액션, 원칙 선언 |

추가 Guizang 고정 레이아웃은 실제 사용 가치가 있을 때만 더한다.  
레이아웃 이름은 참고하되, 장표 번호에 고정 배정하지 않는다.

## 금지 규칙 내용

`guizang-do-not-copy.md`에는 최소 다음 금지 항목을 둔다.

- Guizang 원본 색상 그대로 사용 금지
- 중국어권 잡지풍 장식 사용 금지
- 과한 고채도 단색 배경 금지
- 본문을 너무 작게 넣는 구조 금지
- 한국어 제목을 한 줄에 억지로 압축 금지
- 장표 전체를 PNG로 대체하는 방식 금지
- `object-fit: cover`로 핵심 이미지가 잘려 보이는 방식 금지
- 이미지·도형을 장식용으로만 사용하는 방식 금지
- Guizang 레이아웃이 한국어 보고 논리를 덮어쓰는 방식 금지

이미지는 HTML 장표 안의 시각 자산이어야 한다. 제목, 결론, 카드, 표, 라벨, 프로세스 단계는 가능한 HTML 텍스트로 유지한다.

## 기존 스킬과의 관계

`korean-executive-html-report` 스킬은 그대로 메인 스킬로 유지한다.  
해당 스킬의 설계 흐름 안에서 레이아웃 후보가 필요할 때만 `references/layout-library/guizang-layout-map.md`를 참고한다.

Refero MCP가 지정된 경우에는 Refero가 미감과 시각 언어를 우선한다.  
Guizang은 이때도 레이아웃 후보만 제공하며, Refero 마스터의 선, 면, 여백, 밀도, 타이포 리듬을 대체하지 않는다.

## 구현 단위

다음 구현은 별도 단계에서 진행한다.

1. `references/layout-library/` 디렉터리 생성
2. `guizang-layout-map.md` 작성
3. `guizang-do-not-copy.md` 작성
4. `korean-executive-html-report` 스킬에 참고 문서 사용 규칙 추가
5. 디자인 시스템 문서에 Guizang의 위치를 보조 레퍼런스로 명시
6. 품질 체크리스트에 이미지 잘림 검수 추가

## 검수 기준

구현 후 다음을 확인한다.

- Guizang이 메인 스킬로 등록되지 않았는가
- 레이아웃 문서가 색상·폰트·장식 복제를 유도하지 않는가
- 한국어 보고서 스킬의 우선순위와 충돌하지 않는가
- Refero 마스터 규칙과 충돌하지 않는가
- 이미지 잘림 금지 규칙이 명확한가
- 장표 번호별 고정 배정이 아니라 보고 논리 기반 선택으로 설명되어 있는가

## 비범위

이번 설계는 다음을 포함하지 않는다.

- Guizang PPT Skill 설치
- Guizang 원본 HTML/CSS 복사
- Guizang 팔레트, 폰트, 장식, 배경 효과 적용
- 기존 보고서 즉시 재작성
- Refero MCP 설정 변경

## 근거

사용자가 제공한 Guizang Layout Map과 Guizang PPT Skill 설명을 기준으로 한다.  
외부 링크는 구조 참고 목적이며, 최종 산출물은 한국어 임원보고 스킬과 프로젝트 디자인 시스템을 우선한다.
