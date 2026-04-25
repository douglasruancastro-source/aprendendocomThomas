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

---

## 6. Pendências / pontos de atenção (não-bloqueantes)

- Asset da logo está em [public/assets/brand/logo-mundo-tres-ilhas.jpg](public/assets/brand/logo-mundo-tres-ilhas.jpg) (renomeado durante a execução; index.html foi atualizado).
- Texto do botão do splash continua "Bah, vamos comecar!" (não foi alterado para "Explorar as Ilhas!").
- Ilha das Cores → menu filtrado mostrando apenas a fase 13 (default acordado).

---

**Última atualização:** 2026-04-24 — Mundo das Três Ilhas entregue: mapa, hotspots, mascotes, filtros do menu, testes e2e atualizados, verificação visual completa.
