# Copy Gate Workflow

Use this when adding a repeatable gate for landing page, brochure, or GTM copy.

## Pattern From Monithub Homepage

The Monithub homepage uses these script concepts:

1. Keep marketing copy in a structured source such as `src/content/site-copy.jsonc`.
2. Generate typed app copy from that source.
3. Extract a plain text copy surface with paths.
4. Run copy evaluation rules for story, readability, and AI/translation tone.
5. Run copy sanity checks for tense/adverb conflicts and repeated structures.
6. Run Patina with Korean marketing profile.
7. Fail the gate on banned phrases, high/critical audit warnings, or unsupported claims.

Representative commands:

```bash
npm run copy:generate
npm run copy:surface
npm run copy:evaluate
npm run copy:sanity
npm run patina:score
npm run patina:audit
npm run patina:gate
```

## What To Extract

Extract only visible customer-facing strings:

- titles
- section body copy
- bullets
- CTA labels
- card titles and body
- metadata title/description
- image alt text and captions
- email subject/body if customer-facing

Exclude:

- route paths
- fragment IDs
- style/kind fields
- asset paths
- internal config

Represent the surface as:

```text
pages.home.hero.title: 봐야 할 게 너무 많은 장애 대응, 이제 감으로 찾지 마세요.
pages.home.finalCta.actions.0.label: 대표 장애 시나리오로 상담 시작하기
```

## Gate Layers

### Structural schema

Validate that copy exists where the UI expects it. For structured sources, use schema validation such as Zod.

Check:

- required sections exist;
- CTA labels are non-empty;
- image alt text exists;
- route/fragment IDs are valid;
- forbidden navigation keys such as `goto` do not appear.

### Copy evaluation

Block:

- hero title overloaded with domain English;
- long titles or CTA labels;
- long sentences with multiple ideas;
- internal abstraction;
- translationese;
- unsupported hype;
- missing landing page story arc.

### Copy sanity

Report or block:

- time adverbs and tense conflicts;
- repeated verbs;
- repeated "문제는 ... 점입니다" structure;
- future promises such as "곧" without roadmap certainty.

### Patina or external audit

Use a Korean marketing profile when available.

Treat high/critical warnings as blocking. For medium warnings, allow only reviewed domain terms or intentional UI structure terms.

## Suggested Blocklist

```text
운영 자산
개인기
자산화
플랜은 기능표
기능표가 아니라
도입 단계입니다
처음부터 큰 계약
혁신적인
새로운 패러다임
획기적인
차세대
완벽한
자동으로 해결
확정 RCA
완전 자동 RCA
AI가 모든 장애
즉시 모든 문제 해결
무제한
```

## Suggested Allowlist

Allow necessary domain terms only when the audience expects them. For observability/operations examples:

```text
Prometheus
Grafana
OpenTelemetry
ClickHouse
telemetry
observability
Incident
Service Map
Trace
War Room
RCA
MTTA
MTTR
SRE
DevOps
```

Do not let allowlisted terms dominate the hero title.
