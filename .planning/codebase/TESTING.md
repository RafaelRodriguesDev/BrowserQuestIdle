---
mapped_at: 2026-07-09
focus: quality
---

# Testing

## Automated Tests

No automated test framework is configured.
There are no Jest, Mocha, Vitest, Playwright, Cypress, or Node test scripts in `package.json`.
There is no CI configuration in the current repository snapshot.

## Current Verification Method

The working verification path is manual/browser-driven:

1. Run `node server/js/main.js`.
2. Serve the repository root on port `9090`.
3. Open `http://localhost:9090/client/`.
4. Enter a player name.
5. Confirm `GET http://localhost:8000/status` returns one player in a world.
6. Click the map and verify character movement.

This path was verified locally with Playwright through the Codex browser.

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

## Suggested Minimal Automated Tests

The first useful test layer should be smoke-level, not unit-heavy:

- Node smoke: start `server/js/main.js`, request `/status`, assert JSON array length equals configured `nb_worlds`.
- WebSocket smoke: connect with a `ws` client, receive `go`, send valid `HELLO`, receive `WELCOME`.
- Browser smoke: Playwright opens `/client/`, enters name, waits for body class `started`, asserts `#playercount` includes `1 player`.

## Areas Hard to Test

- Combat correctness is distributed across `client/js/game.js`, `server/js/player.js`, `server/js/worldserver.js`, and `server/js/formulas.js`.
- Map exporter correctness depends on Tiled TMX data and Python/Node tooling.
- Production build correctness depends on `bin/r.js` and `client/js/build.js` pragmas.
- Audio behavior varies by browser and file availability.

## Risk From No Tests

Dependency updates can break the app at module-load time before gameplay starts.
The most likely breakages are RequireJS module resolution, implicit globals, and WebSocket protocol assumptions.
Any update plan should add smoke tests before replacing vendored browser libraries.

