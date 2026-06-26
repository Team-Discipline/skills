---
name: monithub-feature-docs
description: Use when starting, updating, reviewing, or finishing a Monithub feature implementation that needs feature documentation, ADRs, or pre-deploy discussion tracking. Applies to docs/features, docs/decisions, and docs/release/pre-deploy-discussions.md.
license: MIT
metadata:
  author: Team-Discipline
  version: "1.0"
---

# Monithub Feature Documentation

Use this skill when a Monithub feature needs documentation to be created or updated alongside implementation.

## Core Rules

- Create one Markdown document per feature under `docs/features/`.
- Keep design, implementation status, next steps, open questions, and history in the same feature document.
- Split major technical decisions into ADRs under `docs/decisions/`.
- Track deployment-sensitive temporary values in `docs/release/pre-deploy-discussions.md`.
- Update documentation during implementation, not only at the end.
- Keep writing concise and practical.

## Reference Files

Load only the reference needed for the current task:

- `references/feature-doc-template.md`: use when creating or normalizing a feature document.
- `references/adr-template.md`: use when creating an ADR for a major technical decision.
- `references/pre-deploy-template.md`: use when creating or updating deployment-sensitive temporary value tracking.

## Feature Document Rules

Use this path:

```text
docs/features/<feature-name>.md
```

Every feature document should include:

1. 작업 출처
2. 배경
3. 목표
4. 범위
5. 구현해야 할 것
6. 현재 구현 상태
7. 다음에 바로 해야 할 것
8. 후속에 구현해야 할 것
9. 결정된 사항
10. 아직 결정되지 않은 사항
11. 임시 구현 / 주의사항
12. 변경 이력

When starting a new feature, create the document even if incomplete. At minimum include 작업 출처, 배경, 목표, 범위, 구현해야 할 것, 아직 결정되지 않은 사항.

## Status Values

Use only these status values:

- 미시작
- 진행 중
- 완료
- 보류
- 재검토 필요

## Temporary Values

If any of these appear, record them in the feature document:

- mock data
- fake responses
- temporary token lifetime
- hardcoded URL
- temporary admin account
- temporary permission policy
- test code that must not ship
- config that must be re-decided before production

If it affects production readiness, also add it to:

```text
docs/release/pre-deploy-discussions.md
```

## ADR Rule

Create an ADR under `docs/decisions/` when a major technical decision explains why a direction was chosen.

Examples:

- source-of-truth storage
- REST vs WebSocket/SSE
- database or queue choice
- major deployment architecture
- long-term security or permission model

## Before Finishing Work

Before final response or commit, check:

- Feature document exists or was updated.
- Current implementation status matches the actual code.
- Immediate next steps are clear.
- Temporary values are also listed in pre-deploy discussions if needed.
- ADR exists if a major technical decision was made.
