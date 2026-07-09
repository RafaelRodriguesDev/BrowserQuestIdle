# Phase 6: Integração de Novos Sprites e Inimigos - Research

**Goal:** Understand how monsters are implemented in BrowserQuest and how sprites are mapped ("vectorized") to their image dimensions, avoiding modification of original assets.

## 1. Arquitetura de Monstros no BrowserQuest

Para adicionar um **novo monstro** sem sobrescrever ou modificar os monstros originais, os seguintes pontos de integração são necessários no código (Backend e Frontend):

### Server-Side (Backend)
1. **`shared/js/gametypes.js`**: 
   - Deve-se adicionar o ID numérico do novo monstro em `Types.Entities` (ex: `NEW_MONSTER: 100`).
   - Adicionar o registro no objeto `kinds` indicando que é um "mob": `new_monster: [Types.Entities.NEW_MONSTER, "mob"]`.
2. **`server/js/properties.js`**:
   - É aqui que as estatísticas do monstro são configuradas (`hp`, `armor`, `weapon`, `drops`). Devemos criar um bloco com o nome do monstro.
3. **`server/maps/world_server.json`**:
   - Este arquivo contém as instâncias ("spawns") físicas no mapa do jogo no array `"roamingAreas"`.
   - Um registro típico se parece com: `{"id": 0, "x": 10, "y": 206, "width": 13, "height": 7, "type": "rat", "nb": 3}`.
   - Para adicionar nosso novo monstro no mapa, precisaremos inserir uma nova entrada em `roamingAreas` apontando o `"type"` para o nosso novo monstro.

### Client-Side (Frontend)
1. **`client/sprites/<monster_name>.json`**:
   - Mapeamento das animações e dimensões do sprite do monstro (veja seção 2).
2. **`client/js/sprites.js`**:
   - Adicionar a dependência do arquivo JSON (`'text!../sprites/<monster_name>.json'`) e mapeá-lo.
3. **`client/img/1/` e `client/img/2/`**:
   - Colocar os arquivos `.png` nos dois diretórios com as proporções corretas. O jogo carrega da pasta `2` se a resolução da tela do jogador for maior que 1000 pixels (tamanho dobrado), e carrega da pasta `1` se for menor (tamanho base).

## 2. Vetorização das Sprites (Formato JSON e Grids)

O BrowserQuest trabalha com um sistema de **Grid de Spritesheets**, em que a imagem completa é recortada em quadros iguais. O tamanho e ordem desses quadros são definidos pelos arquivos JSON (ex: `rat.json`).

Um arquivo `.json` de sprite possui a seguinte estrutura:
```json
{
    "id": "new_monster",
    "width": 81,
    "height": 81,
    "animations": {
        "death": { "length": 4, "row": 0 },
        "atk_right": { "length": 6, "row": 1 },
        "walk_right": { "length": 3, "row": 2 }
    }
}
```

### Relacionamento entre Imagem e JSON:
- `width` e `height`: Tamanho **BASE** de um único quadro. O tamanho base é o referente às imagens em `img/1/`. (Quando o cliente lê da `img/2/`, ele multiplica esse valor pelo `scaleFactor` de 2, lendo 162x162, por exemplo).
- `length`: Quantidade máxima de quadros (colunas) usados na animação.
- `row`: Em qual linha horizontal essa animação se encontra na imagem (começando em 0).

### Lógica Automática (A ser feita em Python):
Ao invés de contar manualmente o tamanho do grid, a fórmula matemática exata que podemos usar em Python para analisar uma imagem `img/2/Rat.png` (fator = 2) seria:

1. Achar a maior coluna (Maior `length` no JSON). Exemplo do rat: `atk_right` = 6.
2. Achar a maior linha (Maior `row` no JSON + 1). Exemplo do rat: `idle_down` = 9 (total 10 linhas).
3. Pegar a resolução total da imagem em `img/2/`. Exemplo: Largura `486`, Altura `810`.
4. Encontrar a dimensão em escala grande (Fator 2): `frame_w2 = 486 / 6 = 81`, `frame_h2 = 810 / 10 = 81`.
5. Descobrir a dimensão BASE (Fator 1) a ser colocada no JSON: `width = frame_w2 / 2`, `height = frame_h2 / 2`. 

Com esse cálculo, nosso script Python poderá ler o JSON genérico (que tem apenas rows/lengths), ler a nova imagem `v2` e injetar automaticamente o `width` e `height` perfeitos.
