---
phase: 04-preparacao-para-producao-privada
plan: 04-02-proxy-runtime-health-and-ops
type: execute
wave: 2
depends_on:
  - 04-01-websocket-endpoint-config-and-smoke
files_modified:
  - server/config.json
  - server/config_local.json-dist
  - server/js/main.js
  - server/js/ws.js
  - scripts/smoke-server.js
  - scripts/smoke-websocket.js
  - package.json
  - server/README.md
  - README.md
autonomous: true
requirements:
  - PRD-03
---

# Plan 04-02: Proxy runtime health and ops

<objective>
Prepare the Node game server to run privately behind a reverse proxy with a configurable bind host, lightweight health endpoint, and repeatable operational checks.
</objective>

<context>
Read before implementation:

- `.planning/phases/04-preparacao-para-producao-privada/04-CONTEXT.md`
- `.planning/phases/04-preparacao-para-producao-privada/RESEARCH.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/TESTING.md`
- `server/js/main.js`
- `server/js/ws.js`
- `server/config.json`
- `server/config_local.json-dist`
- `scripts/smoke-server.js`
- `scripts/smoke-websocket.js`
- `package.json`
- `server/README.md`
- `README.md`
</context>

<must_haves>

## Truths

- D-01: Existing `/status`, WebSocket handshake, and browser smokes must remain passing.
- D-04: Node listener must be able to bind to loopback or a private interface.
- D-05: Health readiness should be separate from population `/status`.
- D-06: Operational docs are part of the deliverable.

## Boundaries

- Do not add mandatory PM2/systemd/NSSM dependencies to the app.
- Do not expose a public deployment as fully validated without a real proxy/TLS smoke.
- Do not remove or reshape `/status`.
- Do not enable metrics by default or reintroduce a memcache dependency.

</must_haves>

<tasks>

<task type="auto">
  <name>Task 1: Add private bind host configuration</name>
  <files>server/config.json, server/config_local.json-dist, server/js/main.js, server/js/ws.js, scripts/smoke-server.js, scripts/smoke-websocket.js</files>
  <action>Add a server config key for the bind host and pass it to the HTTP/WebSocket listener. Keep smoke scripts aligned with the configured local loopback address.</action>
  <verify>
    <automated>npm run smoke:server</automated>
    <automated>npm run smoke:websocket</automated>
  </verify>
  <acceptance_criteria>
    - Server can bind to `127.0.0.1` for private proxy operation.
    - Local smoke scripts connect to the configured loopback path.
    - Startup logs show the host and port being listened on.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Add operational health endpoint and smoke</name>
  <files>server/js/main.js, server/js/ws.js, scripts/smoke-server.js, package.json</files>
  <action>Add a lightweight health endpoint such as `/health` returning JSON readiness data, then add a package script that checks it deterministically.</action>
  <verify>
    <automated>npm run smoke:health</automated>
  </verify>
  <acceptance_criteria>
    - `/health` returns HTTP 200 with valid JSON after startup.
    - `/status` still returns the existing world population array.
    - Health smoke does not require a browser or active player.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Document reverse proxy, logs, and supervisor contract</name>
  <files>server/README.md, README.md</files>
  <action>Document private production operation: bind host, proxy TLS/WebSocket upgrade responsibilities, stdout/stderr log capture, supervisor restart expectations, and healthcheck command.</action>
  <verify>
    <automated>rg -n "bind|127\\.0\\.0\\.1|proxy|upgrade|health|supervisor|stdout|stderr|smoke:health" README.md server/README.md</automated>
  </verify>
  <acceptance_criteria>
    - Docs explain that Node should stay behind a proxy/private interface.
    - Docs identify the healthcheck URL and npm command.
    - Docs state that the process manager should capture stdout/stderr and restart on failure.
  </acceptance_criteria>
</task>

</tasks>

<verification>

Run:

```powershell
npm run smoke:server
npm run smoke:websocket
npm run smoke:health
rg -n "bind|127\\.0\\.0\\.1|proxy|upgrade|health|supervisor|stdout|stderr" README.md server/README.md server/js server/config*.json scripts package.json
```

</verification>

<success_criteria>

- Server can run on a private bind host suitable for reverse proxy operation.
- `/health` or equivalent operational healthcheck is available and smoke-tested.
- Existing `/status` and WebSocket handshake remain compatible.
- Runbook-level docs cover logs, healthcheck, proxy assumptions, and supervisor expectations.

</success_criteria>
