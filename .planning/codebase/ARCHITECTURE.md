---
mapped_at: 2026-07-09
focus: arch
---

# Architecture

## Summary

BrowserQuest is a client/server multiplayer game.
The server owns authoritative world state, entity state, combat, loot, spawning, and player population.
The browser client owns rendering, input, pathfinding intent, local UI state, audio, and local achievements.

## Server Entry Flow

1. `server/js/main.js` reads `server/config.json`.
2. It optionally reads `server/config_local.json` or a custom path from `process.argv[2]`.
3. It creates `new ws.MultiVersionWebsocketServer(config.port, config.host || "127.0.0.1")`.
4. It creates `nb_worlds` `WorldServer` instances from `server/js/worldserver.js`.
5. Each world loads `server/maps/world_server.json`.
6. `/status` returns player counts per world.
7. `/health` returns process readiness JSON for supervisor/proxy checks.

## Server Module Boundaries

- `server/js/ws.js`: WebSocket, `/status`, and `/health` HTTP wrapper.
- `server/js/worldserver.js`: central game orchestration for worlds, groups, queues, spawn/despawn, combat broadcasting, population.
- `server/js/player.js`: protocol handling for a single player connection.
- `server/js/message.js`: serializable message objects sent to clients.
- `server/js/map.js`: server map loading, collision grid, zones, spawn/chest/checkpoint data.
- `server/js/mobarea.js`, `server/js/chestarea.js`: area-based respawning.
- `server/js/properties.js`, `server/js/formulas.js`: gameplay constants and formulas.
- `shared/js/gametypes.js`: shared enum/type registry.

## Client Entry Flow

1. `client/index.html` loads Modernizr, `client/js/detect.js`, and RequireJS via `client/js/lib/require-jquery.js`.
2. `data-main="js/home"` loads `client/js/home.js`.
3. `client/js/home.js` loads `client/js/main.js`.
4. `client/js/main.js` creates `App` and later `Game`.
5. `client/js/game.js` loads the map, sprites, audio, pathfinder, and WebSocket client.
6. `client/js/gameclient.js` builds a configured `ws`/`wss` URL, connects to the Node server, and performs the handshake.

## Client Module Boundaries

- `client/js/app.js`: intro UI, play button, storage-backed character loading, population display.
- `client/js/game.js`: main client-side game state, entity grids, game loop, network callbacks.
- `client/js/gameclient.js`: WebSocket protocol client.
- `client/js/renderer.js`: Canvas rendering.
- `client/js/map.js`, `client/js/mapworker.js`: client map loading.
- `client/js/storage.js`: localStorage.
- `client/js/audio.js`: local sound and music loading.
- `client/js/entity*.js`, `mobs.js`, `items.js`, `npcs.js`, `warrior.js`: client entity classes and factories.

## Data Flow

Client to server:

- `HELLO`: player name, armor, weapon.
- `MOVE`, `LOOTMOVE`, `ATTACK`, `HIT`, `HURT`, `CHAT`, `LOOT`, `TELEPORT`, `WHO`, `ZONE`, `OPEN`, `CHECK`.
- Messages are arrays with numeric message IDs from `shared/js/gametypes.js`.

Server to client:

- `WELCOME`, `SPAWN`, `DESPAWN`, `MOVE`, `HEALTH`, `CHAT`, `EQUIP`, `DROP`, `POPULATION`, `LIST`, `DESTROY`, etc.
- Messages are JSON-encoded in current local mode.
- BISON support exists in code but `useBison` is false.

## Game Loop

- Server world update interval: `server/js/worldserver.js`, `this.ups = 50`, interval `1000 / this.ups`.
- Client animation loop: `client/js/game.js` calls `requestAnimFrame`.
- Client updates and renders only after `this.started` is true.

## Important Legacy Pattern

Many files rely on implicit globals:

- `Class` from `client/js/lib/class.js` and `server/js/lib/class.js`.
- `Types` from `shared/js/gametypes.js`.
- `log` on the server.
- `_` from browser underscore or npm underscore.

This matters for dependency updates because newer modules and stricter bundling will not preserve implicit globals unless explicitly adapted.

## Current Verified Local Path

- Server: `node server/js/main.js`.
- Server bind: `127.0.0.1:8000` by default.
- Client static server: repository root, URL `/client/`.
- Browser verified entering as `CodexTester`, player count `1`, map render, movement target and player movement.

## Private Production Shape

- Browser WebSocket protocol is configured through client config as `ws`, `wss`, or `auto`.
- Node should bind to loopback or a private interface.
- A reverse proxy owns HTTPS termination and WebSocket upgrade forwarding.
- `/health` is the readiness endpoint; `/status` remains population monitoring.
