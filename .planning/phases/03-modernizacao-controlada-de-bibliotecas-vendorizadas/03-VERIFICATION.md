# Phase 3 Verification

## Phase

`03-modernizacao-controlada-de-bibliotecas-vendorizadas`

## Result

Passed.

## Commands

```powershell
npm install
npm run vendor:check
npm run smoke
npm run smoke:browser:build
git status --short --ignored client-build build.txt client/config/config_build.json browserquest-local-test.png
```

## Evidence

- `npm install`: up to date, audited 6 packages, 0 vulnerabilities.
- `npm run vendor:check`: verified 9 vendored browser library contracts.
- `npm run smoke`: server, WebSocket, and `/client/` browser smoke passed.
- `npm run smoke:browser:build`: optimized `client-build/` started with 1 player and accepted movement click.
- `git status --short --ignored`: `build.txt`, `client-build/`, and `client/config/config_build.json` are ignored; `browserquest-local-test.png` remains intentionally untracked local evidence.

## Vendored Library Decisions

All vendored browser libraries are frozen for the current 1.0 baseline with rationale in `client/js/lib/README.md`:

- `require-jquery.js`: frozen because it combines RequireJS `0.26.0`, jQuery `1.6.4`, AMD `jquery`, and global `$`/`jQuery`.
- `modernizr.js`: frozen until feature checks are replaced or a custom modern build is smoke-proven.
- `underscore.min.js`: frozen after probe because npm `underscore` changes wrapper/AMD behavior and needs map-worker/global-specific smoke coverage.
- `bison.js`: frozen after probe because npm `bison` has no clear runtime benefit absent protocol-codec tests.
- `astar.js`: frozen until exact-signature pathfinding tests exist.
- `class.js`: frozen because `Class.extend` is used broadly across client modules.
- `stacktrace.js`: frozen because `stacktrace-js` is not a drop-in replacement for global `printStackTrace()`.
- `log.js`: frozen as the current global logger adapter.
- `css3-mediaqueries.js`: frozen as legacy IE-only compatibility asset.

## Requirement Coverage

- `MOD-01`: complete. RequireJS/jQuery and related vendored browser libraries are frozen with justification and protected by `npm run vendor:check` plus browser smoke gates.

## Residual Caveats

- No vendored browser runtime file was replaced in Phase 3.
- Future replacement work needs dedicated contract tests for worker globals, protocol codec behavior, pathfinding, or loader/jQuery migration.
- Public production deployment remains Phase 4 scope.
