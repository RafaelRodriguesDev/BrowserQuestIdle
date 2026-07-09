---
mapped_at: 2026-07-09
focus: tech
---

# Integrations

## Summary

BrowserQuest is mostly self-contained. It has no database, no account provider, no payment system, and no external runtime API required for local play.
The main integration boundary is browser-to-server WebSocket traffic.

## Browser to Game Server

- Client WebSocket entrypoint: `client/js/gameclient.js`.
- Server WebSocket listener: `server/js/ws.js`.
- Server bootstrap: `server/js/main.js`.
- Status endpoint: `GET /status` on the same Node HTTP server.

Current client connection behavior:

- `client/js/gameclient.js` builds URLs as `ws://` + host + `:` + port + `/`.
- Local config uses `localhost:8000`.
- Public HTTPS/WSS support is not currently configurable.

## Local Static Client Serving

- `client/index.html` is static.
- The working local setup serves the repository root and opens `/client/`.
- Serving only the `client/` folder breaks `../../shared/js/gametypes` loading.

## Storage

- Client persistence uses browser `localStorage`.
- Storage wrapper: `client/js/storage.js`.
- Saved state includes player name, armor, weapon, achievements, and counters.
- Server state is in memory only.

## Optional Metrics

- Config flag: `server/config.json`, `metrics_enabled`.
- Metrics code: `server/js/metrics.js`.
- Legacy dependency: `memcache`.
- Current local path avoids metrics by keeping `metrics_enabled: false` and making `Metrics` optional in `server/js/main.js`.

## Map and Asset Inputs

- Tiled TMX map source: `tools/maps/tmx/map.tmx`.
- Export tools generate runtime JSON consumed by client and server.
- Images, sprites, sounds, fonts, and map data are local static assets.

## External Links in UI

The client contains outbound links in `client/index.html`:

- Mozilla.
- BrowserQuest technology article.
- GitHub source link.
- Credits and social share links.

These are presentation links, not runtime dependencies.

## No Auth or Account Integration

- No login service.
- No user registration API.
- Player identity is a runtime name sent in the first `HELLO` message.
- Local browser storage can reload a character, but the server does not persist accounts.

## Update Implications

- Dependency updates should not introduce a database or auth system.
- WebSocket compatibility is the highest-risk integration point.
- Metrics support should be either restored with a modern package or removed/marked unsupported.
- If public deployment becomes a goal, `client/js/gameclient.js` must support `wss://` or derive protocol from page origin.

