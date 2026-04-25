// Bootstrap da aplicação. Carrega estado, aplica tema/mascote, conecta telas e botões.

import { loadState, saveState, resetState } from './state.js';
import { applyTheme } from './shop.js';
import { applyMascotLook, setMascot, hideMascot } from './renderers/mascot.js';
import { renderMenu, renderHud, animateCoinGain } from './renderers/menu.js';
import { renderShop } from './renderers/shop.js';
import { renderIslandMap } from './renderers/islandMap.js';
import { initEngine, startActivity, getCurrentPhase, triggerCelebration } from './engine.js';
import { applyDailyBonus } from './rewards.js';
import { downloadPrizePDF } from './pdf.js';
import { showCoinToast } from './renderers/feedback.js';
import { soundBigReward } from './audio.js';

let state = loadState();

// Nome padrão caso a criança ainda não tenha digitado (primeiro acesso).
const DEFAULT_NAME = 'Guri';

function sanitizeName(raw) {
    if (!raw) return '';
    const onlyLetters = String(raw).replace(/[^A-Za-zÀ-ÿ\s'-]/g, '');
    return onlyLetters.trim().replace(/\s+/g, ' ').slice(0, 16);
}

function getPlayerName() {
    return state.playerName && state.playerName.trim() ? state.playerName : DEFAULT_NAME;
}

function applyPlayerNameToUI() {
    const name = getPlayerName();
    const menuTitle = document.getElementById('menuTitle');
    if (menuTitle) menuTitle.textContent = `Ola, ${name}! Escolha uma fase!`;
    const shopTitle = document.getElementById('shopTitle');
    if (shopTitle) shopTitle.textContent = `Loja do ${name}`;
    const splashSub = document.getElementById('splashSubtitle');
    if (splashSub) splashSub.textContent = `Bah ${name}, bora aprender a ler e escrever!`;
}

// ===== Navegação entre telas =====
function showScreen(id) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) homeBtn.style.display = (id === 'splash' || id === 'menu' || id === 'namePrompt' || id === 'islandMap') ? 'none' : 'block';

    if (id === 'activity') setMascot('idle', state);
    else if (id === 'celebration') setMascot('celebrating', state);
    else hideMascot();
}

function showMenu(filter = 'all') {
    applyPlayerNameToUI();
    showScreen('menu');
    renderMenu(state, (phaseId) => startActivity(phaseId), showShop, filter);
}

function showIslandMap() {
    applyPlayerNameToUI();
    showScreen('islandMap');
    renderIslandMap({
        onPickSection: (section) => showMenu(section),
        onOpenShop: showShop,
    });
}

function showShop() {
    applyPlayerNameToUI();
    showScreen('shop');
    renderShop(state, showIslandMap);
}

function showCelebrationScreen(phase) {
    showScreen('celebration');
    const name = getPlayerName();
    document.getElementById('celebTitle').textContent = `Parabens, ${name}!`;
    document.getElementById('celebSub').textContent = phase ? `Voce completou: ${phase.subtitle}` : '';
    triggerCelebration(state);
}

function showSplash() {
    applyPlayerNameToUI();
    showScreen('splash');
}

function showNamePrompt() {
    showScreen('namePrompt');
    const input = document.getElementById('nameInput');
    if (input) {
        input.value = state.playerName || '';
        setTimeout(() => input.focus(), 100);
    }
}

function confirmName() {
    const input = document.getElementById('nameInput');
    const raw = input ? input.value : '';
    const clean = sanitizeName(raw);
    state.playerName = clean || DEFAULT_NAME;
    saveState(state);
    applyPlayerNameToUI();
    showSplash();
}

// ===== Wiring =====
function wire() {
    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.onclick = showIslandMap;

    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) homeBtn.onclick = showIslandMap;

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.onclick = () => {
        if (confirm('Tem certeza que quer apagar todo o progresso?')) {
            state = resetState();
            applyTheme(state);
            applyMascotLook(state);
            renderHud(state);
            showNamePrompt();
        }
    };

    const celebMenuBtn = document.getElementById('celebMenuBtn');
    if (celebMenuBtn) celebMenuBtn.onclick = showIslandMap;

    const celebPdfBtn = document.getElementById('celebPdfBtn');
    if (celebPdfBtn) celebPdfBtn.onclick = () => downloadPrizePDF(state, getCurrentPhase());

    const nameConfirmBtn = document.getElementById('nameConfirmBtn');
    if (nameConfirmBtn) nameConfirmBtn.onclick = confirmName;

    const nameInput = document.getElementById('nameInput');
    if (nameInput) {
        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                confirmName();
            }
        });
    }
}

// ===== Inicialização =====
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

    // Bônus de login diário (só concede uma vez por dia)
    const dailyPrev = state.coins || 0;
    const daily = applyDailyBonus(state, new Date());
    if (daily.coinsAwarded > 0) {
        saveState(state);
        soundBigReward();
        showCoinToast(daily.coinsAwarded, daily.breakdown);
        animateCoinGain(dailyPrev, state.coins);
        renderHud(state);
    }

    // Primeiro acesso: pergunta o nome. Caso contrário, vai direto ao splash.
    if (!state.playerName || !state.playerName.trim()) {
        showNamePrompt();
    } else {
        applyPlayerNameToUI();
        showSplash();
    }
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
