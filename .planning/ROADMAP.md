# Roadmap: BrowserQuestIdle

**Created:** 2026-07-09
**Current milestone:** 1.0 local modernization baseline

## Overview

The roadmap starts with the smallest safe modernization slice: stabilize dependency/runtime behavior and add verification around the local playable path. Later phases can address production build, vendored browser libraries, and gameplay changes.

## Phases

### Phase 1: Estabilizacao de dependencias e runtime local

**Goal:** Garantir que BrowserQuestIdle tenha install limpo, servidor Node moderno, cliente local jogavel e smoke checks basicos antes de qualquer troca grande de bibliotecas.
**Requirements:** RUN-01, RUN-02, RUN-03, RUN-04, BRW-01, BRW-02, BRW-03, BRW-04, DEP-01, DEP-02, DEP-03, DEP-04, VER-01, VER-02, VER-03

**Success Criteria:**
1. `npm install` em ambiente limpo instala apenas dependencias necessarias ao fluxo local.
2. `node server/js/main.js` sobe e `/status` responde JSON valido.
3. Cliente em `/client/` cria personagem, conecta e movimenta no mapa via WebSocket.
4. Dependencias npm, imports residuais e bibliotecas vendorizadas ficam documentados com risco e proximo passo.
5. Smoke tests ou scripts documentados cobrem servidor, WebSocket e browser.

**Plans:**

| Wave | Plan | What it builds |
|------|------|----------------|
| 1 | `01-01-runtime-dependency-consistency` | Clean dependency/import baseline for local runtime |
| 2 | `01-02-smoke-verification` | Server, WebSocket and browser smoke checks |
| 3 | `01-03-docs-final-validation` | Local run docs, codebase map refresh and final validation |

**Cross-cutting constraints:**

- Do not update vendored browser libraries in Phase 1.
- Preserve local browser gameplay as the primary acceptance gate.
- Keep protocol message IDs and array message format stable.

**Status:** Complete - 2026-07-09

### Phase 2: Build legado e configuracao de ambiente

**Goal:** Reconciliar `client-build/`, config local/build e dispatcher mode com o servidor atual.
**Requirements:** PRD-02, DEP-04

**Success Criteria:**
1. O projeto tem um caminho oficial de cliente local e um caminho documentado para build.
2. O build legado ou e corrigido para conectar no servidor atual ou fica explicitamente fora do fluxo 1.0.
3. Docs deixam claro como rodar local e como empacotar.

**Plans:**

| Wave | Plan | What it builds |
|------|------|----------------|
| 1 | `02-01-build-command-and-diagnostics` | Windows-friendly legacy build command and generated-output hygiene |
| 2 | `02-02-build-connection-and-smoke` | Build connection-mode decision and browser smoke coverage |
| 3 | `02-03-docs-final-validation` | Build docs, codebase map refresh, and final validation |

**Cross-cutting constraints:**

- Keep `/client/` as the verified local baseline unless build smoke proves otherwise.
- Do not replace vendored RequireJS/jQuery/Modernizr in Phase 2.
- Do not commit generated `client-build/` output.
- Direct-server build support must not silently rely on dispatcher mode.

**Status:** Complete - 2026-07-09

### Phase 3: Modernizacao controlada de bibliotecas vendorizadas

**Goal:** Atualizar ou congelar `client/js/lib` com smoke tests protegendo carregamento, renderizacao e gameplay.
**Requirements:** MOD-01

**Success Criteria:**
1. Cada biblioteca vendorizada tem decisao: atualizar, substituir, manter ou remover.
2. Mudancas de RequireJS/jQuery/Modernizr passam pelo smoke browser.
3. Globals legados relevantes sao reduzidos ou documentados.

**Plans:**

| Wave | Plan | What it builds |
|------|------|----------------|
| 1 | `03-01-vendored-library-contract-and-registry` | Vendored library registry and automated contract check |
| 2 | `03-02-controlled-library-probes` | One-at-a-time replacement/freeze decisions for low/medium-risk vendored libs |
| 3 | `03-03-final-docs-and-validation` | Docs, codebase map refresh, and final Phase 3 validation |

**Cross-cutting constraints:**

- Keep `/client/` and `client-build/` smoke checks green.
- Do not replace `require-jquery.js` without a dedicated loader/jQuery migration plan.
- Preserve AMD module names and globals currently consumed by the client.
- Every vendored library must end Phase 3 with an explicit replace/freeze/remove/defer decision.

**Status:** Complete - 2026-07-09

### Phase 4: Preparacao para producao privada

**Goal:** Preparar execucao protegida com configuracao, WSS/proxy se necessario e supervisao.
**Requirements:** PRD-01, PRD-03

**Success Criteria:**
1. Cliente suporta endpoint WebSocket seguro quando necessario.
2. Servidor pode rodar atras de proxy sem expor Node diretamente.
3. Operacao minima tem logs, healthcheck e runbook.

**Plans:**

| Wave | Plan | What it builds |
|------|------|----------------|
| 1 | `04-01-websocket-endpoint-config-and-smoke` | Configurable client WebSocket protocol with preserved local/build smokes |
| 2 | `04-02-proxy-runtime-health-and-ops` | Private bind host, health endpoint, and operational runbook |
| 3 | `04-03-docs-final-validation` | Docs, codebase map refresh, and final Phase 4 validation |

**Cross-cutting constraints:**

- Keep `/client/`, `client-build/`, and `vendor:check` validation green.
- Do not claim public TLS/proxy deployment unless a real proxy/WSS smoke is run.
- Preserve WebSocket message protocol and dispatcher reply compatibility.
- Keep generated build output and local config files uncommitted.

**Status:** Planned - 2026-07-09

### Phase 5: Base para features BrowserQuestIdle

**Goal:** Abrir caminho para features idle sem misturar gameplay com divida de runtime.
**Requirements:** MOD-02, MOD-03

**Success Criteria:**
1. Ferramentas de mapa e metricas antigas tem decisao final.
2. Um ponto de extensao de gameplay e definido sem quebrar protocolo atual.
3. Backlog idle e separado de modernizacao tecnica.

**Status:** Pending

---
*Last updated: 2026-07-09 after Phase 4 planning*
