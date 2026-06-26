---
name: natural-marketing-copy
description: Rewrite, review, or systematize Korean landing page, brochure, website, CTA, email, and GTM copy so it does not feel AI-generated, translated, overhyped, or internally abstract. Use when the user asks to remove "AI 티", humanize marketing copy, improve launch copy, build copy QA gates, or adapt Monithub homepage copy-sanity/patina patterns.
---

# Natural Marketing Copy

Use this skill to turn AI-generated or internally written marketing copy into Korean copy that sounds like a real team speaking to a real customer.

This skill is based on the Monithub homepage copy workflow:

```text
structured copy source -> copy surface extraction -> language/story evaluation -> copy sanity checks -> patina gate -> human review
```

## Core Rule

Do not merely make copy smoother. Check whether the copy:

- speaks from a customer's situation, not the team's internal strategy;
- avoids translationese and generic AI product language;
- makes claims that the product can actually support;
- preserves the page or brochure story arc;
- stays short enough for the surface where it appears;
- can be checked again with a repeatable gate.

## Workflow

### 1. Identify the surface

Classify the copy before rewriting:

- first viewport hero
- landing page section
- brochure page
- CTA/button
- pricing or demo page
- email/customer message
- social metadata
- internal positioning draft

Keep internal positioning words in strategy docs only. Rewrite customer-facing copy in customer language.

### 2. Extract the copy surface

When working in a repository, prefer a single structured copy source where one exists.

For Monithub homepage, use the existing flow:

```bash
npm run copy:surface
npm run copy:evaluate
npm run copy:sanity
npm run patina:gate
```

If those scripts do not exist, manually create a copy surface with path + text pairs before reviewing. Do not review only the visible file diff if the rendered copy comes from JSON, JSONC, CMS data, generated TypeScript, or templates.

### 3. Review with blocking rules

Block or rewrite copy that uses:

- internal abstraction: "운영 자산", "개인기", "자산화", "상위 분석 레이어"
- AI/translation tone: "당신", "에 의해", "다음과 같습니다", "제공합니다", "활용 가능합니다", "사용자 친화적"
- unsupported hype: "혁신적인", "획기적인", "차세대", "새로운 패러다임", "완벽한"
- impossible automation claims: "자동으로 해결", "완전 자동 RCA", "AI가 모든 장애", "즉시 모든 문제 해결"
- sales/internal acronyms in customer CTAs when plain Korean is better
- repeated explanatory patterns such as "문제는 ... 점입니다"
- time adverb and verb conflicts such as "이미 쌓입니다"

### 4. Preserve the story arc

For landing pages and brochures, verify that the copy has:

1. a concrete customer scene;
2. the painful current behavior;
3. the next action or decision the product helps with;
4. what evidence, record, or output remains;
5. a clear customer action such as consultation, demo, or scenario review.

Do not lead with broad slogans, abstract category claims, or product jargon unless the audience already uses those exact words.

### 5. Rewrite

Use this rewrite order:

1. Replace internal nouns with customer scenes.
2. Replace generic benefit claims with before/after behavior.
3. Shorten long titles, CTAs, and sentences.
4. Remove unsupported future promises.
5. Keep necessary domain terms only where they reduce ambiguity.
6. Re-run the copy gate or manually re-check the same rules.

## References

Load only the needed reference:

- `references/anti-ai-copy-rules.md`: use when reviewing or rewriting copy.
- `references/copy-gate-workflow.md`: use when adding or porting copy QA scripts/gates.
- `references/prompts.md`: use when the user needs reusable prompts for marketing copy rewrites or reviews.

## Output Format

For copy review:

```markdown
**차단 이슈**
- 위치: <path/section>
- 문제: <why it sounds AI-like or unsafe>
- 수정 방향: <concrete instruction>

**수정안**
- 원문:
- 제안:

**검증**
- 실행한 copy/script/patina checks or manual checks
```

For rewrite-only requests, return the revised copy first, then a short note listing the major changes.

## Before Finishing

Check:

- The final copy does not sound like a translated SaaS landing page.
- The claim matches the current product capability.
- Titles, buttons, and short UI surfaces are not overloaded.
- The first viewport starts from a customer scene or pain.
- Any reusable rule is captured in a checklist, prompt, script, or skill when the task repeats.
