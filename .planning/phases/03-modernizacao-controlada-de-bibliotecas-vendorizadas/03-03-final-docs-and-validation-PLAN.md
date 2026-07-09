---
phase: 03-modernizacao-controlada-de-bibliotecas-vendorizadas
plan: 03-03-final-docs-and-validation
type: execute
wave: 3
depends_on:
  - 03-01-vendored-library-contract-and-registry
  - 03-02-controlled-library-probes
files_modified:
  - README.md
  - client/README.md
  - .planning/codebase/STACK.md
  - .planning/codebase/CONCERNS.md
  - .planning/codebase/TESTING.md
  - .planning/PROJECT.md
  - .planning/STATE.md
  - .planning/ROADMAP.md
  - .planning/REQUIREMENTS.md
autonomous: true
requirements:
  - MOD-01
---

# Plan 03-03: Final docs and validation

<objective>
Close Phase 3 by aligning docs, codebase maps, and planning state with the final vendored-library decisions and verification evidence.
</objective>

<context>
Read before implementation:

- `.planning/phases/03-modernizacao-controlada-de-bibliotecas-vendorizadas/03-CONTEXT.md`
- `.planning/phases/03-modernizacao-controlada-de-bibliotecas-vendorizadas/RESEARCH.md`
- Summaries from plans 03-01 and 03-02 once they exist
- `client/js/lib/README.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/TESTING.md`
- `.planning/PROJECT.md`
- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
</context>

<must_haves>

## Truths

- Docs must not imply that npm updates modernize browser vendored files automatically.
- The final state must say which libraries were replaced and which were frozen.
- Phase 4 should inherit clear residual risks, especially WSS/proxy/dispatcher and high-risk loader migration.
- Generated build output must stay ignored.

## Boundaries

- Do not add new library replacements in this plan.
- Do not claim public deployment support.
- Do not mark MOD-01 complete unless each relevant vendored library has a decision.

</must_haves>

<tasks>

<task type="auto">
  <name>Task 1: Update user-facing docs</name>
  <files>README.md, client/README.md</files>
  <action>Add concise notes that vendored browser libraries are guarded by `npm run vendor:check`, and that dependency updates require `npm run smoke:all` before being accepted.</action>
  <verify>
    <automated>rg -n "vendor:check|client/js/lib|smoke:all|vendored" README.md client/README.md</automated>
  </verify>
  <acceptance_criteria>
    - A developer knows how to validate vendored library work.
    - Docs distinguish npm dependencies from browser vendored assets.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Refresh planning/codebase state</name>
  <files>.planning/codebase/STACK.md, .planning/codebase/CONCERNS.md, .planning/codebase/TESTING.md, .planning/PROJECT.md, .planning/STATE.md, .planning/ROADMAP.md, .planning/REQUIREMENTS.md</files>
  <action>Update codebase maps and GSD state to reflect final Phase 3 decisions, validation commands, remaining risks, and next phase focus.</action>
  <verify>
    <automated>rg -n "MOD-01|Phase 3|vendor:check|vendored|client/js/lib" .planning</automated>
  </verify>
  <acceptance_criteria>
    - ROADMAP marks Phase 3 complete only after verification passes.
    - REQUIREMENTS traceability marks `MOD-01` complete only after all decisions are recorded.
    - STATE points to Phase 4 planning after closure.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Run final Phase 3 validation</name>
  <files>.planning/phases/03-modernizacao-controlada-de-bibliotecas-vendorizadas/03-VERIFICATION.md</files>
  <action>Run the full final validation gate and write a verification artifact with commands, results, changed/frozen library decisions, commits, and residual caveats.</action>
  <verify>
    <automated>npm install</automated>
    <automated>npm run vendor:check</automated>
    <automated>npm run smoke</automated>
    <automated>npm run smoke:browser:build</automated>
    <automated>git status --short --ignored client-build build.txt client/config/config_build.json</automated>
  </verify>
  <acceptance_criteria>
    - Final validation passes.
    - Generated artifacts remain ignored.
    - Verification artifact records exact commands and outcomes.
  </acceptance_criteria>
</task>

</tasks>

<verification>

Run:

```powershell
npm install
npm run vendor:check
npm run smoke
npm run smoke:browser:build
git status --short --ignored client-build build.txt client/config/config_build.json
```

</verification>

<success_criteria>

- Root/client docs match the implemented vendored-library workflow.
- Codebase map and planning state reflect Phase 3 outcome.
- `MOD-01` is covered by explicit decisions.
- Local and optimized browser smoke remain passing.

</success_criteria>
