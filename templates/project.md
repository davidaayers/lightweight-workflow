# Project Workflow Adapter

Project-owned; the lightweight-workflow installer never overwrites this file.
Read `.opencode/workflow/policy.md` for shared policy. This adapter supplies project
owners and explicit overrides; do not copy the shared procedure here.

## Current Owners

- Project constraints and architecture: `AGENTS.md` and relevant code/tests.
- Behavior/contracts: use existing project owners; no formal spec tree is required.
- Current design and decisions: name existing documents when applicable.
- Verification: name the existing setup/checks document and focused commands.
- Deferred obligations: name the project's backlog or issue tracker.
- Optional briefs: `docs/changes/*.md`; historical briefs: `docs/changes/archive/`.
- Other active plans/history: name only applicable locations; otherwise none.

Replace descriptive placeholders with actual owners before claiming project
verification or reconciliation. Investigate discoverable checks; do not manufacture
passing evidence when verification guidance is absent. Brief directories need not
exist until a saved plan is useful. Use root-relative references inside briefs.

## Project Overrides And Acceptance

Declare only relevant additions or overrides: behavioral/security/persistence
guarantees, supported surfaces/input/accessibility, UI feedback tooling, specialized
review selection, and existing release/audit gates. Shared defaults apply otherwise.
Resolve contradictions before affected implementation; domain skills cannot add
project guarantees or override scope/authorization.

## Workflow Maintenance

Edit shared installed source in the lightweight-workflow module and explicitly
update this project. Edit this adapter and its named project owners locally.
Verify installation with:

```bash
node .opencode/workflow/verify-installation.mjs .
```
