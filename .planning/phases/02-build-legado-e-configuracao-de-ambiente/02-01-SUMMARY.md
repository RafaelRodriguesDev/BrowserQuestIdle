# Summary 02-01: Build command and diagnostics

## Status

Complete.

## Implementation

- Added `npm run build:client` backed by `scripts/build-client.js`.
- Kept `bin/build.sh` as a Unix wrapper around the npm command.
- The build script now cleans stale `client-build/` and `build.txt`, creates ignored `client/config/config_build.json` from the template when missing, runs the vendored RequireJS optimizer, prunes generated JS files by basename, removes generated sprites/config folders, and writes the build log to root `build.txt`.
- Patched `bin/r.js` from `path.existsSync` to `fs.existsSync` so the legacy optimizer runs on Node 24.

## Verification

- `npm run build:client`: passed.
- `git check-ignore client-build build.txt client/config/config_build.json`: passed.
- `git status --short --ignored client-build build.txt client/config/config_build.json`: confirmed generated output is ignored.

## Commit

- `fb5013d feat(02): validate legacy client build path`

## Deviations

- `.gitignore` already covered the generated artifacts, so no ignore change was needed.
- `bin/r.js` required a compatibility patch that was not listed in the original files_modified set.
