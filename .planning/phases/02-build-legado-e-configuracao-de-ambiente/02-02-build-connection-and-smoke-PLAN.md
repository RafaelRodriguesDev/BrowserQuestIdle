---
phase: 02-build-legado-e-configuracao-de-ambiente
plan: 02-02-build-connection-and-smoke
type: execute
wave: 2
depends_on:
  - 02-01-build-command-and-diagnostics
files_modified:
  - client/js/build.js
  - client/js/config.js
  - client/js/game.js
  - client/config/config_build.json-dist
  - scripts/smoke-browser.js
  - scripts/smoke-browser-build.js
  - package.json
autonomous: true
requirements:
  - PRD-02
  - DEP-04
---

# Plan 02-02: Build connection and smoke

<objective>
Reconcile the optimized `client-build/` connection behavior with the current direct game server, or explicitly encode that the build is unsupported for the 1.0 local baseline.
</objective>

<context>
Read before implementation:

- `.planning/phases/02-build-legado-e-configuracao-de-ambiente/02-CONTEXT.md`
- `.planning/phases/02-build-legado-e-configuracao-de-ambiente/RESEARCH.md`
- `.planning/phases/01-estabilizacao-dependencias-runtime-local/01-VERIFICATION.md`
- `client/js/build.js`
- `client/js/config.js`
- `client/js/app.js`
- `client/js/game.js`
- `client/js/gameclient.js`
- `client/config/config_build.json-dist`
- `scripts/smoke-browser.js`
</context>

<must_haves>

## Truths

- The current server is a direct game server, not a dispatcher.
- A supported build path must prove `WELCOME` and movement through browser smoke.
- Build behavior must not silently diverge from `/client/` behavior.
- If build support is deferred, docs and scripts must say so clearly.

## Boundaries

- Do not implement a full dispatcher service unless no smaller direct-server option exists.
- Do not replace RequireJS or jQuery in this plan.
- Do not weaken the Phase 1 smoke suite.
- Do not commit generated `client-build/`.

</must_haves>

<tasks>

<task type="auto">
  <name>Task 1: Make build connection mode explicit</name>
  <files>client/js/build.js, client/js/config.js, client/js/game.js, client/config/config_build.json-dist</files>
  <action>Adjust the build/client config contract so the optimized client can either connect directly to the current game server or fail with an explicit documented reason. Prefer adding/using `dispatcher: false` in build config over hard-coded production dispatcher mode if compatible with the optimizer pragmas.</action>
  <verify>
    <automated>rg -n "dispatcher|prodHost|config_build|connect\\(true\\)|connect\\(config.dispatcher\\)" client/js client/config</automated>
  </verify>
  <acceptance_criteria>
    - The selected build connection mode is visible in code/config.
    - Direct-server build support does not require a dispatcher.
    - `/client/` local behavior remains unchanged.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Add build browser smoke if supported</name>
  <files>scripts/smoke-browser-build.js, scripts/smoke-browser.js, package.json</files>
  <action>If `client-build/` is supported, add `npm run smoke:browser:build` to build/serve `client-build/`, open it in Playwright, create a player, verify one player, and click the map. Reuse Phase 1 smoke helpers where practical.</action>
  <verify>
    <automated>npm run smoke:browser:build</automated>
  </verify>
  <acceptance_criteria>
    - Build smoke verifies actual gameplay, not only static file presence.
    - Build smoke cleans up server/static processes.
    - Failure identifies whether build, connection, or browser gameplay failed.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Preserve Phase 1 regression gate</name>
  <files>package.json, scripts/smoke-browser.js</files>
  <action>Ensure `npm run smoke` still validates the unbuilt `/client/` baseline. If adding build smoke to an aggregate command, use a separate command such as `smoke:all` so Phase 1 smoke remains fast and stable.</action>
  <verify>
    <automated>npm run smoke</automated>
  </verify>
  <acceptance_criteria>
    - `npm run smoke` still passes for `/client/`.
    - Build smoke is explicit and does not hide local baseline failures.
  </acceptance_criteria>
</task>

</tasks>

<verification>

Run:

```powershell
npm run build:client
npm run smoke
npm run smoke:browser:build
```

If build support is intentionally deferred, replace `npm run smoke:browser:build` with a documented failing/skip command that exits with a clear message and update Plan 02-03 docs accordingly.

</verification>

<success_criteria>

- The repository has an explicit stance on whether `client-build/` is supported in 1.0.
- If supported, optimized build browser smoke passes against the direct server.
- If deferred, the unsupported state is encoded in docs/scripts and does not confuse local setup.
- Phase 1 smoke remains passing.

</success_criteria>
