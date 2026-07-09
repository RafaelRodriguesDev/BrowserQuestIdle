# Requirements: BrowserQuestIdle

**Defined:** 2026-07-09
**Core Value:** O jogo precisa continuar funcionando localmente de ponta a ponta enquanto a base tecnica e modernizada.

## v1 Requirements

### Runtime

- [x] **RUN-01**: Desenvolvedor consegue executar `npm install` em ambiente limpo sem depender de pacotes extraneous.
- [x] **RUN-02**: Desenvolvedor consegue iniciar o servidor com `node server/js/main.js`.
- [x] **RUN-03**: Servidor responde `GET /status` com JSON contendo a populacao dos mundos.
- [x] **RUN-04**: Imports residuais de pacotes removidos sao resolvidos ou documentados como ferramentas fora do fluxo principal.

### Browser

- [x] **BRW-01**: Desenvolvedor consegue servir a raiz do repositorio e abrir `http://localhost:9090/client/`.
- [x] **BRW-02**: Cliente carrega mapa, sprites e UI sem erro bloqueante no console.
- [x] **BRW-03**: Jogador consegue informar nome, conectar via WebSocket e receber `WELCOME`.
- [x] **BRW-04**: Jogador consegue mover no mapa por clique apos entrar no mundo.

### Dependencies

- [x] **DEP-01**: Dependencias npm diretas estao fixadas em ranges ou versoes coerentes com o lockfile.
- [x] **DEP-02**: Bibliotecas vendorizadas do cliente estao inventariadas e classificadas por risco antes de substituicao.
- [x] **DEP-03**: `log` e `memcache` residuais nao quebram o fluxo local validado.
- [x] **DEP-04**: O plano diferencia runtime local validado, build legado e ferramentas de mapa.

### Verification

- [x] **VER-01**: Existe smoke test documentado ou automatizado para `/status`.
- [x] **VER-02**: Existe smoke test documentado ou automatizado para handshake WebSocket.
- [x] **VER-03**: Existe smoke test documentado ou automatizado para browser entrar e mover personagem.

## v2 Requirements

### Production

- **PRD-01**: Cliente suporta `wss://` ou deriva protocolo de `window.location`.
- **PRD-02**: Build de producao e reconciliado com o servidor local ou substituido por fluxo moderno.
- **PRD-03**: Processo Node tem supervisor, logs e healthcheck operacional.

### Modernization

- **MOD-01**: RequireJS/jQuery vendorizados sao substituidos ou congelados com justificativa.
- **MOD-02**: Ferramentas de mapa sao validadas em Windows.
- **MOD-03**: Metricas antigas sao removidas ou reimplementadas com biblioteca mantida.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Reescrita completa do cliente | Alto risco antes de smoke tests e contrato runtime estavel |
| Novas features idle | Deve vir depois da base local estar confiavel |
| Auth/contas/banco | Nao faz parte do BrowserQuest original nem do objetivo imediato |
| Deploy publico | Depende de WSS/proxy e nao e necessario para a fase 1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| RUN-01 | Phase 1 | Complete |
| RUN-02 | Phase 1 | Complete |
| RUN-03 | Phase 1 | Complete |
| RUN-04 | Phase 1 | Complete |
| BRW-01 | Phase 1 | Complete |
| BRW-02 | Phase 1 | Complete |
| BRW-03 | Phase 1 | Complete |
| BRW-04 | Phase 1 | Complete |
| DEP-01 | Phase 1 | Complete |
| DEP-02 | Phase 1 | Complete |
| DEP-03 | Phase 1 | Complete |
| DEP-04 | Phase 1 | Complete |
| VER-01 | Phase 1 | Complete |
| VER-02 | Phase 1 | Complete |
| VER-03 | Phase 1 | Complete |
| PRD-02 | Phase 2 | Complete |
| DEP-04 | Phase 2 | Complete |
| MOD-01 | Phase 3 | Complete |
| PRD-01 | Phase 4 | Complete |
| PRD-03 | Phase 4 | Complete |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

---
*Requirements defined: 2026-07-09*
*Last updated: 2026-07-09 after Phase 4 execution*
