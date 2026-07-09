---
phase: 03-modernizacao-controlada-de-bibliotecas-vendorizadas
plan: 03-02-controlled-library-probes
type: execute
wave: 2
depends_on:
  - 03-01-vendored-library-contract-and-registry
files_modified:
  - client/js/lib/README.md
  - client/js/lib/underscore.min.js
  - client/js/lib/bison.js
  - client/js/lib/astar.js
  - client/js/lib/stacktrace.js
  - client/js/lib/log.js
  - package.json
autonomous: true
requirements:
  - MOD-01
---

# Plan 03-02: Controlled library probes

<objective>
Evaluate low- and medium-risk vendored libraries one at a time and either replace them with a proven compatible source or freeze them with a specific rationale.
</objective>

<context>
Read before implementation:

- `.planning/phases/03-modernizacao-controlada-de-bibliotecas-vendorizadas/03-CONTEXT.md`
- `.planning/phases/03-modernizacao-controlada-de-bibliotecas-vendorizadas/RESEARCH.md`
- `client/js/lib/README.md`
- `scripts/check-vendored-libs.js`
- `client/js/gameclient.js`
- `client/js/pathfinder.js`
- `client/js/mapworker.js`
- `client/js/home.js`
- `scripts/smoke-browser.js`
- `scripts/smoke-browser-build.js`
</context>

<must_haves>

## Truths

- `require-jquery.js`, `modernizr.js`, and `class.js` are high-risk and should be frozen unless a dedicated adapter/rewrite is created.
- Replacements are acceptable only when they preserve existing AMD/global contracts.
- Each candidate must be validated independently; do not batch replace libraries.
- A failed probe should be reverted and recorded as a freeze decision, not left partially changed.

## Boundaries

- Do not replace `require-jquery.js` in this plan.
- Do not replace `modernizr.js` in this plan.
- Do not convert the app to ES modules or a modern bundler.
- Do not change WebSocket message formats.

</must_haves>

<tasks>

<task type="auto">
  <name>Task 1: Probe Underscore replacement or freeze</name>
  <files>client/js/lib/underscore.min.js, client/js/lib/README.md, package.json</files>
  <action>Compare the vendored browser underscore against the installed npm `underscore` package. If a browser build can preserve global `_`, old aliases used by the code (`_.detect`, `_.include`, `_.any`, etc.), and map-worker `importScripts` behavior, replace it. Otherwise keep the file and record the freeze reason.</action>
  <verify>
    <automated>npm run vendor:check</automated>
    <automated>npm run smoke:all</automated>
  </verify>
  <acceptance_criteria>
    - Either `underscore.min.js` is replaced with a proven compatible version or its freeze rationale is documented.
    - `mapworker.js` still loads `_`.
    - `/client/` and `client-build/` browser smokes pass after the decision.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Probe BISON replacement or freeze</name>
  <files>client/js/lib/bison.js, client/js/lib/README.md, package.json</files>
  <action>Compare the vendored BISON browser codec with the npm `bison` package. Replace only if `BISON.encode` and `BISON.decode` remain available to `gameclient.js` and WebSocket smoke/browser smoke prove compatibility. Otherwise freeze with rationale.</action>
  <verify>
    <automated>npm run vendor:check</automated>
    <automated>npm run smoke:all</automated>
  </verify>
  <acceptance_criteria>
    - WebSocket `HELLO`/`WELCOME` still works.
    - Browser gameplay still starts and accepts movement.
    - Protocol codec decision is documented.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Decide AStar, stacktrace, log, and css3-mediaqueries</name>
  <files>client/js/lib/astar.js, client/js/lib/stacktrace.js, client/js/lib/log.js, client/js/lib/README.md</files>
  <action>Evaluate whether each remaining standalone file should be replaced now or frozen. Prefer freezing unless an exact API-compatible replacement is trivial and smoke-proven. Record each decision and unlock condition.</action>
  <verify>
    <automated>npm run vendor:check</automated>
    <automated>npm run smoke:all</automated>
  </verify>
  <acceptance_criteria>
    - `AStar(grid, start, end)` still works for pathfinding.
    - `printStackTrace` usage through `log.error(..., true)` remains valid or is adapted.
    - Global `log` remains available to client modules.
    - IE-only polyfill status is documented without disrupting modern browser smoke.
  </acceptance_criteria>
</task>

</tasks>

<verification>

After each candidate decision:

```powershell
npm run vendor:check
npm run smoke:all
```

If a replacement fails, restore the candidate file before proceeding and document the freeze reason.

</verification>

<success_criteria>

- Every low/medium-risk vendored library has a final Phase 3 decision.
- Any committed replacement is smoke-proven in both `/client/` and `client-build/`.
- Any non-replaced library has an explicit freeze rationale.
- High-risk loader/browser-detection libraries remain stable.

</success_criteria>
