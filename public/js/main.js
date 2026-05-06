// Bootstrap da aplicacao. Carrega estado, aplica tema/mascote, conecta telas e botoes.

import { loadState, saveState, resetState } from './state.js';
import { applyTheme } from './shop.js';
import { applyMascotLook, setMascot, hideMascot } from './renderers/mascot.js';
import { renderMenu, renderHud, animateCoinGain } from './renderers/menu.js';
import { renderShop } from './renderers/shop.js';
import { renderIslandMap } from './renderers/islandMap.js';
import { renderMissionsCard } from './renderers/missions.js';
import { startTutorial } from './components/Tutorial.js';
import { renderParents } from './renderers/parents.js';
import { renderBadges } from './renderers/badges.js';
import { initEngine, startActivity, getCurrentPhase, triggerCelebration } from './engine.js';
import { applyDailyBonus } from './rewards.js';
import { downloadPrizePDF } from './pdf.js';
import { showCoinToast } from './renderers/feedback.js';
import { soundBigReward, soundClick } from './audio.js';

let state = loadState();

// Nome padrao por enquanto. Quando a "Area dos pais" tiver PIN, ela editara isso.
const DEFAULT_NAME = 'Guri';

function getPlayerName() {
    return state.playerName && state.playerName.trim() ? state.playerName : DEFAULT_NAME;
}

// ===== Navegacao entre telas =====
const NAV_VISIBLE_SCREENS = new Set(['islandMap', 'menu', 'shop', 'badges', 'parents']);
const HOME_BTN_HIDDEN_SCREENS = new Set(['splash', 'menu', 'islandMap', 'shop', 'badges', 'parents']);

function showScreen(id) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) homeBtn.style.display = HOME_BTN_HIDDEN_SCREENS.has(id) ? 'none' : 'block';

    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        const visible = NAV_VISIBLE_SCREENS.has(id);
        mainNav.style.display = visible ? 'flex' : 'none';
        document.body.classList.toggle('has-main-nav', visible);
        const playMap = { play: 'islandMap', badges: 'badges', shop: 'shop' };
        mainNav.querySelectorAll('button[data-nav]').forEach((btn) => {
            const target = playMap[btn.dataset.nav];
            btn.setAttribute('aria-current', target === id ? 'true' : 'false');
        });
    }

    // Fase 9 - Onda 1: mascote VISIVEL em todas as telas-ancora (splash, mapa, menu, badges, shop, parents).
    // Antes ele so aparecia em #activity/#celebration — agora a customizacao da loja e visivel sempre.
    const SHOW_MASCOT = ['activity', 'celebration', 'splash', 'islandMap', 'menu', 'badges', 'shop', 'parents'];
    if (id === 'activity') setMascot('idle', state);
    else if (id === 'celebration') setMascot('celebrating', state);
    else if (SHOW_MASCOT.includes(id)) setMascot('idle', state);
    else hideMascot();

    // Marca a screen no body para CSS posicionar o mascote (canto certo, tamanho certo).
    document.body.dataset.screen = id;
}

function showMenu(filter = 'all') {
    showScreen('menu');
    renderMenu(
        state,
        (phaseId) => startActivity(phaseId),
        showShop,
        filter,
        (phaseId) => startActivity(phaseId, { review: true }), // Fase 12.2
    );
}

function showIslandMap() {
    showScreen('islandMap');
    renderIslandMap({
        state,
        onPickSection: (section) => showMenu(section),
        onOpenShop: showShop,
        // Fase 15: CTA "Continuar" -> proxima fase desbloqueada (ou no-op se completo).
        onContinue: (phase) => { if (phase) startActivity(phase.id); },
    });
    // Fase 9.17: card de missoes diarias.
    renderMissionsCard(state, (reward) => {
        animateCoinGain(state.coins - reward, state.coins);
        renderHud(state);
    });
    // Fase 10.2: tutorial inicial dispara apenas na primeira visita ao mapa.
    if (!state.hasSeenTutorial) {
        // Pequeno delay pra garantir que o mapa esta renderizado.
        setTimeout(() => {
            startTutorial({
                steps: [
                    {
                        title: '\u{1F44B} Bem-vindo ao Mundo das Tres Ilhas!',
                        text: 'Esse e o seu mapa. Cada ilha tem fases divertidas pra voce aprender brincando.',
                    },
                    {
                        title: '\u{1F3AF} Toque numa ilha pra comecar',
                        text: 'Comece pelas Letras com o Tomi! Depois explore Numeros, Cores e mais.',
                        target: '.island-letters',
                    },
                    {
                        title: '\u{1FA99} Acerte rapido pra ganhar moedas',
                        text: 'Quanto mais rapido voce acerta, mais moedas ganha. Faca combos pra dobrar o premio!',
                    },
                    {
                        title: '\u{1F3C5} Conquiste medalhas na Loja',
                        text: 'Use moedas na Loja pra comprar temas, mascotes, dicas e muito mais. Boa sorte, guri!',
                        target: '.main-nav button[data-nav="shop"]',
                        position: 'top',
                    },
                ],
                onDone: () => {
                    state.hasSeenTutorial = true;
                    saveState(state);
                },
            });
        }, 500);
    }
}

function showShop() {
    showScreen('shop');
    renderShop(state, showIslandMap);
}

function showBadges() {
    showScreen('badges');
    renderBadges(state);
}

function showParents() {
    showScreen('parents');
    // Fase 10.3: dashboard real com PIN.
    renderParents(state, () => {
        // Reset do progresso da crianca: recarrega state e volta pro splash.
        state = loadState();
        applyTheme(state);
        applyMascotLook(state);
        renderHud(state);
        showScreen('splash');
    });
}

function showCelebrationScreen(phase) {
    showScreen('celebration');
    const name = getPlayerName();
    document.getElementById('celebTitle').textContent = `Parabens, ${name}!`;
    document.getElementById('celebSub').textContent = phase ? `Voce completou: ${phase.subtitle}` : '';
    triggerCelebration(state);
}

function showSplash() {
    showScreen('splash');
}

// Fase 14: tela de escolha do mascote (primeira sessao apenas).
function showMascotPick() {
    showScreen('mascotPick');
    // Renderiza ambos SVGs (dino e unicornio) nos cards de escolha.
    import('./renderers/mascot.js').then(({ renderMascotPickPreview }) => {
        if (renderMascotPickPreview) renderMascotPickPreview();
    });
    document.querySelectorAll('.mascot-pick-card').forEach((card) => {
        card.onclick = () => {
            soundClick();
            const type = card.dataset.mascotType;
            state.mascotType = type;
            saveState(state);
            applyMascotLook(state);
            showIslandMap();
        };
    });
}

// ===== Wiring =====
function wire() {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.onclick = () => {
        soundClick();
        // Fase 14: primeira sessao -> escolher mascote antes do mapa.
        if (!state.mascotType) showMascotPick();
        else showIslandMap();
    };

    const parentsBtn = document.getElementById('parentsBtn');
    if (parentsBtn) parentsBtn.onclick = () => { soundClick(); showParents(); };

    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) homeBtn.onclick = showIslandMap;

    const menuBackBtn = document.getElementById('menuBackBtn');
    if (menuBackBtn) menuBackBtn.onclick = () => { soundClick(); showIslandMap(); };

    const badgesBackBtn = document.getElementById('badgesBackBtn');
    if (badgesBackBtn) badgesBackBtn.onclick = () => { soundClick(); showIslandMap(); };

    const parentsBackBtn = document.getElementById('parentsBackBtn');
    if (parentsBackBtn) parentsBackBtn.onclick = () => { soundClick(); showSplash(); };

    const mainNav = document.getElementById('mainNav');
    if (mainNav) {
        mainNav.querySelectorAll('button[data-nav]').forEach((btn) => {
            btn.onclick = () => {
                soundClick();
                const dest = btn.dataset.nav;
                if (dest === 'play') showIslandMap();
                else if (dest === 'badges') showBadges();
                else if (dest === 'shop') showShop();
            };
        });
    }

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.onclick = () => {
        if (confirm('Tem certeza que quer apagar todo o progresso?')) {
            state = resetState();
            applyTheme(state);
            applyMascotLook(state);
            renderHud(state);
            showSplash();
        }
    };

    const celebMenuBtn = document.getElementById('celebMenuBtn');
    if (celebMenuBtn) celebMenuBtn.onclick = showIslandMap;

    const celebPdfBtn = document.getElementById('celebPdfBtn');
    if (celebPdfBtn) celebPdfBtn.onclick = () => downloadPrizePDF(state, getCurrentPhase());
}

// ===== Inicializacao =====
function boot() {
    applyTheme(state);
    applyMascotLook(state);
    renderHud(state);

    initEngine({
        state,
        onShowScreen: showScreen,
        onShowMenu: showIslandMap,
        onShowCelebration: showCelebrationScreen,
    });

    wire();

    // Bonus de login diario (so concede uma vez por dia)
    const dailyPrev = state.coins || 0;
    const daily = applyDailyBonus(state, new Date());
    if (daily.coinsAwarded > 0) {
        saveState(state);
        soundBigReward();
        showCoinToast(daily.coinsAwarded, daily.breakdown);
        animateCoinGain(dailyPrev, state.coins);
        renderHud(state);
    }

    showSplash();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

// Expoe utilitario para outros modulos lerem o nome sem depender do main.
export function currentPlayerName() {
    return getPlayerName();
}
