---
mapped_at: 2026-07-09
focus: quality
---

# Testing

## Automated Smoke Checks

`package.json` now provides smoke-level validation:

- `npm run vendor:check`: verifies vendored browser library files and key API/version markers under `client/js/lib/`.
- `npm run smoke:server`: starts `server/js/main.js`, waits for `/status`, and asserts a JSON array.
- `npm run smoke:websocket`: starts the server, connects with `ws`, receives `go`, sends `HELLO`, and asserts `WELCOME`.
- `npm run smoke:browser`: starts the server and static root server, opens `/client/` with Playwright, creates a character, verifies one player, and clicks the map.
- `npm run build:client`: regenerates ignored `client-build/` output with the legacy RequireJS optimizer.
- `npm run smoke:browser:build`: builds `client-build/`, serves it with Playwright, creates a character, verifies one player, and clicks the map.
- `npm run smoke`: runs all smoke checks in sequence.
- `npm run smoke:all`: runs the runtime smoke suite plus the optimized build browser smoke.

There is still no CI configuration in the current repository snapshot.

## Current Verification Method

The manual verification path remains:

1. Run `node server/js/main.js`.
2. Serve the repository root on port `9090`.
3. Open `http://localhost:9090/client/`.
4. Enter a player name.
5. Confirm `GET http://localhost:8000/status` returns one player in a world.
6. Click the map and verify character movement.

This path is now covered by `npm run smoke:browser`; the optimized `client-build/` equivalent is covered by `npm run smoke:browser:build`.

## Current Smoke Evidence

- Server `/status` returned `[1,0,0,0,0]` with one connected player.
- Server log included `CodexTester has joined world1`.
- Browser rendered stacked canvases and showed player name `CodexTester`.
- Screenshot: `browserquest-local-test.png`.

## Manual Test Areas for Dependency Updates

For each dependency or vendored library update, verify:

- Initial client load has no console blocking errors.
- `client/config/config_build.json` or `config_local.json` loads as JSON.
- `shared/js/gametypes.js` loads before modules that use `Types`.
- WebSocket connects to `localhost:8000`.
- Player receives `WELCOME`.
- Map and sprites load.
- Movement works by clicking the canvas.
- NPC/mob spawn messages render.
- Browser storage reloads an existing character.
- `/status` reflects player count.
- Closing the tab decrements server population.

## Next Test Candidates

The next useful layer should stay close to gameplay risk:

- Browser reload smoke for saved localStorage character.
- Movement protocol assertion that a `MOVE` message changes server-side player position.
- Map exporter smoke for `tools/maps/exportmap.js`.

## Areas Hard to Test

- Combat correctness is distributed across `client/js/game.js`, `server/js/player.js`, `server/js/worldserver.js`, and `server/js/formulas.js`.
- Map exporter correctness depends on Tiled TMX data and Python/Node tooling.
- Public production build correctness depends on `bin/r.js`, `client/js/build.js` pragmas, WSS/proxy behavior, and optional dispatcher mode.
- Audio behavior varies by browser and file availability.

## Risk From No Tests

Dependency updates can break the app at module-load time before gameplay starts.
The most likely breakages are RequireJS module resolution, implicit globals, and WebSocket protocol assumptions.
Any update plan should add smoke tests before replacing vendored browser libraries.
For `client/js/lib/` specifically, `npm run vendor:check` is a fast contract gate, but it is not sufficient by itself; accepted changes still need `npm run smoke:all`.
Phase 3 final validation uses `npm install`, `npm run vendor:check`, `npm run smoke`, and `npm run smoke:browser:build`.
