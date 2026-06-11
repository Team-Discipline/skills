# Monithub Issue Body Template

Use this structure for new issues. Delete sections that truly do not apply, but keep `배경`, `현재 문제`, `목표`, `구현 범위`, and `완료 조건`.

```md
## 배경

왜 지금 이 작업이 필요한지 적는다.

## 현재 문제

- 현재 코드/운영/문서에서 부족한 점
- 사용자가 겪는 문제
- 관련 레포 또는 파일

## 목표

- 이 이슈가 끝났을 때 달라져야 하는 것

## 대상 레포

- monithub-platform
- monithub-chat
- monithub-gateway
- monithub-operator
- monithub-llm-util
- monithub-homepage

## 예시 흐름

### 흐름 A: 대표 사용자 흐름

1. 사용자가 어떤 행동을 한다.
2. 시스템이 어떤 검증을 한다.
3. 어떤 데이터가 생성/변경된다.
4. 실패하면 어떤 응답이나 상태가 된다.

### 흐름 B: 예외 또는 운영 흐름

1. 예외 조건이 발생한다.
2. 시스템이 상태를 기록한다.
3. 사용자 또는 운영자가 확인할 수 있다.

## 구현 범위

- API
- DB migration
- Store/service/handler
- Frontend UI
- 권한 체크
- Swagger 문서와 예제
- 테스트

## API/데이터 검토 포인트

- `POST /example`
- `GET /example/{id}`
- `example_table`
- 상태값: `pending`, `active`, `failed`

## 예외 처리

- 권한 없음
- quota 초과
- 중복 요청
- 만료된 token
- 외부 provider 실패

## 테스트 계획

- 단위 테스트
- API 테스트
- 권한/실패 케이스
- Swagger 예제 확인

## 완료 조건

- 사용자 흐름이 동작한다.
- 실패 케이스가 명확한 reason code로 처리된다.
- Swagger 문서와 예제가 갱신된다.
- 관련 문서가 갱신된다.
```

For a sub-issue, put this at the top:

```md
Parent: #<parent-number>
```
