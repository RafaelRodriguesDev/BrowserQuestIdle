# Phase 02: Build legado e configuracao de ambiente - Context

**Gathered:** 2026-07-09
**Status:** Ready for planning
**Source:** Roadmap Phase 2 plus Phase 1 verification and codebase map

<domain>
## Phase Boundary

Phase 2 reconciles the legacy optimized client build path with the local server path validated in Phase 1. The target is not a full frontend modernization. The target is to decide and implement one official stance for `client-build/`: either make it work against the direct local game server, or make it explicitly unsupported for 1.0 with scripts/docs proving the supported local path.

</domain>

<decisions>
## Implementation Decisions

### Build Scope
- D-01: Keep the unbuilt `/client/` path as the verified local development baseline.
- D-02: Investigate `client-build/` with the current vendored RequireJS optimizer before replacing libraries or tooling.
- D-03: If the optimized build can be made to connect directly to the current game server with a small config/pragmas change, prefer that over replacing the build system.
- D-04: If the optimized build cannot be made reliable within Phase 2, document it as outside the 1.0 local baseline and keep smoke coverage focused on `/client/`.

### Connection Contract
- D-05: The current server is a direct game server on port `8000`, not a dispatcher service returning `{status, host, port}`.
- D-06: Production dispatcher behavior in `client/js/game.js` must not be silently used for local validation unless a dispatcher is actually implemented.
- D-07: Any build smoke must prove the browser receives `WELCOME` and accepts a movement click, not only that files were emitted.

### Config Contract
- D-08: Keep local config files ignored by Git.
- D-09: Templates under `client/config/*.json-dist` must describe direct-server vs dispatcher behavior clearly.
- D-10: Do not introduce account/auth/database/deploy concerns in this phase.

### the agent's Discretion
- The executor may add npm scripts and Node helper scripts for build/smoke automation.
- The executor may adjust RequireJS pragmas or config loading if the change is small and preserves `/client/` smoke.
- The executor may create a build-specific browser smoke script if it reuses the Phase 1 smoke helpers.

</decisions>

<canonical_refs>
## Canonical References

Downstream agents MUST read these before planning or implementing.

### Phase Intent
- `.planning/ROADMAP.md` - Phase 2 goal and success criteria.
- `.planning/REQUIREMENTS.md` - `PRD-02` and inherited `DEP-04` context.
- `.planning/phases/01-estabilizacao-dependencias-runtime-local/01-VERIFICATION.md` - validated local baseline and residual risks.

### Build and Config
- `client/js/build.js` - RequireJS optimizer config and `prodHost`/`devHost` pragmas.
- `bin/build.sh` - legacy shell build flow.
- `bin/r.js` - vendored RequireJS optimizer.
- `client/js/config.js` - config loading behavior.
- `client/js/app.js` - server option selection.
- `client/js/game.js` - dispatcher vs direct game-server connection.
- `client/js/gameclient.js` - WebSocket connection and dispatcher response handling.
- `client/config/config_build.json-dist` - build config template.
- `client/config/config_local.json-dist` - local config template.

### Verification
- `scripts/smoke-browser.js` - current browser gameplay smoke for `/client/`.
- `scripts/smoke-server.js` - reusable server startup/status helper.
- `.planning/codebase/TESTING.md` - current smoke coverage and suggested next checks.

</canonical_refs>

<specifics>
## Specific Ideas

- Add `npm run build:client` for Windows-friendly invocation instead of relying only on `bin/build.sh`.
- Add or adapt a smoke script for `client-build/` if Phase 2 chooses to support it.
- Keep `client-build/` ignored; generated output should not be committed.
- Preserve `npm run smoke` from Phase 1 as a regression gate.

</specifics>

<deferred>
## Deferred Ideas

- Replacing RequireJS/jQuery/Modernizr is deferred to Phase 3.
- WSS/HTTPS/proxy deployment is deferred to Phase 4.
- Dispatcher service implementation is deferred unless it is the smallest viable way to validate build behavior, which is unlikely for Phase 2.

</deferred>

---

*Phase: 02-build-legado-e-configuracao-de-ambiente*
*Context gathered: 2026-07-09 via plan-phase express context*
