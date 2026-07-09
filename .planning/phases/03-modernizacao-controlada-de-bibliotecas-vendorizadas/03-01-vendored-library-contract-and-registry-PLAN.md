---
phase: 03-modernizacao-controlada-de-bibliotecas-vendorizadas
plan: 03-01-vendored-library-contract-and-registry
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - scripts/check-vendored-libs.js
  - client/js/lib/README.md
  - .planning/codebase/STACK.md
  - .planning/codebase/TESTING.md
autonomous: true
requirements:
  - MOD-01
---

# Plan 03-01: Vendored library contract and registry

<objective>
Create an explicit registry and automated contract check for every vendored browser library before attempting any replacement.
</objective>

<context>
Read before implementation:

- `.planning/phases/03-modernizacao-controlada-de-bibliotecas-vendorizadas/03-CONTEXT.md`
- `.planning/phases/03-modernizacao-controlada-de-bibliotecas-vendorizadas/RESEARCH.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/TESTING.md`
- `client/index.html`
- `client/js/build.js`
- `scripts/build-client.js`
- `package.json`
- `client/js/lib/`
</context>

<must_haves>

## Truths

- `client/js/lib/` is a runtime surface, not passive copied assets.
- Each vendored file must have a recorded decision before broad dependency updates.
- Contract checks must cover both expected files and important internal version/API markers.
- Generated `client-build/` output must remain uncommitted.

## Boundaries

- Do not replace any vendored library in this plan.
- Do not change gameplay or protocol behavior.
- Do not remove IE-only assets in this plan.

</must_haves>

<tasks>

<task type="auto">
  <name>Task 1: Add vendored library registry</name>
  <files>client/js/lib/README.md</files>
  <action>Create a concise registry listing each vendored file, current role, detected version/source, runtime contract, current Phase 3 decision, and future unlock condition.</action>
  <verify>
    <automated>rg -n "require-jquery|Modernizr|underscore|BISON|AStar|Class|printStackTrace|css3-mediaqueries" client/js/lib/README.md</automated>
  </verify>
  <acceptance_criteria>
    - All files under `client/js/lib/` are represented.
    - `require-jquery.js` is documented as both loader and jQuery provider.
    - Decisions are explicit: freeze, probe, replace, remove, or defer.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Add automated vendored contract check</name>
  <files>scripts/check-vendored-libs.js, package.json</files>
  <action>Add `npm run vendor:check` backed by a Node script that verifies required vendored files exist and contain key markers such as RequireJS 0.26.0, jQuery 1.6.4, Modernizr 2.5.3, `define('jquery'`, `window.BISON`, `Class.extend`, `printStackTrace`, and `define(function()` for AStar.</action>
  <verify>
    <automated>npm run vendor:check</automated>
  </verify>
  <acceptance_criteria>
    - Missing or accidentally replaced files fail clearly.
    - The check is fast and deterministic.
    - The script does not require browser execution.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Refresh codebase testing map</name>
  <files>.planning/codebase/STACK.md, .planning/codebase/TESTING.md</files>
  <action>Document `vendor:check` as the first gate for vendored library work and clarify how it composes with `npm run smoke:all`.</action>
  <verify>
    <automated>rg -n "vendor:check|vendored|client/js/lib" .planning/codebase/STACK.md .planning/codebase/TESTING.md</automated>
  </verify>
  <acceptance_criteria>
    - Future agents can see the vendored-library guardrail from the codebase map.
    - The test map says `vendor:check` is necessary but not sufficient; browser smoke still matters.
  </acceptance_criteria>
</task>

</tasks>

<verification>

Run:

```powershell
npm run vendor:check
npm run smoke
```

</verification>

<success_criteria>

- Vendored library inventory is complete and actionable.
- Automated contract check exists and passes.
- No runtime library replacement has happened yet.
- Existing `/client/` smoke remains passing.

</success_criteria>
