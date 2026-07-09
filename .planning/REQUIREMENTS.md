# Requirements: BrowserQuestIdle

**Defined:** 2026-07-09
**Core Value:** O jogo precisa continuar funcionando localmente de ponta a ponta enquanto a base tecnica e modernizada.

## v1 Requirements

### Runtime

- [ ] **RUN-01**: Desenvolvedor consegue executar `npm install` em ambiente limpo sem depender de pacotes extraneous.
- [ ] **RUN-02**: Desenvolvedor consegue iniciar o servidor com `node server/js/main.js`.
- [ ] **RUN-03**: Servidor responde `GET /status` com JSON contendo a populacao dos mundos.
- [ ] **RUN-04**: Imports residuais de pacotes removidos sao resolvidos ou documentados como ferramentas fora do fluxo principal.

### Browser

- [ ] **BRW-01**: Desenvolvedor consegue servir a raiz do repositorio e abrir `http://localhost:9090/client/`.
- [ ] **BRW-02**: Cliente carrega mapa, sprites e UI sem erro bloqueante no console.
- [ ] **BRW-03**: Jogador consegue informar nome, conectar via WebSocket e receber `WELCOME`.
- [ ] **BRW-04**: Jogador consegue mover no mapa por clique apos entrar no mundo.

### Dependencies

- [ ] **DEP-01**: Dependencias npm diretas estao fixadas em ranges ou versoes coerentes com o lockfile.
- [ ] **DEP-02**: Bibliotecas vendorizadas do cliente estao inventariadas e classificadas por risco antes de substituicao.
- [ ] **DEP-03**: `log` e `memcache` residuais nao quebram o fluxo local validado.
- [ ] **DEP-04**: O plano diferencia runtime local validado, build legado e ferramentas de mapa.

### Verification

- [ ] **VER-01**: Existe smoke test documentado ou automatizado para `/status`.
- [ ] **VER-02**: Existe smoke test documentado ou automatizado para handshake WebSocket.
- [ ] **VER-03**: Existe smoke test documentado ou automatizado para browser entrar e mover personagem.

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
| RUN-01 | Phase 1 | Pending |
| RUN-02 | Phase 1 | Pending |
| RUN-03 | Phase 1 | Pending |
| RUN-04 | Phase 1 | Pending |
| BRW-01 | Phase 1 | Pending |
| BRW-02 | Phase 1 | Pending |
| BRW-03 | Phase 1 | Pending |
| BRW-04 | Phase 1 | Pending |
| DEP-01 | Phase 1 | Pending |
| DEP-02 | Phase 1 | Pending |
| DEP-03 | Phase 1 | Pending |
| DEP-04 | Phase 1 | Pending |
| VER-01 | Phase 1 | Pending |
| VER-02 | Phase 1 | Pending |
| VER-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

---
*Requirements defined: 2026-07-09*
*Last updated: 2026-07-09 after project planning bootstrap*
