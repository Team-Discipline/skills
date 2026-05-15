---
name: git-commit-split
description: Group file changes by dependency and narrative flow so commits are independently revertible and tell a coherent story. Use when user asks to split commits, curate changes, commit in logical chunks, or organize a messy working tree into a clean history.
license: MIT
compatibility: Requires git
metadata:
  author: Team-Discipline
  version: "2.0"
---

# Git Commit Split

## Report Language

Before writing any commit message or summary, you MUST ask the user:

> "Use Korean or English for commit messages?"

Wait for their response. Do not default to any language.

## Philosophy: Why We Split Commits

커밋을 분할하는 목적은 두 가지다.

### 1. 복구 용이성 (Recoverability)

각 커밋은 **독립적으로 revert / cherry-pick 가능해야 한다.**

- 이 커밋만 revert해도 나머지가 깨지지 않는가?
- feature A 커밋만 골라서 다른 브랜치에 cherry-pick 할 수 있는가?
- 버그픽스 커밋만 선별해서 핫픽스 배포에 포함할 수 있는가?

**→ 한 커밋 안에 서로 의존성이 없는 변경이 섞여 있으면 안 된다. 반대로, 의존 관계가 있는 변경은 같은 커밋에 있어야 한다.**

### 2. 작업 흐름 추적 (Workflow Traceability)

커밋 로그는 **개발자가 문제를 해결해 나간 순서를 드러내야 한다.**

- 왜 이 파일을 먼저 리팩터링했는가? → 다음 작업의 기반이었기 때문
- 왜 이 테스트를 나중에 추가했는가? → 기능 구현 후 검증이 필요했기 때문

커밋 로그를 시간순으로 읽으면 **"개발자의 의사결정 흐름"** 이 보여야 한다. 단순히 "무엇을" 바꿨는지가 아니라 **"왜 이 순서로"** 바꿨는지가 담겨 있어야 한다.

## Core Principles

| 원칙 | 설명 |
|------|------|
| **의존성으로 묶고, 의도로 자른다** | 같은 타입/함수를 건드리는 변경은 한 커밋에. 서로 다른 의도의 변경은 같은 파일에 있어도 분리한다. |
| **중간 상태가 깨지지 않아야 한다** | 각 커밋 시점에 프로젝트가 컴파일되고 기본 기능이 동작해야 한다. |
| **순서가 이야기를 만든다** | Prep → Core → Fix → Polish 순서로 쌓는다. |
| **하나의 커밋 = 하나의 의도** | "버그 수정 + 리팩터링 + 문서 업데이트"는 3개의 커밋이다. |

## When to Use

- User asks to split commits by meaning.
- User wants staged commits with curated file groups.
- Repo has mixed changes and needs clean history.
- User says "commit in logical chunks," "organize my changes," or "clean up my working tree."
- A PR has too many unrelated changes in a single commit.

## Workflow

### 0. Change Analysis

Run these to understand the full picture:

```bash
git status --short                              # overview
git diff --stat                                 # file-level summary
git diff --name-status                          # detect rename/copy/mode
git diff --numstat                              # lines changed per file
```

For dependency analysis (check if two changes touch related code):

```bash
git diff -- <path_a> <path_b>                   # compare related files
```

Identify every changed file and classify by **intent** and **dependency**:

- **Prep** — Renames, moves, import path updates, lint fixes, config setup. Changes that enable subsequent work.
- **Core** — New feature logic, refactors with equivalent behavior, API changes. The main event.
- **Fix** — Bugfixes discovered during Core work. Includes the test that proves the fix.
- **Polish** — Tests for Core, docs, README, changelog, cleanup.

**Dependency rule:** If file A depends on file B (imports it, calls its API, uses its type), they MUST be in the same commit or A must come AFTER B in a later commit. A commit that breaks its dependencies is invalid.

**Rollback test:** For each proposed group, ask: "Can I revert just this commit while keeping the rest?"

### 1. Build the Narrative Plan

Present a clear, ordered plan with the **why** behind each group:

> I see 8 changed files across 4 logical steps:
>
> **Prep —** `refactor: move source files to src/`
>   - bot.py, buttons.py → src/ (import paths updated across project)
>   - *Why first:* 모든 파일 이동을 먼저 정리해야 이후 변경이 깔끔함
>
> **Core —** `feat: add user profile endpoint`
>   - src/api/users.py (new), src/models/user.py (modified)
>   - *Why together:* models 없이는 endpoint가 동작하지 않음 (의존 관계)
>
> **Fix —** `fix: handle empty response in search`
>   - src/services/search.py (수정)
>   - *발견 경로:* Core 작업 중 기존 검색 로직에서 버그 발견
>
> **Polish —** `test: add profile endpoint tests`
>   - tests/test_users.py (new)
>   - *Why last:* 기능이 먼저 구현된 후에야 테스트를 작성할 수 있음
>
> Accept this plan? (y / n / edit)

Do NOT stage or commit anything until the user confirms.

If the user says "no" or has a different grouping in mind, ask for their preferred grouping.

If the user says "edit" or modifies the plan, adjust accordingly and re-confirm.

### 2. Validate Group Independence

Before staging, for each group, verify:

1. **Import completeness** — Does this group include all new imports it introduces?
2. **API contract** — If this group changes a function signature, are all call sites updated in the same or earlier commit?
3. **Test coherence** — Does a fix include its corresponding test? (Yes = same commit)
4. **Revert isolation** — If I revert this commit, would other commits still compile?

If any check fails, absorb the dependent changes into this group or reorder.

### 3. Stage and Commit Per Group

For each group in order:

```bash
git add <files>
git commit -m "<type>(<scope>): <description>"
```

Use conventional commits with **scope** inferred from module/package path:
- `src/api/users/controller.ts` → `feat(api/users): add list endpoint`
- `src/services/payment.ts` → `fix(payment): handle timeout correctly`

| Type     | When                          | Example                                    |
|----------|-------------------------------|--------------------------------------------|
| refactor | Move/rename, restructure      | `refactor(core): move all source to src/`  |
| build    | Entry points, Docker, scripts | `build: add Docker entrypoint`             |
| docs     | README, AGENTS, docs          | `docs: update README with install guide`   |
| ci       | CI configs, workflows         | `ci: remove deprecated review workflow`    |
| chore    | Tooling, license, misc        | `chore: remove .claude and .gemini configs`|
| feat     | New feature code              | `feat(users): add profile endpoint`        |
| fix      | Bugfix code                   | `fix(search): handle empty response`       |
| test     | Test additions/modifications  | `test(users): add profile endpoint tests`  |
| perf     | Performance improvement       | `perf(cache): reduce TTL to 30s`           |
| revert   | Revert a previous commit      | `revert: restore search pagination`        |

**Message format — narrative style:**

```
<type>(<scope>): <imperative description>

<why this change exists — context, discovery path, tradeoff>
```

Example:

```
fix(search): handle empty response

Core work on the profile endpoint revealed that the existing search
service returns 500 on empty queries. Quick fix to return [] instead.
```

Use the language the user chose for commit messages.

If a group contains changes spread across files but sharing one intent, commit them together even if types differ — e.g., a bugfix + its test in one commit, labeled as `fix`.

### 4. Verify Recoverability

After each commit, run:

```bash
git status --short
```

After all commits, confirm:

```bash
git log --oneline -n 10
```

Then perform the **recoverability check** on the final series:

1. Does each commit build/compile on its own? (If CI is available, note this.)
2. Can I cherry-pick any single commit without conflicts?
3. Does reverting a single commit leave a working state?

Summarize what was created:

> Done. Created 4 commits:
> - refactor(core): move source files to src/
> - feat(users): add profile endpoint
> - fix(search): handle empty response
> - test(users): add profile endpoint tests
>
> 각 커밋은 독립적으로 revert 가능하며, Prep → Core → Fix → Polish 순서로
> 작업 흐름을 추적할 수 있습니다.

## Interaction Modes

### Interactive (default)

Show the full narrative plan, ask for confirmation per group. Wait after each commit for user acknowledgment if there are many groups.

### Non-Interactive / Batch

User says "just do it" or "go ahead." Proceed through all groups without pausing. Only stop if something unexpected happens (conflict, error, ambiguous deletion).

### Narrative Mode

User says "tell me the story" or "narrative mode." Enhanced workflow where:

- Each commit message MUST include a body explaining **why this step comes before the next**.
- After all commits, produce a **summary narrative** in the user's chosen language:

  > 1. 먼저 파일을 src/로 옮겨서 새 구조를 만들었습니다.
  > 2. 그 위에 profile endpoint를 추가했습니다.
  > 3. 작업 중 발견한 검색 서비스 버그를 수정했습니다.
  > 4. 마지막으로 endpoint 테스트를 추가했습니다.

### PR Review Mode

User says "split this PR's commits" or the working tree came from a PR branch. Same workflow but with extra care:

- Check if the branch tracks a remote (`git branch -vv`).
- Flag if splitting would break the PR history (force-push needed). Ask: "This will require a force push. Proceed?"
- Verify no other collaborators are working on the same branch.

## Guardrails

### Dependency Conflicts
- If two groups modify the **same function or type**, flag it: "Group A and B both change `UserService.login()`. Merge them or risk partial-apply breakage."
- If removing a function that others import, absorb those call-site updates into the same commit.

### Deletions
- If unrelated deletions appear (files not in scope of any group), ask before committing.
- If license/CI/workflow removals are in scope, call out the impact: "Removing this CI workflow means PR checks will stop running."

### README Links
- If README links break due to deletions, flag: "README links to [path] will break. Fix before or after split?"

### Empty Commits
- Do NOT create empty commits. If a group has no files after user edits the plan, skip it.

### Partial Staging (Hunk Splitting)
- If a single file contains changes for multiple intents (e.g., both a bugfix and a refactor), offer to split with `git add -p`.
- For each hunk, ask: "Does this belong to the current commit or a previous/next one?"
- See `references/staging-recipes.md` for detailed patterns.

### Merge Conflicts
- If `git add` or `git commit` produces an error, stop and ask the user for guidance. Do not proceed blindly.

### Large Repos (20+ files)
- Generate a **dependency heatmap** of changed files first.
- Ask: "Would you like me to group by directory boundary, by narrative step (Prep/Core/Fix/Polish), or manually?"

### Broken Intermediate State
- If the user chooses a grouping that would leave an intermediate commit broken, warn: "Committing A without B will leave the project in a non-compilable state until B is committed. Proceed anyway?"
- If the user says yes, note it in the commit message body: `(intermediate state — see next commit for completion)`

### Commit Message Language
- Always use the language the user chose for commit messages (asked at the start).

## References

- See `references/commit-groups.md` for grouping heuristics and dependency rules.
- See `references/staging-recipes.md` for hunk-splitting and partial-staging patterns.
- See `references/recoverability-checks.md` for post-split validation.
