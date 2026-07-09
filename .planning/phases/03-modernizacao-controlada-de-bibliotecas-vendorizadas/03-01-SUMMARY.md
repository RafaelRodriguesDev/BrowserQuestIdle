---
phase: 03-modernizacao-controlada-de-bibliotecas-vendorizadas
plan: 03-01-vendored-library-contract-and-registry
subsystem: vendored-browser-libraries
tags:
  - vendored-libs
  - verification
  - docs
key-files:
  created:
    - client/js/lib/README.md
    - scripts/check-vendored-libs.js
  modified:
    - package.json
    - .planning/codebase/STACK.md
    - .planning/codebase/TESTING.md
requirements-completed:
  - MOD-01
completed: 2026-07-09
---

# Phase 3 Plan 03-01: Vendored Library Contract and Registry Summary

Created an explicit browser vendored-library registry and a fast `vendor:check` contract gate.

## Commits

| Commit | Description |
|--------|-------------|
| `48b15ed` | Added `client/js/lib/README.md`, `scripts/check-vendored-libs.js`, `npm run vendor:check`, and codebase map notes |

## Tasks Completed

1. Added a registry for every file under `client/js/lib/`.
2. Added `npm run vendor:check` to verify expected files and key API/version markers.
3. Updated `.planning/codebase/STACK.md` and `.planning/codebase/TESTING.md` with the new guardrail.

## Verification

- `npm run vendor:check`: passed.
- `rg -n "require-jquery|Modernizr|underscore|BISON|AStar|Class|printStackTrace|css3-mediaqueries" client/js/lib/README.md`: passed.
- `rg -n "vendor:check|vendored|client/js/lib" .planning/codebase/STACK.md .planning/codebase/TESTING.md`: passed.
- `npm run smoke`: passed.

## Deviations from Plan

- Adjusted two initial script markers after running the contract against the real vendored files:
  - `underscore.min.js` uses `b.VERSION="1.1.7"` instead of a literal `_.VERSION` marker.
  - `css3-mediaqueries.js` uses `cssHelper.mediaQueryLists` instead of a literal `respondTo` marker.

## Self-Check: PASSED

The vendored registry is complete, the automated contract check exists and passes, no runtime library was replaced, and `/client/` smoke remains passing.
