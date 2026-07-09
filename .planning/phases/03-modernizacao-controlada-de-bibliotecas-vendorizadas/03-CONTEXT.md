# Phase 3: Modernizacao controlada de bibliotecas vendorizadas - Context

**Gathered:** 2026-07-09
**Status:** Ready for planning
**Source:** `$gsd-plan-phase 3`

<domain>

## Phase Boundary

Phase 3 decides what to do with browser libraries vendored under `client/js/lib/` without breaking the already validated local runtime and optimized build paths.

This phase is not a rewrite to a modern bundler. The main deliverable is a controlled modernization/freeze contract for vendored browser dependencies, with automated checks and smoke gates protecting `/client/` and `client-build/`.

</domain>

<decisions>

## Implementation Decisions

### D-01: Protect both client paths

- Every vendored library change must pass `npm run smoke` and `npm run smoke:browser:build`.
- `/client/` remains the fast local baseline.
- `client-build/` remains the optimized build regression gate.

### D-02: Treat `require-jquery.js` as high risk

- `client/js/lib/require-jquery.js` bundles RequireJS `0.26.0` and jQuery `1.6.4`.
- It defines the AMD module `jquery` and exposes `window.jQuery` / `window.$`.
- Direct replacement with current `jquery` or `requirejs` is not allowed unless a specific plan preserves AMD loading, jQuery legacy APIs, and build optimizer behavior.

### D-03: Freeze before replacing

- Each vendored file must receive a decision: replace now, keep/freeze, remove, or defer.
- A freeze decision is valid if it records the reason, runtime dependency surface, and future unlock condition.

### D-04: Prefer small standalone probes

- Low-risk candidates such as `bison.js`, `underscore.min.js`, `astar.js`, `stacktrace.js`, `log.js`, and `class.js` can be evaluated individually.
- Any replacement must preserve globals or AMD module names consumed by the current code.

### D-05: Do not widen scope into production deployment

- WSS/proxy/dispatcher deployment remains Phase 4.
- Phase 3 should not solve public production hosting.

### the agent's Discretion

- Exact script names and documentation layout.
- Whether a low-risk candidate is replaced or frozen after source/API inspection.
- How detailed the vendored-library registry should be, provided it is actionable for Phase 4/5.

</decisions>

<canonical_refs>

## Canonical References

Downstream agents MUST read these before planning or implementing.

### Project Planning

- `.planning/PROJECT.md` - core value, constraints, and current validated state.
- `.planning/ROADMAP.md` - Phase 3 goal, requirements, and success criteria.
- `.planning/REQUIREMENTS.md` - `MOD-01` traceability.
- `.planning/STATE.md` - current workflow state and residual caveats.

### Codebase Map

- `.planning/codebase/STACK.md` - current vendored library inventory and build tooling.
- `.planning/codebase/CONCERNS.md` - high-risk dependency and global-coupling concerns.
- `.planning/codebase/TESTING.md` - smoke gates and manual dependency update checks.
- `.planning/codebase/STRUCTURE.md` - update-sensitive paths.

### Runtime and Build

- `client/index.html` - direct script loading of Modernizr, log, and RequireJS/jQuery.
- `client/js/build.js` - optimizer config and `jquery` path alias.
- `scripts/build-client.js` - generated-output pruning and kept JS assets.
- `scripts/smoke-browser.js` - browser smoke helper.
- `scripts/smoke-browser-build.js` - optimized build smoke.
- `package.json` - current verification commands.

### Vendored Libraries

- `client/js/lib/require-jquery.js`
- `client/js/lib/modernizr.js`
- `client/js/lib/underscore.min.js`
- `client/js/lib/bison.js`
- `client/js/lib/astar.js`
- `client/js/lib/class.js`
- `client/js/lib/stacktrace.js`
- `client/js/lib/log.js`
- `client/js/lib/css3-mediaqueries.js`

</canonical_refs>

<specifics>

## Specific Ideas

- Add a `vendor:check` command that asserts expected vendored files, known internal versions, required globals, and AMD module contracts.
- Add `client/js/lib/README.md` as the human-readable freeze/replacement registry.
- Keep `require-jquery.js` frozen for 1.0 unless a later phase moves to a modern loader/bundler.
- Evaluate standalone libraries one at a time, never as a batch replacement.

</specifics>

<deferred>

## Deferred Ideas

- Full RequireJS/jQuery replacement is deferred unless a dedicated plan proves compatibility.
- ES modules/Vite/Webpack migration is deferred beyond this phase.
- Public WSS/proxy deployment remains Phase 4.
- Gameplay/idle features remain out of scope.

</deferred>

---

*Phase: 03-modernizacao-controlada-de-bibliotecas-vendorizadas*
*Context gathered: 2026-07-09 via plan-phase research path*
