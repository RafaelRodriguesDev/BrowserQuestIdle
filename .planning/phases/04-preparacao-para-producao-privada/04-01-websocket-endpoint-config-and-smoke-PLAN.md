---
phase: 04-preparacao-para-producao-privada
plan: 04-01-websocket-endpoint-config-and-smoke
type: execute
wave: 1
depends_on: []
files_modified:
  - client/js/gameclient.js
  - client/js/game.js
  - client/js/app.js
  - client/config/config_local.json-dist
  - client/config/config_build.json-dist
  - scripts/smoke-browser.js
  - scripts/smoke-browser-build.js
  - client/README.md
autonomous: true
requirements:
  - PRD-01
---

# Plan 04-01: WebSocket endpoint config and smoke

<objective>
Make the BrowserQuest client support configurable `ws://` and `wss://` endpoints while preserving the currently validated local and optimized-build smoke paths.
</objective>

<context>
Read before implementation:

- `.planning/phases/04-preparacao-para-producao-privada/04-CONTEXT.md`
- `.planning/phases/04-preparacao-para-producao-privada/RESEARCH.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/TESTING.md`
- `client/js/gameclient.js`
- `client/js/game.js`
- `client/js/app.js`
- `client/config/config_local.json-dist`
- `client/config/config_build.json-dist`
- `scripts/smoke-browser.js`
- `scripts/smoke-browser-build.js`
- `client/README.md`
</context>

<must_haves>

## Truths

- D-01: Local gameplay smoke remains the primary regression gate.
- D-02: WebSocket protocol must be configurable and support `wss://` for private production.
- D-03: Dispatcher reply shape remains `{status, host, port}` unless a dedicated dispatcher plan changes it.
- `dispatcher: false` remains the validated direct-server path for local and `client-build/` smoke.

## Boundaries

- Do not change message IDs, array payload protocol, or gameplay behavior.
- Do not require a real TLS certificate or public domain in this plan.
- Do not replace RequireJS, jQuery, or vendored browser libraries.

</must_haves>

<tasks>

<task type="auto">
  <name>Task 1: Add client websocket protocol config</name>
  <files>client/config/config_local.json-dist, client/config/config_build.json-dist, client/js/app.js, client/js/game.js</files>
  <action>Add a simple websocket protocol field to local and build config templates. Pass that protocol through the existing server-option selection path into `GameClient` without changing local host/port defaults.</action>
  <verify>
    <automated>rg -n "\"protocol\"|setServerOptions|new GameClient|config\\.build|config\\.local" client/config client/js/app.js client/js/game.js</automated>
  </verify>
  <acceptance_criteria>
    - Local template defaults still use direct local `ws` behavior.
    - Build template can express `wss` without code edits.
    - `setServerOptions` carries protocol information or an equivalent explicit config object.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Build websocket URL through one explicit path</name>
  <files>client/js/gameclient.js</files>
  <action>Replace the hard-coded `ws://` construction with a single helper/path that accepts the configured protocol, normalizes allowed values, and falls back to local `ws` behavior when unspecified.</action>
  <verify>
    <automated>rg -n "ws://|wss://|protocol|build.*Url|WebSocket" client/js/gameclient.js</automated>
  </verify>
  <acceptance_criteria>
    - `protocol: "ws"` produces the existing local URL.
    - `protocol: "wss"` produces a secure WebSocket URL.
    - Optional `auto` behavior, if implemented, derives from `window.location.protocol` and is documented.
    - Invalid or missing protocol does not silently produce a malformed URL.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Preserve direct and build browser smokes</name>
  <files>scripts/smoke-browser.js, scripts/smoke-browser-build.js, client/README.md</files>
  <action>Update smoke assertions or docs so the local direct server continues to validate the `ws` path and build config documents how to switch to `wss` for private production.</action>
  <verify>
    <automated>npm run smoke:browser</automated>
    <automated>npm run smoke:browser:build</automated>
  </verify>
  <acceptance_criteria>
    - Existing local browser smoke still joins the game and accepts a movement click.
    - Optimized build smoke still works with `dispatcher: false`.
    - Docs clearly distinguish local `ws` from private-production `wss`.
  </acceptance_criteria>
</task>

</tasks>

<verification>

Run:

```powershell
npm run smoke:browser
npm run smoke:browser:build
rg -n "\"protocol\"|wss|dispatcher|WebSocket" client/js client/config client/README.md
```

</verification>

<success_criteria>

- Client configuration can express both `ws` and `wss`.
- Hard-coded `ws://` no longer blocks private production config.
- Local direct-server gameplay and optimized build smokes remain green.
- Dispatcher behavior is preserved or explicitly documented as unchanged.

</success_criteria>
