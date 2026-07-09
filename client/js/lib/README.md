# Vendored Browser Libraries

These files are part of the BrowserQuest browser runtime. They are not updated by `npm install` or `npm update`.

Any change here must pass:

```powershell
npm run vendor:check
npm run smoke:all
```

## Registry

| File | Role | Detected version/source | Runtime contract | Phase 3 decision | Future unlock |
|------|------|-------------------------|------------------|------------------|---------------|
| `require-jquery.js` | AMD loader plus jQuery provider | RequireJS `0.26.0`, jQuery `1.6.4` | Provides `require`, `define`, AMD module `jquery`, `window.jQuery`, and `window.$` | Freeze | Replace only in a dedicated loader/jQuery migration that preserves old jQuery APIs and build optimizer behavior |
| `modernizr.js` | Browser feature detection | Modernizr `2.5.3` custom build | Provides `window.Modernizr.localstorage`, `window.Modernizr.audio`, and CSS feature classes | Freeze | Replace with direct feature helpers or a custom modern build after smoke coverage proves parity |
| `underscore.min.js` | Utility helpers used by app and map worker | Underscore `1.1.7` browser build | Provides global `_` and aliases including `_.detect`, `_.include`, `_.any`, `_.each`, `_.map`, and `_.size` | Freeze after probe | Npm `underscore` `1.13.8` keeps aliases but changes wrapper/AMD behavior; replace only with explicit map-worker/global smoke coverage |
| `bison.js` | Browser protocol codec | BonsaiDen BISON browser bundle | Provides AMD `lib/bison` export plus `window.BISON.encode` and `window.BISON.decode` | Freeze after probe | Installed npm `bison` is the same project family with no clear runtime benefit; replace only as part of protocol-codec test coverage |
| `astar.js` | Pathfinding helper | Standalone AStar AMD helper | Provides AMD function `AStar(grid, start, end)` for `pathfinder.js` | Freeze | Available npm alternatives do not prove the exact `AStar(grid, start, end)` contract; replace only with pathfinding-specific tests |
| `class.js` | Legacy inheritance helper | John Resig `Class.extend` pattern | Provides global `Class.extend` used by most client modules | Freeze | Remove only during a broad client class/model refactor |
| `stacktrace.js` | Stack trace helper for logger | Legacy `printStackTrace` helper | Provides global `printStackTrace()` consumed by `log.js` | Freeze | `stacktrace-js` has a different API; replace only with an adapter that keeps `printStackTrace()` behavior |
| `log.js` | Browser logger | Local BrowserQuest wrapper | Provides global `log.info`, `log.debug`, and `log.error` | Freeze | Replace only if all global logger calls are migrated or an equivalent global adapter remains |
| `css3-mediaqueries.js` | IE conditional media query polyfill | Legacy IE-only polyfill | Loaded only through the IE conditional block in `client/index.html` | Freeze as legacy optional asset | Remove only when legacy IE support is explicitly dropped |

## Rules

- Do not batch replace vendored libraries.
- Do not replace `require-jquery.js` together with other files.
- Preserve AMD module names and globals unless the consuming code is migrated in the same commit.
- If a probe fails, restore the original file and update this registry with the freeze reason.

## Phase 3 Probe Notes

- `underscore.min.js`: npm `underscore` `1.13.8` exposes a UMD/AMD wrapper named `underscore` and preserves aliases such as `detect` and `include`, but the current app depends on an implicit global `_` loaded by `home.js` and `mapworker.js`. Frozen until a worker/global-specific smoke exists.
- `bison.js`: npm `bison` `1.1.1` is the same BonsaiDen project family. The vendored file already provides the required browser AMD/global contract, so replacement is deferred until protocol-codec tests exist.
- `astar.js`: the current helper is tiny and already matches `pathfinder.js`. No replacement is accepted without an exact signature match and pathfinding verification.
- `stacktrace.js`: current logger calls global `printStackTrace()`. `stacktrace-js` is not a drop-in replacement.
- `log.js`: local wrapper remains the stable global logging contract for the legacy client.
- `css3-mediaqueries.js`: retained as an IE-only compatibility asset; it is not exercised by modern smoke tests.
