---
name: monithub-issue-pr-workflow
description: Use before starting implementation, documentation, refactoring, bug fixing, branch creation, committing, pushing, or opening PRs in Monithub repositories. Enforces GitHub issue discovery or creation, parent/sub-issue planning for large work, docs/features updates, Korean branch and commit conventions, develop-target PRs, and issue links in PR bodies.
license: MIT
metadata:
  author: Team-Discipline
  version: "1.0"
---

# Monithub Issue / PR Workflow

## Core Rule

Do not start Monithub implementation or documentation work until the GitHub issue context is clear.

Use this order:

1. Search for an existing issue.
2. Use the matching issue if one clearly exists.
3. Create a new issue if none exists.
4. Split large work into a parent issue and `[SubIssue]` items.
5. Link commits, docs, and PRs to the right issue.

## Repository Context

Default repository for platform-centered work:

```text
Monithub/monithub-platform
```

Default local checkout:

```text
/Users/ryankimjh/Documents/Monithub/monithub-platform
```

Default PR base branch:

```text
develop
```

When the task spans multiple Monithub repositories, create the tracking issue in `Monithub/monithub-platform` unless the user explicitly chooses another repository. In the issue body, list target repositories under `대상 레포`.

## Before Editing

1. Resolve the current repository with `git remote -v`.
2. Inspect current branch and dirty files with `git status --short --branch`.
3. Do not stage or rewrite unrelated dirty files.
4. Derive 3-5 search keywords from the user's request in Korean and English when useful.
5. Search open issues with `gh issue list` or the GitHub connector.
6. If a clear issue exists, state the issue number and use it.
7. If several plausible issues exist, ask the user which one to use.
8. If no issue exists, create an issue before editing.

Recommended issue search:

```bash
gh issue list --repo Monithub/monithub-platform --state open --search "<keywords>" --json number,title,url,labels
```

## Issue Creation

For small work, create one issue.

For large work, create:

1. One parent issue for the outcome or roadmap.
2. One or more `[SubIssue]` issues for independently mergeable work.

Every sub-issue body must start with:

```text
Parent: #<parent-number>
```

Use the issue body structure in `references/issue-body-template.md`.

Include flow examples when the implementation affects user behavior, API behavior, billing, auth, onboarding, incident handling, tenant routing, or operator deployment.

## Feature Documentation

Use `monithub-feature-docs` together with this skill when the work affects:

- `docs/features/`
- `docs/decisions/`
- `docs/release/pre-deploy-discussions.md`
- user-visible product behavior
- API contracts
- deployment-sensitive temporary policy

Create or update `docs/features/<feature-name>.md` before or during implementation, not only after the code is complete.

When temporary values, mock behavior, hardcoded policy, fake responses, or production-readiness caveats appear, also update:

```text
docs/release/pre-deploy-discussions.md
```

## Branch Naming

Use:

```text
<type>/<short-description>
```

Allowed types:

- `feat`
- `fix`
- `refactor`
- `docs`
- `chore`
- `test`
- `style`
- `perf`
- `ci`
- `hotfix`

Rules:

- Use lowercase.
- Use hyphens instead of spaces.
- Keep one purpose per branch.
- Keep the description short.

Examples:

- `feat/email-verification`
- `fix/token-refresh-error`
- `docs/poc-business-logic`
- `refactor/query-service`

## Commit Messages

Use Korean commit messages with the existing prefix rules:

- `feat: 이메일 인증 추가`
- `fix: 토큰 갱신 오류 수정`
- `refactor: 쿼리 서비스 구조 개선`
- `docs: PoC 비즈니스 로직 정리`
- `test: 인증 서비스 테스트 추가`

Commit after a completed work unit. For large changes, split commits between main logic and supporting docs/config/test work.

## PR Creation

Open PRs against `develop`.

Use the PR body structure in `references/pr-body-template.md`.

Issue link rules:

- Use `Closes #<issue>` only when the PR fully completes that issue.
- Use `Related #<issue>` for parent issues, roadmap issues, or partial work.
- When there is a parent and sub-issue, normally use `Closes #<subIssue>` and `Related #<parentIssue>`.
- Do not use `Closes` for a parent issue unless all sub-issues are complete.

PRs may be draft when the change is exploratory, incomplete, documentation-only for review, or awaiting user confirmation.

After creating or finding the PR, set PR metadata:

1. Add assignee `@me`.
2. Add a label matching the work type.
3. Add the relevant GitHub Project when one exists.
4. Do not request reviewers unless the user explicitly asks.

Default labels:

- `feat` -> `enhancement`
- `fix` or `hotfix` -> `bug`
- `docs` -> `documentation`
- `refactor` -> `refactor` when available, otherwise `enhancement`
- `chore`, `ci`, `test`, `style`, `perf` -> use the matching label when available, otherwise `enhancement`
- dependency, package, or submodule updates -> `dependencies` when available, otherwise `enhancement`

Default projects:

- `Monithub/monithub-platform` -> `플랫폼`
- `Team-Discipline/skills` -> `Monithub platform`

If the repository has no relevant project or `gh pr edit --add-project` cannot find it, do not add an unrelated project. Report the missing project in the final response.

Example:

```bash
gh pr edit <number> --repo Monithub/monithub-platform --add-assignee @me --add-label documentation --add-project "플랫폼"
```

## API And Swagger Rule

When backend API behavior changes:

1. Update Swagger UI/documentation.
2. Update request and response examples.
3. Mention the Swagger update in the PR body.
4. If Swagger was not updated, explain why.

## Completion Checklist

Before final response:

- Issue exists or a clear existing issue is linked.
- Branch name follows Monithub rules.
- Feature docs are created or updated when needed.
- Pre-deploy discussion is updated for temporary production-sensitive policy.
- Tests or validation commands were run, or skipped with a reason.
- PR body links issues correctly.
- PR assignee, label, and project were set where available.
- No reviewers were requested unless the user asked.
- Unrelated dirty files remain unstaged.

Report the issue, branch, commit, PR, and validation results concisely.
