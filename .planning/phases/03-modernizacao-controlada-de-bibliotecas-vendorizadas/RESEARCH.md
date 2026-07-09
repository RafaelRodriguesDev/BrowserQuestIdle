# Phase 3 Research: Vendored Browser Libraries

## Research Complete

Phase 3 should not attempt a broad dependency upgrade. BrowserQuest's client runtime depends on old global and AMD contracts that are separate from npm dependencies.

## Current Vendored Files

| File | Current role | Detected version/source | Risk | Initial decision |
|------|--------------|-------------------------|------|------------------|
| `require-jquery.js` | RequireJS loader + jQuery + AMD `jquery` module | RequireJS `0.26.0`, jQuery `1.6.4` | Very high | Freeze for 1.0 unless dedicated loader migration exists |
| `modernizr.js` | Feature detection for localStorage/audio/opacity/prefixes | Modernizr `2.5.3` custom build | High | Freeze unless feature checks are replaced by direct browser APIs |
| `underscore.min.js` | Global `_` utility used across client and map worker | Old browser underscore, npm has `1.13.8` | Medium | Candidate for controlled replacement/probe |
| `bison.js` | Browser BISON codec used by WebSocket protocol | BISON browser bundle, npm has `1.1.1` | Medium | Candidate for controlled replacement/probe |
| `astar.js` | AMD pathfinding helper used by `pathfinder.js` | Standalone algorithm | Medium | Freeze unless exact API replacement is trivial |
| `class.js` | Global `Class.extend` inheritance helper | John Resig inheritance helper | High | Freeze; broad refactor required to remove |
| `stacktrace.js` | Global `printStackTrace` used by `log.js` | Legacy stack trace helper, npm `stacktrace-js` is API-different | Medium | Freeze or replace only with adapter |
| `log.js` | Global `log` used throughout client | Local wrapper | Low | Keep/freeze; replacement not worth risk now |
| `css3-mediaqueries.js` | IE conditional polyfill | Legacy IE-only polyfill | Low for modern browsers | Keep or document as legacy/optional |

## Usage Findings

- `client/index.html` loads `modernizr.js`, IE-only `css3-mediaqueries.js`, `detect.js`, `log.js`, and `require-jquery.js`.
- `client/js/build.js` aliases `jquery` to `lib/require-jquery` and excludes `jquery` from optimized modules.
- `require-jquery.js` exposes `window.jQuery`, `window.$`, and `define('jquery', [], function() { return jQuery })`.
- `home.js` loads `lib/class`, `lib/underscore.min`, and `lib/stacktrace` primarily for globals.
- Most client modules rely on global `Class`, `_`, `log`, and `Types`.
- `mapworker.js` imports `lib/underscore.min.js` directly via `importScripts`.
- `gameclient.js` imports `lib/bison` and uses `BISON.encode` / `BISON.decode`.
- `pathfinder.js` imports `lib/astar` and calls it as `AStar(grid, start, end)`.

## Current Package Versions Checked

Checked through `npm view` on 2026-07-09:

- `requirejs`: `2.3.8`
- `jquery`: `4.0.0`
- `modernizr`: `3.13.1`
- `underscore`: `1.13.8`
- `bison`: `1.1.1`
- `stacktrace-js`: `2.0.2`
- `javascript-astar`: `0.4.1`

## Risk Assessment

### RequireJS/jQuery

This is the highest-risk replacement. The current single file is not just jQuery; it is also the loader and AMD `jquery` module. The app uses old jQuery APIs such as `.bind()`, `.size()`, `attr('value')`, animation helpers, and AJAX behavior. Current jQuery can break these behaviors, and current RequireJS changes optimizer/runtime assumptions.

### Modernizr

The custom Modernizr build only checks a small feature set, but the client uses `Modernizr.localstorage` and `Modernizr.audio.mp3`. A safe future replacement is likely direct feature helpers rather than upgrading the whole Modernizr package.

### Underscore

The code uses old aliases such as `_.detect` and `_.include`. Underscore `1.13.8` still retains many aliases, but the map worker import path and global `_` contract must be preserved.

### BISON

The npm package appears to be the same BonsaiDen BiSON project family, but client/server protocol compatibility must be tested together. Any replacement must prove the WebSocket `HELLO`/`WELCOME` and gameplay message flow.

### Class/log/stacktrace/astar

These are small but deeply assumed. `Class` is used by almost every client module. `log` is global. `stacktrace-js` has a different API than `printStackTrace`. `astar` replacement must preserve the exact function signature.

## Recommended Plan Shape

1. Add a vendored-library registry and automated contract check.
2. Freeze the high-risk loader/browser-detection surface with explicit rationale.
3. Probe low-risk replacements one at a time, committing replacements only when both `/client/` and `client-build/` smoke pass.
4. Refresh docs/state and leave unresolved replacements as deliberate future work, not unknown drift.

## Verification Gate

Minimum final gate for Phase 3:

```powershell
npm install
npm run vendor:check
npm run smoke
npm run smoke:browser:build
```

If any vendored file is replaced, run `npm run smoke:all` after that replacement before moving to the next candidate.
