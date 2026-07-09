---
mapped_at: 2026-07-09
focus: quality
---

# Conventions

## JavaScript Style

- Legacy JavaScript, mostly ES5-era syntax.
- `var` declarations dominate.
- Modules use CommonJS on server and AMD on client.
- Class-like inheritance uses `Class.extend` from `server/js/lib/class.js` and `client/js/lib/class.js`.
- Code often assigns constructor names into `module.exports`, for example `module.exports = Player = Character.extend(...)`.

## Server Conventions

- Server modules require shared enums via `require("../../shared/js/gametypes")`.
- Game objects expose callback registration methods such as `onMove`, `onExit`, `onBroadcast`.
- Message serialization is explicit in `server/js/message.js`.
- The server broadcasts serialized message arrays through world group queues.
- Logging expects a global `log` object.

## Client Conventions

- Client modules use `define([...], function(...) { ... return X; })`.
- Large client orchestration is centralized in `client/js/game.js`.
- UI is jQuery-based through the old `require-jquery` bundle.
- Browser state checks use `Detect` from `client/js/detect.js`.
- Rendering uses several stacked canvases: `background`, `entities`, `foreground`.

## Protocol Conventions

- Message types are numeric constants in `shared/js/gametypes.js`.
- Messages are arrays, not objects.
- Current local transport serializes JSON.
- BISON encoding exists in both `server/js/ws.js` and `client/js/gameclient.js`, but is disabled.

## Configuration Conventions

- Default server config is committed in `server/config.json`.
- Local server overrides are copied from `server/config_local.json-dist`.
- Client build/local configs are copied from `client/config/*.json-dist`.
- `.gitignore` excludes active local configs.

## Error Handling

- Server connection protocol errors usually close the WebSocket with a log reason in `server/js/player.js`.
- Client WebSocket errors add `error` class to `#container` and may call `disconnected_callback`.
- Many browser asset load failures log through `client/js/lib/log.js`.
- Optional metrics are explicit: default local config disables metrics, and `server/js/metrics.js` only loads `memcache` when metrics are enabled.

## Comments and Documentation

- Inline comments explain old production build pragmas, mobile loading differences, and map pipeline details.
- Original docs in `client/README.md` and `server/README.md` are partially stale.
- `tools/maps/README.md` is unusually detailed and should be preserved during dependency updates.

## Dependency Update Conventions to Preserve

- Keep client AMD module names stable unless doing a deliberate bundler migration.
- Keep `shared/js/gametypes.js` compatible with both browser and Node.
- Keep server message array protocol stable while upgrading transport packages.
- Keep local play path simple: one Node server, one static file server, no database.

## Current Local Deviations

- `server/js/ws.js` has been patched to modern `ws`.
- `server/js/utils.js` replaced package `sanitizer` with inline HTML escaping.
- `server/js/map.js` uses `fs.access` instead of removed `path.exists`.
- `client/js/audio.js` disables missing music loading.
- `shared/js/gametypes.js` explicitly exposes `window.Types` for browser compatibility.
- `scripts/smoke-*.js` provide the current local verification path for server, WebSocket, and browser gameplay.
