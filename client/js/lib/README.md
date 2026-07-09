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
| `underscore.min.js` | Utility helpers used by app and map worker | Legacy browser Underscore | Provides global `_` and aliases including `_.detect`, `_.include`, `_.any`, `_.each`, `_.map`, and `_.size` | Probe | Replace only if the browser build preserves global `_`, old aliases, and `mapworker.js` import behavior |
| `bison.js` | Browser protocol codec | BonsaiDen BISON browser bundle | Provides AMD `lib/bison` export plus `window.BISON.encode` and `window.BISON.decode` | Probe | Replace only if WebSocket handshake and browser gameplay pass with the new codec |
| `astar.js` | Pathfinding helper | Standalone AStar AMD helper | Provides AMD function `AStar(grid, start, end)` for `pathfinder.js` | Freeze unless exact replacement is trivial | Replace only with identical function signature and pathfinding smoke coverage |
| `class.js` | Legacy inheritance helper | John Resig `Class.extend` pattern | Provides global `Class.extend` used by most client modules | Freeze | Remove only during a broad client class/model refactor |
| `stacktrace.js` | Stack trace helper for logger | Legacy `printStackTrace` helper | Provides global `printStackTrace()` consumed by `log.js` | Freeze unless adapter is added | Replace only with an adapter that keeps `printStackTrace()` behavior |
| `log.js` | Browser logger | Local BrowserQuest wrapper | Provides global `log.info`, `log.debug`, and `log.error` | Freeze | Replace only if all global logger calls are migrated or an equivalent global adapter remains |
| `css3-mediaqueries.js` | IE conditional media query polyfill | Legacy IE-only polyfill | Loaded only through the IE conditional block in `client/index.html` | Freeze as legacy optional asset | Remove only when legacy IE support is explicitly dropped |

## Rules

- Do not batch replace vendored libraries.
- Do not replace `require-jquery.js` together with other files.
- Preserve AMD module names and globals unless the consuming code is migrated in the same commit.
- If a probe fails, restore the original file and update this registry with the freeze reason.
