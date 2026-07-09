---
phase: 02-build-legado-e-configuracao-de-ambiente
researched_at: 2026-07-09
status: complete
---

# Phase 02 Research: Build legado e configuracao de ambiente

## Findings

### The build path is old but narrow

The optimized build is controlled by `client/js/build.js` and the vendored `bin/r.js` optimizer. `bin/build.sh` removes most source modules after optimization and emits `client-build/`.

The highest-risk setting is not minification itself; it is the pragma block:

- `devHost: false`
- `prodHost: true`

Those pragmas remove local config loading and force production connection behavior.

### Production build currently assumes dispatcher mode

`client/js/game.js` always calls `this.client.connect(true)` inside the `prodHost` include block. In `client/js/gameclient.js`, `dispatcherMode=true` means the first WebSocket server response is expected to be JSON with `status`, `host`, and `port`.

The current server sends `"go"` and then expects `HELLO`; it is not a dispatcher. Therefore a build using the current `prodHost` path is expected to fail against the Phase 1 direct server.

### Config templates are ambiguous

`client/config/config_build.json-dist` only contains `host` and `port`. It does not express `dispatcher`.

`client/config/config_local.json-dist` includes `dispatcher: false`, which matches the Phase 1 direct-server path. The optimized build excludes local config loading, so this does not help `client-build/`.

### Practical Phase 2 direction

The safest implementation order is:

1. Add a Windows-friendly build command and inspect whether `client-build/` can be produced at all on current Node.
2. Make the build connection mode explicit and testable. Prefer direct-server build support via config if possible.
3. Add a build smoke command only after the build emits files and connection semantics are understood.
4. Update docs and codebase notes with the final stance.

## Risks

- The vendored optimizer is old and may fail on modern Node or minification syntax.
- `client-build/` may omit files needed by current browser smoke.
- Build pragmas can make source and build behavior diverge in hard-to-see ways.
- Generated `client-build/` must remain ignored and uncommitted.

## Recommended Plan Shape

- Plan 02-01: build command and build-output diagnosis.
- Plan 02-02: connection/config reconciliation and build browser smoke.
- Plan 02-03: docs, map refresh, and final validation.

## RESEARCH COMPLETE
