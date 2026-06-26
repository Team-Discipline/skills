# Bottleneck Playbook

Use this reference when the user wants a compelling startup story, launch workflow, demo, or retrospective.

## Narrative Rule

Do not present "we used Codex for A to Z" as a flat list. Anchor the story in events:

```text
we wanted X -> we got stuck at Y -> Codex helped us create Z loop -> result changed how we work
```

The audience should feel:

- "This could happen to my team."
- "I also have this bottleneck."
- "I can copy part of this workflow."

## Four Bottlenecks

### 1. Product definition was blurry

Symptoms:

- The team has many ideas but no clear user problem.
- Features are described from the builder's view, not the customer's view.
- Landing page copy and product scope keep changing.

Codex loop:

1. Summarize customer segment and pain point.
2. List assumptions and unknowns.
3. Convert the idea into user flow, requirements, edge cases, and priorities.
4. Produce a customer-value version of the same feature.

Shareable output:

- Product value brief.
- Feature requirement doc.
- Landing page section outline.

### 2. Team execution rules were inconsistent

Symptoms:

- Branch names, commit messages, PR bodies, and docs vary by person.
- Swagger, tests, release notes, or security checks are forgotten.
- The founder repeats the same working rules every time.

Codex loop:

1. Move rules into AGENTS.md or a skill.
2. Make Codex read repo status and issue context before editing.
3. Use issue, branch, commit, PR, docs, and checks as one execution chain.
4. Commit completed work units with concise messages.

Shareable output:

- AGENTS.md structure.
- Issue/PR workflow.
- PR readiness checklist.

### 3. The feature worked but was not launch-ready

Symptoms:

- Local implementation passes basic checks but fails in browser flow.
- Auth, permission, empty state, error state, console error, or UI layout issues appear late.
- Temporary values and debug logs survive too long.

Codex loop:

1. Run tests, build, lint, and type checks.
2. Use browser QA for real login and flow verification when available.
3. Check auth, authorization, validation, secrets, logs, and data exposure.
4. Record temporary values in feature docs or pre-deploy discussions.

Shareable output:

- Browser QA checklist.
- Security and launch-readiness checklist.
- Pre-deploy discussion list.

### 4. Product and GTM were disconnected

Symptoms:

- A feature exists, but customer-facing value is unclear.
- Marketing copy is rewritten from scratch after development.
- Brochure, landing page, email, and sales messages drift away from actual product behavior.

Codex loop:

1. Summarize implemented behavior in plain language.
2. Extract customer problem, before/after, proof point, and objection.
3. Convert it into landing page, brochure, CTA, email, and FAQ copy.
4. Check that claims match the real product state.

Shareable output:

- Landing page copy.
- Brochure structure.
- Email or customer communication draft.

## Story Template

```markdown
처음에는 <initial belief>라고 생각했습니다.
하지만 실제로 <situation>을 하면서 문제는 <real bottleneck>이라는 것을 알게 됐습니다.

가장 크게 막혔던 지점은 <specific blocker>였습니다.
이 문제는 <why it mattered> 때문에 그냥 넘길 수 없었습니다.

저희는 Codex를 <tool use>가 아니라 <workflow role>로 사용하기 시작했습니다.
구체적으로는 <repo/git/browser/docs/skills/scripts loop>를 만들었습니다.

그 결과 <measurable or observable outcome>이 생겼고,
반복되는 작업은 <reusable asset>으로 남겼습니다.

다음 단계는 <future direction>입니다.
```
