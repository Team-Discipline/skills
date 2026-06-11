# Monithub PR Body Template

Use this structure when creating a PR.

```md
## 작업 내용

- 변경한 핵심 내용
- 문서/Swagger/테스트 갱신 여부

## 관련 이슈

Closes #<subIssue>
Related #<parentIssue>

## 검증

- `command`
- 실행하지 못한 검증이 있다면 이유

## 영향 범위

- API:
- DB:
- Frontend:
- Operator/infra:
- 문서:

## 배포 전 확인

- [ ] 임시 정책이 있다면 `docs/release/pre-deploy-discussions.md`에 기록
- [ ] Swagger 예제 값 최신화
- [ ] unrelated dirty files 제외
```

Use `Closes` only for issues fully completed by the PR. Use `Related` for parent or roadmap issues.
