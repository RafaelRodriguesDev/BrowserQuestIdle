# Phase 4: Preparacao para producao privada - Context

**Gathered:** 2026-07-09
**Status:** Ready for planning
**Source:** `$gsd-plan-phase 4`

<domain>

## Phase Boundary

Phase 4 prepares BrowserQuestIdle for protected private production operation without turning this into a public hosting launch.

The phase must make the WebSocket endpoint configurable for `ws://` and `wss://`, let the Node server bind privately behind a reverse proxy, and document the minimum operational path for logs, health checks, and supervisor-based restarts.

</domain>

<decisions>

## Implementation Decisions

### D-01: Preserve local gameplay as the primary regression gate

- `npm run smoke`, `npm run smoke:browser:build`, and `npm run vendor:check` must stay green.
- The default local development path remains root static server at `http://localhost:9090/client/` plus game server on port `8000`.
- Message protocol, dispatcher reply shape, and gameplay behavior must not change.

### D-02: Configure WebSocket protocol explicitly with safe fallback

- The client must support a configurable WebSocket protocol for direct and build modes.
- Local defaults must continue to produce `ws://127.0.0.1:8000/` or equivalent local behavior.
- Private production can use `wss://` when TLS is terminated by a proxy.
- Any protocol derivation from `window.location.protocol` must be documented and must not break the separate static-server/game-server local setup.

### D-03: Treat dispatcher mode as a compatibility path

- Current direct-server build mode with `dispatcher: false` remains the validated path.
- If dispatcher mode is touched, the `{status, host, port}` reply contract must remain compatible.
- Dispatcher-specific WSS behavior can be documented as a requirement if no dispatcher exists locally to validate it.

### D-04: Bind Node privately for proxy operation

- The game server should be configurable to bind to `127.0.0.1` or another private interface.
- Running behind a proxy must not require exposing the Node listener directly to the internet.
- The proxy is responsible for HTTPS termination and WebSocket upgrade forwarding.

### D-05: Separate population status from health readiness

- Existing `/status` returns world population and can remain for operational visibility.
- Add or document a lightweight health endpoint suitable for uptime checks.
- Health checks should not require browser gameplay or a player connection.

### D-06: Operational docs are part of the deliverable

- Phase 4 is not complete unless the runbook explains local/private-production config, proxy assumptions, healthcheck command, logs, and supervisor expectations.
- No new heavy supervisor dependency is required if the runbook gives process-manager-neutral instructions.

### the agent's Discretion

- Exact config key names for protocol/bind host, provided they are simple and documented.
- Whether the health endpoint is `/health`, `/ready`, or both.
- Whether a dedicated health script is named `health:check`, `smoke:health`, or folded into smoke scripts.
- Exact runbook file location.

</decisions>

<canonical_refs>

## Canonical References

Downstream agents MUST read these before planning or implementing.

### Project Planning

- `.planning/PROJECT.md` - core value, constraints, and private-production scope.
- `.planning/ROADMAP.md` - Phase 4 goal and success criteria.
- `.planning/REQUIREMENTS.md` - `PRD-01` and `PRD-03`.
- `.planning/STATE.md` - current phase status and residual notes.

### Codebase Map

- `.planning/codebase/ARCHITECTURE.md` - current client/server shape.
- `.planning/codebase/CONCERNS.md` - fixed `ws://`, proxy/WSS, and status endpoint concerns.
- `.planning/codebase/STACK.md` - current npm/browser dependency decisions.
- `.planning/codebase/TESTING.md` - smoke commands and validation expectations.

### Client Runtime

- `client/js/gameclient.js` - constructs the WebSocket URL.
- `client/js/game.js` - creates `GameClient` and reconnects after dispatcher reply.
- `client/js/app.js` - chooses local/dev/build server options.
- `client/config/config_local.json-dist` - local websocket config template.
- `client/config/config_build.json-dist` - build/private-production websocket config template.
- `scripts/smoke-browser.js` - Playwright smoke for `/client/`.
- `scripts/smoke-browser-build.js` - Playwright smoke for `client-build/`.

### Server Runtime and Operations

- `server/js/main.js` - loads server config and instantiates the WebSocket server.
- `server/js/ws.js` - HTTP listener, WebSocket upgrade server, and `/status`.
- `server/config.json` - committed default server config.
- `server/config_local.json-dist` - local/private override template.
- `scripts/smoke-server.js` - HTTP status smoke helper.
- `scripts/smoke-websocket.js` - WebSocket handshake smoke.
- `server/README.md` - server deployment and monitoring docs.
- `README.md` - root run and smoke docs.
- `package.json` - script entrypoints.

</canonical_refs>

<specifics>

## Specific Ideas

- Add a `protocol` field to client websocket config with allowed values `ws`, `wss`, or `auto`.
- Add a small URL-building helper inside `gameclient.js` so tests and diagnostics can reason about protocol decisions.
- Preserve `dispatcher: false` for local and optimized build smoke.
- Add `host` or `bind_host` to server config and pass it to `httpServer.listen(port, host, ...)`.
- Add `/health` returning JSON with process uptime and a simple ready flag, while keeping `/status` unchanged.
- Add a script that checks the health endpoint without requiring a browser.
- Add a private-production runbook covering reverse proxy websocket upgrade headers, loopback binding, logs, healthcheck, and supervisor restart policy.

</specifics>

<deferred>

## Deferred Ideas

- Public HTTPS deployment with real certificate and domain is out of scope.
- BrowserQuest dispatcher implementation is out of scope unless needed to preserve current compatibility.
- Authentication, accounts, and persistence remain out of scope.
- Replacing RequireJS/jQuery or vendored browser libraries remains out of scope for Phase 4.

</deferred>

---

*Phase: 04-preparacao-para-producao-privada*
*Context gathered: 2026-07-09 via plan-phase research path*
