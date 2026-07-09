---
phase: 01-estabilizacao-dependencias-runtime-local
plan: 01-02-smoke-verification
type: execute
wave: 2
depends_on:
  - 01-01-runtime-dependency-consistency
files_modified:
  - package.json
  - scripts/smoke-server.js
  - scripts/smoke-websocket.js
  - scripts/smoke-browser.js
  - README.md
autonomous: true
requirements:
  - RUN-02
  - RUN-03
  - BRW-01
  - BRW-02
  - BRW-03
  - BRW-04
  - VER-01
  - VER-02
  - VER-03
---

# Plan 01-02: Smoke verification

<objective>
Add repeatable smoke verification for the current local playable path: server status, WebSocket handshake, and browser entry/movement.
</objective>

<context>
Read before implementation:

- `.planning/phases/01-estabilizacao-dependencias-runtime-local/01-CONTEXT.md`
- `.planning/phases/01-estabilizacao-dependencias-runtime-local/RESEARCH.md`
- `.planning/codebase/TESTING.md`
- `server/js/ws.js`
- `server/js/player.js`
- `client/js/gameclient.js`
- `client/js/app.js`
- `client/js/game.js`
</context>

<must_haves>

## Truths

- Smoke checks must validate behavior, not only process startup.
- Browser smoke must open `/client/` while serving repository root.
- The smoke suite should be practical on Windows.
- Smoke scripts must not require production build or deployment.

## Boundaries

- Do not add a heavy test framework unless it clearly improves the smoke path.
- Do not replace the app architecture.
- Do not make screenshots required for every run unless they are useful on failure.

</must_haves>

<tasks>

<task type="auto">
  <name>Task 1: Add server status smoke</name>
  <files>scripts/smoke-server.js, package.json</files>
  <action>Create a Node smoke script that starts `server/js/main.js`, waits for port 8000, requests `/status`, asserts valid JSON array, then stops the child process. Add an npm script such as `smoke:server`.</action>
  <verify>
    <automated>npm run smoke:server</automated>
  </verify>
  <acceptance_criteria>
    - Script exits nonzero on startup or `/status` failure.
    - Script cleans up its child process.
    - Output is concise and useful.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Add WebSocket handshake smoke</name>
  <files>scripts/smoke-websocket.js, package.json</files>
  <action>Create a Node smoke script using the installed `ws` client. It should start or connect to the local server, wait for the initial `go`, send a valid `HELLO` array using `shared/js/gametypes.js`, and assert a `WELCOME` response.</action>
  <verify>
    <automated>npm run smoke:websocket</automated>
  </verify>
  <acceptance_criteria>
    - Script validates the actual BrowserQuest protocol handshake.
    - Script fails if `WELCOME` is missing or malformed.
    - It avoids changing game source behavior.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Add browser smoke for local gameplay</name>
  <files>scripts/smoke-browser.js, package.json</files>
  <action>Add a browser smoke path. Prefer Playwright if acceptable as a dev dependency; otherwise document a manual command path. The smoke must serve the repository root, open `/client/`, enter a name, wait for body class `started`, verify `#playercount` includes `1 player`, click the map, and assert the canvas/game state remains healthy.</action>
  <verify>
    <automated>npm run smoke:browser</automated>
  </verify>
  <acceptance_criteria>
    - Browser smoke confirms gameplay entry and movement target.
    - It does not depend on `client-build/`.
    - It cleans up local server processes.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 4: Add aggregate smoke command</name>
  <files>package.json</files>
  <action>Add an npm script such as `smoke` that runs server, WebSocket, and browser smoke checks in the safest order.</action>
  <verify>
    <automated>npm run smoke</automated>
  </verify>
  <acceptance_criteria>
    - One command validates the Phase 1 local baseline.
    - Failures identify the failing smoke layer.
  </acceptance_criteria>
</task>

</tasks>

<verification>

Run:

```powershell
npm run smoke:server
npm run smoke:websocket
npm run smoke:browser
npm run smoke
```

</verification>

<success_criteria>

- Server smoke passes.
- WebSocket protocol smoke passes.
- Browser local gameplay smoke passes.
- Aggregate smoke command passes.
- Smoke path is documented enough for future dependency updates.

</success_criteria>

