---
phase: 03-modernizacao-controlada-de-bibliotecas-vendorizadas
plan: 03-02-controlled-library-probes
subsystem: vendored-browser-libraries
tags:
  - vendored-libs
  - dependency-decisions
key-files:
  modified:
    - client/js/lib/README.md
requirements-completed:
  - MOD-01
completed: 2026-07-09
---

# Phase 3 Plan 03-02: Controlled Library Probes Summary

Evaluated low- and medium-risk vendored browser libraries and froze them with explicit rationale instead of replacing runtime files.

## Commits

| Commit | Description |
|--------|-------------|
| `bd9fdd5` | Recorded probe outcomes and freeze rationale for Underscore, BISON, AStar, stacktrace, log, and css3-mediaqueries |

## Tasks Completed

1. Probed Underscore replacement feasibility and froze `underscore.min.js` because npm `underscore` changes the wrapper/AMD surface and needs map-worker/global-specific smoke coverage.
2. Probed BISON replacement feasibility and froze `bison.js` because the npm package is the same project family with no clear runtime benefit absent protocol-codec tests.
3. Decided AStar, stacktrace, log, and css3-mediaqueries as frozen until exact adapters/tests exist.

## Verification

- `npm run vendor:check`: passed.
- `rg -n "Freeze after probe|Phase 3 Probe Notes|map-worker|protocol-codec|printStackTrace|AStar\\(grid" client/js/lib/README.md`: passed.
- `npm run smoke:all`: passed.

## Deviations from Plan

- No runtime vendored files were replaced. This is an intentional Phase 3 outcome because the probes did not identify a low-risk replacement with meaningful benefit and sufficient dedicated coverage.

## Self-Check: PASSED

Every low/medium-risk vendored library has a final Phase 3 decision. High-risk loader/browser-detection libraries remain stable. `/client/` and `client-build/` smoke checks pass.
