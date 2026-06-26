# Startup Launch Checklists

Use these checklists selectively. Do not paste every checklist into the final answer unless the user asks for a full operating manual.

## Product Definition

- Target user and role are named.
- The painful current workflow is described.
- The product promise is written in customer language.
- Feature priority is tied to launch value.
- Non-goals are listed.
- Open assumptions are separated from decisions.

## Repo Execution

- Current repo, branch, and dirty files are inspected.
- Related issue or task source is clear.
- Existing architecture and local style are read before editing.
- Branch name and commit message follow the team's rules.
- Only task-related files are staged.
- PR body explains what changed, why, validation, and remaining risk.

## Documentation

- Feature docs are created or updated.
- API contract changes update Swagger and examples when applicable.
- Major technical decisions have an ADR.
- Temporary policy, mock behavior, fake data, hardcoded values, or production caveats are tracked.
- Docs match the actual implementation state.

## Security

- Authentication flow is checked.
- Authorization and role boundaries are checked.
- Inputs are validated at trust boundaries.
- Secrets and tokens are not exposed.
- Logs do not include sensitive data.
- API routes cannot leak cross-tenant or unauthorized data.
- Temporary admin/test accounts are documented and removed before production.

## Browser QA

- Main happy path works in a real browser.
- Empty, loading, error, and permission-denied states are checked.
- Console errors are reviewed.
- Responsive layout is checked for the target viewport.
- Navigation and refresh behavior are stable.
- The user can recover from failed actions.

## GTM Conversion

- Feature behavior is translated into customer value.
- Before/after is specific.
- Claims match the current product.
- CTA is tied to the next customer action.
- Landing page, brochure, email, and FAQ use the same core message.
- Sensitive internal details are removed.

## Reuse

- Repeated instructions move into AGENTS.md or a skill.
- Repeated commands move into scripts.
- Repeated review steps move into checklists.
- Repeated messaging transformations move into prompt templates.
