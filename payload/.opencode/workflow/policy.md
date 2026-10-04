# Lightweight Execution Policy

Read the project-owned `.opencode/workflow/project.md` first for owner locations,
verification, acceptance guarantees, and explicit overrides. Existing project and
user authorization governs; this policy supplies defaults within that boundary.

## Instruction Ownership

| Owner | Responsibility |
|---|---|
| Project adapter and its named documents | Stack/product guarantees, documentation owners, checks, release/audit gates, and explicit policy overrides |
| This policy | Execution decisions, consequential escalation, review selection/budget, UI timing, and optional-plan lifecycle |
| `lightweight-change` skill | Start/resume, implementation, completion, and safe brief moves |
| `code-review` skill | Primary-agent review handoff and finding resolution |
| `explore` skill | Thinking-only investigation and implementation handoff |
| `workflow/review-contract.md` | Common reviewer inspection/output contract for this workflow |
| Reviewer agent files | Specialty checks and escalation targets |
| `lightweight-change/brief.md` | Optional brief format |

Commands only load their skill and forward arguments. Domain skills and builder
agents supply technical procedures inside the selected scope. Keep one owner for
each procedure; consumers reference owners rather than maintaining second copies.

## Default: Bounded Execution

Understand the outcome, implement a coherent change, verify, update affected
current knowledge, and report. Implementation with clear scope proceeds directly;
planning-only requests stop at planning. Investigate ordinary uncertainty without
a classification worksheet, repeated routing approval, or testing-boundary ritual.

The request, conversation, or existing handoff is sufficient. A saved brief is
optional, including for behavior changes. There is no mandatory proposal/delta
packet, planning commit, synchronization ceremony, or review manifest.

Intentional behavior changes update affected continuing contracts, implementation,
and relevant tests together where those owners exist. Earlier contracts protect
against accidental changes, not explicitly authorized replacements. Reconcile
complete affected guarantees and named direct dependents; report unrelated drift.
Code/tests describe implementation, not automatic authority over disputed intent.

Completion requires acceptance, current-owner agreement, required verification,
and applicable review. Missing evidence leaves work pending; continue independent
in-scope work safely and report concrete blockers. Use the project's deferred-work
owner for genuinely deferred obligations. Development process creates no product
requirements. No workflow step authorizes commits, branches, merges, pushes,
deployment, or publishing without the required explicit user authorization.

## Plan For Consequences

Deeper planning is warranted by material stored-data compatibility or migrations,
security/trust guarantees, coordinated cross-subsystem contracts, or costly durable
architectural commitments. File count, touching persistence, or editing a contract
does not by itself require escalation.

Investigate unfamiliar code. When a consequential decision emerges, pause affected
implementation, explain the decision, and resolve it with the user. Make relevant
compatibility, failure handling, rollout/rollback, and verification explicit. Reuse
the existing record; save one plan when sequencing or handoff benefits. Significant
settled rationale belongs in the project's decision-record owner if it uses one;
ordinary topology/tuning stays in code, design, or planning context.

## Optional Briefs And History

Use the adapter's brief location when durable handoff, resumption, sequencing, or
consequential decisions justify it. Reuse one evolving record instead of parallel
proposal/design/task/review documents. Root-relative references survive relocation.
`Status: active` means work remains; terminal states are `complete`, `superseded`,
and `cancelled`, with the actual disposition recorded. The skill owns safe moves.
Archiving is mechanical closeout, not another review/approval stage. A failed move
is a closeout blocker, not a reason to repeat successful implementation checks.

Discover named or overlapping active plans, not the entire historical corpus.
Active plans propose work; archives explain provenance and cannot override current
owners. Preserve pending acceptance obligations and user decisions in retained
legacy plans; follow this workflow rather than obsolete lifecycle machinery.
Do not bulk-convert records or falsely complete unfinished work. Historical lookup
requires a specific provenance question; project-specific legacy aliases belong
in the adapter.

## Iterative UI Checkpoints

Reversible refinement of named surfaces can proceed directly with a conversation
record of baseline, accepted tweaks, changed paths, pending reconciliation, and
evidence. No per-tweak brief or review is required. Rediscover only for changed scope
or new conflicts. This covers presentation and controls using existing action owners.

Preserve the project's declared behavioral, persistence, security, accessibility,
supported-display/input, and architectural guarantees. Pause affected tweaks for
material guarantee changes under the escalation criteria. Placeholders must not
misrepresent canonical behavior. Use the project's feedback tooling and relevant
presentation; run focused checks/captures when needed rather than a complete device
matrix for each refinement.

At the agreed completion checkpoint, including a request to commit the pass,
inspect the accumulated scoped diff, reconcile affected documentation/direct
dependents, run appropriate checks, and obtain applicable review. Reuse fresh
evidence. Pending documentation drift must be recorded and resolved before
completion. A pause/handoff remains pending. Checkpoints do not waive authorization
or the project's release/audit/native-device acceptance gates.

## Review Selection

Use `code-review` with the request/record, exact scoped diff, relevant owners/direct
consumers, and verification. Record results in the conversation or existing record.

- Localized corrections restoring established behavior and editorial changes use
  primary inspection and focused checks by default; explicit review remains available.
- Behavior changes and executable workflow-instruction changes receive applicable
  bounded delegated implementation review. UI iteration is reviewed at its checkpoint.
- Normally reserve at most one delegated review across the request. Select code,
  design, or architecture expertise for the most consequential boundary; the primary
  verifies other acceptance conditions. Do not add parallel standards/spec reviewers.
- Use standard reviewers for behavior, targeted for metadata/fixtures/isolated tests/
  mechanical work, and deep only for a concrete unresolved risk a standard review
  cannot verify. A high-risk topic alone does not require escalation.
- Resolve findings and directly verify focused corrections. Additional passes need
  uncovered risk, materially invalidated coverage, or explicit user instruction;
  explain the need. Correction or relocation alone does not trigger another pass.
- Planning review is optional, never an automatic ADR/implementation prerequisite.
  Obtain authorization before optional review exceeds the one-pass budget.

If required reviewer capability is unavailable, report the gap rather than
substituting self-review for a delegated gate. Project overrides may choose a
different review policy explicitly; a domain skill cannot silently do so.

## Documentation Maintenance

Correct bounded drift when established intent is clear. Preserve durable guarantees
and their continuing owners, inspect named dependents, and run project-appropriate
documentation checks. Resolve disputed intent instead of making documents silently
match code. Demoting implementation detail must preserve the real outcome and its
remaining knowledge destination. Audits, when the project has them, inspect/report;
repairs are separately scoped and completed evidence stays historical.
