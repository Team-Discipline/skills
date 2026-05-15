---
name: git-commit-split
description: Group file changes by meaning and create small, focused git commits with clear conventional-commit messages. Use when user asks to split commits, curate changes, commit in logical chunks, or organize a messy working tree into a clean history.
license: MIT
compatibility: Requires git
metadata:
  author: Team-Discipline
  version: "1.0"
---

# Git Commit Split

## Report Language

Before writing any commit message or summary, you MUST ask the user:

> "Use Korean or English for commit messages?"

Wait for their response. Do not default to any language.

## When to Use

- User asks to split commits by meaning.
- User wants staged commits with curated file groups.
- Repo has mixed changes and needs clean history.
- User says "commit in logical chunks," "organize my changes," or "clean up my working tree."
- A PR has too many unrelated changes in a single commit.

## Workflow

### 1. Inspect Changes

Run these to understand what changed:

```bash
git status --short
git diff --stat
```

If needed for context:

```bash
git diff -- <path>
```

Identify every changed file and categorize it:
- Source moves / renames / refactors
- Build / entrypoint / config changes
- Docs / README / AGENTS updates
- CI / workflow config changes
- Tooling / assistant config changes
- License / policy changes
- Dependency / lockfile updates
- New feature code
- Bugfix code
- Test additions / modifications

### 2. Propose Groups to the User

Present a clear, ordered plan. Example:

> I see 8 changed files. I propose these commits:
>
> 1. **refactor: migrate source files to src/** — bot.py, buttons.py → src/
> 2. **build: add Docker entrypoint** — Dockerfile
> 3. **docs: update README and AGENTS** — README.md, AGENTS.md
> 4. **ci: remove old workflows** — .github/workflows/*.yml
> 5. **chore: remove deprecated tooling** — .claude, .gemini
>
> Accept this plan? (y / n / edit)

Do NOT stage or commit anything until the user confirms.

If the user says "no" or has a different grouping in mind, ask for their preferred grouping.

If the user says "edit" or modifies the plan, adjust accordingly and re-confirm.

### 3. Stage and Commit Per Group

For each group in order:

```bash
git add <files>
git commit -m "<type>: <description>"
```

Message format — Conventional Commits:

| Type     | When                          | Example                                    |
|----------|-------------------------------|--------------------------------------------|
| refactor | Move/rename source files      | `refactor: move bot.py and helpers to src/` |
| build    | Entry points, Docker, scripts | `build: add Docker entrypoint`             |
| docs     | README, AGENTS, docs          | `docs: update README with install guide`   |
| ci       | CI configs, workflows         | `ci: remove deprecated review workflow`    |
| chore    | Tooling, license, misc        | `chore: remove .claude and .gemini configs`|
| feat     | New feature code              | `feat: add user profile endpoint`          |
| fix      | Bugfix code                   | `fix: handle empty state in search results`|
| test     | Test additions/modifications  | `test: add edge cases for input validation`|

Use the language the user chose for commit messages.

### 4. Verify

After all commits, confirm clean status:

```bash
git status --short
git log --oneline -n 5
```

Summarize what was created:

> Done. Created 5 commits:
> - refactor: move source files to src/
> - build: add Docker entrypoint
> - docs: update README and AGENTS
> - ci: remove old workflows
> - chore: remove deprecated tooling

## Interaction Modes

### Interactive (default)

Show the full plan, ask for confirmation per group. Wait after each commit for user acknowledgment if there are many groups.

### Non-Interactive / Batch

User says "just do it" or "go ahead." Proceed through all groups without pausing. Only stop if something unexpected happens (conflict, error, ambiguous deletion).

### PR Review Mode

User says "split this PR's commits" or the working tree came from a PR branch. Same workflow but with extra care:
- Check if the branch tracks a remote (`git branch -vv`).
- Flag if splitting would break the PR history (force-push needed). Ask: "This will require a force push. Proceed?"
- Verify no other collaborators are working on the same branch.

## Guardrails

### Deletions
- If unrelated deletions appear (files not in scope of any group), ask before committing.
- If license/CI/workflow removals are in scope, call out the impact: "Removing this CI workflow means PR checks will stop running."

### README Links
- If README links break due to deletions, flag: "README links to [path] will break. Fix before or after split?"

### Empty Commits
- Do NOT create empty commits. If a group has no files after user edits the plan, skip it.

### Partial Staging
- If the user asks to stage only parts of a file (`git add -p`), use interactive staging with clear descriptions of each hunk.

### Merge Conflicts
- If `git add` or `git commit` produces an error, stop and ask the user for guidance. Do not proceed blindly.

### Large Repos
- For repos with 20+ changed files, ask: "Would you like me to group by directory, by file type, or manually?"

### Commit Message Language
- Always use the language the user chose for commit messages (asked at the start).

## References

- See `references/commit-groups.md` for grouping heuristics.
- See `references/staging-recipes.md` for staging patterns.
