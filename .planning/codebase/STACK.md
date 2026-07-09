---
mapped_at: 2026-07-09
focus: tech
---

# Stack

## Summary

BrowserQuest is a legacy HTML5 multiplayer game with a Node.js WebSocket server and a static browser client.
The current local workspace has already been minimally patched to run on Node.js `v24.15.0`.
The update surface is split between npm dependencies, vendored browser libraries, and legacy build/map tools.

## Runtime

- Server runtime: Node.js, currently verified locally with `node server/js/main.js` and `npm run smoke`.
- Browser client runtime: static HTML, CSS, Canvas, WebSocket, RequireJS AMD modules.
- Local static serving: project root must be served and opened at `/client/`, because the client loads `../shared/js/gametypes.js`.
- Verified local ports:
  - Server WebSocket and status endpoint: `server/config.json`, port `8000`.
  - Static client server: smoke script built-in static server on port `9090`, or external tools such as Python `http.server`.

## Npm Dependencies

Current `package.json`:

- `underscore`: `>0`, installed as `1.13.8`.
- `bison`: `>0`, installed as `1.1.1`.
- `ws`: `^8.18.0`, installed as `8.21.0`.

Current dev dependencies:

- `playwright`: browser smoke automation.

Latest versions checked on 2026-07-09:

- `ws`: `8.21.0`.
- `underscore`: `1.13.8`.
- `bison`: `1.1.1`.
- `requirejs`: `2.3.8` if the vendored optimizer is replaced.
- `jquery`: `4.0.0`, but this is high risk because the client bundles an old `require-jquery.js`.
- `modernizr`: `3.13.1`, high risk if replacing the vendored browser detector directly.

## Vendored Browser Libraries

These are not managed by npm today:

- `client/js/lib/require-jquery.js`: old RequireJS + jQuery bundle.
- `client/js/lib/underscore.min.js`: old browser underscore, separate from npm `underscore`.
- `client/js/lib/modernizr.js`: old Modernizr.
- `client/js/lib/astar.js`: pathfinding.
- `client/js/lib/bison.js`: browser-side BISON codec.
- `client/js/lib/class.js`: inheritance helper used by most client modules.
- `client/js/lib/stacktrace.js`, `client/js/lib/log.js`, `client/js/lib/css3-mediaqueries.js`.

These libraries are loaded directly by `client/index.html` and AMD module names in `client/js/*.js`.
Updating them is not equivalent to `npm update`; it requires browser regression testing.
`client/js/lib/README.md` records the current freeze/probe decision for each file.
`npm run vendor:check` verifies the expected vendored files and key API/version markers before browser smoke runs.

## Build Tooling

- `scripts/build-client.js` is the Windows-friendly build command used by `npm run build:client`.
- `bin/build.sh` is now a Unix wrapper that delegates to `npm run build:client`.
- `bin/r.js` is a vendored RequireJS optimizer patched for Node 24 compatibility.
- `client/js/build.js` configures the optimized build.
- The optimized production path uses `prodHost: true`, and `client/js/game.js` now reads `config_build.dispatcher` to choose dispatcher mode.
- The default local path remains the unbuilt client at `/client/`.
- `client-build/` is locally smoke-tested by `npm run smoke:browser:build` against the direct server when `dispatcher` is `false`.
- Generated `client-build/` output and `build.txt` are ignored by Git.

## Map Tooling

- Map source: `tools/maps/tmx/map.tmx`.
- Python converter: `tools/maps/tmx2json.py`.
- Node processor: `tools/maps/processmap.js`.
- Export wrapper: `tools/maps/export.py`.
- Runtime maps:
  - Client: `client/maps/world_client.js`, `client/maps/world_client.json`.
  - Server: `server/maps/world_server.json`.

## Configuration

- Server default config: `server/config.json`.
- Server local override: `server/config_local.json` copied from `server/config_local.json-dist`.
- Client build config template: `client/config/config_build.json-dist`.
- Local workspace has `client/config/config_build.json`, but `.gitignore` ignores `config_build.json`.
- Client local override template: `client/config/config_local.json-dist`.

## Dependency Update Implications

- `ws`, `underscore`, and `bison` are already at latest npm versions.
- The biggest dependency work is not version bumping; it is replacing or freezing vendored client libraries.
- Vendored library work must start with `npm run vendor:check` and finish with browser smoke on both `/client/` and `client-build/`.
- Legacy `log` imports were removed from the default server and map tooling.
- `memcache` is only loaded when metrics are enabled; default local play keeps metrics disabled.
- A clean install strategy still needs to decide whether old metrics should be modernized or retired.
