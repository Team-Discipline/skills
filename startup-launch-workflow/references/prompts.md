# Reusable Prompts

Adapt these prompts to the current repository, team rules, and launch stage.

## Product Definition To Feature Plan

```text
이 고객 문제를 해결하는 SaaS 기능을 정의해줘.

입력:
- 대상 고객:
- 현재 pain point:
- 우리가 제공하려는 가치:
- 기존 제품/코드/문서 맥락:

출력:
1. 고객 문제 정의
2. 핵심 가치 제안
3. 기능 요구사항
4. 우선순위
5. 유저 플로우
6. 예외 케이스
7. 이번 범위에서 제외할 것
8. 구현 전 확인 질문
```

## Feature To Repo Execution

```text
이 기능을 기존 repo 구조에 맞춰 구현 계획으로 바꿔줘.

먼저 repo, 문서, 테스트 명령, API/프론트엔드 구조를 파악해줘.
그 다음 다음 항목으로 정리해줘.

1. 수정 예상 파일
2. API/DB/권한 영향
3. Swagger 또는 문서 업데이트 필요 여부
4. 보안 체크포인트
5. 테스트/빌드/브라우저 검증 방법
6. 커밋/PR 단위
7. 남은 리스크
```

## PR Readiness

```text
PR 전에 이 변경을 점검해줘.

확인할 것:
- 코드 품질
- 테스트/빌드/lint 결과
- 인증/권한/입력값 검증
- 민감 정보 노출
- 불필요한 console/debug 로그
- Swagger/API 문서와 예제 값
- 브라우저에서 확인해야 할 화면
- PR 본문에 써야 할 요약, 검증 결과, 리스크

코드는 바로 수정하지 말고 먼저 findings와 권장 수정 순서를 알려줘.
```

## Browser QA

```text
브라우저에서 런칭 전 QA를 해줘.

확인할 것:
- 로그인/권한 흐름
- 주요 happy path
- empty/loading/error/permission denied 상태
- 콘솔 에러
- UI 깨짐과 반응형 문제
- 새로고침/뒤로가기/재시도 동작

문제가 있으면 재현 경로, 영향, 수정 우선순위로 정리해줘.
```

## Feature To GTM Messaging

```text
구현된 기능을 고객에게 설명할 메시지로 바꿔줘.

입력:
- 기능 설명:
- 대상 고객:
- 해결하는 문제:
- 실제로 가능한 것:
- 아직 불가능하거나 과장하면 안 되는 것:

출력:
1. 한 문장 가치 제안
2. Before/After
3. 랜딩 페이지 섹션 구조
4. 브로슈어 문구
5. CTA 후보
6. 이메일 초안
7. 고객 FAQ
8. 과장/민감 정보 체크
```

## Storytelling

```text
이 Codex 활용 사례를 발표 스토리로 정리해줘.

조건:
- 정보 나열이 아니라 우리 팀에게 일어난 사건으로 쓸 것
- 기승전결이 드러날 것
- 어려움, 시행착오, 해결 과정, 성과, 다음 이야기를 포함할 것
- 듣는 사람이 "우리 팀도 겪는 문제"라고 느끼게 할 것
- Codex-specific 요소(repo, browser, git, AGENTS.md, skills, scripts, verification loop)를 분명히 넣을 것
```
