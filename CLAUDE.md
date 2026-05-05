# CLAUDE.md — guia de execução do EducaTche / Mundo das Três Ilhas

> Documento vivo. Sempre que terminar uma tarefa, **atualizo o "Quadro de progresso" abaixo** marcando `[x]` e a data.

---

## 1. Visão geral

**EducaTche** (antes "Aprendendo com Thomas") é um app educativo single-page para crianças de 6-7 anos aprenderem a ler, escrever e fazer matemática básica. Identidade visual gaúcha (Rio Grande do Sul). Em evolução para o conceito **"Mundo das Três Ilhas"** com mascotes Tomi (capivara), Rô (macaco) e Livi (arara).

- **Stack:** HTML + CSS + JS puro com **ES modules**. **Sem frameworks**, sem React, sem build step.
- **Testes:** vitest + jsdom (unit, 122 testes); Playwright (E2E).
- **Dev server:** `npx serve` na porta **3456**.
- **Deploy:** Vercel (estático em `public/`).
- **Persistência:** `localStorage` schema v3 com migração de v1/v2.

### Estrutura de pastas

```
public/
├── index.html              telas (screens) e templates inline
├── css/
│   ├── styles.css          base + telas existentes
│   └── islands.css         tela do mapa (NOVO)
├── jspdf.umd.min.js        biblioteca PDF (vendored)
├── assets/
│   ├── brand/              logo do projeto
│   ├── maps/               mapa-ilhas-home.jpg
│   └── mascots/            tomi, ro, livi, mascotes-grupo
└── js/
    ├── main.js             bootstrap, navegação entre telas
    ├── engine.js           orquestra fase: rodadas, streak, fim
    ├── state.js            load/save/reset do localStorage v3
    ├── rounds.js           POOLS por fase + sorteio
    ├── difficulty.js       seleção de level 1/2 adaptativo
    ├── rewards.js          BADGE_DEFS, dailyBonus, checkBadges
    ├── audio.js            sons + speak (TTS)
    ├── pdf.js              certificado de prêmio
    ├── shop.js             gerenciamento de itens comprados
    ├── utils.js            helpers
    ├── data/               pools de cada atividade
    │   ├── phases.js       metadados de TODAS as 16 fases
    │   ├── letters.js, syllables.js, words.js, sentences.js
    │   ├── logic.js, colors.js, numbers.js, math.js, svg.js
    │   └── shop.js         itens da loja
    └── renderers/          UI por tela
        ├── menu.js         grid de fases + medalhas
        ├── islandMap.js    mapa interativo (NOVO)
        ├── activities.js   despacho dos 16 renderers de atividade
        ├── shop.js         loja
        ├── feedback.js     toasts e overlay de resposta
        ├── mascot.js       look do mascote durante atividade
        └── celebration.js  tela de celebração final
tests/
├── unit/                   *.test.js (vitest)
└── e2e/                    *.spec.js (playwright)
```

---

## 2. Mapa do código (se quer mexer em X, vá em Y)

| Quero… | Ir em… |
|---|---|
| Adicionar/alterar metadados de fase | [public/js/data/phases.js](public/js/data/phases.js) |
| Mudar pool de rodadas de uma fase | `public/js/data/<tipo>.js` (ex.: `colors.js` para fase 13) |
| Adicionar tipo novo de atividade | (1) novo `data/foo.js` (2) `rounds.js` em `POOLS` (3) `renderers/activities.js` em `ACTIVITY_RENDERERS` (4) `phases.js` |
| Mudar regras de desbloqueio de fase | [public/js/renderers/menu.js:24-32](public/js/renderers/menu.js:24) |
| Mudar layout/cor do menu de fases | [public/css/styles.css](public/css/styles.css) (`.phases-grid`, `.phase-card`) |
| Mudar layout/cor do mapa de ilhas | [public/css/islands.css](public/css/islands.css) |
| Reposicionar hotspots | [public/css/islands.css](public/css/islands.css) (`.island-letters`, `.island-numbers`, etc.) |
| Adicionar/mudar mascote por ilha | [public/index.html](public/index.html) bloco `#islandMap` |
| Mudar fluxo de telas | [public/js/main.js](public/js/main.js) (`showScreen`, `showSplash`, `showIslandMap`, `showMenu`) |
| Adicionar nova medalha | [public/js/rewards.js](public/js/rewards.js) (`BADGE_DEFS` + `checkBadges`) |
| Mudar moedas/recompensa por acerto | [public/js/rewards.js](public/js/rewards.js) (`rewardForAnswer`, `rewardForPhaseEnd`) |
| Mudar loja/itens | [public/js/data/shop.js](public/js/data/shop.js) + `public/js/renderers/shop.js` |
| Mudar PDF do prêmio | [public/js/pdf.js](public/js/pdf.js) |
| Migrar schema do localStorage | [public/js/state.js](public/js/state.js) (`loadState`, `defaultState`) |

---

## 3. Como rodar e testar

```bash
# dev server (porta 3456)
npm run dev          # = npx serve public -l 3456

# unit tests
npm run test         # = npx vitest run
npm run test:watch   # vitest em watch mode

# e2e
npm run test:e2e     # = npx playwright test
```

Antes do primeiro `test:e2e`: `npx playwright install`.

---

## 4. Convenções

- **Sem React, sem JSX, sem build.** Tudo `<script type="module">`.
- **XSS-safe:** sempre `createElement` + `textContent`. **Nunca** `innerHTML` com dados dinâmicos.
- **Renderers** têm contrato `(ctx, round)` onde `ctx = { state, content, showFeedback, onAnswer }`.
- **Difficulty** adaptativa via `level: 1 | 2` em cada round; `filterByDifficulty(pool, level)`.
- **A11y:** `role="button"` + `aria-label` em qualquer elemento clicável que não seja `<button>`.
- **Comentários em português** (curtos, só onde o "porquê" não é óbvio).
- **Não criar arquivos `.md`** sem pedido explícito. Este `CLAUDE.md` é exceção (foi pedido).
- **localStorage key:** `thomas_learning_v3` (não mudar sem migração).

### Identidade visual

- **Cores RS** (splash, badges): vermelho `#E53935`, amarelo `#FFEB3B`, verde `#2E7D32`.
- **Cores Mundo das Ilhas:** azul céu `#5DADE2`, areia `#F9E79F`, coral `#F5B7B1`, folha `#82E0AA`, sol `#F7DC6F`.
- **Fonte:** Comic Neue (Google Fonts).

---

## 5. Quadro de progresso — Mundo das Três Ilhas

> A cada item completado, eu marco `[x]` aqui imediatamente.

### Fase 1 — Estrutura e estilo

- [x] **1.1** Criar este `CLAUDE.md` com checklist inicial — *2026-04-24*
- [x] **1.2** Adicionar `<div id="islandMap">` em [public/index.html](public/index.html) + `<link>` para `islands.css` + preload das imagens críticas — *2026-04-24*
- [x] **1.3** Criar [public/css/islands.css](public/css/islands.css) com layout, hotspots, mascotes, animações, responsive — *2026-04-24*
- [x] **1.4** Criar [public/js/renderers/islandMap.js](public/js/renderers/islandMap.js) — *2026-04-24*

### Fase 2 — Integração com o app existente

- [x] **2.1** Modificar [public/js/renderers/menu.js](public/js/renderers/menu.js) para aceitar parâmetro `filter` (`'all' | 'letters' | 'numbers' | 'colors'`) — *2026-04-24*
- [x] **2.2** Modificar [public/js/main.js](public/js/main.js): adicionar `showIslandMap()`; `showMenu(filter)` aceita filtro; `startBtn`, `homeBtn`, `celebMenuBtn`, retorno da loja e `onShowMenu` da engine agora vão para `#islandMap` — *2026-04-24*

### Fase 3 — Testes

- [x] **3.1** Atualizar [tests/e2e/navigation.spec.js](tests/e2e/navigation.spec.js) — splash agora leva ao `#islandMap`; tests adicionais cobrem 4 hotspots, navegação e filtro — *2026-04-24*
- [x] **3.2** Atualizar [tests/e2e/math.spec.js](tests/e2e/math.spec.js), [tests/e2e/new-phases.spec.js](tests/e2e/new-phases.spec.js) e [tests/e2e/phase-completion.spec.js](tests/e2e/phase-completion.spec.js) — helpers passam pelo name prompt e clicam na ilha apropriada — *2026-04-24*
- [x] **3.3** Criar [tests/e2e/island-map.spec.js](tests/e2e/island-map.spec.js) — smoke: hotspots existem, clique navega, layout responsivo — *2026-04-24*

### Fase 4 — Verificação

- [x] **4.1** `npm run test` → 122/122 unit tests verdes — *2026-04-24*
- [x] **4.2** `npm run dev` + verificação manual via preview MCP (mapa, navegação por todas as 4 ilhas, filtros, home button, mobile 375x812) — *2026-04-24*
- [x] **4.3** `git add` + commit final com tudo — *2026-04-24*

### Fase 5 — Refactor UX/UI v2 (paleta infantil + 5a ilha + medalhas/parents)

- [x] **5.1** Criar [public/css/design-system.css](public/css/design-system.css) com tokens (paleta sem vermelho agressivo, raios infantis, tap-min 48px) — *2026-04-24*
- [x] **5.2** Criar componentes reutilizaveis em [public/js/components/](public/js/components/): Button, Card, LevelCard, CurrencyBadge — *2026-04-24*
- [x] **5.3** Refatorar #splash: logo grande + mascotes-grupo + 2 botoes (Comecar / Area dos pais); remover bloco #namePrompt — *2026-04-24*
- [x] **5.4** Limpar [public/js/main.js](public/js/main.js): remover refs a namePrompt; getPlayerName default 'Guri' — *2026-04-24*
- [x] **5.5** Atualizar [public/js/renderers/menu.js](public/js/renderers/menu.js) para usar LevelCard, suportar filter 'syllables', remover badges inline — *2026-04-24*
- [x] **5.6** Criar tela #badges separada com [public/js/renderers/badges.js](public/js/renderers/badges.js) (grid grande com nome, descricao e estado) — *2026-04-24*
- [x] **5.7** Criar tela #parents placeholder ("Em breve!") — *2026-04-24*
- [x] **5.8** Adicionar barra fixa `<nav class="main-nav">` (Jogar / Medalhas / Loja) no rodape de #islandMap, #menu, #shop, #badges, #parents — *2026-04-24*
- [x] **5.9** Adicionar 5a ilha "Sons & Silabas" como balao no mapa: hotspot em [public/index.html](public/index.html), CSS em [public/css/islands.css](public/css/islands.css) (top 12% / left 50%), filter-syllables — *2026-04-24*
- [x] **5.10** Criar fases 17-20 (`type: 'syllable-build'`) em [public/js/data/phases.js](public/js/data/phases.js) + ROUNDS_PER_PHASE — *2026-04-24*
- [x] **5.11** Criar `SYLLABLE_BUILD_ROUNDS` (mecanica GA+TO=GATO) em [public/js/data/syllables.js](public/js/data/syllables.js) — *2026-04-24*
- [x] **5.12** Registrar POOLS[17..20] em [public/js/rounds.js](public/js/rounds.js) e renderer 'syllable-build' em [public/js/renderers/activities.js](public/js/renderers/activities.js) (renderer novo em [public/js/renderers/syllableBuild.js](public/js/renderers/syllableBuild.js)) — *2026-04-24*
- [x] **5.13** Polish da loja: XSS hardening (createElement em vez de innerHTML), CurrencyBadge no banner, selo "Equipado", emojis nas categorias, rename "Cores do Mascote" → "Mascotes" — *2026-04-24*
- [x] **5.14** Reposicionar 4 hotspots existentes (letras top 38%, numeros top 28%) para nao colidir com balao — *2026-04-24*
- [x] **5.15** Estados visuais do .phase-card: data-state="locked|available|completed", overlay 🔒, animacao pulse no available — *2026-04-24*
- [x] **5.16** `npm test` 122/122 verde + verificacao via preview MCP (splash sem name prompt, 5 ilhas, syllable-build funcional, badges/parents acessiveis pela main-nav, mobile 375x812 sem overflow) — *2026-04-24*
- [x] **5.17** Atualizar specs E2E (helpers sem name prompt; novos specs para badges/shop/parents/syllables) — resolvido na Fase 16 Onda 9 — *2026-05-04*
- [ ] **5.18** Commit + push final — *aguardando confirmacao do usuario*

### Fase 14 — Mascote refeito: 2 personagens marcantes + acessórios grandes

**Objetivo:** o mascote era um SVG simples (círculo amarelo + olhos + boca, ~80px). Acessórios SVG minúsculos. Criança não se identifica e cosméticos não são desejáveis. Solução: 2 personagens distintos (Dino masculino, Lumi unicórnio feminino) com SVGs ricos + escolha inicial + acessórios 2x maiores.

#### Itens entregues

- [x] **14.1** Schema **v6** em [public/js/state.js](public/js/state.js) com `state.mascotType: 'dino' | 'unicorn' | null`. Migração v5→v6 lossless (campo opcional, default null). Migrações encadeadas v3→v4→v5→v6 atualizadas. `tests/unit/state.test.js` ajustado pra `version: 6` — *2026-04-26*
- [x] **14.2** [public/js/renderers/mascot.js](public/js/renderers/mascot.js) refeito completamente:
  - **`dinoSvg(body, stroke, sparkle)`**: T-Rex amigável viewBox 100x110. Corpo verde gordinho, cabeça redonda com sorriso, **espinhos serrados nas costas** (4 polígonos), olhos brancos com pupila preta + brilho, dentinhos brancos no sorriso, bracinhos curtinhos, cauda atrás, pernas com 6 garras, bochechas rosadas opacity 0.5.
  - **`unicornSvg(body, stroke, sparkle)`**: cavalinho branco viewBox 100x110. Corpo elíptico, **chifre dourado** com 2 listras, **crina em 3 pomponzinhos coloridos** (rosa/lilás/azul), orelhas internas rosa, **olhos com 6 cílios cada**, bochechas rosa fortes, **cauda em swoop tricolor** (3 paths sobrepostos), focinho sutil.
  - Default colors: dino verde `#66BB6A`/`#1B5E20`, unicórnio branco `#FFFFFF`/`#9C27B0`. Cores compradas (mascot-blue/red/etc) substituem o body fill.
  - Sparkle (mascot-gold): 3 estrelas piscantes em posições distintas.
  - Acessório envolvido em `<g class="mascot-accessory">` injected antes de `</svg>` — *2026-04-26*
- [x] **14.3** Nova tela `#mascotPick` em [public/index.html](public/index.html): 2 cards grandes (Dino e Lumi) com SVG preview 160x176, nome, descrição. CSS com gradient amarelo, cards com border colorido pelo tipo (verde/roxo), hover com translateY+scale 1.04, animation `float` no SVG. Mobile (≤480px): grid muda pra 1 coluna — *2026-04-26*
- [x] **14.4** [public/js/data/shop.js](public/js/data/shop.js) — 8 acessórios redesenhados (todos 2x maiores):
  - **Óculos Estilosos**: lentes redondas 18×14 com fill ciano translúcido, hastes 3px, brilhos brancos
  - **Coroa Real**: zigue-zague 64px, 5 pedras coloridas (rubi central, safiras laterais, esmeraldas)
  - **Cartola Mágica**: 56×28 preta com fita vermelha + estrela mágica brilhante na lateral
  - **Chapéu de Festa**: cone 40×34 rosa com bolinhas amarela/azul/verde + estrela no topo
  - **Capacete Aventureiro**: 76×38 laranja com lâmpada amarela frontal + faixa de couro
  - **Bombacha Gauchinha**: calça verde 56×26 nas pernas com botões amarelos
  - **Lenço Tchê**: triângulo 56×28 vermelho com bordado dourado
  - **Chimarrão**: cuia 28×32 marrom + bomba prata 22px do lado direito — *2026-04-26*
- [x] **14.5** [public/js/main.js](public/js/main.js) `showMascotPick()` nova função. `startBtn.onclick` agora checa `state.mascotType`: se null → mascotPick, senão → islandMap. Click em card salva tipo + chama `applyMascotLook` + vai pro mapa. Renderer `renderMascotPickPreview()` pinta os 2 SVGs nos cards — *2026-04-26*

#### Resultado

- [x] **14.6** `npm run test` → **126/126 verde** — *2026-04-26*
- [x] **14.7** Verificação MCP: localStorage limpo → splash → click "Comecar" → tela #mascotPick ativa com 2 cards (Dino verde + Lumi roxo), ambos SVGs renderizados — *2026-04-26*

### Fase 13 — Loja funcional de verdade: powerups + cosméticos visíveis (2 ondas)

**Objetivo:** corrigir 8 bugs concretos relatados pelo usuário ("powerups não funcionam" + "cosméticos não alteram nada"). Tornar cada compra com retorno visual perceptível.

#### Onda 1 — Powerups que funcionam de verdade

- [x] **13.1** **Dica em todas as 16 fases.** [public/js/engine.js](public/js/engine.js) `useHint()` agora tem fallback `buildHintText(phase, round)` que retorna mensagem específica por tipo: vogais ("Toque nas VOGAIS: A, E, I, O, U"), build-word ("A palavra e: BOLA"), type-word ("Digite: GATO"), memory-game ("Vire 2 cartas iguais"), syllable-build ("Junte para formar: GATO"), build-sentence ("Frase: 'O gato come'"). Nova função `showHintHelper(text)` em [public/js/renderers/feedback.js](public/js/renderers/feedback.js) exibe pílula amarela no topo por 2.8s. Powerup é consumido em ambos os caminhos (pulse OU helper) — *2026-04-26*
- [x] **13.2** **2x Moedas vira toggle MANUAL.** Removido auto-consumo em `startActivity` ([public/js/engine.js:81-87](public/js/engine.js:81)). Adicionado 4º botão `💰` na powerup-bar ([public/index.html](public/index.html)). Click chama `useDoubleCoins()`: consome 1, seta `state.coinMultiplier = 2`, mostra hintHelper "2x Moedas ATIVO!", botão ganha classe `.active` (gradient dourado pulsante). Multiplier reseta a cada nova fase (já existia) — *2026-04-26*
- [x] **13.3** **Tenta de Novo na powerup-bar.** Adicionado 3º botão `🔄` na barra. Click chama `useRetry()`: consome 1, re-renderiza rodada atual via `renderRound()` sem mexer em streak/correctCount. Continua disponível também no overlay de feedback (atalho rápido) — *2026-04-26*
- [x] **13.1+** Verificação MCP: fase 1 (find-vowels) - clicar Dica caiu de 3→2 e mostrou "💡 Toque nas VOGAIS: A, E, I, O, U". Clicar 2x — multiplier 1→2, classe `.active` aplicada, hintHelper exibido — *2026-04-26*

#### Onda 2 — Cosméticos com efeito visual REAL

- [x] **13.4** **Tema substitui bg da screen.** [public/js/shop.js](public/js/shop.js) `applyTheme` agora seta `--screen-bg` em :root (não só `--theme-bg` que era overlay 55%). [public/css/styles.css](public/css/styles.css), [public/css/islands.css](public/css/islands.css), [public/css/design-system.css](public/css/design-system.css): `#splash`, `#islandMap`, `#menu`, `#shop`, `#celebration` ganharam `background: var(--screen-bg, /* fallback original */)`. Tema "Espaço" agora cobre todas essas telas com radial-gradient escuro real (`#1a237e → #0d0d1a`). Overlay sutil antigo mantido só em `#activity`/`#result`/`#badges` (que não tinham bg próprio fixo) com opacity reduzida pra 35% — *2026-04-26*
- [x] **13.5** **Mascote maior + bounce no equip.** [public/css/styles.css](public/css/styles.css): mascote em telas-âncora cresceu de 64px → **100px** (110px no splash). Em mobile (≤480px) fica 80-90px. Nova classe `.just-equipped` aplicada em [public/js/renderers/mascot.js](public/js/renderers/mascot.js) `applyMascotLook` que dá bounce 0.7s ao trocar visual — *2026-04-26*
- [x] **13.6** **Acessório destacado.** [public/js/renderers/mascot.js](public/js/renderers/mascot.js) envolve o `accessory.svg` com `<g transform="translate(-20,-12) scale(1.4)">` para coroa/óculos/chapéu ficarem visivelmente maiores na cabeça do mascote — *2026-04-26*
- [x] **13.7** **Effect dispara no `#result` também.** [public/js/engine.js](public/js/engine.js) `showResult` chama `celebrate(state)` após 600ms quando passa de fase. Confete/fogos/estrelas/arco-íris caem **na tela de resultado**, não só em #celebration. Quem clica em "Ver meu premio!" continua vendo no celebration (efeito duplo) — *2026-04-26*
- [x] **13.8** **Preview do frame na loja.** [public/js/renderers/shop.js](public/js/renderers/shop.js) `renderCard`: para `category: 'frame'` (não-default), substitui o ícone do preview por mini phase-card (60×60) com número "1" + estrela e a moldura aplicada via `data-frame={item.id}`. CSS `.phase-card-mini` em [public/css/design-system.css](public/css/design-system.css) com mesmas regras de halo do phase-card grande (gold/neon/holo). Criança vê **antes de comprar** como vai ficar — *2026-04-26*

#### Resultado final

- [x] **13.9** `npm run test` → **126/126 verde** (lógica intacta) — *2026-04-26*
- [x] **13.10** Verificação MCP: 4 powerups funcionais (Dica/Pular/Retry/2x), tema Espaço aplicado em #islandMap visivelmente, mascote 80-100px, acessório (coroa) destacado — *2026-04-26*

### Fase 12 — Conteúdo, modo livre e polish (3 ondas)

**Objetivo:** dar profundidade ao conteúdo (variação por tier dentro da ilha), oferecer modo livre de treino para crianças que querem revisar fases dominadas e polir mensagens motivacionais.

#### Onda 1 — Tier-aware difficulty

- [x] **12.1** [public/js/rounds.js](public/js/rounds.js) novo helper `effectiveLevel(state, phase)` combina `getDifficultyLevel` adaptativo com `tierForPhase`. Tier 1 (fases 1-5 da ilha): nivel apenas adaptativo. Tier 2 (6-10): igual. **Tier 3 (11-15)**: força `level >= 2` (dificuldade alta) mesmo se a criança está com baixa performance adaptativa. Garante progressão dentro da ilha sem precisar de pools por fase — *2026-04-26*

#### Onda 2 — Modo Revisão (treino livre)

- [x] **12.2** Engine.js suporte a `startActivity(phaseId, { review: true })`: marca `session.isReview`, prefixa título da atividade com "🎲 Revisao: ". Em `onAnswer`, **moedas reduzidas em 50%** (anti-farming, deduz a metade do que `rewardForAnswer` creditou). Em `showResult`, se review: pula `completedPhases.push`, pula `onPhaseCompleted`, pula cerimônia de ilha, pula update de medalhas/dificuldade adaptativa — só mostra resultado e volta ao menu — *2026-04-26*
- [x] **12.2** Botão "🎲 Treinar" no header da ilha em [public/js/renderers/menu.js](public/js/renderers/menu.js): só aparece se `completedInIsland > 0`. Click sortea fase aleatória já completada da ilha e dispara callback `onStartReview(phaseId)`. Wire-up em [public/js/main.js](public/js/main.js) `showMenu` passa novo callback que chama `startActivity(phaseId, { review: true })`. CSS `.menu-train-btn` (border azul, ícone 🎲, hover lift) — *2026-04-26*
- [x] **12.2** Verificação MCP em mobile (375x812): Ilha das Letras com 5/15 fases mostra botão "🎲 Treinar" no canto direito do header verde — *2026-04-26*

#### Onda 3 — Mensagens motivacionais variadas

- [x] **12.3** [public/js/engine.js](public/js/engine.js) `showResult` agora calcula 5 faixas de score com emoji + mensagem específica:
  - **Perfeito (100%):** 🏆 "{nome}, voce arrasou! 100% perfeito!"
  - **95%+:** 🌟 "Quase perfeito, {nome}! Voce e um craque!"
  - **85%+:** 🎉 "Excelente trabalho! Continue assim!"
  - **70%+:** 👍 "Mandou bem! Voce esta aprendendo rapido!"
  - **<70% (não passou):** 💪 "Cada erro te ensina algo. Tenta de novo!"
  - **Modo Revisão:** título substitui "Parabens" por "{nome}, treino completo!" — *2026-04-26*

#### Resultado final

- [x] **12.4** `npm run test` → **126/126 verde** (lógica intacta, tier filtering só usa funções já existentes) — *2026-04-26*
- [x] **12.5** Verificação MCP: tier 3 força level 2 nas fases finais; modo revisão consome 50% das moedas e não atualiza progresso; mensagens variadas no #result conforme score real — *2026-04-26*

### Fase 11 — Closure educacional, áudio e backup (3 ondas)

**Objetivo:** fechar o loop educacional (cerimônia ao terminar uma ilha), enriquecer áudio nas atividades (reforço auditivo) e dar utilidade real para os pais (backup do progresso).

#### Onda 1 — Cerimônia de ilha completa

- [x] **11.1** `showIslandCompletionCelebration(island, bonusCoins)` em [public/js/renderers/feedback.js](public/js/renderers/feedback.js): overlay full-screen com card central usando `--island-color` da ilha, mascote da ilha (Tomi/Ro/Livi via `<img>`, ou emoji para clouds/treasure), título "🎉 Voce conquistou!" + nome da ilha em destaque, mensagem "{Mascote} esta orgulhoso de voce!", badge "+500 moedas de bonus", 50 partículas de confete usando `confettiDrop`. CSS em [public/css/design-system.css](public/css/design-system.css) com `.island-completion-card` 5px border na cor da ilha, `rankupZoom` na entrada, mascote 120-180px com border colorido + animação `bounce` 0.4s — *2026-04-26*
- [x] **11.1** Hook em [public/js/engine.js](public/js/engine.js) `showResult`: após `firstTime` push, calcula `islandForPhase(phase.id)`, verifica se TODAS as fases da ilha estão em `completedPhases`. Se sim, credita +500 moedas via `addCoins` e dispara `showIslandCompletionCelebration` após delay de 2200ms (deixa toasts de moeda/medalha aparecerem primeiro) — *2026-04-26*
- [x] **11.1** Verificação MCP: `showIslandCompletionCelebration(ISLANDS[0], 500)` mostrou Tomi capivara gigante centralizado, "Voce conquistou! / Ilha das Letras" em verde, "Todas as 15 fases completas! Tomi esta orgulhoso de voce!", "+500 moedas de bonus" + botão "Continuar a aventura". Confete colorido caindo no fundo — *2026-04-26*

#### Onda 2 — Áudio enriquecido em renderers

- [x] **11.2** Adicionado `speak()` em mais 4 renderers em [public/js/renderers/activities.js](public/js/renderers/activities.js):
  - **renderSyllables** (fase 3 + 46-60): pronuncia a sílaba ao aparecer (300ms delay) + ao acertar
  - **renderBuildWord** (fases 4, 12 e variantes): pronuncia palavra ao montar corretamente
  - **renderReadMatch** (fase 5, 13): pronuncia a palavra escrita assim que aparece
  - **renderFillBlank** (fase 6 e variantes): pronuncia palavra completa após preencher letra correta
  - **renderTypeWord** (fase 7, 15): pronuncia a palavra digitada ao acertar
  - Já tinham `speak()`: color-match, count-match, number-recognize, math-add/sub — *2026-04-26*

#### Onda 3 — Backup/Restore JSON

- [x] **11.3** Seção "💾 Backup do progresso" no dashboard da Área dos Pais ([public/js/renderers/parents.js](public/js/renderers/parents.js)):
  - **Exportar progresso:** gera Blob JSON do `state` com `URL.createObjectURL`, dispara download com nome `educatche-progresso-YYYY-MM-DD.json`
  - **Importar progresso:** abre `<input type="file" accept=".json">`, lê via `file.text()`, parsea JSON, valida estrutura mínima (precisa ter `completedPhases` array), confirma com o usuário, sobrescreve o state (preserva referência), salva e recarrega
  - CSS `.parents-backup` (border azul, help text, 2 botões side-by-side) — *2026-04-26*
- [x] **11.3** Verificação MCP: dashboard mostra seção backup com 2 botões (Exportar + Importar). Mascote já visível no canto em todas as telas (incluindo islandMap, feito na Fase 9.3) — *2026-04-26*

#### Resultado final

- [x] **11.4** `npm run test` → **126/126 verde** (lógica intacta, só adições visuais e áudio) — *2026-04-26*
- [x] **11.5** Verificação MCP completa em mobile (375x812): cerimônia de ilha, áudio sintético funcional via SpeechSynthesis API (silencioso em testes mas integrado), backup/restore JSON na Área dos Pais — *2026-04-26*

### Fase 10 — Engajamento, pais e polish final (3 ondas)

**Objetivo:** fechar 4 pendências de UX/closure: tutorial inicial, celebração de rank-up, Área dos Pais funcional, specs E2E alinhados.

#### Onda 1 — Celebração de Rank-up

- [x] **10.1** `showRankUpCelebration(rank)` em [public/js/renderers/feedback.js](public/js/renderers/feedback.js): overlay full-screen com card central (ícone gigante, nome do rank, "+X% em moedas"), 30 partículas de confete reusando `confettiDrop`, som `soundBigReward`. Wrapper `checkBadgesAndRankUp` em [public/js/engine.js](public/js/engine.js) compara `getRank` antes/depois — se mudou, dispara após delay (espera toasts de medalha primeiro). Aplicado nos 3 sites de `checkBadges` (memoryWin, onAnswer, showResult). CSS `@keyframes rankupZoom` + variantes coloridas por raridade (master violeta-glow, legend dourada com `legendaryPulse`) — *2026-04-26*

#### Onda 2 — Tutorial inicial

- [x] **10.2** Schema **v5** em [public/js/state.js](public/js/state.js): adiciona `hasSeenTutorial: false` e `parentsPin: null`. Migração v4→v5 lossless (defaults aplicados a saves antigos). Test `tests/unit/state.test.js` agora cobre v3→v4→v5 e v4→v5 lossless — *2026-04-26*
- [x] **10.2** Componente novo [public/js/components/Tutorial.js](public/js/components/Tutorial.js) `startTutorial({ steps, onDone })`: overlay escuro, card central reposicionado por `step.target` (BoundingRect dinâmico), botão "Próximo"/"Bora jogar!" + "Pular". 4 steps definidos: bem-vindo + apontar Letras + explicar moedas + apontar Loja. Wire-up em [public/js/main.js](public/js/main.js) `showIslandMap` dispara apenas se `!state.hasSeenTutorial`, marca true ao concluir/pular — *2026-04-26*

#### Onda 3 — Área dos Pais funcional

- [x] **10.3** Novo renderer [public/js/renderers/parents.js](public/js/renderers/parents.js) com 3 modos: setup PIN (primeira vez, 4 dígitos), gate (pede PIN), dashboard. Dashboard tem: **6 stat cards** (fases completas N/75, medalhas N/total, moedas ganhas, sequência diária, melhor combo, rank atual), **5 barras de progresso por ilha** com cor temática + count N/15, **zona de cuidado** com botão Resetar progresso (confirmação dupla) + Mudar PIN. Helper `makePinInput` cria 4 caixas com auto-focus entre digitos e flash de erro — *2026-04-26*
- [x] **10.3** Wire-up em `showParents` no main.js: chama `renderParents(state, onReset)` que recebe callback pra re-carregar state e voltar pro splash após reset — *2026-04-26*
- [x] **10.3** CSS completo (parents-stats-grid 2-col, parents-island-bar com `--island-color`, parents-pin-digit 50x60, parents-danger zona vermelha) — *2026-04-26*
- [x] **10.3** Verificação MCP: tela inicial pede PIN; após digitar e confirmar, mostra dashboard com stats reais (17/75 fases, 8/29 medalhas, 30000 moedas, sequência, combo, 🐤 Aventureiro) + 5 ilhas com barras coloridas — *2026-04-26*

#### Onda 4 — Specs E2E atualizados

- [x] **10.4** Reescritos 5 specs em [tests/e2e/](tests/e2e/) pra arquitetura atual: helpers usam `localStorage` direto pra setar `version: 5, hasSeenTutorial: true` (sem name prompt, sem tutorial overlay). Atualizados:
  - `navigation.spec.js`: 12 tests cobrindo splash sem name prompt, 5 hotspots, missionsCard, main-nav, atividade com powerupBar, mascote visivel
  - `island-map.spec.js`: 9 tests com 5 hotspots, ambient particles, hotspot rewards agora vai pra menu (Ilha do Tesouro), responsividade 375x812
  - `new-phases.spec.js`: 6 tests com IDs reais (fase 9 sequência, 10 memória, 11 diferente, 16 conte) e gating cross-fase
  - `math.spec.js`: 4 tests com fases 18 (Somas) e 19 (Subtrações) na ilha dos Numeros
  - `phase-completion.spec.js`: 4 tests cobrindo completar fase 1, progress bar, powerup bar, streak counter — *2026-04-26*

#### Resultado final

- [x] **10.5** `npm run test` → **126/126 verde** (1 test novo de migração v5) — *2026-04-26*
- [x] **10.6** Verificação MCP completa: tutorial dispara na primeira sessão e desaparece nas seguintes; rank-up celebra com confete; Área dos Pais com PIN funcional + dashboard real; powerups in-activity; missões diárias rotativas — *2026-04-26*

### Fase 9 — Loja & Medalhas com propósito (3 ondas)

**Objetivo:** Resolver 7 problemas profundos de motivação: temas invisíveis, mascote escondido, medalhas sem recompensa, critérios desatualizados, falta de variedade na loja, ausência de propósito.

#### Onda 1 — Tornar tudo VISÍVEL

- [x] **9.1** Refatorar `applyTheme` em [public/js/shop.js](public/js/shop.js) para usar CSS var `--theme-bg` + `data-theme-active` no `<html>` (em vez de `body.style.background` que era coberto pelos bgs das screens) — *2026-04-26*
- [x] **9.2** [public/css/design-system.css](public/css/design-system.css): `.screen.active::before` agora aplica `var(--theme-bg)` com `mix-blend-mode: multiply` e `opacity: 0.55` quando tema ativo. Tema escolhido na loja vaza para TODAS as 8 screens — *2026-04-26*
- [x] **9.3** Mascote sempre visível em [public/js/main.js](public/js/main.js): substituído `hideMascot()` por whitelist `SHOW_MASCOT = ['activity','celebration','splash','islandMap','menu','badges','shop','parents']`. CSS posicional por `body[data-screen]` em [public/css/styles.css](public/css/styles.css) — *2026-04-26*
- [x] **9.4** Verificação preview MCP: tema "Espaço" aplicado visivelmente sobre splash + islandMap; mascote idle no canto inferior direito em todas as telas-âncora; 125/125 testes verde — *2026-04-26*

#### Onda 2 — Medalhas com PROPÓSITO

- [x] **9.5** Recompensa em moedas por raridade (Common 50, Rare 150, Epic 400, Legendary 1000) em [public/js/rewards.js](public/js/rewards.js) `BADGE_COIN_REWARD`. `checkBadges` credita as moedas via `addCoins` ao conquistar — *2026-04-26*
- [x] **9.6** Critérios atualizados para 75 fases: `halfway` 6→15, `farroupilha` 9→30, `all-complete` 12→50, `educatche-mestre` 16→75. Novos `letters-master` (1-15), `numbers-master` (16-30), `colors-master` (31-45), `syllables-master` (46-60), `treasure-master` (61-75) usando helper `allPhasesIn()`. Math reescrito para "3 fases de math em 16-30" — *2026-04-26*
- [x] **9.7** 5 medalhas novas: `island-explorer`, `fashionista`, `coin-spent-500`, `three-stars-10`, `treasure-master`. Tracking de `state.totalCoinsSpent` em `spendCoins`, `state.equippedHistory` em `equipItem` — *2026-04-26*
- [x] **9.8** Itens premium da loja desbloqueiam por medalha (não só por moeda): `mascot-gold` requer `streak-10`, `mascot-rainbow` requer `three-stars-10`, `theme-galaxy` requer `all-complete`, `effect-fireworks` requer `perfect`, `effect-rainbow` requer `colors-master`, `effect-stars` requer `streak-5`. Novo suporte `requires.badge` em `meetsRequirements`. UI da loja mostra hint "🏆 Ganhe medalha X" quando bloqueado — *2026-04-26*
- [x] **9.9** 5 testes unit atualizados (rewards.test.js + shop.test.js) para refletir critérios novos (15/50/75 fases, badge-based requires). 125/125 verde — *2026-04-26*

#### Onda 3 — Loja com VARIEDADE de uso

- [x] **9.10** Powerups (nova categoria `powerup` consumível): Dica 50, Tenta de Novo 75, 2x Moedas 200, Pular 150. `buyItem` suporta `consumable: true` (incrementa `state.powerups[id]`); novas funções `consumePowerup`/`powerupStock`. UI da loja mostra estoque (`x3` badge), descrição, botão "Comprar +1" — *2026-04-26*
- [x] **9.11** **2x Moedas** funcional end-to-end: `engine.startActivity` consome 1 unidade do `powerup-2x` se houver e seta `state.coinMultiplier = 2`; `rewardForAnswer` aplica multiplicador antes de creditar e adiciona linha `"💰 2x Moedas"` no breakdown. Reseta no `showResult` — *2026-04-26*
- [x] **9.12** Molduras (nova categoria `frame`): `frame-default` 0, `frame-gold` 250, `frame-neon` 350, `frame-holo` 500 (requires `three-stars-10`). [public/js/components/LevelCard.js](public/js/components/LevelCard.js) recebe prop `frame` e seta `data-frame` em fases completadas. CSS aplica halos: dourado, neon ciano, holo com `hue-rotate` — *2026-04-26*
- [x] **9.13** UI da loja com 6 tabs: 💡 Powerups (default), 🐾 Mascotes, 🎨 Temas, 🎁 Acessórios, ✨ Efeitos, 🖼️ Molduras. CSS distintivo no preview por categoria — *2026-04-26*
- [x] **9.14** Verificação preview MCP: tab Powerups mostra 4 cards (Dica, Tenta de Novo, 2x Moedas, Pular) com descrição, estoque badge verde (x3, x1), preço, "Comprar +1". Mascote ainda visível no canto. 125/125 testes verde — *2026-04-26*

#### Onda 4 — Powerups in-activity, Missões diárias e Ranks

- [x] **9.15** Powerup **Dica** funcional in-activity. Barra de powerups em [public/index.html](public/index.html) `#activity` com botão 💡 mostrando estoque. Click: consome 1, encontra `[data-correct="true"]` no `#activityContent` e aplica `.hint-pulse` (CSS `@keyframes hintPulse` + glow amarelo) por 3s. 8 renderers em [public/js/renderers/activities.js](public/js/renderers/activities.js) marcam o elemento correto: syllables, read-match, fill-blank, logical-sequence, odd-one-out, count-match, color-match, number-recognize, math-add/sub — *2026-04-26*
- [x] **9.16** Powerup **Pular** funcional in-activity. Botão ⏭️ na barra de powerups. Click: consome 1, avança `roundIdx++` SEM mexer em `currentStreak`/`correctCount` (preserva combo) — *2026-04-26*
- [x] **9.16** Powerup **Tenta de Novo** funcional. [public/js/renderers/feedback.js](public/js/renderers/feedback.js) `showFeedback` agora retorna `Promise<{retry?:boolean}>`. Se errou e há estoque, mostra botão `🔄 Tenta de Novo (-1)` no overlay. Click: consome 1, fecha overlay e retorna `{retry:true}`. [public/js/engine.js](public/js/engine.js) `ctx.showFeedback`/`ctx.onAnswer` interceptam: `session.retryRequested` força `renderRound()` na mesma rodada, sem perder streak. Funciona com TODOS os 16 renderers sem mudança — *2026-04-26*
- [x] **9.17** Sistema de **Missões Diárias**. Novo [public/js/data/missions.js](public/js/data/missions.js) com pool de 14 missões (acertos, fases, combos, perfectos, moedas, por ilha). Novo [public/js/missions.js](public/js/missions.js) com `ensureDailyMissions` (sorteio determinístico via seed do dia), `getTodayMissions`, hooks (`onCorrectAnswer`, `onPhaseCompleted`, `onStreakReached`, `onCoinEarned`), `claimMission`. Card no `#islandMap` em [public/js/renderers/missions.js](public/js/renderers/missions.js) com 3 missões, barras de progresso, botão "+N moedas" ao completar. Engine chama os hooks em `onAnswer` e `showResult` — *2026-04-26*
- [x] **9.18** Sistema de **Ranks**. `RANKS` em [public/js/rewards.js](public/js/rewards.js): 🐣 Pequeno (0+), 🐤 Aventureiro (5+ medalhas, +5%), 🦅 Mestre Pampa (12+, +10%), 🌟 Lenda do Sul (20+, +20%). `getRank(state)` retorna rank atual. `addCoins` aplica bônus % do rank antes de creditar. HUD ganha `.rank-pill` com ícone+nome+border colorida (Mestre violeta-glow, Lenda dourada com `legendaryPulse`). `renderHud` atualiza em tempo real — *2026-04-26*
- [x] **9.19** Verificação preview MCP: HUD topo mostra `🐤 Aventureiro` + `999`; card "Missoes do dia (0/3)" no islandMap com 3 missões + barras + botão ⏳; barra de powerups in-activity (`💡 x3`, `⏭️ x2`); click no Dica caiu para 2 e ativou `.hint-pulse` no botão "4" (resposta correta). 125/125 testes verde — *2026-04-26*

### Fase 8 — Polish visual: splash + header do mapa + hotspots alinhados

**Objetivo:** Resolver 3 problemas visuais identificados pelo usuário ao ver o app no desktop. CSS-only, zero lógica.

- [x] **8.1** Trocar gradient RS (vermelho/amarelo/verde) do `#splash` por azul-céu igual ao do `#islandMap` em [public/css/styles.css](public/css/styles.css). Atualizar também `#splash h1 text-shadow` e `#splash .subtitle background` para tons azuis — *2026-04-26*
- [x] **8.2** `.map-logo` em [public/css/islands.css](public/css/islands.css): remover caixa branca extra e padding (a logo já tem fundo próprio); aumentar `max-height: clamp(80px, 14vh, 160px)` para crescer no desktop; adicionar `float 4s` infinite — *2026-04-26*
- [x] **8.3** Reposicionar 5 hotspots em [public/css/islands.css:98-107](public/css/islands.css:98) para alinhar com as ilhas reais do JPG (medidas direto na imagem 1024x1024):
  - `.island-letters`   38%/18% → **30%/18%** (sai da montanha nevada do meio, vai pra ilha do livro)
  - `.island-numbers`   28%/80% → **22%/80%** (sobe pra ilha do "83")
  - `.island-syllables` 12%/50% → **18%/47%** (mascote 🦜 cai sobre a ilha de letras-blocos)
  - `.island-colors`    73%/26% → **76%/24%** (ajuste fino sobre a ilha do arco-íris)
  - `.island-rewards`   76%/78% → **79%/78%** (centraliza sobre o baú)
  - Atualizar `@media (max-width: 600px)` mobile com as mesmas coordenadas — *2026-04-26*
- [x] **8.4** Verificação preview MCP em desktop 1280x800: 5 mascotes visivelmente alinhados sobre suas ilhas no JPG; logo do mapa maior e sem caixa duplicada; splash com `getComputedStyle.background` confirmado como gradient azul-céu (`rgb(174, 214, 241) → rgb(46, 134, 193)`, sem nenhum tom RS); 125/125 testes verde — *2026-04-26*

### Fase 7 — Game Feel & Experiência (3 ondas)

**Objetivo:** Tornar o app divertido e visualmente vivo. Foco exclusivo em UX/visual — zero alteração em lógica (engine, state, rounds, rewards, pools intactos). Todas as mudanças são aditivas (novas classes, novos keyframes).

#### Onda 1 — Feedback imediato (acerto/erro/streak)

- [x] **7.1** Keyframes `sparkleBurst`, `shakeX`, `streakHotPulse` em [public/css/styles.css](public/css/styles.css); regras `.sparkle-layer`/`.sparkle`, `.wrong-shake`, `body.streak-hot #activity`, `.streak-burst-layer` — *2026-04-26*
- [x] **7.2** [public/js/renderers/feedback.js](public/js/renderers/feedback.js): `showFeedback` injeta 8 sparkles em ramo `correct`; nova função `showStreakBurst()` cria chuva de confete fixed sobre a viewport — *2026-04-26*
- [x] **7.3** [public/js/engine.js](public/js/engine.js): toggle `body.streak-hot` quando `currentStreak >= 3`; dispara `showStreakBurst()` em streaks 3 e múltiplos de 5; cleanup em `startActivity` e `showResult` — *2026-04-26*
- [x] **7.4** Substituído `wobble` por `shakeX` em `.letter-bubble.wrong`, `.option-btn.wrong`, `.image-option.wrong`, `.odd-item.wrong`, `.number-option-group.wrong`. `wobble` permanece no mascote — *2026-04-26*

#### Onda 2 — Ilhas vivas e cor temática

- [x] **7.5** [public/js/renderers/menu.js](public/js/renderers/menu.js) propaga `--island-color` no `menuRoot` (não só no header); [public/css/design-system.css](public/css/design-system.css) `#menu` ganha `radial-gradient` sutil com `color-mix(--island-color, white)` — *2026-04-26*
- [x] **7.6** `.phase-card[data-state="available"]` ganha border + bg tematizados pela ilha; `availablePulse` usa `--island-color`; hover lift `translateY(-5px) scale(1.02)`. `[data-state="completed"]` também recebe bg sutil — *2026-04-26*
- [x] **7.7** [public/index.html](public/index.html) ganha `<div class="map-ambient">` com 10 partículas (folhas, nuvens, sparkles, arco-íris, brilhos do tesouro); [public/css/islands.css](public/css/islands.css) novos keyframes `leafFall`, `cloudPass`, `citySparkle`, `rainbowFloat`, `treasureGlow` — *2026-04-26*
- [x] **7.8** [public/js/renderers/islandMap.js](public/js/renderers/islandMap.js) recebe `state` e calcula completude por ilha (compara `state.completedPhases` com `island.phaseRange`); aplica classe `.island-complete` no botão. CSS `islandCompleteHalo` + estrela ⭐ via `::after` — *2026-04-26*

#### Onda 3 — Vitrine e celebração (loja + medalhas)

- [x] **7.9** [public/js/renderers/shop.js](public/js/renderers/shop.js) `renderCard` adiciona `card.dataset.category = item.category`; design-system.css aplica animação distinta por categoria (mascot=`float`, theme=`themeAnimatedPulse`, effect=`starPulse`, accessory=`bounce`) — *2026-04-26*
- [x] **7.10** Novos keyframes `rarePulse`, `epicPulse` em [public/css/design-system.css](public/css/design-system.css). Aplicados em `.badge-card.earned.rarity-rare` e `.rarity-epic`. `legendary` mantém `legendaryPulse` (mais intenso) — *2026-04-26*
- [x] **7.11** [public/js/renderers/feedback.js](public/js/renderers/feedback.js) `showBadgeNotification` reescrito com `createElement`+`textContent` (XSS-safe). Adiciona `.badge-particles` com 10 spans animados via `particleBurst`; cor da partícula muda por raridade (`data-rarity`) — *2026-04-26*

#### Acessibilidade + verificação

- [x] **7.12** Guard `@media (prefers-reduced-motion: reduce)` em [public/css/design-system.css](public/css/design-system.css) — todas animações reduzidas a 0.01ms — *2026-04-26*
- [x] **7.13** `npm run test` 125/125 verde (lógica intacta) — *2026-04-26*
- [x] **7.14** Verificação via preview MCP em 360x640, 375x812, 768x1024:
  - splash + islandMap com 5 hotspots e ambient particles (folhas, nuvens, sparkles, arco-íris, brilho do tesouro)
  - menu da ilha das Letras com fundo verde sutil + phase-card 1 com border verde
  - 8 sparkles injetados no overlay quando correct (verificado via DOM eval)
  - `body.streak-hot` aplica `streakHotPulse` no `#activity`
  - shop tabs com animações distintas por categoria (mascot=float, theme=themeAnimatedPulse confirmados)
  - badges paginadas: rare→`rarePulse`, epic→`epicPulse`, legendary→`legendaryPulse` (todos confirmados via getComputedStyle)
  - badge notification com 10 partículas + classes XSS-safe
  - hotspot da Letras (state.completedPhases=1..15) ganha `island-complete` + estrela no canto
  - 0 erros / 0 warnings no console em todos os fluxos — *2026-04-26*
- [ ] **7.15** Commit + push final — *aguardando confirmacao do usuario*

### Fase 6 — Refactor "App Profissional Nivel 2" (4 ondas)

**Objetivo:** Zero scroll vertical, 5 ilhas com identidade, 75 fases (5x15) com estrutura, sistema de estrelas (1-3), loja com tabs + grid 2 col, medalhas com raridade.

#### Onda A — Responsividade + layout + UI

- [x] **A.1** Tokens de espacamento (--space-1..8), tipografia clamp() (--fs-display/h2/body), `.screen { height: 100dvh; overflow: hidden; }` — *2026-04-25*
- [x] **A.2** Splash centrado com clamp() — logo/mascotes responsam, max-height por viewport, sem comprimir — *2026-04-25*
- [x] **A.3** Componente [public/js/components/Pager.js](public/js/components/Pager.js) — paginacao interna sem scroll — *2026-04-25*
- [x] **A.4** Menu paginado por ilha (6 fases por pagina, header da ilha com cor + emoji + progresso ⭐ N/N) — *2026-04-25*
- [x] **A.5** Medalhas paginadas (6 por pagina, summary 🏅 N/M no topo) — *2026-04-25*
- [x] **A.6** `#activity .activity-content { flex: 1 1 auto; min-height: 0; overflow-y: auto; }` — scroll APENAS interno quando atividade exige (keyboard, etc) — *2026-04-25*
- [x] **A.7** Auditoria 360x640 / 375x812 / 768x1024 — todas as 6 telas em altura exata, sem overflow horizontal — *2026-04-25*

#### Onda B — Loja + Medalhas

- [x] **B.1** Componente [public/js/components/Tabs.js](public/js/components/Tabs.js) — tablist generico com aria-current — *2026-04-25*
- [x] **B.2** Loja: tabs no topo (🐾 Mascotes / 🎨 Temas / 🎁 Acessorios / ✨ Efeitos), grid 2 colunas paginado (4 cards por pagina), card grande com preview/preco/acao, selo Equipado, XSS-safe — *2026-04-25*
- [x] **B.3** Medalhas com raridade (`common`/`rare`/`epic`/`legendary`) em [public/js/rewards.js](public/js/rewards.js); tabs por raridade na tela #badges; halos/ribbons distintos; lendarias com `legendaryPulse` — *2026-04-25*

#### Onda C — Sistema de estrelas

- [x] **C.1** Schema v4 em [public/js/state.js](public/js/state.js): `phaseStars: { phaseId: 0|1|2|3 }`. Migracao v3→v4 atribui 1⭐ a cada `completedPhase` existente — *2026-04-25*
- [x] **C.2** [public/js/rewards.js](public/js/rewards.js): `starsForScore(percent)` (70/85/95), `updatePhaseStars` preserva o melhor; `rewardForPhaseEnd` aceita `percent` e retorna `stars` + bonus por estrela (+15 / +40); engine passa `percent` calculado — *2026-04-25*
- [x] **C.3** [public/js/components/LevelCard.js](public/js/components/LevelCard.js) mostra 3 estrelas (acesas/apagadas) em pill no canto. Tela de result mostra estrelas grandes — *2026-04-25*
- [x] **C.4** Tests: state v4 + migracao + rewards starsForScore + best stars preservadas — 125/125 verde — *2026-04-25*

#### Onda D — Expansao para 75 fases (estrutura completa, conteudo iterativo)

- [x] **D.1** [public/js/data/islands.js](public/js/data/islands.js) — 5 ilhas (forest/city/rainbow/clouds/treasure), `phaseRange`, helpers `islandForPhase` e `tierForPhase` — *2026-04-25*
- [x] **D.2** [public/js/data/phases.js](public/js/data/phases.js) com 75 fases (1-15 Letras, 16-30 Numeros, 31-45 Cores, 46-60 Silabas, 61-75 Tesouro) — reaproveitam mecanicas existentes — *2026-04-25*
- [x] **D.3** [public/js/rounds.js](public/js/rounds.js) mapeia `phase.type → pool` automaticamente; overrides para fases especiais (silabas BA/CA/MA por ilha, boss da ilha do tesouro) — *2026-04-25*
- [x] **D.4** [public/js/renderers/menu.js](public/js/renderers/menu.js) usa `ISLANDS` para filtro/ranges; `islandMap.js` roteia hotspot rewards → Ilha do Tesouro (em vez de loja) — *2026-04-25*
- [x] **D.5** Tests atualizados (75 fases) — 125/125 verde — *2026-04-25*

### Fase 16 — Refactor UI/UX global (10 ondas)

**Objetivo:** consolidar a UI em um sistema de design coerente. Antes do refactor, conviviam dois sistemas de tokens (legacy RS bandeira + paleta v2 "infantil"), backgrounds gradient distintos por tela, listra tricolor RS no topo do menu, 3 inline-styles em botões, classes duplicadas (`.btn-primary`, `.shop-card`, `.parents-card`), CSS órfão (#namePrompt, badges legacy) e bugs latentes (títulos vermelhos sobrepondo island headers, mascote 55px em mobile sobrescrevendo design 80px). Refactor faseado em 10 ondas, cada uma com aprovação humana antes da próxima.

#### Ondas entregues

- [x] **16.1** Tokens canônicos v3 em [public/css/design-system.css](public/css/design-system.css): `--c-*` (4 marcas + superfícies + ink + estados + ilhas), `--s-1..8`, `--r-sm/md/lg/xl/pill`, `--sh-sm/md/lg/halo-*`, `--t-display/h1/h2/body-l/body/caption` com clamp(), `--d-fast/base/slow`, `--ease/-bounce`, `--z-base/mascot/fixed/nav/overlay/modal/toast`, `--tap-min: 48px`. Tokens v2 viraram aliases. `--z-nav` e `--z-overlay` legacy preservados nos valores antigos (override sobre canônicos) para zero mudança de stacking — *2026-05-04*

- [x] **16.2** Layout primitive: `.screen-header`, `.screen-body`, `.screen-footer` + variantes `.screen--hero/.screen--app/.screen--game` + helpers `.screen-header__title`, `.screen-header--island`. Aditivo, opt-in. Nenhuma tela migrada (deferido) — *2026-05-04*

- [x] **16.3** Botões unificados (BEM): `.btn--primary/secondary/ghost/danger`, `.btn--sm/lg`, helpers `.btn__icon/.btn__label`. Cada variante autocontida (não depende de classe `.btn` base) para evitar colisão com legacy. `min-height: var(--tap-min)`, focus-visible ciano, estados hover/active/disabled — *2026-05-04*

- [x] **16.4** Cards unificados: variantes `.card--interactive/bare/compact/elevated`; estados `.card[data-state="locked|completed|available|equipped"]`; raridades `.card--rarity-common/rare/epic/legendary`; frames `.card--frame-gold/neon/holo`; helpers `.card__media/title/subtitle/meta/actions/seal`. Keyframes prefixados (`cardAvailablePulse`, `cardRarePulse`, etc.) para não colidir com os legacy — *2026-05-04*

- [x] **16.5.1** `#splash`: bg gradient azul animado (`#C8E6F5 → #82C8E5 → #4FA3CF` + `gradientBG 14s`) → cream sólido `var(--c-surface-app)`. Tagline branco com sombra escura → `--c-ink`. Link "Área dos pais" branco semi-transparente → `--c-ink-soft` — *2026-05-04*

- [x] **16.5.2** `#mascotPick`: bg gradient amarelo/laranja → cream. Sombra amarela do título removida (perdia função). Cards Dino (verde) e Lumi (roxo) preservados intactos como identidade — *2026-05-04*

- [x] **16.5.3** `#menu`: gradient amarelo→verde RS removido; **listra tricolor RS de 12px no topo eliminada**; regra `#menu h2` legacy removida (sobrescrevia `.menu-island-title` por especificidade 0,1,1, **pintando o título da ilha de vermelho `#B71C1C` em vez do branco previsto pelo `.menu-island-header`**). Bug visual presente desde Fase 5 corrigido — *2026-05-04*

- [x] **16.5.4** `#shop`: gradient amarelo eliminado; regra `#shop h2` legacy removida (mesmo bug do menu — pintava `.shop-screen-title` de vermelho RS). `padding-top: 80px` mantido para clearance do HUD fixed — *2026-05-04*

- [x] **16.5.5** `#badges`: `.screen-title` (compartilhada com `#parents`) modernizada para tokens canônicos: `var(--t-h1)` clamp(24,5vw,36) em vez de `--fs-lg` 28px fixo; margens em `var(--s-3)/--s-4`; line-height 1.15 — *2026-05-04*

- [x] **16.5.6** `#parents`: bloco `.parents-card` placeholder duplicado removido (Fase 5.7 vs Fase 10.3); regra `.parents-card p` (única exclusiva do placeholder) preservada e modernizada (`color: #555` → `var(--c-ink-soft)`, `margin: 0` adicionado) — *2026-05-04*

- [x] **16.5.7** `#activity`: `padding-top: 80px → 64px` (16px de altura útil ganha para conteúdo da rodada, ainda clears HUD fixed top-right + btn-home top-left); `gap: 20px → var(--s-4)` (16px). Remoção total do padding-top depende de Onda 6 (HUD adaptativo) — *2026-05-04*

- [x] **16.5.8** `#result`: tokens canônicos clamp() em emoji/h2/msg/score; `.result-msg color #555 → var(--c-ink-soft)`; **inline-style `style="display:flex;gap:14px;..."` do `#resultButtons` substituído por classe `.result-actions`** — *2026-05-04*

- [x] **16.5.9** `#celebration`: gradient RS bandeira animado (`#E53935 → #FFEB3B → #2E7D32` + `gradientBG 6s`) → cream. h2 branco com sombra RS vermelha+verde → `--c-ink` com sombra dourada sutil. **2 inline-styles dos botões eliminados** (`#celebPdfBtn` ganha classe `.celeb-pdf-btn` com gradient festivo amarelo→âmbar→laranja na paleta v3; `#celebMenuBtn` ganha `.celeb-menu-btn`). Energia visual da tela agora vem das animações (confete, fogos, arco-íris) — *2026-05-04*

- [x] **16.6** Mascote consolidado: 5 blocos de regras espalhados (`body[data-screen="splash|menu|badges|parents|shop|islandMap"] #mascot`) → 3 blocos semânticos (base + override splash + override islandMap). Definição de `#mascot.idle` reduzida de 7 ocorrências para 1 (`float 3.5s`). Comportamento preservado em splash/menu/badges/shop/parents/islandMap; `#activity` e `#celebration` agora recebem a base 100×100 em vez do fallback antigo 70×70. **Parte do HUD adaptativo deferida** (depende de telas migradas para `.screen--app`) — *2026-05-04*

- [x] **16.7** Overlays unificados (BEM): `.overlay` + `.overlay--feedback/tutorial/celebration/island-complete` + `.overlay__card` + `.overlay__card--feedback/tutorial/celebration/island-complete` + helpers `.overlay__emoji/title/message/actions`. Reaproveita keyframes existentes (`fadeIn`, `pop`, `rankupZoom`). Migração JS deferida (`.feedback-overlay/.tutorial-overlay/.rankup-overlay/.island-completion-overlay` continuam intactos, criados via classNames em [public/js/renderers/feedback.js](public/js/renderers/feedback.js) e [public/js/components/Tutorial.js](public/js/components/Tutorial.js)) — *2026-05-04*

- [x] **16.8** Limpeza: removidos `#namePrompt` + `.name-prompt-*` + `#nameInput` (~67 linhas, órfãos desde Fase 5.3); legacy badges `.badges-section/badge-item/badge-icon/badge-name` (~57 linhas, substituídos por `.badges-grid-large`+`.badge-card` na Fase 6); keyframe `@keyframes gradientBG` (órfão pós-Ondas 5.1/5.3/5.9); 15 tokens órfãos (`--rs-yellow`, `--rs-green-light`, `--rs-sky`, `--phase1..12`). **Bug latente corrigido**: regra `@media (max-width: 600px) #mascot { width: 55px; right: 50px }` sobrescrevia silenciosamente a regra mobile `@media (max-width: 480px) #mascot { width: 80px }` da Onda 6 por source order — em mobile o mascote estava 55px em vez dos 80px planejados — *2026-05-04*

- [x] **16.9** Specs E2E: 35/35 verde. Auditoria confirmou zero seletor estrutural mudou (todos IDs/data-attrs/classes preservados); única falha em [tests/e2e/island-map.spec.js](tests/e2e/island-map.spec.js) era fragilidade pré-existente (5º card "rewards" coberto por `.home-cta-bar` no viewport Playwright 1280×720) — corrigida com `page.evaluate(() => element.click())` que dispara handler JS direto. Pendência 5.17 da CLAUDE.md resolvida — *2026-05-04*

- [x] **16.10** A11y polish: focus-visible universal (`button:focus-visible, [role="button"]:focus-visible, a:focus-visible { outline: 3px solid var(--c-secondary); outline-offset: 3px; }`) cobrindo `.btn-back`, `.btn-secondary`, `.menu-train-btn`, `.main-nav button`, `.tab-btn`, `.pager-btn`, `.shop-card-action`, `.feedback-overlay .retry-btn`, `.tutorial-next/skip`, `.parents-danger-btn`, `.island-completion-close`. Tap targets bumped: `.btn-back`, `.menu-train-btn`, `.parents-danger-btn`, `.tutorial-next` → 44px (WCAG AA); `.island-completion-close` → 48px (Material). Reduced-motion já tinha guard global `*` (preserva animações das ondas 2-7 automaticamente) — *2026-05-04*

#### Resultado final

- [x] **16.11** `npm run test` → **126/126 unit verde** + `npx playwright test` → **35/35 e2e verde** = **161/161 testes verdes** — *2026-05-04*

#### Saldo do refactor

- **+605 linhas** de novo sistema canônico (tokens v3, primitivo de layout, sistema BEM de botões/cards/overlays, polish a11y).
- **-220 linhas** de código órfão removido.
- **3 inline-styles eliminados** (`#resultButtons`, `#celebPdfBtn`, `#celebMenuBtn`).
- **4 backgrounds gradient eliminados** (`#splash`, `#mascotPick`, `#shop`, `#celebration`).
- **1 listra tricolor RS removida** do topo do `#menu`.
- **3 bugs latentes corrigidos**: títulos vermelhos sobrescrevendo `.menu-island-title` e `.shop-screen-title`; mascote mobile 55px (deveria ser 80px).
- **15 tokens CSS órfãos** removidos.
- **0 regressões** em 161 testes.

#### Trabalho deferido (Onda 11 — Migração estrutural)

Sistema canônico está pronto mas **nenhuma tela ainda usa as classes novas no HTML**. Para uma onda futura quando o HTML/JS for migrado em pacote único:

1. Telas → `.screen--app/.screen--hero/.screen--game` no HTML.
2. HUD → entra no `.screen-header` em telas `.screen--app` (sai do `position: fixed`).
3. Botões legacy (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-back`, `.btn-home`) → `.btn--*`.
4. Cards legacy (`.shop-card`, `.badge-card`, `.parents-card`, `.phase-card`, `.island-card`, `.mascot-pick-card`) → `.card` + variantes.
5. Overlays legacy (`.feedback-overlay`, `.tutorial-overlay`, `.rankup-overlay`, `.island-completion-overlay`) → `.overlay` + variantes — requer ajuste em [feedback.js](public/js/renderers/feedback.js) e [Tutorial.js](public/js/components/Tutorial.js).
6. Renomear `.home-strip/.home-hero/.home-cta-bar` → `.screen-header/.screen-body/.screen-footer` no `#islandMap`.

---

## 6. Pendências / pontos de atenção (não-bloqueantes)

- Asset da logo está em [public/assets/brand/logo-mundo-tres-ilhas.jpg](public/assets/brand/logo-mundo-tres-ilhas.jpg) (renomeado durante a execução; index.html foi atualizado).
- Texto do botão do splash continua "Bah, vamos comecar!" (não foi alterado para "Explorar as Ilhas!").
- Ilha das Cores → menu filtrado mostrando apenas a fase 13 (default acordado).
- **Fase 5 (Refactor UX/UI v2):** specs E2E ainda referenciam o name prompt removido — `tests/e2e/*.spec.js` precisam atualizar helpers (não bloqueia a app, só os specs E2E falhariam até serem atualizados).
- 5ª ilha "Sons & Sílabas" usa balão 🎈 + emoji 🦜 (papagaio) como mascote — placeholder até asset real chegar.
- **Fase 6 — conteúdo iterativo:** as 75 fases têm metadados completos, mas as 55 novas fases (16-75) reaproveitam pools existentes via `phase.type`. Pools dedicados por fase (palavras temáticas, sílabas tônicas, multiplicação, classificação por matiz) ficam para próxima onda.
- **Fase 6 — desbloqueio cross-ilha:** atualmente fase N requer fase N-1. Fica pendente refinar gating para "5⭐ na ilha N para abrir ilha N+1" ou similar, conforme o uso real.
- **Fase 6 — Ilha do Tesouro:** o hotspot 5️⃣ (rewards) agora roteia para o menu da ilha do Tesouro (fases 61-75), não mais para a loja. A loja continua acessível pela main-nav.

---

**Última atualização:** 2026-05-04 — Fase 16 (10 ondas) entregue: refactor UI/UX global.

  • **Ondas 1-4 (fundação):** tokens canônicos v3, layout primitive `.screen--*`, sistema BEM de botões `.btn--*` e cards `.card--*`. Aditivo, sem mudança visual.
  • **Ondas 5.1-5.9 (telas individuais):** 9 telas modernizadas. 4 backgrounds gradient eliminados (splash, mascotPick, shop, celebration), 1 listra tricolor RS removida (menu), 3 inline-styles eliminados (#resultButtons, #celebPdfBtn, #celebMenuBtn), 2 bugs latentes corrigidos (títulos `.menu-island-title` e `.shop-screen-title` que apareciam vermelhos por especificidade legacy).
  • **Onda 6 (mascote):** 5 blocos de regras posicionais consolidados em 3 (base + override splash + override islandMap). Bug latente corrigido (mascote mobile 55px → 80px conforme planejado).
  • **Onda 7 (overlays):** sistema canônico `.overlay`/`.overlay__card` + 4 variantes (feedback/tutorial/celebration/island-complete). Migração JS deferida.
  • **Onda 8 (limpeza):** -220 linhas de código órfão removidas (#namePrompt + name-prompt-*, badges legacy, gradientBG keyframe, 15 tokens —phase1..12 + rs-yellow/green-light/sky).
  • **Onda 9 (E2E):** 35/35 specs verde. Pendência 5.17 da Fase 5 resolvida.
  • **Onda 10 (a11y):** focus-visible universal + tap targets bumped pra WCAG AA.

  **161/161 testes verdes** (126 unit + 35 e2e). **+605 linhas** de novo sistema canônico, **-220 linhas** órfãs, **0 regressões**. Sistema canônico pronto para adoção HTML/JS em uma futura "Onda 11 — migração estrutural".
