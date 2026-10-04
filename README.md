# Lightweight Workflow

A project-local OpenCode module for bounded execution: understand, implement,
verify, update current knowledge, and report. Conversation is the default record;
one optional brief supports useful handoff or consequential decisions.

Requires Node 22 or later. No package installation, OpenSpec, game engine, formal
spec corpus, global reviewer setup, or particular model provider is required.

## Motivation

This workflow grew out of using OpenSpec with additional ADR and review stages
for an actively evolving project. Explicit contracts and recorded decisions were
valuable, but the surrounding change-management process became costly for ordinary
work: proposal and delta packets, repeated planning documents, review manifests,
planning commits, and separate synchronization and archive steps. Small fixes and
UI refinements could spend more effort satisfying the lifecycle than improving
the product. Coding agents also had to navigate overlapping instructions and
decide which artifact owned each fact.

Lightweight Workflow keeps the useful discipline—clear scope, consequential
decisions, meaningful verification, bounded review, and current documentation—while
making the process proportional to the work. A clear implementation request can
proceed directly. Conversation is sufficient for ordinary work; one evolving brief
is available when it improves handoff or sequencing. Planning depth follows actual
compatibility, security, persistence, and architectural consequences rather than
the number of files changed. Reversible UI work can iterate with review and
reconciliation at an agreed completion checkpoint.

Projects can retain their specs, ADRs, and historical plans without retaining
OpenSpec tooling or its change lifecycle. Each project names its own continuing
owners and acceptance requirements in a small adapter, and the shared module owns
the execution procedures. The aim is less duplicated paperwork and fewer routing
decisions, with the same responsibility to verify outcomes and preserve guarantees.

## What's Included

| Component | Purpose |
|---|---|
| Execution policy | Bounded execution, consequential planning, optional briefs, UI checkpoints, and review selection |
| `lightweight-change` skill and command | Build or resume a change through implementation, verification, reconciliation, and completion |
| `explore` skill and command | Investigate a problem or compare ideas without implementing |
| `code-review` skill and command | Prepare a scoped review, resolve findings, and track relevant evidence |
| Brief template | One optional saved record for outcome, approach, work, evidence, and disposition |
| Reviewer contract and seven agents | Code review (standard, targeted, deep), architecture review (standard, deep), and design/UX review (standard, deep) |
| Project adapter template | Declare project owners, checks, constraints, and explicit overrides |
| Installer and verification tools | Explicit project-local installation/update, version and content-hash recording, and drift checks |
| Source checks and installer tests | Check instruction wiring and exercise adoption, updates, overwrite protection, and standalone verification |

The slash commands are `/lightweight-change`, `/explore`, and `/code-review`.
Reviewers are self-contained and do not pin a model or provider. Installation
manages 17 core files and seeds a separate project-owned adapter.

Product-specific rules, technology choices, verification commands, release gates,
ADR authoring, spec governance, and corpus audits belong to the project or separately
scoped modules. File ownership and maintenance boundaries are detailed below.

## Install And Adopt

From this module's checkout:

```bash
node install.mjs /path/to/project
```

The project directory must exist. The installer copies the managed payload and
records its version and exact content hashes in
`.opencode/workflow/installation.json`. Commit these files in the consumer for
reproducibility. It creates `.opencode/workflow/project.md` from the template only
when absent; that adapter remains project-owned on every subsequent update.

Review and complete the adapter, then add this pointer to the project's `AGENTS.md`:

```markdown
## Workflow

Use the project-local lightweight workflow. Read
`.opencode/workflow/project.md` for project owners and overrides and
`.opencode/workflow/policy.md` for shared execution/review policy.
```

The installer does not edit `AGENTS.md`, project configuration, verification
commands, global OpenCode files, or other skills. The adapter names existing owners;
projects without formal specs or ADRs do not need to create them. Adoption is
complete only after wiring the pointer and reviewing that project policy.

Restart OpenCode after installation/update. `/lightweight-change`, `/explore`, and
`/code-review` use the installed skills. Project-local reviewer definitions are
self-contained and do not pin models or reasoning variants; choose those in the
project's OpenCode configuration when needed. Their names match the conventional
shared reviewers, so inspect existing definitions before adoption.

## Explicit Updates And Drift

```bash
node install.mjs --check /path/to/project  # read-only comparison with this checkout
node install.mjs /path/to/project          # explicit update
node /path/to/project/.opencode/workflow/verify-installation.mjs /path/to/project
```

`--check` exits 1 when the project differs from this module, has edited managed
files, or lacks installation metadata/adapter. The installed verifier checks the
recorded installation without requiring this checkout or network access. Neither
check proves semantic agreement or how an agent follows prose.

Updates refuse locally edited or deleted managed files before writing anything.
Change shared files in the module; put project differences in the adapter. A
failed partial write leaves the old ledger, making incomplete state visible; a
retry accepts files already equal to the new source. Resolve other drift explicitly.

For initial migration from existing same-named files only:

```bash
node install.mjs --check /path/to/project
node install.mjs --adopt /path/to/project
```

`--adopt` explicitly permits replacing unmanaged conflicting payload paths. Inspect
those files/diffs first. It never bypasses protection for an existing managed
installation, and it never overwrites the adapter. There is no force-update mode.
Unexpected ledger paths or symbolic links in managed paths fail closed. The module
does not automatically delete retired files; a future removal needs an explicit,
reviewed migration rather than guessing which project files are disposable.

## Ownership

- `payload/.opencode/workflow/policy.md`: generic execution, escalation, review
  selection, UI checkpoints, and brief lifecycle.
- `payload/.opencode/workflow/review-contract.md`: common reviewer contract.
- `payload/.opencode/skills/`: operational procedures and brief template.
- `payload/.opencode/agents/`: reviewer specialties and permission boundaries.
- `payload/.opencode/commands/`: thin skill entry points.
- `templates/project.md`: initial project adapter.
- Consumer adapter and its referenced documents: product/stack guarantees,
  documentation owners, verification, specialist inputs, and release/audit gates.

Shared source is maintained here; installed files are versioned copies, not local
forks. Updates are manual and explicit, not startup synchronization. Increment the
module version for shared changes; hashes also identify the exact installed content.
The `check` command verifies source wiring and rejects obvious project-specific
references. Add optional governance/ADR/audit modules only when separately scoped.

## Develop

```bash
npm run check
npm test
```

Tests use temporary projects and exercise initial adoption, read-only drift checks,
updates, conflict protection, adapter preservation, and installed verification.
