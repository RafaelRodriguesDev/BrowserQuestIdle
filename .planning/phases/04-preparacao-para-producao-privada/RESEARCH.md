# Phase 4 Research: Private Production Preparation

## Research Complete

Phase 4 should focus on configuration, bind behavior, health checks, and operational documentation. It should not become a public deployment or TLS certificate setup.

## Current Findings

| Area | Current state | Risk | Phase 4 direction |
|------|---------------|------|-------------------|
| Client WebSocket URL | `client/js/gameclient.js` builds `ws://host:port/` directly | HTTPS pages cannot connect without mixed-content failures | Add configurable `ws`/`wss`/`auto` protocol support |
| Client config | `config_local` and `config_build` have `host`, `port`, `dispatcher` only | No production-safe way to select `wss://` | Extend templates and docs without changing local defaults |
| Dispatcher mode | Client expects `{status, host, port}` and reconnects to returned server | WSS behavior is undefined for dispatcher/direct split | Preserve shape; document limitations if no dispatcher smoke exists |
| Server listener | `server/js/ws.js` listens only by port | Node may bind all interfaces by default | Add configurable bind host for loopback/private-interface operation |
| Status endpoint | `/status` returns world population | Useful but not a clean readiness endpoint | Keep `/status`; add a lightweight `/health` endpoint |
| Smoke coverage | Current scripts cover `/status`, WebSocket handshake, `/client/`, and `client-build/` | No operation-specific health/proxy guard | Add health smoke and docs assertions |
| Operations docs | README says production is not revalidated | Future private deployment would be guesswork | Add runbook with proxy, supervisor, logs, and healthcheck guidance |

## Recommended Technical Approach

### Client protocol

Use a small config contract instead of inferring everything implicitly:

- `protocol: "ws"` for local direct server.
- `protocol: "wss"` for private production behind TLS proxy.
- Optional `protocol: "auto"` may derive `wss` when `window.location.protocol === "https:"`, otherwise `ws`.

This keeps local smoke predictable because local static hosting and the game server are on separate ports.

### Server bind host

Add a server config key such as `host` or `bind_host` and pass it to `httpServer.listen(port, host, callback)`.

Recommended default for this local fork is conservative: keep local smoke using `127.0.0.1`, and document how to set a different private interface if needed.

### Health endpoint

Add `/health` separately from `/status`.

Suggested response:

```json
{
  "status": "ok",
  "uptime": 123.45,
  "worlds": 5
}
```

It should return HTTP 200 when the process is ready to accept traffic. `/status` can keep returning the existing population array.

### Reverse proxy contract

The repo should document the contract, not own the proxy:

- Proxy terminates HTTPS.
- Proxy forwards WebSocket upgrade requests to the private Node listener.
- Client uses `wss://public-host[:public-port]/`.
- Node binds to loopback or private interface.
- Health checks hit `http://127.0.0.1:8000/health` from the machine or private network.

### Supervisor/logs

Do not add a mandatory supervisor package for this legacy game unless required. The runbook can describe PM2, systemd, Windows service/NSSM, or a generic supervisor as deployment options.

The code already uses `console.log`/`console.error` through the local `log` facade in `server/js/main.js`. The runbook should state that stdout/stderr are the log stream to capture.

## Risks and Guardrails

- Do not break `npm run smoke:browser`; it is the fastest end-to-end gameplay check.
- Do not make `protocol: "auto"` the only local path; local static server on `9090` still connects to game server on `8000`.
- Do not replace dispatcher behavior without a real dispatcher test.
- Do not remove `/status`; existing docs and smoke scripts depend on it.
- Do not claim public WSS is fully validated without a real TLS/proxy smoke.

## Verification Gate

Minimum final gate for Phase 4:

```powershell
npm install
npm run vendor:check
npm run smoke
npm run smoke:browser:build
npm run smoke:health
```

If the implementation names the health command differently, update this research and all plans before execution is marked complete.
