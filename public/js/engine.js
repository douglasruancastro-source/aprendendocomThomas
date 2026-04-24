// Engine: orquestra uma fase — sorteio de rodadas, render, streak, recompensa, fim de fase.
// Recebe callbacks do main.js para navegar entre telas e atualizar HUD.

import { phaseById } from './data/phases.js';
import { buildRoundsForPhase, recordRoundsSeen } from './rounds.js';
import { ACTIVITY_RENDERERS } from './renderers/activities.js';
import { showFeedback } from './renderers/feedback.js';
import { setMascot } from './renderers/mascot.js';
import { animateCoinGain, renderHud } from './renderers/menu.js';
import { celebrate } from './renderers/celebration.js';
import { saveState } from './state.js';
import { soundComplete, soundBigReward, soundBadge, soundStreak } from './audio.js';
import { checkBadges, rewardForAnswer, rewardForPhaseEnd, BADGE_DEFS } from './rewards.js';
import { recordPhaseResult } from './difficulty.js';
import { showBadgeNotification, showCoinToast } from './renderers/feedback.js';

// Estado em memória da sessão atual. Reset em startActivity.
const session = {
    state: null,
    phase: null,
    rounds: [],
    roundIdx: 0,
    correctCount: 0,
    currentStreak: 0,
    roundStart: 0,
    onShowScreen: null,
    onShowMenu: null,
    onShowCelebration: null,
};

export function initEngine({ state, onShowScreen, onShowMenu, onShowCelebration }) {
    session.state = state;
    session.onShowScreen = onShowScreen;
    session.onShowMenu = onShowMenu;
    session.onShowCelebration = onShowCelebration;
}

export function startActivity(phaseId) {
    const state = session.state;
    const phase = phaseById(phaseId);
    if (!phase) return;
    session.phase = phase;
    session.rounds = buildRoundsForPhase(state, phaseId);
    session.roundIdx = 0;
    session.correctCount = 0;
    session.currentStreak = 0;

    if (!session.rounds || session.rounds.length === 0) {
        // Pool vazio — volta ao menu. Não deveria acontecer em fases implementadas.
        session.onShowMenu();
        return;
    }

    session.onShowScreen('activity');
    document.getElementById('activityTitle').textContent = phase.subtitle;
    document.getElementById('activityTitle').style.color = phase.color;
    document.getElementById('streakDisplay').classList.remove('active');
    setMascot('idle', state);
    renderRound();
}

function renderRound() {
    const { rounds, roundIdx, phase, state } = session;
    const total = rounds.length;
    document.getElementById('roundInfo').textContent = `Rodada ${roundIdx + 1} de ${total}`;
    const fill = document.getElementById('progressFill');
    fill.style.width = (roundIdx / total * 100) + '%';
    fill.style.background = phase.color;
    document.getElementById('instruction').textContent = phase.instruction;

    const content = document.getElementById('activityContent');
    content.innerHTML = '';
    const round = rounds[roundIdx];
    const renderer = ACTIVITY_RENDERERS[phase.type];
    if (!renderer) return;

    session.roundStart = performance.now();

    const ctx = {
        state,
        content,
        showFeedback: (correct, msg) => showFeedback(state, correct, msg),
        onAnswer: (correct) => onAnswer(correct),
        onMemoryWin: () => {
            // Concedido quando memória foi rápida; checa badge.
            const awarded = checkBadges(state, 'memory-master');
            awarded.forEach((id, i) => {
                const def = BADGE_DEFS.find((b) => b.id === id);
                setTimeout(() => {
                    showBadgeNotification(def);
                    soundBadge();
                }, i * 1500);
            });
        },
    };
    renderer(ctx, round);
}

function onAnswer(wasCorrect) {
    const { state } = session;
    const responseMs = performance.now() - session.roundStart;

    // Streak
    if (wasCorrect) {
        session.currentStreak++;
        state.streak = session.currentStreak;
        if (session.currentStreak > state.bestStreak) state.bestStreak = session.currentStreak;
        state.totalCorrect++;
        session.correctCount++;
    } else {
        session.currentStreak = 0;
        state.streak = 0;
    }

    // Moedas por resposta
    const prevCoins = state.coins || 0;
    const answerReward = rewardForAnswer(state, {
        correct: wasCorrect,
        responseMs,
        newStreak: session.currentStreak,
    });
    if (answerReward.coinsAwarded > 0) {
        animateCoinGain(prevCoins, state.coins);
    }

    // UI de streak
    const streakDisp = document.getElementById('streakDisplay');
    const streakCount = document.getElementById('streakCount');
    if (session.currentStreak >= 2) {
        streakDisp.classList.add('active');
        streakCount.textContent = session.currentStreak;
        if (session.currentStreak >= 5) soundStreak();
    } else {
        streakDisp.classList.remove('active');
    }

    // Medalhas gerais
    const newBadges = checkBadges(state);
    newBadges.forEach((id, i) => {
        const def = BADGE_DEFS.find((b) => b.id === id);
        setTimeout(() => {
            showBadgeNotification(def);
            soundBadge();
        }, i * 1500);
    });

    saveState(state);
    renderHud(state);

    session.roundIdx++;
    if (session.roundIdx >= session.rounds.length) showResult();
    else renderRound();
}

function showResult() {
    const { state, phase, rounds, correctCount } = session;
    const total = rounds.length;
    const passed = correctCount >= Math.ceil(total * 0.7);
    const perfect = correctCount === total;
    const firstTime = passed && !state.completedPhases.includes(phase.id);

    session.onShowScreen('result');
    document.getElementById('resultEmoji').textContent = passed ? '\uD83C\uDF89' : '\uD83D\uDE15';
    const playerName = (state.playerName && state.playerName.trim()) || 'Guri';
    document.getElementById('resultTitle').textContent = passed ? `Parabens, ${playerName}!` : 'Quase la!';
    document.getElementById('resultMsg').textContent = passed
        ? 'Voce foi muito bem nessa fase!'
        : 'Nao desista, tente de novo!';
    document.getElementById('resultScore').textContent = `Acertou ${correctCount} de ${total}`;
    document.getElementById('resultScore').style.color = passed ? 'var(--correct)' : 'var(--wrong)';

    // Registra dificuldade adaptativa e anti-repetição
    recordPhaseResult(state, phase.id, correctCount, total);
    recordRoundsSeen(state, phase.id, rounds);

    const btns = document.getElementById('resultButtons');
    btns.innerHTML = '';

    if (passed) {
        if (firstTime) state.completedPhases.push(phase.id);
        soundComplete();

        const prevCoins = state.coins;
        const reward = rewardForPhaseEnd(state, { phaseId: phase.id, passed, perfect, firstTime });
        if (reward.coinsAwarded > 0) {
            soundBigReward();
            showCoinToast(reward.coinsAwarded, reward.breakdown);
            animateCoinGain(prevCoins, state.coins);
        }

        const newBadges = checkBadges(state, perfect ? 'perfect' : null);
        newBadges.forEach((id, i) => {
            const def = BADGE_DEFS.find((b) => b.id === id);
            setTimeout(() => {
                showBadgeNotification(def);
                soundBadge();
            }, i * 1500);
        });

        saveState(state);
        renderHud(state);

        const celebBtn = document.createElement('button');
        celebBtn.className = 'btn';
        celebBtn.style.background = 'linear-gradient(135deg,#FF6F00,#FFA726)';
        celebBtn.textContent = 'Ver meu premio!';
        celebBtn.onclick = () => session.onShowCelebration(phase);
        btns.appendChild(celebBtn);
    } else {
        saveState(state);
        const retryBtn = document.createElement('button');
        retryBtn.className = 'btn';
        retryBtn.style.background = 'linear-gradient(135deg,#FF7043,#FF8A65)';
        retryBtn.textContent = 'Tentar de novo';
        retryBtn.onclick = () => startActivity(phase.id);
        btns.appendChild(retryBtn);
    }

    const menuBtn = document.createElement('button');
    menuBtn.className = 'btn btn-primary';
    menuBtn.textContent = 'Voltar ao Menu';
    menuBtn.onclick = () => session.onShowMenu();
    btns.appendChild(menuBtn);
}

export function getCurrentPhase() {
    return session.phase;
}

export function triggerCelebration(state) {
    celebrate(state);
}
