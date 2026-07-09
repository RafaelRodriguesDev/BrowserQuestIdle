---
phase: 02-build-legado-e-configuracao-de-ambiente
plan: 02-01-build-command-and-diagnostics
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - scripts/build-client.js
  - bin/build.sh
  - .gitignore
autonomous: true
requirements:
  - PRD-02
  - DEP-04
---

# Plan 02-01: Build command and diagnostics

<objective>
Make the legacy `client-build/` generation path runnable and diagnosable from the current Windows/Node workspace without committing generated output.
</objective>

<context>
Read before implementation:

- `.planning/phases/02-build-legado-e-configuracao-de-ambiente/02-CONTEXT.md`
- `.planning/phases/02-build-legado-e-configuracao-de-ambiente/RESEARCH.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/CONCERNS.md`
- `package.json`
- `bin/build.sh`
- `client/js/build.js`
- `bin/r.js`
- `.gitignore`
</context>

<must_haves>

## Truths

- `client-build/` must remain generated output and must not be committed.
- The build command must be practical on Windows.
- Build failure must produce actionable output, not a silent partial directory.
- Phase 1 smoke for `/client/` must remain passing.

## Boundaries

- Do not replace RequireJS, jQuery, or Modernizr in this plan.
- Do not change WebSocket connection behavior in this plan.
- Do not commit `client-build/` or `build.txt`.

</must_haves>

<tasks>

<task type="auto">
  <name>Task 1: Add Windows-friendly client build command</name>
  <files>package.json, scripts/build-client.js</files>
  <action>Add an npm script such as `build:client` backed by a Node script that invokes the existing RequireJS optimizer from the correct working directory. The script should clean stale `client-build/`, run the optimizer, and surface failures clearly.</action>
  <verify>
    <automated>npm run build:client</automated>
  </verify>
  <acceptance_criteria>
    - `npm run build:client` exists.
    - The command does not require Bash.
    - Failure exits nonzero with useful output.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Preserve or document legacy shell build</name>
  <files>bin/build.sh, README.md, client/README.md</files>
  <action>If `bin/build.sh` remains useful, keep it aligned with the Node build command. If not, document that `npm run build:client` is the supported local command and `bin/build.sh` is legacy.</action>
  <verify>
    <automated>rg -n "build:client|client-build|bin/build.sh|RequireJS" README.md client/README.md bin/build.sh package.json</automated>
  </verify>
  <acceptance_criteria>
    - Docs do not instruct Windows users to rely only on `chmod +x` and Bash.
    - The legacy shell script status is explicit.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Verify generated-output hygiene</name>
  <files>.gitignore, scripts/build-client.js</files>
  <action>Confirm `client-build/` and build logs remain ignored. Add ignore entries only if missing. Ensure the build script does not stage or commit generated output.</action>
  <verify>
    <automated>git check-ignore client-build build.txt</automated>
    <automated>git status --short --ignored client-build build.txt</automated>
  </verify>
  <acceptance_criteria>
    - Generated build artifacts are ignored.
    - Git status after build does not show `client-build/` as untracked source.
  </acceptance_criteria>
</task>

</tasks>

<verification>

Run after all tasks:

```powershell
npm run build:client
npm run smoke
git status --short --ignored client-build build.txt
```

</verification>

<success_criteria>

- `npm run build:client` runs or fails with actionable diagnostics.
- Generated output remains ignored.
- Phase 1 `/client/` smoke still passes.
- No vendored browser libraries are replaced.

</success_criteria>
