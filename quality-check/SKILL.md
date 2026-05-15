---
name: quality-check
description: Repository code quality inspection workflow. Reviews changed files from git status, inspects recent N commits, or performs a full repository audit. Runs existing test/lint/typecheck tools and produces concise findings. Does not modify code. Does not add tests — only recommends them.
license: MIT
compatibility: Requires git
metadata:
  author: Team-Discipline
  version: "1.0"
---

# Quality Check

## Report Language

BEFORE GENERATING ANY REPORT: You MUST ask the user:

> "Write the report in Korean or English?"

Wait for their response. Do not default to any language. Do not proceed without an explicit answer.

## Principles

- Answer in the language the user chose for the report. Skip greetings, background, and generalities.
- Use precise terminology to save tokens, but be specific enough to copy-paste.
- If existing test/lint/typecheck/format/CI scripts exist, run them first.
- Read repository patterns first, then infer standard tools by language/framework/package manager.
- Prioritize findings: bugs, regression risk, coupling, test gaps, maintainability.
- If implementation intent is unclear from design-pattern or system-design viewpoint, you MUST ask the user.
- For test gaps: write instructions only. Do not write test code.
- For refactoring: recommend direction only. Do not create refactoring patches.

## 0. Git Check

Check that git is available:

```bash
command -v git
git rev-parse --show-toplevel
```

- If git is missing: stop and ask: "Git is not available. Cannot detect changes. Proceed with full audit, or cancel?"
- If not a git repo: ask: "This is not a git repository. Proceed with full audit, or cancel?"

## 1. Mode Selection

Use the mode the user explicitly requests.

- **Partial mode**: git worktree changes, PR review, "only what changed."
- **Recent commits mode**: "last N commits," "recent work history."
- **Full audit mode**: entire codebase, "everything," "whole repo."
- If mode is unclear, default to partial. If no changes exist, ask whether to proceed with full audit.

## 2. Partial Mode

Use `git status --short` to identify target files.

- staged: `git diff --cached -- <file>`
- unstaged: `git diff -- <file>`
- untracked: read the full file, track only minimal dependencies.
- rename/delete: check call sites, imports/exports, build config up to impact boundary.

Scope is limited to changed files + directly affected contracts (interface, schema, route, public API, migration, config). Do not expand into repo-wide refactoring suggestions.

Run tools:

- Existing test/lint/typecheck scripts for the changed language.
- Run per-file if possible, per-module if not.
- If no tools exist, note the limitation based on static reading.

Output format:

```markdown
**Findings**
- [P1/P2/P3] file:line - issue. cause. fix instruction.

**Test Gap Instructions**
- file/scenario: what boundary values, failure paths, regression cases to add.

**Refactoring Suggestions**
- target: structural issue and recommended direction. No patches.

**Questions**
- Only items needing design-intent clarification.

**Verification**
- Commands run and result summary.
```

If no issues found: state "No critical issues" and briefly note residual risks and unrun checks.

## 3. Recent Commits Mode

Inspect already-committed changes in the last N commits. Exclude uncommitted worktree changes by default. If uncommitted changes exist, state: "Excluding uncommitted changes."

Determining N:

- Use N if the user specified it.
- If N is missing, ask: "How many recent commits should I inspect?"
- N must be a positive integer. If unrealistically large, recommend full audit mode.

Scope:

- Default: `HEAD~n..HEAD`
- If fewer commits exist, inspect from the earliest available commit to HEAD.
- If many merge commits and user wants workflow-oriented review, suggest `--first-parent`.
- If a specific branch/tag/commit is given, use `base..target`.

Commands:

```bash
set n 5
git log --oneline -n $n
git diff --name-status HEAD~$n..HEAD
git diff --stat HEAD~$n..HEAD
git diff HEAD~$n..HEAD -- <file>
```

Procedure:

1. `git log --oneline -n <n>` to summarize commits and intent.
2. `git diff --name-status <base>..HEAD` to identify target files.
3. For commits that need per-commit separation: `git show --stat --name-status <sha>` and `git show <sha> -- <file>`.
4. If commit-level intent matters more than file-level: write findings per commit first, then file/line as sub-evidence.
5. Check scope + directly affected contracts (interface, schema, route, public API, migration, config).
6. Run existing test/lint/typecheck tools on the scope.

Output format:

```markdown
**Scope**
- commits: <base>..HEAD
- targets: key files/modules
- excluded: uncommitted changes, generated/vendor

**Commit Summary**
- <sha> - intent/impact

**Findings**
- [P1/P2/P3] file:line - issue. cause. fix instruction.

**Test Gap Instructions**
- commit/file/scenario: regression tests to add.

**Refactoring Suggestions**
- target: structural issue and recommended direction. No patches.

**Questions**
- Only items needing commit-intent or design-intent clarification.

**Verification**
- Commands run and result summary.
```

Caveats:

- Do NOT modify commit history. No rebase, amend, or reset.
- Include commit message quality assessment only when requested.
- If multiple commits introduce the same defect and a later commit fixes it: report based on final state, avoid duplicate findings. Mention as "intermediate commit risk" only.
- Issues not reproducible at HEAD: only flag as high-priority if intermediate commits could have been deployed/released.

## 4. Full Audit Mode

Create a markdown report at the repository root. Default filename: `QUALITY_CHECK.md`. If the file already exists, ask before overwriting.

Target selection:

- List tracked files with `git ls-files`.
- Exclude: non-code files, lockfiles, vendored/generated/build artifacts, large binaries.
- Include untracked source/test/config files in a separate section.
- Monorepo: break down by package/app/service.
- Standard repo: break down by top-level directory.

Per-directory procedure:

1. Understand role and entry points.
2. Understand public contracts and data flow.
3. Check error handling, edge cases, concurrency, security, resource lifetime, type safety.
4. Evaluate test coverage and change risk.
5. Incorporate existing tool results.
6. Write per-directory findings, test gap instructions, refactoring suggestions.

Report template:

```markdown
# Quality Check

## Summary
- Overall assessment:
- Key risks:
- Verification run:

## Scope
- Included:
- Excluded:

## Findings
- [P1/P2/P3] path:line - issue. impact. fix instruction.

## Test Gap Instructions
- path/module: test scenarios to add.

## Refactoring Suggestions
- path/module: structural issue and recommended direction.

## Design Questions
- Question and decision needed.

## Per-Directory Notes
- path: observations, risks, verification status.
```

After creating the report, re-read it and self-check:

- Does every finding have file/line/impact/fix instruction?
- Are test instructions really instructions, not actual test code?
- Are refactoring suggestions directional, not patches?
- Are design questions limited to items that cannot be inferred?
- Are executed commands and skipped items documented?

## Judgment Criteria

Priority:

- P1: runtime crash, data loss, security vulnerability, clear release blocker.
- P2: major-path regression, defect likely to recur due to missing tests, API contract violation.
- P3: maintainability, coupling, duplication, minor type/edge-case risk.

Test gap candidates:

- High-change-probability policy/domain logic.
- Public API, serializer/parser, auth, billing, migration, async workflow.
- Condition branches where past defects recur.
- Contract-testable boundaries that don't require mocking.

Refactoring candidates:

- Circular dependency, large function/class, implicit global state.
- Duplicated policy branches, scattered validation, unclear ownership.
- I/O coupling that prevents test isolation.
- Type/schema/domain model mismatch.

When to ask the user:

- Change intent conflicts with existing architecture.
- Abstraction choice seems excessive or insufficient for requirements.
- Data consistency, transaction, cache invalidation, permission boundaries are unclear.
- You cannot reasonably explain "why this was implemented this way."
