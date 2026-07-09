# BrowserQuestIdle

## What This Is

BrowserQuestIdle e um fork local do BrowserQuest da Mozilla para evoluir o jogo com seguranca, comecando por estabilizar o runtime moderno e a base de dependencias. O primeiro objetivo nao e mudar gameplay; e garantir que o projeto instale, abra no navegador, conecte via WebSocket, crie personagem e permita jogar localmente.

## Core Value

O jogo precisa continuar funcionando localmente de ponta a ponta enquanto a base tecnica e modernizada.

## Requirements

### Validated

- Checked: servidor Node inicia em `server/js/main.js` e expoe `/status`.
- Checked: cliente abre em `http://localhost:9090/client/` quando a raiz do repositorio e servida.
- Checked: jogador `CodexTester` entrou no mundo, mapa renderizou e movimento por clique funcionou.
- Phase 1: `npm install`, `npm ls --depth=0`, `npm audit`, `npm audit --omit=dev`, and `npm run smoke` passed.
- Phase 1: smoke scripts cover server `/status`, WebSocket `HELLO`/`WELCOME`, and browser `/client/` entry with movement click.
- Phase 1: root/server/client docs match the verified local run path.
- Phase 2: `npm run build:client` creates ignored `client-build/` output through the legacy RequireJS optimizer.
- Phase 2: `npm run smoke:browser:build` validates the optimized build against the local direct server with `dispatcher: false`.
- Phase 3: `npm run vendor:check` verifies vendored browser library contracts under `client/js/lib/`.
- Phase 3: every vendored browser library has an explicit freeze decision and rationale in `client/js/lib/README.md`.
- Phase 4: private production preparation is planned around configurable WebSocket protocol, private server bind/proxy operation, healthcheck, logs, and runbook.
- Phase 4: `npm run smoke:health` verifies `/health`; `npm run smoke` and `npm run smoke:browser:build` still pass after WebSocket protocol and server bind changes.

### Active

- [ ] Preservar protocolo atual de mensagens e comportamento de gameplay durante a modernizacao.

### Out of Scope

- Reescrever o jogo para framework moderno nesta primeira etapa, porque o risco e alto e nao agrega ao objetivo imediato.
- Criar autenticacao, banco de dados ou contas persistentes, porque o jogo original usa nome e `localStorage`.
- Publicacao publica com dominio/certificado HTTPS/WSS real, porque Phase 4 prepara configuracao privada mas nao valida um proxy publico real.
- Novas mecanicas idle/gameplay antes de estabilizar runtime e testes.

## Context

- O fork remoto configurado como `origin` e `https://github.com/RafaelRodriguesDev/BrowserQuestIdle.git`.
- A branch de trabalho e `feature/refactor_1_0_browserQuestIdle`.
- O projeto original e legado, com servidor CommonJS e cliente AMD/RequireJS.
- O codebase map atual esta em `.planning/codebase/`.
- `ws`, `underscore` e `bison` ja estao nas versoes npm mais recentes verificadas em 2026-07-09.
- O maior risco esta em bibliotecas vendorizadas sob `client/js/lib/`, dependencia antiga de `memcache` em metricas e deploy publico com WSS/proxy/dispatcher.

## Constraints

- Tech stack: manter Node.js + cliente HTML5 Canvas/RequireJS por enquanto, para reduzir risco.
- Compatibility: preservar execucao local em Node.js `v24.15.0`.
- Verification: toda fase de dependencia precisa passar por smoke browser real.
- Git: trabalho deve ocorrer em branch local/feature e commits pequenos.
- Scope: atualizacao de dependencias primeiro; refatoracao estrutural apenas quando desbloquear install/teste.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Manter BrowserQuest local funcionando antes de modernizar bibliotecas vendorizadas | O jogo quebra facilmente em module loading e globals legados | Validated in Phase 1 |
| Tratar `client/js/lib` como superficie separada de npm | Npm update nao atualiza o runtime browser vendorizado | Validated in Phase 1 |
| Criar smoke tests antes de grandes trocas | Sem testes, regressao so aparece manualmente no navegador | Implemented in Phase 1 |
| Validar `client-build/` sem trocar bibliotecas vendorizadas | O build legado precisava conectar ao servidor direto antes de qualquer troca de RequireJS/jQuery | Implemented in Phase 2 |
| Congelar `require-jquery.js` ate existir plano dedicado de loader/jQuery | O arquivo combina RequireJS 0.26.0, jQuery 1.6.4, AMD `jquery` e globals usados pelo cliente | Implemented in Phase 3 |
| Exigir `vendor:check` antes de aceitar mudancas em `client/js/lib` | Npm update nao protege bibliotecas vendorizadas nem seus globals/AMD contracts | Implemented in Phase 3 |
| Preparar producao privada antes de features idle | WSS/proxy/health/logs precisam estar claros para nao misturar operacao com gameplay novo | Implemented in Phase 4 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

After each phase transition:
1. Requirements invalidated? Move to Out of Scope with reason.
2. Requirements validated? Move to Validated with phase reference.
3. New requirements emerged? Add to Active.
4. Decisions to log? Add to Key Decisions.
5. What This Is still accurate? Update if drifted.

After each milestone:
1. Full review of all sections.
2. Core Value check.
3. Audit Out of Scope.
4. Update Context with current state.

---
*Last updated: 2026-07-09 after Phase 4 execution*
