---
mapped_at: 2026-07-09
focus: concerns
---

# Concerns

## High Priority

### `log` dependency mismatch

`package.json` no longer declares `log`, but source still imports it:

- `server/js/worldserver.js`.
- `tools/maps/processmap.js`.

The current local `node_modules` still contains `log` as extraneous from previous installs.
A clean install or `npm prune` may remove it and break the server/tooling.

### Metrics still depends on `memcache`

`server/js/metrics.js` still calls `require("memcache")`.
The local path avoids this because `metrics_enabled` is false and `server/js/main.js` catches missing metrics.
If metrics are enabled, runtime will still fail unless this subsystem is removed or modernized.

### Production build path likely does not match local verified path

`client/js/build.js` sets `prodHost: true`.
`client/js/game.js` uses dispatcher mode in production build when it cannot find local/dev config.
The current server is a direct game server, not a dispatcher returning `{status, host, port}`.
This means `client-build/` may not behave like the tested `/client/` path.

### Vendored client dependencies are old and untracked by npm

Important libraries live under `client/js/lib/`.
Updating npm dependencies does not update the browser runtime.
Replacing `require-jquery.js`, old jQuery, old RequireJS, Modernizr, or Underscore can break AMD loading and globals.

## Medium Priority

### WebSocket URL is fixed to `ws://`

`client/js/gameclient.js` constructs `ws://host:port/`.
This blocks secure public HTTPS deployments unless the client is changed to support `wss://` or derive the protocol.

### Global variable coupling

Several modules rely on globals such as `Types`, `Class`, `_`, and `log`.
Modern bundling or strict mode can break these assumptions.
The local fix explicitly exports `window.Types`, but a broader modernization should make dependencies explicit.

### Missing music assets

`.gitignore` excludes `client/audio/music`, and the folder is absent locally.
The local `client/js/audio.js` disables music loading by using an empty `musicNames` array.
If music is restored later, this should become a config flag or asset existence check.

### Documentation drift

`server/README.md` still lists removed/deprecated dependencies.
`client/README.md` still recommends the production optimized build, but the verified path is static `/client/`.
Docs should be updated after the dependency plan is finalized.

## Low Priority

### Deprecated APIs and old browser paths

- `url.parse` in `server/js/ws.js` emits Node deprecation warnings.
- Browser code still checks `window.MozWebSocket`.
- CSS/mediaquery polyfills and IE branches are still present.

### Map tools are legacy and OS-sensitive

`tools/maps/README.md` says exporter was written with OSX in mind.
Python scripts and shell scripts may need Windows-specific validation.

## Security Notes

- Player names and chat are sanitized in `server/js/utils.js`.
- No auth means no account-level security boundary.
- `/status` is public on the Node listener.
- Server trusts client movement after checking `server.isValidPosition`, but broader anti-cheat is out of scope for local play.

## Recommended Update Order

1. Stabilize clean install: declare or remove every runtime import (`log`, `memcache`).
2. Add smoke tests for server, WebSocket handshake, and browser local play.
3. Freeze or explicitly document vendored browser libraries before replacing them.
4. Update docs to match the local verified run path.
5. Only then attempt optional modernization of RequireJS/jQuery/Modernizr/build tooling.

