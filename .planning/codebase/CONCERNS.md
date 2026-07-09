---
mapped_at: 2026-07-09
focus: concerns
---

# Concerns

## High Priority

### Metrics still depends on optional `memcache`

`server/js/metrics.js` still calls `require("memcache")`.
The local path avoids this because `metrics_enabled` is false.
If metrics are enabled without adding a maintained memcache client, runtime now fails with an explicit error.

### Public production build deployment is not fully validated

`client/js/build.js` sets `prodHost: true`.
`client/js/game.js` now reads `config_build.dispatcher`, and the local optimized `client-build/` path is validated against the direct server with `dispatcher: false`.
Public deployment still needs separate validation for HTTPS/WSS, proxy behavior, and any dispatcher endpoint using `{status, host, port}`.

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

Docs were updated for the verified local path, but future production/build modernization must keep them aligned.

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
2. Keep `/client/` and `client-build/` smoke checks green while changing browser code.
3. Freeze or explicitly document vendored browser libraries before replacing them.
4. Only then attempt optional modernization of RequireJS/jQuery/Modernizr/build tooling.
