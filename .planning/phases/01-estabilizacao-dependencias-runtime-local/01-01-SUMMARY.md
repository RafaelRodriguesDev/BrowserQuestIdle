---
phase: 01-estabilizacao-dependencias-runtime-local
plan: 01-01-runtime-dependency-consistency
subsystem: runtime
tags: [node, dependencies, runtime]
key-files:
  modified:
    - package.json
    - package-lock.json
    - server/js/main.js
    - server/js/worldserver.js
    - server/js/metrics.js
    - tools/maps/processmap.js
    - tools/maps/exportmap.js
requirements-completed: [RUN-01, RUN-02, RUN-03, RUN-04, DEP-01, DEP-03]
completed: 2026-07-09
duration: same session
---

# Phase 01 Plan 01: Runtime Dependency Consistency Summary

Runtime dependency cleanup for clean local install and default server startup.

## Commits

| Commit | Description |
|--------|-------------|
| `b437850` | Removed residual legacy runtime imports, pruned lockfile, and kept default local metrics optional. |

## What Changed

- Removed npm `log` usage from the default server runtime and map tooling.
- Replaced map-tool logger dependency with small local console logger fallbacks.
- Replaced `path.exists` in `tools/maps/exportmap.js` with `fs.access`.
- Made metrics explicitly optional: `memcache` is loaded only when metrics are enabled.
- Normalized `package-lock.json` after `npm install`, removing extraneous legacy transitive packages.

## Verification

- `npm install`: passed.
- `npm ls --depth=0`: passed.
- `npm audit --omit=dev`: passed.
- `npm run smoke:server`: passed.
- `npm run smoke`: passed in final phase validation.

## Deviations from Plan

- Also fixed `tools/maps/exportmap.js`, because it had the same undeclared `log` dependency as `processmap.js`.

**Total deviations:** 1 auto-fixed.
**Impact:** Positive; it closes the same dependency mismatch for the full map export tool path.

## Self-Check: PASSED

All plan success criteria were met.
