---
phase: 04-preparacao-para-producao-privada
plan: 04-01-websocket-endpoint-config-and-smoke
subsystem: client-websocket-config
tags:
  - websocket
  - client-config
  - smoke
key-files:
  modified:
    - client/js/config.js
    - client/js/app.js
    - client/js/game.js
    - client/js/gameclient.js
    - client/config/config_local.json-dist
    - client/config/config_build.json-dist
    - client/README.md
key-decisions:
  - Configured websocket protocol as ws, wss, or auto without changing message protocol.
requirements-completed:
  - PRD-01
duration: "inline"
completed: 2026-07-09
---

# Phase 4 Plan 04-01: WebSocket Endpoint Config and Smoke Summary

Implemented configurable browser WebSocket protocol support while preserving the local direct-server path.

## Commits

| Commit | Description |
|--------|-------------|
| `6cf02a9` | Added client protocol config flow and documented ws/wss build configuration. |

## Completed

- Added `protocol: "ws"` to default/local client config and `protocol: "wss"` to the build template.
- Passed protocol from `app.js` through `game.js` into `GameClient`.
- Replaced hard-coded `ws://` construction with `buildWebSocketUrl()` and `normalizeProtocol()`.
- Preserved dispatcher reply shape and direct-server `dispatcher: false` behavior.

## Verification

- `npm run smoke:browser` passed.
- `npm run smoke:browser:build` passed.
- `rg -n "\"protocol\"|wss|dispatcher|WebSocket" client/js client/config client/README.md` passed.

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

