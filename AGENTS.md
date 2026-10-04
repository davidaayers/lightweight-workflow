# Lightweight Workflow Module

Reusable OpenCode execution policy, skills, commands, and bounded reviewers.

- `payload/.opencode/` is canonical installed source. Change shared behavior here,
  then explicitly update consumers with `node install.mjs <project>`.
- `templates/project.md` is an onboarding template, not continuing project policy.
- `README.md` owns installation and maintenance. Installed `workflow/policy.md`
  owns execution/review selection; `workflow/review-contract.md` owns reviewers'
  shared inspection/output contract. Skills own procedures; agents own specialties.
- Keep stack, product, model/provider selections, verification commands, release
  gates, and documentation locations in the consuming project's adapter.
- Verify changes with `npm run check` and `npm test`. Installer changes need
  meaningful filesystem tests for overwrite protection and non-mutating checks.
- Use Conventional Commits. Do not commit, push, publish, or create remote
  repositories without explicit authorization.
- Follow the same bounded workflow when maintaining this module. Use the supplied
  conversation for decisions/results; optional plans do not create another lifecycle.
