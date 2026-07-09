---
mapped_at: 2026-07-09
focus: arch
---

# Structure

## Root

- `README.md`: short original project description.
- `LICENSE`: code and content licensing reference.
- `package.json`: npm dependency declaration for server/runtime tooling.
- `package-lock.json`: local lockfile generated during Node 24 compatibility work.
- `.gitignore`: ignores `node_modules`, `client-build`, `build.txt`, local config files, `client/audio/music`.
- `browserquest-local-test.png`: local verification screenshot, not part of product source.

## Server

- `server/config.json`: default runtime server config.
- `server/config_local.json-dist`: local override template.
- `server/README.md`: original server documentation; currently stale relative to patched dependencies.
- `server/js/main.js`: server process entrypoint.
- `server/js/ws.js`: WebSocket server and status endpoint.
- `server/js/worldserver.js`: world-level orchestration.
- `server/js/player.js`: player message handling.
- `server/js/message.js`: server-to-client message serialization.
- `server/js/map.js`: map loading and collision/zone data.
- `server/js/properties.js`: entity stats, drops, and item/mob properties.
- `server/js/metrics.js`: legacy optional memcache metrics.
- `server/maps/world_server.json`: server map data.

## Client

- `client/index.html`: browser entrypoint.
- `client/README.md`: original client build instructions; stale for local root-serving note.
- `client/config/config_build.json-dist`: production/client config template.
- `client/config/config_build.json`: local ignored config generated for current local test.
- `client/config/config_local.json-dist`: local client override template.
- `client/css/main.css`, `client/css/achievements.css`, `client/css/ie.css`: styles.
- `client/js/home.js`, `client/js/main.js`, `client/js/app.js`, `client/js/game.js`: top-level client flow.
- `client/js/gameclient.js`: WebSocket protocol client.
- `client/js/lib/`: vendored browser libraries.
- `client/maps/`: client runtime map data.
- `client/sprites/`: sprite metadata JSON.
- `client/img/`: scale-specific sprite sheets and tiles.
- `client/audio/sounds/`: sound effects.
- `client/audio/music/`: ignored and absent locally.

## Shared

- `shared/js/gametypes.js`: shared protocol IDs, entity IDs, kind mappings, and helper predicates.
- This file is used by both Node and browser code.
- The browser path is loaded by AMD as `../../shared/js/gametypes`.

## Build

- `bin/build.sh`: shell script for optimized client build.
- `bin/r.js`: vendored RequireJS optimizer.
- `client/js/build.js`: optimizer config.
- Build output target: `client-build/`, ignored by Git.

## Map Tools

- `tools/maps/README.md`: exporter documentation.
- `tools/maps/export.py`: wrapper for client/server map export.
- `tools/maps/tmx2json.py`: TMX conversion.
- `tools/maps/processmap.js`: Node map processor.
- `tools/maps/tmx/map.tmx`: source map.

## Naming and Layout Conventions

- Server files use CommonJS `require` and `module.exports`.
- Client files use AMD `define`.
- Entity-related concepts are mirrored across client and server.
- Runtime JSON assets are stored close to consuming layer: `client/maps`, `client/sprites`, `server/maps`.

## Update-Sensitive Paths

- `package.json` and `package-lock.json`: npm dependency decisions.
- `server/js/ws.js`: `ws` compatibility.
- `server/js/worldserver.js`: still imports `log`.
- `tools/maps/processmap.js`: still imports `log`.
- `server/js/metrics.js`: still imports `memcache`.
- `client/js/lib/require-jquery.js`: old RequireJS/jQuery bundle.
- `client/js/build.js`: production build pragmas alter WebSocket connection mode.

