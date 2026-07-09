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

### Active

- [ ] Estabilizar dependencias npm e imports residuais para que um install limpo nao dependa de pacotes extraneous.
- [ ] Definir smoke tests minimos para servidor, WebSocket e navegador.
- [ ] Atualizar documentacao operacional local para o fluxo real de execucao.
- [ ] Mapear e isolar bibliotecas vendorizadas antes de qualquer troca de RequireJS, jQuery, Modernizr ou build tooling.
- [ ] Preservar protocolo atual de mensagens e comportamento de gameplay durante a modernizacao.

### Out of Scope

- Reescrever o jogo para framework moderno nesta primeira etapa, porque o risco e alto e nao agrega ao objetivo imediato.
- Criar autenticacao, banco de dados ou contas persistentes, porque o jogo original usa nome e `localStorage`.
- Publicacao publica com HTTPS/WSS nesta fase, porque o cliente ainda usa `ws://` fixo.
- Novas mecanicas idle/gameplay antes de estabilizar runtime e testes.

## Context

- O fork remoto configurado como `origin` e `https://github.com/RafaelRodriguesDev/BrowserQuestIdle.git`.
- A branch de trabalho e `feature/refactor_1_0_browserQuestIdle`.
- O projeto original e legado, com servidor CommonJS e cliente AMD/RequireJS.
- O codebase map atual esta em `.planning/codebase/`.
- `ws`, `underscore` e `bison` ja estao nas versoes npm mais recentes verificadas em 2026-07-09.
- O maior risco esta em bibliotecas vendorizadas sob `client/js/lib/`, imports residuais de `log`, dependencia antiga de `memcache` em metricas e build de producao em modo dispatcher.

## Constraints

- Tech stack: manter Node.js + cliente HTML5 Canvas/RequireJS por enquanto, para reduzir risco.
- Compatibility: preservar execucao local em Node.js `v24.15.0`.
- Verification: toda fase de dependencia precisa passar por smoke browser real.
- Git: trabalho deve ocorrer em branch local/feature e commits pequenos.
- Scope: atualizacao de dependencias primeiro; refatoracao estrutural apenas quando desbloquear install/teste.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Manter BrowserQuest local funcionando antes de modernizar bibliotecas vendorizadas | O jogo quebra facilmente em module loading e globals legados | Pending |
| Tratar `client/js/lib` como superficie separada de npm | Npm update nao atualiza o runtime browser vendorizado | Pending |
| Criar smoke tests antes de grandes trocas | Sem testes, regressao so aparece manualmente no navegador | Pending |
| Nao usar o build `client-build/` como caminho validado inicial | O build usa `prodHost` e dispatcher mode diferente do servidor local | Pending |

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
*Last updated: 2026-07-09 after project planning bootstrap*
