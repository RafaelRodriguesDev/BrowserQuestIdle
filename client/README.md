BrowserQuest client documentation
=================================

Local Development
-----------------

The validated local path is the unbuilt client at `/client/`, served from the repository root.

Example from the repository root:

```powershell
python -m http.server 9090
```

Then open:

```text
http://localhost:9090/client/
```

Do not run the static server from inside `client/`; the browser loads `../shared/js/gametypes.js`.


Vendored Libraries
------------------

Browser runtime libraries live in `client/js/lib/`. They are separate from npm dependencies and are not updated by `npm update`.

Before accepting any change under `client/js/lib/`, run:

```powershell
npm run vendor:check
npm run smoke:all
```

The current Phase 3 decision is to freeze the existing RequireJS/jQuery, Modernizr, Class, Underscore, BISON, AStar, stacktrace, log, and IE media-query polyfill contracts. Rationale and future unlock conditions are documented in `client/js/lib/README.md`.


Production Build
----------------

The optimized legacy build path creates `client-build/` and is validated locally against the direct game server.

Configure the websocket endpoint:

1. Copy `client/config/config_build.json-dist` to `client/config/config_build.json`.
2. Edit host, port, and protocol settings for the target server.
3. Keep `"dispatcher": false` for the current direct BrowserQuest game server.

Use `"protocol": "ws"` for local direct traffic, `"protocol": "wss"` when the browser connects through a TLS-terminating proxy, or `"protocol": "auto"` to derive `wss` from an HTTPS page and `ws` otherwise.

Use `"dispatcher": true` only when deploying behind a BrowserQuest dispatcher endpoint that returns `{status, host, port}`.

Build from the project root:

```powershell
npm run build:client
```

Validate the optimized output locally:

```powershell
npm run smoke:browser:build
```

The legacy Unix entrypoint is still available as `bin/build.sh`; it delegates to `npm run build:client`.

The build uses the vendored RequireJS optimizer to create `client-build/` and writes a root `build.txt` log. Both files are ignored by Git and should be regenerated locally.

Important: private production can now be configured for `wss`, but public deployment still needs separate validation with the real HTTPS proxy and any dispatcher-specific setup.
