---
phase: 01-estabilizacao-dependencias-runtime-local
plan: 01-03-docs-final-validation
type: execute
wave: 3
depends_on:
  - 01-01-runtime-dependency-consistency
  - 01-02-smoke-verification
files_modified:
  - README.md
  - server/README.md
  - client/README.md
  - .planning/codebase/STACK.md
  - .planning/codebase/CONCERNS.md
  - .planning/STATE.md
autonomous: true
requirements:
  - BRW-01
  - DEP-02
  - DEP-04
  - VER-01
  - VER-02
  - VER-03
---

# Plan 01-03: Docs and final validation

<objective>
Align documentation and GSD state with the verified local runtime, then run the full smoke path as the Phase 1 exit gate.
</objective>

<context>
Read before implementation:

- `.planning/PROJECT.md`
- `.planning/ROADMAP.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/TESTING.md`
- `README.md`
- `server/README.md`
- `client/README.md`
- `.gitignore`
</context>

<must_haves>

## Truths

- Docs must reflect that the validated local client URL is `/client/` served from repo root.
- Docs must not claim production build is validated if it is not.
- Vendored browser libraries must be listed as deferred/high-risk update surface.
- Final validation must run the smoke commands created in Plan 01-02.

## Boundaries

- Do not over-document production deployment.
- Do not update docs for features not built.
- Do not include local screenshots as required source artifacts.

</must_haves>

<tasks>

<task type="auto">
  <name>Task 1: Update root README for local run path</name>
  <files>README.md</files>
  <action>Document the minimum local commands: install, start server, serve repo root, open `/client/`, and run smoke checks. Make clear this fork is BrowserQuestIdle modernization baseline.</action>
  <verify>
    <automated>rg -n "npm install|server/js/main.js|/client/|smoke|BrowserQuestIdle" README.md</automated>
  </verify>
  <acceptance_criteria>
    - A developer can follow README to run the game locally.
    - README does not rely on stale BrowserQuest dependency list.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Update stale server and client docs</name>
  <files>server/README.md, client/README.md</files>
  <action>Update dependency and run instructions to match current local runtime. Mark `client-build/` and production dispatcher behavior as not the current validated path if still unresolved.</action>
  <verify>
    <automated>rg -n "ws|/status|config_local|client-build|dispatcher|/client/" server/README.md client/README.md</automated>
  </verify>
  <acceptance_criteria>
    - Server docs no longer list removed packages as required for default local play.
    - Client docs explain root serving and `/client/`.
    - Production build status is honest.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Refresh codebase map notes if implementation changed them</name>
  <files>.planning/codebase/STACK.md, .planning/codebase/CONCERNS.md, .planning/codebase/TESTING.md</files>
  <action>Update the codebase map if Plans 01-01 or 01-02 changed dependency facts, risks, or testing state. Keep it concise and factual.</action>
  <verify>
    <automated>rg -n "log|memcache|smoke|client/js/lib|ws|/client/" .planning/codebase</automated>
  </verify>
  <acceptance_criteria>
    - Map no longer reports stale dependency concerns as current if fixed.
    - Remaining risks are clearly listed.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 4: Run final Phase 1 validation and update STATE</name>
  <files>.planning/STATE.md</files>
  <action>Run the full smoke suite and update `.planning/STATE.md` with Phase 1 execution readiness. Record any known residual caveats.</action>
  <verify>
    <automated>npm run smoke</automated>
    <automated>git status --short</automated>
  </verify>
  <acceptance_criteria>
    - Full smoke passes.
    - STATE says Phase 1 is planned and ready for execution or records precise blockers.
  </acceptance_criteria>
</task>

</tasks>

<verification>

Run:

```powershell
npm install
npm run smoke
git status --short
```

</verification>

<success_criteria>

- Root/server/client docs match the verified local path.
- Codebase map is updated if facts changed.
- Full smoke suite passes.
- Phase 1 can move to `$gsd-execute-phase 1`.

</success_criteria>

