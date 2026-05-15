---
name: git-commit-split
description: Group file changes by meaning and create small, focused git commits with clear messages. Use when user asks to split commits, curate changes, or commit in logical chunks.
---

# Git Commit Split

## When to use
- User asks to split commits by meaning.
- User wants staged commits with curated file groups.
- Repo has mixed changes and needs clean history.

## Workflow
1) Inspect changes:
   - `git status --short`
   - `git diff --stat`
   - If needed: `git diff -- <path>` for context.
2) Propose meaningful groups:
   - Source moves/refactors
   - Build/entrypoint changes
   - Docs updates
   - Tooling/CI removals
   - License or policy changes
3) Stage per group and commit immediately:
   - `git add ...`
   - `git commit -m "<type>: <description>"`
4) Confirm clean status:
   - `git status --short`

## Guardrails
- If unrelated deletions appear, ask before committing.
- If license/CI/workflow removals are in scope, call out impact.
- If README links break due to deletions, flag for follow-up.

## Messages
Use Conventional Commits:
- `refactor: ...`, `build: ...`, `docs: ...`, `ci: ...`, `chore: ...`

## References
- See `references/commit-groups.md` for grouping heuristics.
- See `references/staging-recipes.md` for staging patterns.
