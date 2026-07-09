# Summary 02-02: Build connection and smoke

## Status

Complete.

## Implementation

- Added `dispatcher: false` to `client/config/config_build.json-dist`.
- Changed the optimized `prodHost` path in `client/js/game.js` to use `this.app.config.build.dispatcher === true` instead of hard-coded dispatcher mode.
- Reworked `scripts/smoke-browser.js` into a reusable smoke helper that can serve either `/client/` or `client-build/`.
- Added diagnostics for browser console errors, page errors, and failed requests.
- Added `scripts/smoke-browser-build.js` and `npm run smoke:browser:build`.
- Added `npm run smoke:all` to run the runtime smoke suite plus build smoke.

## Verification

- `npm run smoke`: passed for `/client/`.
- `npm run smoke:browser:build`: passed for `client-build/`.
- Build smoke created a character, verified one player, and accepted movement click against the direct local server.

## Commit

- `fb5013d feat(02): validate legacy client build path`

## Deviations

- The Windows smoke build runner calls `node scripts/build-client.js` directly instead of spawning `npm`, because spawning npm caused `spawn EINVAL` on Windows.
- The shared browser smoke now synchronizes both DOM `value` and legacy jQuery `attr("value")` before clicking play, because the old client reads `attr("value")` when starting the game.
