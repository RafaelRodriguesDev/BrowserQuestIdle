---
phase: 01-estabilizacao-dependencias-runtime-local
plan: 01-01-runtime-dependency-consistency
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - package-lock.json
  - server/js/worldserver.js
  - server/js/metrics.js
  - tools/maps/processmap.js
  - server/js/main.js
autonomous: true
requirements:
  - RUN-01
  - RUN-02
  - RUN-03
  - RUN-04
  - DEP-01
  - DEP-03
---

# Plan 01-01: Runtime dependency consistency

<objective>
Make the local runtime dependency graph deterministic so a clean install can start the BrowserQuestIdle server without relying on stale or extraneous packages.
</objective>

<context>
Read before implementation:

- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/phases/01-estabilizacao-dependencias-runtime-local/01-CONTEXT.md`
- `.planning/phases/01-estabilizacao-dependencias-runtime-local/RESEARCH.md`
- `package.json`
- `server/js/main.js`
- `server/js/worldserver.js`
- `server/js/metrics.js`
- `tools/maps/processmap.js`
</context>

<must_haves>

## Truths

- The local game server must not depend on undeclared `log`.
- The local game server must not load `memcache` when metrics are disabled.
- `npm install` must leave declared production dependencies coherent with `package-lock.json`.
- `/status` must keep working after dependency cleanup.

## Boundaries

- Do not replace vendored browser libraries in this plan.
- Do not introduce a database, auth, or production supervisor.
- Do not change gameplay protocol message IDs.

</must_haves>

<tasks>

<task type="auto">
  <name>Task 1: Resolve residual `log` usage in server runtime</name>
  <files>server/js/worldserver.js, server/js/main.js, package.json</files>
  <action>Replace the remaining server-side `require('log')` dependency with the existing runtime logger contract. Prefer using the global `log` object already initialized by `server/js/main.js`, or a tiny local fallback if a module can run before bootstrap. Keep logging calls behaviorally equivalent.</action>
  <verify>
    <automated>rg -n "require\\(['\\\"]log['\\\"]\\)" server/js package.json</automated>
    <manual>Confirm `server/js/worldserver.js` no longer imports `log` directly.</manual>
  </verify>
  <acceptance_criteria>
    - `server/js/worldserver.js` does not require the `log` npm package.
    - Server startup still prints world creation logs.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Decide and isolate map-tool `log` dependency</name>
  <files>tools/maps/processmap.js, package.json</files>
  <action>Either replace `require('log')` in `tools/maps/processmap.js` with a small local logger or explicitly declare a maintained dependency if the tool truly needs it. Prefer removing the dependency because the map exporter is legacy and should not force extra runtime packages.</action>
  <verify>
    <automated>rg -n "require\\(['\\\"]log['\\\"]\\)" tools package.json</automated>
  </verify>
  <acceptance_criteria>
    - A clean install does not need undeclared `log` for map tooling.
    - The decision is reflected in docs or comments only where necessary.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Guard or retire legacy `memcache` metrics path</name>
  <files>server/js/metrics.js, server/js/main.js, server/config.json</files>
  <action>Make the metrics path explicitly optional. If keeping `server/js/metrics.js`, ensure missing `memcache` cannot break local startup when `metrics_enabled` is false. Add a clear runtime error only if metrics are enabled without the dependency or mark metrics unsupported for now.</action>
  <verify>
    <automated>node -e "require('./server/js/main.js')" should not be used because main starts the server; instead inspect imports with rg and start the real server in smoke plan.</automated>
    <automated>rg -n "memcache|metrics_enabled|Metrics" server/js server/config.json</automated>
  </verify>
  <acceptance_criteria>
    - Default local config keeps metrics disabled.
    - Missing `memcache` cannot break default server startup.
    - Metrics behavior is explicit enough for future work.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 4: Normalize npm dependency declarations</name>
  <files>package.json, package-lock.json</files>
  <action>Pin or range direct dependencies intentionally. Keep `ws`, `underscore`, and `bison` only if they are required by the current runtime. Run install/prune as needed so the lockfile reflects direct dependencies and no required package is extraneous.</action>
  <verify>
    <automated>npm install</automated>
    <automated>npm ls --depth=0</automated>
    <automated>npm audit --omit=dev</automated>
  </verify>
  <acceptance_criteria>
    - `npm install` succeeds.
    - `npm ls --depth=0` has no missing runtime dependency.
    - Any extraneous package left in local `node_modules` is not required by source.
  </acceptance_criteria>
</task>

</tasks>

<verification>

Run after all tasks:

```powershell
npm install
npm ls --depth=0
npm audit --omit=dev
node server/js/main.js
```

In another shell:

```powershell
(Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:8000/status').Content
```

</verification>

<success_criteria>

- Clean install succeeds.
- Server starts on port `8000`.
- `/status` returns a JSON array.
- No default local runtime path depends on undeclared `log` or `memcache`.
- No browser/vendor library replacement was attempted.

</success_criteria>

