# Phase 1: Estabilizacao de dependencias e runtime local - Context

**Gathered:** 2026-07-09
**Status:** Ready for planning
**Source:** Codebase map + user direction after fork setup

<domain>
## Phase Boundary

Esta fase consolida a base local do BrowserQuestIdle antes de qualquer refatoracao maior. O foco e garantir install limpo, servidor Node moderno, cliente jogavel em browser e smoke checks que protejam futuras atualizacoes de dependencias.

Nao e uma fase para trocar RequireJS/jQuery/Modernizr ainda. Essas bibliotecas entram apenas como inventario e risco documentado.
</domain>

<decisions>
## Implementation Decisions

### Runtime local
- D-01: O fluxo local oficial da fase e `node server/js/main.js` para o servidor e servidor estatico na raiz do repositorio abrindo `/client/`.
- D-02: O servidor deve continuar respondendo `/status` na porta configurada em `server/config.json`.
- D-03: O cliente deve continuar conectando diretamente ao game server local, sem dispatcher.

### Dependencias
- D-04: O install limpo nao deve depender de pacotes extraneous deixados por installs antigos.
- D-05: Imports residuais de `log` e `memcache` devem ser resolvidos, isolados ou explicitamente documentados fora do fluxo principal.
- D-06: Bibliotecas vendorizadas em `client/js/lib` nao devem ser atualizadas nesta fase sem smoke tests cobrindo carregamento e gameplay.

### Verificacao
- D-07: A fase precisa produzir smoke checks repetiveis para servidor, WebSocket e browser.
- D-08: Browser verification deve confirmar entrada no jogo e movimento, nao apenas carregamento de HTML.
- D-09: Qualquer mudanca de dependencia deve preservar o protocolo de mensagens por arrays numericos de `shared/js/gametypes.js`.

### the agent's Discretion
- Escolher entre scripts npm, scripts PowerShell ou documentacao operacional para os smoke checks, desde que sejam executaveis no ambiente Windows atual.
- Escolher se `log` sera removido por completo ou substituido por helper local, desde que `worldserver` e map tooling nao fiquem quebrados.
- Escolher se metricas antigas serao desabilitadas formalmente ou removidas do fluxo principal nesta fase.
</decisions>

<canonical_refs>
## Canonical References

Downstream agents MUST read these before planning or implementing.

### Project state
- `.planning/PROJECT.md` - product boundary and core value.
- `.planning/REQUIREMENTS.md` - v1 requirements and traceability.
- `.planning/ROADMAP.md` - phase boundary and success criteria.
- `.planning/STATE.md` - current workflow status.

### Codebase map
- `.planning/codebase/STACK.md` - dependency surface and current versions.
- `.planning/codebase/CONCERNS.md` - high-risk issues and recommended order.
- `.planning/codebase/TESTING.md` - current verification gap and smoke recommendations.
- `.planning/codebase/ARCHITECTURE.md` - client/server flow and protocol.

### Runtime source
- `package.json` - direct npm dependencies.
- `package-lock.json` - current lockfile.
- `server/js/main.js` - server bootstrap.
- `server/js/ws.js` - WebSocket transport and `/status`.
- `server/js/worldserver.js` - current residual `log` import and world loop.
- `server/js/metrics.js` - legacy `memcache` dependency.
- `tools/maps/processmap.js` - residual `log` import in map tooling.
- `client/js/gameclient.js` - client WebSocket URL and protocol handling.
- `client/js/game.js` - local vs production dispatcher behavior.
- `shared/js/gametypes.js` - protocol and entity constants.
</canonical_refs>

<specifics>
## Specific Ideas

- Add npm scripts such as `start:server`, `start:client`, and smoke scripts if they reduce command drift.
- Prefer a small Node-based smoke for `/status` and WebSocket handshake before adding heavier test frameworks.
- Browser smoke can use Playwright if added intentionally, but it must be worth the dependency footprint.
- Keep `client/config/config_build.json` ignored; document how to materialize it locally.
- Consider removing committed screenshot evidence from future commits; screenshots are useful locally but not source.
</specifics>

<deferred>
## Deferred Ideas

- Updating `client/js/lib/require-jquery.js` to a modern RequireJS/jQuery stack.
- Public deploy, HTTPS and WSS.
- Idle gameplay features.
- Rewriting map tooling.
- Reintroducing production metrics.
</deferred>

---
*Phase: 01-estabilizacao-dependencias-runtime-local*
*Context gathered: 2026-07-09 via manual GSD plan-phase bootstrap*
