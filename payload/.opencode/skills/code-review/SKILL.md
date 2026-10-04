---
name: code-review
description: Review a completed change, UI checkpoint, or selected planning decision within a bounded scope
---

# Bounded Review

Read `.opencode/workflow/project.md` for authority/acceptance and
`.opencode/workflow/policy.md` for review selection/budget. This skill owns the
primary agent's handoff/resolution; `workflow/review-contract.md` owns reviewer
inspection/output. Planning inputs are decisions/sources, not completed code.

## Primary-Agent Procedure

1. Select review under the policy and explicit project overrides. Reuse applicable
   coverage of this scope/revision. For completion review, confirm implementation,
   owner reconciliation, and required checks are complete. A named mid-iteration
   review does not automatically complete the session. Planning review has no
   implementation prerequisites or separate approval artifact.
2. Prepare one compact prompt: request/handoff or existing record, stage, exact
   scoped diff including new files (or planning artifacts), affected owners and
   named direct consumers, invariants/non-goals, actual verification, and concrete
   review questions. For visual work include named surfaces/states/viewports,
   design/accessibility constraints, and rendered evidence. For workflow work
   include authorization, policy, and instruction consumers. Do not create a plan
   solely as reviewer input. Gather missing essential evidence first.
3. Invoke the applicable reviewer with the local reviewer contract. Resolve returned
   expansion/escalation requests under the review budget; do not silently broaden.
   Missing required coverage leaves review pending. Reviewers do not rerun checks.
4. Reconcile findings as primary. Ask before materially changing agreed scope or
   architecture. Fix accepted defects; rerun only affected/failed checks. Verify
   focused corrections directly; another reviewer pass needs the policy's reasons.
5. Record reviewer, scope/evidence, findings/resolutions, actual checks, and gaps in
   conversation or the existing record. Do not create a manifest or paste transcripts.

## Freshness

Material later changes to behavior, contracts, test meaning, or acceptance evidence
invalidate implicated coverage. Mechanical corrections and plan relocation can be
verified directly when outcomes/evidence remain unchanged.
