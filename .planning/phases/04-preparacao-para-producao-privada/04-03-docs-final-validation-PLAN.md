---
phase: 04-preparacao-para-producao-privada
plan: 04-03-docs-final-validation
type: execute
wave: 3
depends_on:
  - 04-01-websocket-endpoint-config-and-smoke
  - 04-02-proxy-runtime-health-and-ops
files_modified:
  - README.md
  - client/README.md
  - server/README.md
  - .planning/PROJECT.md
  - .planning/ROADMAP.md
  - .planning/REQUIREMENTS.md
  - .planning/STATE.md
  - .planning/codebase/ARCHITECTURE.md
  - .planning/codebase/CONCERNS.md
  - .planning/codebase/TESTING.md
  - .planning/phases/04-preparacao-para-producao-privada/04-VERIFICATION.md
autonomous: true
requirements:
  - PRD-01
  - PRD-03
---

# Plan 04-03: Docs final validation

<objective>
Close Phase 4 by aligning documentation, codebase maps, requirements traceability, and final smoke evidence for private-production preparation.
</objective>

<context>
Read before implementation:

- `.planning/phases/04-preparacao-para-producao-privada/04-CONTEXT.md`
- `.planning/phases/04-preparacao-para-producao-privada/RESEARCH.md`
- `.planning/phases/04-preparacao-para-producao-privada/04-01-websocket-endpoint-config-and-smoke-PLAN.md`
- `.planning/phases/04-preparacao-para-producao-privada/04-02-proxy-runtime-health-and-ops-PLAN.md`
- `.planning/PROJECT.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/TESTING.md`
- `README.md`
- `client/README.md`
- `server/README.md`
</context>

<must_haves>

## Truths

- D-01: `/client/` and `client-build/` smokes must stay green.
- D-02: Docs must explain how `wss` is configured without implying real public TLS was tested.
- D-04: Docs must explain private bind/proxy operation.
- D-05: Health endpoint and `/status` must have distinct purposes.
- D-06: Phase 4 is not complete without operational runbook coverage.

## Boundaries

- Do not mark public deployment or real WSS proxy smoke as complete unless it was actually run.
- Do not commit generated `client-build/`, `build.txt`, or local config files.
- Do not commit `browserquest-local-test.png`.

</must_haves>

<tasks>

<task type="auto">
  <name>Task 1: Align public docs and codebase maps</name>
  <files>README.md, client/README.md, server/README.md, .planning/codebase/ARCHITECTURE.md, .planning/codebase/CONCERNS.md, .planning/codebase/TESTING.md</files>
  <action>Update docs and codebase maps to describe the final Phase 4 behavior: websocket protocol config, private bind host, reverse proxy assumptions, healthcheck, smoke commands, and remaining unvalidated public deployment gaps.</action>
  <verify>
    <automated>rg -n "wss|protocol|bind|proxy|health|supervisor|smoke:health|private production" README.md client/README.md server/README.md .planning/codebase</automated>
  </verify>
  <acceptance_criteria>
    - Docs match implemented config keys and script names exactly.
    - Codebase map no longer says `ws://` is fixed if it has been fixed.
    - Remaining production limitations are stated as limitations, not unknown drift.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 2: Run full validation gate and record evidence</name>
  <files>.planning/phases/04-preparacao-para-producao-privada/04-VERIFICATION.md</files>
  <action>Run the final command suite and record command results, any deviations, and ignored-artifact status in a Phase 4 verification file.</action>
  <verify>
    <automated>npm install</automated>
    <automated>npm run vendor:check</automated>
    <automated>npm run smoke</automated>
    <automated>npm run smoke:browser:build</automated>
    <automated>npm run smoke:health</automated>
    <automated>git status --short --ignored client-build build.txt client/config/config_build.json client/config/config_local.json server/config_local.json browserquest-local-test.png</automated>
  </verify>
  <acceptance_criteria>
    - All required commands pass or any failure is explicitly documented with a follow-up plan.
    - Generated and local-only artifacts remain ignored/uncommitted.
    - Verification file is concise and reproducible.
  </acceptance_criteria>
</task>

<task type="auto">
  <name>Task 3: Update planning state and traceability</name>
  <files>.planning/PROJECT.md, .planning/ROADMAP.md, .planning/REQUIREMENTS.md, .planning/STATE.md</files>
  <action>Mark `PRD-01` and `PRD-03` complete only after validation passes, update current focus toward Phase 5, and preserve any remaining caveats around real TLS/proxy validation.</action>
  <verify>
    <automated>rg -n "PRD-01|PRD-03|Phase 4|Phase 5|wss|health|proxy" .planning/PROJECT.md .planning/ROADMAP.md .planning/REQUIREMENTS.md .planning/STATE.md</automated>
  </verify>
  <acceptance_criteria>
    - Requirements traceability records Phase 4 outcomes.
    - ROADMAP status reflects actual completion state.
    - STATE gives the next executor clear next steps.
  </acceptance_criteria>
</task>

</tasks>

<verification>

Run:

```powershell
npm install
npm run vendor:check
npm run smoke
npm run smoke:browser:build
npm run smoke:health
rg -n "wss|protocol|bind|proxy|health|supervisor|smoke:health" README.md client/README.md server/README.md .planning/codebase .planning/PROJECT.md .planning/ROADMAP.md .planning/REQUIREMENTS.md .planning/STATE.md
git status --short --ignored client-build build.txt client/config/config_build.json client/config/config_local.json server/config_local.json browserquest-local-test.png
```

</verification>

<success_criteria>

- Phase 4 docs and codebase maps match the implemented behavior.
- `PRD-01` and `PRD-03` are traceable to concrete implementation and validation.
- Full local smoke suite, build smoke, vendored contract check, and health smoke pass.
- Remaining unvalidated public TLS/proxy work is explicitly documented.

</success_criteria>
