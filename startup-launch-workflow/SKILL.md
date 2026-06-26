---
name: startup-launch-workflow
description: Use when a small startup or SaaS team wants Codex to turn an ambiguous product, launch, or GTM goal into an execution workflow across product definition, repository work, documentation, QA, security checks, design, and customer-facing messaging.
license: MIT
metadata:
  author: Team-Discipline
  version: "1.0"
---

# Startup Launch Workflow

Use this skill when a founder or small team asks Codex to help move from idea to launch, especially when product, engineering, design, documentation, QA, and GTM are tangled together.

The goal is not to make Codex do more isolated tasks. The goal is to convert startup ambiguity into a repeatable loop:

```text
problem definition -> execution plan -> implementation -> verification -> documentation -> GTM messaging -> reusable workflow
```

## Core Principles

- Start from the real bottleneck the team is facing, not from a generic task list.
- Keep the story centered on what happened to the team: what was unclear, what broke, what was learned, and what changed.
- Treat Codex as a repo-native execution partner, not a chat-only brainstorming tool.
- Connect implementation output back to customer-facing value.
- Turn repeated work into durable instructions, checklists, prompts, scripts, or skills.
- Keep sensitive customer, company, credential, and production details out of shareable outputs.

## When To Use

Use this skill for requests such as:

- "Codex로 창업 준비부터 런칭까지 워크플로우를 잡아줘"
- "SaaS 기능 하나를 제품 정의, 개발, 문서화, QA, 마케팅까지 연결해줘"
- "우리 팀이 겪은 트러블슈팅을 발표/문서/데모로 정리해줘"
- "기능 구현 결과를 랜딩 페이지나 브로슈어 메시지로 바꿔줘"
- "AGENTS.md, skills, scripts로 팀 SOP를 Codex에 넣고 싶어"

## Workflow

### 1. Identify the bottleneck

Classify the current blocker before planning:

1. Product definition is unclear.
2. Team execution rules are inconsistent.
3. The code works locally but is not launch-ready.
4. Product development and GTM messaging are disconnected.

If the blocker is unclear, ask for the smallest missing context needed to choose one.

### 2. Define inputs and expected outputs

Gather only the context needed for the current bottleneck:

- Customer problem, user role, target segment, or use case.
- Existing repo, docs, issue, branch, PR, or design artifact.
- Current feature state: idea, spec, in progress, implemented, or ready for launch.
- Known risks: auth, permission, data exposure, API contract, temporary policy, UI quality, or messaging mismatch.

Declare outputs before executing, for example:

- Product definition brief.
- Issue and implementation plan.
- Feature documentation.
- PR-ready checklist.
- Browser QA checklist.
- Landing page, brochure, CTA, or email copy.
- Reusable prompt, script, or skill update.

### 3. Execute through the launch loop

Use this order unless the user asks for a narrower slice:

1. Define the customer problem and product value.
2. Convert the idea into feature requirements, user flow, priority, and edge cases.
3. Inspect the repo and docs before editing.
4. Implement or plan implementation in the existing project style.
5. Verify tests, build, lint, browser flow, permissions, console errors, and UI states where applicable.
6. Check security-sensitive items: auth, authorization, validation, secrets, logs, data exposure, and API access.
7. Update feature docs, API docs, Swagger examples, PR notes, or release notes when applicable.
8. Translate the implemented feature into customer-facing messaging.
9. Extract reusable instructions into AGENTS.md, a skill, checklist, prompt, or script.

### 4. Use references as needed

Load only the reference that matches the current work:

- `references/bottleneck-playbook.md`: use when turning a vague startup story into concrete bottlenecks, conflict, resolution, and result.
- `references/checklists.md`: use when preparing execution, launch-readiness, security, documentation, browser QA, or GTM checks.
- `references/prompts.md`: use when the user needs reusable prompts for product definition, implementation planning, PR readiness, QA, or GTM conversion.

## Output Shape

For planning work, answer in this compact structure:

```markdown
**현재 병목**
- <one bottleneck and why>

**실행 루프**
- 문제 정의:
- 구현/작업:
- 검증:
- 문서화:
- GTM 연결:
- 재사용화:

**필요 산출물**
- <files/docs/prompts/checklists>
```

For storytelling or presentation work, use:

```markdown
**기**
- 우리가 처한 상황

**승**
- 실제로 막혔던 지점

**전**
- Codex로 어떻게 돌파했는지

**결**
- 성과와 재사용 가능한 구조

**다음**
- 앞으로 확장할 방향
```

## Before Finishing

Check:

- The output names the real bottleneck, not only a broad category.
- Codex-specific leverage is visible: repo, terminal, browser, git, AGENTS.md, skills, scripts, or verification loop.
- The workflow includes verification, not only generation.
- The result can be reused by another small team.
- Sensitive details are removed or marked for redaction.
