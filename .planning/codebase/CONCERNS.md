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
2. Freeze or explicitly document vendored browser libraries before replacing them.
3. Only then attempt optional modernization of RequireJS/jQuery/Modernizr/build tooling.
