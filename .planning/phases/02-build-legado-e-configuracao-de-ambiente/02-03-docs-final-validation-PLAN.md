---
phase: 02-build-legado-e-configuracao-de-ambiente
plan: 02-03-docs-final-validation
type: execute
wave: 3
depends_on:
  - 02-01-build-command-and-diagnostics
  - 02-02-build-connection-and-smoke
files_modified:
  - README.md
  - client/README.md
  - .planning/codebase/STACK.md
  - .planning/codebase/CONCERNS.md
  - .planning/codebase/TESTING.md
  - .planning/STATE.md
autonomous: true
requirements:
  - PRD-02
  - DEP-04
---

# Plan 02-03: Docs and final validation

<objective>
Document the final Phase 2 build/config stance and run the full validation gate for local and build paths.
</objective>

<context>
Read before implementation:

- `.planning/phases/02-build-legado-e-configuracao-de-ambiente/02-CONTEXT.md`
- `.planning/phases/02-build-legado-e-configuracao-de-ambiente/RESEARCH.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/TESTING.md`
- `README.md`
- `client/README.md`
- `package.json`
</context>

<must_haves>

## Truths

- Docs must tell a developer which client path is official for local work.
- Docs must say whether `client-build/` is supported, deferred, or unsupported for 1.0.
- Final validation must run Phase 1 smoke and any build smoke created in Phase 2.
- Codebase map must not keep stale statements about build uncertainty if Phase 2 resolves them.

## Boundaries

- Do not document production deployment beyond the validated build/config facts.
- Do not claim WSS/proxy support.
- Do not require committing generated build artifacts.

</must_haves>

<tasks>

<task type="auto">
  <name>Task 1: Update root and client docs</name>
  <files>README.md, client/README.md</files>
  <action>Document local commands for `/client/`, build commands for `client-build/`, config templates, and the final build support status. Include exact smoke commands.</action>
  <verify>
    <automated>rg -n "build:client|client-build|smoke:browser:build|config_build|dispatcher|/client/" README.md client/README.md</automated>
  </verify>
  <acceptance_criteria>
    - A developer can identify the official local path quickly.
    - Build instructions are honest and match implemented scripts.
    - Dispatcher/direct-server behavior is not ambiguous.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Refresh codebase map</name>
  <files>.planning/codebase/STACK.md, .planning/codebase/CONCERNS.md, .planning/codebase/TESTING.md</files>
  <action>Update build tooling, config, concerns, and test documentation based on Phase 2 implementation outcome.</action>
  <verify>
    <automated>rg -n "client-build|build:client|dispatcher|prodHost|smoke:browser:build|RequireJS" .planning/codebase</automated>
  </verify>
  <acceptance_criteria>
    - Codebase map reflects the final build support status.
    - Remaining risks are listed clearly.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Run final Phase 2 validation and update state</name>
  <files>.planning/STATE.md</files>
  <action>Run install, Phase 1 smoke, and the Phase 2 build/build-smoke gate. Update `.planning/STATE.md` with precise results and residual caveats.</action>
  <verify>
    <automated>npm install</automated>
    <automated>npm run smoke</automated>
    <automated>npm run build:client</automated>
    <automated>git status --short</automated>
  </verify>
  <acceptance_criteria>
    - Final validation commands pass or any intentional build deferral is explicitly recorded.
    - `client-build/` remains uncommitted generated output.
    - STATE points to the next phase after closure.
  </acceptance_criteria>
</task>

</tasks>

<verification>

Run:

```powershell
npm install
npm run smoke
npm run build:client
npm run smoke:browser:build
git status --short --ignored client-build build.txt
```

If `smoke:browser:build` is intentionally deferred, verification must include the explicit documented command/output proving why.

</verification>

<success_criteria>

- Root/client docs match actual build behavior.
- Codebase map reflects Phase 2 outcome.
- Local `/client/` smoke remains passing.
- Build path is either validated by browser smoke or explicitly deferred with clear next action.

</success_criteria>
