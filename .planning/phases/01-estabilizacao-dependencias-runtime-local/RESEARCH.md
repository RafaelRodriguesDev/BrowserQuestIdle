# Phase 1 Research: Estabilizacao de dependencias e runtime local

**Researched:** 2026-07-09
**Confidence:** High for local codebase facts, medium for implementation details until smoke scripts are executed.

## Executive Summary

Phase 1 should not chase broad dependency modernization. The npm surface is already small and current for direct dependencies: `ws`, `underscore`, and `bison` are at latest versions according to npm checks on 2026-07-09. The real stability gaps are internal consistency and verification: residual imports of removed packages, optional legacy metrics, production build behavior that differs from the local path, and missing smoke tests.

The safest plan is to first make a clean install deterministic, then add repeatable smoke checks around the currently validated local game path. Only after that should later phases touch vendored browser libraries.

## Confirmed Facts

- Direct npm dependencies are `underscore`, `bison`, and `ws`.
- Latest checked versions on 2026-07-09:
  - `ws`: `8.21.0`
  - `underscore`: `1.13.8`
  - `bison`: `1.1.1`
- `node_modules` currently contains extraneous packages such as `log`, because previous installs left transitive/old packages behind.
- `server/js/worldserver.js` imports `log`.
- `tools/maps/processmap.js` imports `log`.
- `server/js/metrics.js` imports `memcache`.
- `server/config.json` has `metrics_enabled: false`.
- Local browser path must serve repository root and open `/client/`, otherwise shared modules outside `client/` can fail.
- `client/js/gameclient.js` still builds `ws://host:port/`.
- `client/js/build.js` production pragmas can switch the client into dispatcher mode.

## Technical Risks

| Risk | Impact | Phase 1 Response |
|------|--------|------------------|
| Clean install removes extraneous `log` | Server or map tooling can fail | Remove/replace imports or add intentional dependency |
| Metrics path requires `memcache` | Enabling metrics fails | Keep disabled and guard/remove path from local runtime |
| Browser libraries are vendored | npm update misses browser runtime | Inventory only; defer replacement |
| Production build differs from local | False confidence if only `/client/` works | Document boundary; do not claim build support |
| No smoke tests | Future dependency updates regress silently | Add server, WebSocket, browser smoke checks |

## Recommended Architecture for Phase 1

### Plan A: runtime consistency

Clean up direct runtime dependencies and imports until:

- `npm install` from clean checkout produces no required extraneous runtime dependency.
- `node server/js/main.js` works after install.
- `/status` works.
- Map tooling status is either preserved or explicitly documented as outside phase execution.

### Plan B: smoke verification

Add or document smoke commands for:

- Server startup and `/status`.
- WebSocket connect and `HELLO`/`WELCOME`.
- Browser open `/client/`, create/load character, verify `started` state and `1 player`.

### Plan C: docs and boundaries

Update local docs to say:

- Serve repo root, open `/client/`.
- `client-build/` is not the validated path yet.
- Vendored libraries are deferred.
- `client/audio/music` is absent locally and music loading is disabled.

## Non-Goals

- Do not replace RequireJS/jQuery/Modernizr in Phase 1.
- Do not build production deployment.
- Do not add gameplay features.
- Do not rework protocol messages.

## Planning Conclusion

Split Phase 1 into three waves:

1. Clean dependency/import consistency.
2. Add executable smoke verification.
3. Update docs and run final local browser validation.

This gives future refactor phases a stable baseline and prevents the modernization effort from confusing "latest npm dependency" with "browser runtime safely modernized".

## RESEARCH COMPLETE
