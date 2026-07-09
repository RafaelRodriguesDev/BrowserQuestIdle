# Documentação do Projeto: Integração de Sprites V2

Este documento descreve como o sistema de monstros e vetorização de sprites funciona no BrowserQuest, e detalha o processo passo a passo adotado para integrar com sucesso o novo monstro **RatV2** a partir dos recursos em `img/v2/monster/`.

---

## 1. Como o BrowserQuest Trata Sprites e Resoluções

O frontend do BrowserQuest usa imagens recortadas em grades uniformes (spritesheets). Para cada entidade, o tamanho de cada "quadro" (frame) e o posicionamento das linhas de animação são especificados em um arquivo JSON na pasta `client/sprites/`.

O motor gráfico renderiza em 3 escalas de imagem diferentes para suportar zoom e resoluções responsivas de tela (Celulares, Tablets e Monitores de Alta Resolução):
- **Escala 1 (`client/img/1/`):** Tamanho original (1x).
- **Escala 2 (`client/img/2/`):** Tamanho dobrado (2x) - padrão para a maioria das resoluções desktop.
- **Escala 3 (`client/img/3/`):** Tamanho triplicado (3x) - usado em altas resoluções (HiDPI / Retina).

Os valores de `width` e `height` definidos no JSON do monstro (ex: `ratv2.json`) representam a **Escala 1 (Base)**. O motor multiplica automaticamente esses valores pelo fator da escala atual quando renderiza na tela.

---

## 2. A Solução Automática Utilizada (Python + Pillow)

Em vez de calcular manualmente as dimensões de cada sprite e redimensionar imagens individualmente para 1x, 2x e 3x, criamos uma automação local:

1. **`scripts/make_transparent.py`**:
   - Analisa o arquivo `.png` original. Como os editores de sprite costumam salvar com fundo quadriculado (RGB sem canal alpha), este script localiza pixels claros/brancos (valores de cor RGB acima de 240) e os converte para transparência real (canal Alpha = 0), salvando uma imagem intermediária `RGBA`.

2. **`scripts/sprite_configurator.py`**:
   - Lê a nova imagem limpa e o JSON modelo do monstro antigo (`rat.json`).
   - Descobre o número máximo de frames horizontais (`length`) e linhas verticais (`row`).
   - Divide as dimensões totais da imagem por estes limites para encontrar a resolução de frame exata (Fator 2).
   - Salva a versão 2x na pasta `client/img/2/`.
   - Gera a versão 1x (reduzida à metade de forma pixel-perfect) na pasta `client/img/1/`.
   - Gera a versão 3x (escalada em 1.5x a partir do 2x) na pasta `client/img/3/`.
   - Injeta os novos valores base de `width` e `height` no JSON final em `client/sprites/`.

---

## 3. Passo a Passo da Aplicação do RatV2

Para aplicar a nova versão sem quebrar nada do código original e mantê-lo coexistindo com o rato clássico, o fluxo de integração feito foi:

### Backend (Server)
1. **`shared/js/gametypes.js`**:
   - Criamos o ID numérico `RATV2: 100` em `Entities`.
   - Criamos o registro de tipo: `ratv2: [Types.Entities.RATV2, "mob"]`.
2. **`server/js/properties.js`**:
   - Definimos os status e as taxas de drop para o novo monstro `ratv2` (ex: 30 de HP, ligeiramente mais forte que os 25 do rato antigo).
3. **`server/maps/world_server.json`**:
   - Alteramos as áreas de spawns de `"type": "rat"` para `"type": "ratv2"` nas coordenadas desejadas para que o mapa passe a invocar os monstros novos.

### Frontend (Client)
1. **`client/js/sprites.js`**:
   - Adicionamos `'text!../sprites/ratv2.json'` na lista de recursos carregados no carregamento inicial da engine do jogo.
2. **`client/js/game.js`**:
   - Registramos `"ratv2"` dentro do array estático `this.spriteNames` para que o jogo instancie a spritesheet do cache.
   - Ajustamos a validação de morte (`isDying`) para tocar a animação de morte `"ratv2"` caso a entidade seja instância de `Mobs.Ratv2` (do contrário, o jogo desenhava a animação padrão do esqueleto caindo).
3. **`client/js/mobs.js` e `client/js/entityfactory.js`**:
   - Criamos a classe `Mobs.Ratv2` e vinculamos seu factory para retornar `new Mobs.Ratv2(id)` quando o servidor enviar um sinal de spawn de monstro tipo 100.

---

## 4. Alinhamento de Sombra e Proporções

Por padrão, a textura V2 original desenhada possuía dimensões físicas de frame de 81x81 pixels, consideravelmente maiores que os 48x48 originais. Isso tornava o rato muito gigante em relação ao ambiente do jogo.

Para resolver isso, realizamos os seguintes ajustes de escala e alinhamento:
1. **Redução da Imagem Base (50%):** Criamos o script `scripts/resize_source.py` para redimensionar a imagem transparente do rato pela metade (50%), resultando em dimensões finais de frame base de **40x40** no JSON do monstro (`ratv2.json`), o que encaixou o rato perfeitamente nas proporções do ambiente.
2. **Ajuste de Offsets para a Sombra:** Como as spritesheets ainda possuem espaços vazios ao redor do desenho do rato dentro da caixa de 40x40, a sombra do chão acabava ficando desalinhada. Adicionamos as seguintes chaves de deslocamento no `client/sprites/ratv2.json`:
```json
    "offset_x": -13,
    "offset_y": -14
```
Isso faz com que o motor gráfico desloque a renderização do sprite nas coordenadas exatas, mantendo a sombra exatamente embaixo do centro do corpo do Rato V2.

---

## 5. Como Adicionar Outros Monstros V2 no Futuro

Se você quiser integrar outro monstro da pasta `v2/monster/` (ex: `Skeleton.png`, `Snake.png`):

1. **Crie um arquivo JSON modelo** na pasta `client/sprites/` baseado nas animações (pode copiar um correspondente, como `snake.json`).
2. **Remova o fundo quadriculado** e gere as texturas rodando o script:
   ```bash
   python scripts/make_transparent.py
   python scripts/sprite_configurator.py --image client/img/v2/monster/NomeDoMonstro.png --template client/sprites/modelo.json --out-json client/sprites/nomedomonstro.json --out-id nomedomonstro --out-image-name nomedomonstro.png
   ```
3. **Registre a nova entidade** no backend (`shared/js/gametypes.js` e `server/js/properties.js`).
4. **Mapeie no client** (`mobs.js`, `entityfactory.js`, `game.js` e `sprites.js`).
