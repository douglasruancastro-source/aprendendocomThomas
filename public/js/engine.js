// Engine: orquestra uma fase — sorteio de rodadas, render, streak, recompensa, fim de fase.
// Recebe callbacks do main.js para navegar entre telas e atualizar HUD.

import { phaseById } from './data/phases.js';
import { buildRoundsForPhase, recordRoundsSeen } from './rounds.js';
import { ACTIVITY_RENDERERS } from './renderers/activities.js';
import { showFeedback } from './renderers/feedback.js';
import { setMascot } from './renderers/mascot.js';
import { animateCoinGain, renderHud } from './renderers/menu.js';
import { celebrate, spawnConfetti } from './renderers/celebration.js';
import { saveState } from './state.js';
import { soundComplete, soundBigReward, soundBadge, soundStreak } from './audio.js';
import { checkBadges, rewardForAnswer, rewardForPhaseEnd, BADGE_DEFS } from './rewards.js';
import { recordPhaseResult } from './difficulty.js';
import { showBadgeNotification, showCoinToast, showStreakBurst, showRankUpCelebration, showIslandCompletionCelebration, showHintHelper } from './renderers/feedback.js';
import { consumePowerup, powerupStock } from './shop.js';
import { onCorrectAnswer, onPhaseCompleted, onStreakReached, onCoinEarned } from './missions.js';
import { getRank, addCoins } from './rewards.js';
import { islandForPhase } from './data/islands.js';

// Wrapper: captura rank antes de checkBadges, dispara celebracao se subiu (Fase 10.1).
function checkBadgesAndRankUp(state, extra) {
    const oldRank = getRank(state);
    const awarded = checkBadges(state, extra);
    const newRank = getRank(state);
    if (newRank.id !== oldRank.id) {
        // Atrasa celebracao um pouco pra dar espaco aos toasts de medalha individuais.
        setTimeout(() => showRankUpCelebration(newRank), Math.max(800, awarded.length * 1500 + 500));
    }
    return awarded;
}

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
    retryRequested: false, // Fase 9.16: flag para o powerup "Tenta de Novo"
    isReview: false,        // Fase 12.2: marca atividade como revisao (sem recompensas plenas)
};

export function initEngine({ state, onShowScreen, onShowMenu, onShowCelebration }) {
    session.state = state;
    session.onShowScreen = onShowScreen;
    session.onShowMenu = onShowMenu;
    session.onShowCelebration = onShowCelebration;
}

export function startActivity(phaseId, opts = {}) {
    const state = session.state;
    const phase = phaseById(phaseId);
    if (!phase) return;
    session.phase = phase;
    session.rounds = buildRoundsForPhase(state, phaseId);
    session.roundIdx = 0;
    session.correctCount = 0;
    session.currentStreak = 0;
    session.isReview = !!opts.review; // Fase 12.2

    if (!session.rounds || session.rounds.length === 0) {
        // Pool vazio — volta ao menu. Não deveria acontecer em fases implementadas.
        session.onShowMenu();
        return;
    }

    session.onShowScreen('activity');
    const titleEl = document.getElementById('activityTitle');
    titleEl.textContent = (session.isReview ? '🎲 Revisao: ' : '') + phase.subtitle;
    titleEl.style.color = phase.color;
    document.getElementById('streakDisplay').classList.remove('active');
    document.body.classList.remove('streak-hot'); // limpa aura de sessao anterior
    setMascot('idle', state);

    // Fase 13.2: 2x Moedas agora e TOGGLE manual (nao mais auto-consumido).
    // Reseta multiplicador a cada inicio de fase; criança ativa pelo botao quando quiser.
    state.coinMultiplier = 1;
    saveState(state);

    renderRound();
}

// Atualiza a barra de powerups (Fase 9.15/9.16/13.2/13.3): mostra estoque + estado ativo.
function renderPowerupBar() {
    const bar = document.getElementById('powerupBar');
    if (!bar) return;
    bar.querySelectorAll('.powerup-btn').forEach((btn) => {
        const id = btn.dataset.powerup;
        const stock = powerupStock(session.state, id);
        btn.dataset.stock = String(stock);
        const stockEl = btn.querySelector('.pw-stock');
        if (stockEl) stockEl.textContent = stock;
        // 2x Moedas tem estado especial "ativo" (consumido pra essa fase).
        if (id === 'powerup-2x') {
            const isActive = session.state.coinMultiplier === 2;
            btn.classList.toggle('active', isActive);
            btn.disabled = isActive ? false : stock === 0;
        } else {
            btn.disabled = stock === 0;
        }
        // Re-bind onclick (idempotente).
        btn.onclick = () => onPowerupClick(id, btn);
    });
}

// Despacha o powerup clicado.
function onPowerupClick(id, btnEl) {
    // 2x Moedas pode ser clicado se ja esta ativo (mesmo sem estoque) so para info.
    const stock = powerupStock(session.state, id);
    if (id !== 'powerup-2x' && stock === 0) return;
    if (id === 'powerup-hint')       useHint();
    else if (id === 'powerup-skip')  useSkip();
    else if (id === 'powerup-retry') useRetry();
    else if (id === 'powerup-2x')    useDoubleCoins();
    btnEl.classList.add('flash');
    setTimeout(() => btnEl.classList.remove('flash'), 500);
}

// Fase 13.1: dicas textuais para fases sem [data-correct] (find-vowels, build-word, etc).
function buildHintText(phase, round) {
    if (!phase || !round) return null;
    switch (phase.type) {
        case 'find-vowels':
            return 'Toque nas VOGAIS: A, E, I, O, U';
        case 'find-consonants':
            return 'Vogais sao A, E, I, O, U. Tudo que NAO e vogal e consoante!';
        case 'build-word':
            return `A palavra e: ${round.word}`;
        case 'type-word':
            return `Digite: ${round.word}`;
        case 'build-sentence':
            return `Frase: "${round.sentence.join(' ')}"`;
        case 'memory-game':
            return 'Vire 2 cartas iguais para fazer par!';
        case 'syllable-build':
            return `Junte para formar: ${round.word}`;
        default:
            return null;
    }
}

// 9.15 + 13.1: Pisca a resposta correta. Se nao houver alvo marcado,
// mostra dica textual no topo da tela. Em ambos os casos consome powerup.
function useHint() {
    const content = document.getElementById('activityContent');
    if (!content) return;
    const target = content.querySelector('[data-correct="true"]');
    if (target) {
        consumePowerup(session.state, 'powerup-hint');
        saveState(session.state);
        target.classList.add('hint-pulse');
        setTimeout(() => target.classList.remove('hint-pulse'), 3000);
        renderPowerupBar();
        return;
    }
    // Fallback: dica textual baseada no tipo da fase + round atual.
    const round = session.rounds[session.roundIdx];
    const text = buildHintText(session.phase, round);
    if (!text) return; // tipo sem dica registrada — nao consome.
    consumePowerup(session.state, 'powerup-hint');
    saveState(session.state);
    showHintHelper(text);
    renderPowerupBar();
}

// 9.16: Pula a rodada atual SEM perder streak (mas tambem NAO conta como acerto).
function useSkip() {
    consumePowerup(session.state, 'powerup-skip');
    saveState(session.state);
    renderPowerupBar();
    // Avanca sem mexer em streak/correctCount.
    session.roundIdx++;
    if (session.roundIdx >= session.rounds.length) showResult();
    else renderRound();
}

// 13.3: Tenta de novo - re-renderiza a rodada atual sem perder streak/correctCount.
// Util quando criança quer "rebobinar" antes de errar de novo.
function useRetry() {
    consumePowerup(session.state, 'powerup-retry');
    saveState(session.state);
    renderPowerupBar();
    // Re-renderiza a mesma rodada (DOM novo, sem clicks aplicados).
    renderRound();
}

// 13.2: 2x Moedas como TOGGLE manual. Ja ativo? Mostra info. Senao, consome 1 e ativa.
function useDoubleCoins() {
    if (session.state.coinMultiplier === 2) return; // ja ativo, nao reconsome
    if (powerupStock(session.state, 'powerup-2x') === 0) return;
    consumePowerup(session.state, 'powerup-2x');
    session.state.coinMultiplier = 2;
    saveState(session.state);
    renderPowerupBar();
    showHintHelper('\u{1F4B0} 2x Moedas ATIVO! Acerte rapido!');
}

function renderRound() {
    const { rounds, roundIdx, phase, state } = session;
    const total = rounds.length;
    document.getElementById('roundInfo').textContent = `Rodada ${roundIdx + 1} de ${total}`;
    const fill = document.getElementById('progressFill');
    fill.style.width = (roundIdx / total * 100) + '%';
    fill.style.background = phase.color;
    document.getElementById('instruction').textContent = phase.instruction;
    renderPowerupBar();

    const content = document.getElementById('activityContent');
    content.innerHTML = '';
    const round = rounds[roundIdx];
    const renderer = ACTIVITY_RENDERERS[phase.type];
    if (!renderer) return;

    session.roundStart = performance.now();

    const ctx = {
        state,
        content,
        showFeedback: async (correct, msg) => {
            const result = await showFeedback(state, correct, msg);
            // Fase 9.16: se a tela de feedback retornou retry=true (usuario clicou "Tenta de Novo"),
            // marcamos a flag para onAnswer ignorar a resposta errada e re-renderizar a rodada.
            if (result && result.retry) session.retryRequested = true;
            return result;
        },
        onAnswer: (correct) => {
            if (session.retryRequested) {
                session.retryRequested = false;
                // Re-renderiza a mesma rodada sem mexer em streak/correctCount/idx.
                renderRound();
                return;
            }
            onAnswer(correct);
        },
        onMemoryWin: () => {
            // Concedido quando memória foi rápida; checa badge.
            const awarded = checkBadgesAndRankUp(state, 'memory-master');
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
        // Fase 9.17: missoes diarias
        onCorrectAnswer(state);
        onStreakReached(state, session.currentStreak);
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
    // Fase 12.2: revisao da apenas 50% das moedas (evita farming).
    if (session.isReview && answerReward.coinsAwarded > 0) {
        const halfBack = Math.ceil(answerReward.coinsAwarded / 2);
        state.coins = Math.max(0, state.coins - halfBack);
        state.totalCoinsEarned = Math.max(0, state.totalCoinsEarned - halfBack);
    }
    if (answerReward.coinsAwarded > 0) {
        animateCoinGain(prevCoins, state.coins);
        onCoinEarned(state, answerReward.coinsAwarded); // 9.17 missoes
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

    // Aura quente + confete inline em streaks notaveis (Fase 7 - Game Feel).
    if (session.currentStreak >= 3) {
        document.body.classList.add('streak-hot');
        // Disparo: 3 (primeira vez) e multiplos de 5 dali pra frente.
        if (session.currentStreak === 3 || (session.currentStreak >= 5 && session.currentStreak % 5 === 0)) {
            showStreakBurst();
        }
    } else {
        document.body.classList.remove('streak-hot');
    }

    // Medalhas gerais
    const newBadges = checkBadgesAndRankUp(state);
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

    document.body.classList.remove('streak-hot'); // limpa aura ao sair da atividade
    state.coinMultiplier = 1; // reseta o powerup 2x apos a fase
    session.onShowScreen('result');
    document.getElementById('resultEmoji').textContent = passed ? '\uD83C\uDF89' : '\uD83D\uDE15';
    const playerName = (state.playerName && state.playerName.trim()) || 'Guri';
    const percentScore = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // Fase 12.3: emoji + mensagem motivacional variam pela faixa de score.
    let resEmoji, resMsg;
    if (perfect) {
        resEmoji = '\u{1F3C6}';
        resMsg = `${playerName}, voce arrasou! 100% perfeito!`;
    } else if (percentScore >= 95) {
        resEmoji = '\u{1F31F}';
        resMsg = `Quase perfeito, ${playerName}! Voce e um craque!`;
    } else if (percentScore >= 85) {
        resEmoji = '\u{1F389}';
        resMsg = 'Excelente trabalho! Continue assim!';
    } else if (percentScore >= 70) {
        resEmoji = '\u{1F44D}';
        resMsg = 'Mandou bem! Voce esta aprendendo rapido!';
    } else {
        resEmoji = '\u{1F4AA}';
        resMsg = 'Quase la! Nao desista, voce consegue!';
    }
    if (passed) document.getElementById('resultEmoji').textContent = resEmoji;
    document.getElementById('resultTitle').textContent = passed
        ? (session.isReview ? `${playerName}, treino completo!` : `Parabens, ${playerName}!`)
        : 'Quase la!';
    document.getElementById('resultMsg').textContent = passed ? resMsg : 'Cada erro te ensina algo. Tenta de novo!';
    document.getElementById('resultScore').textContent = `Acertou ${correctCount} de ${total}`;
    document.getElementById('resultScore').style.color = passed ? 'var(--correct)' : 'var(--wrong)';

    // Registra dificuldade adaptativa e anti-repetição
    recordPhaseResult(state, phase.id, correctCount, total);
    recordRoundsSeen(state, phase.id, rounds);

    const btns = document.getElementById('resultButtons');
    btns.innerHTML = '';

    if (passed) {
        // Fase 12.2: revisao nao mexe em progresso/missoes/cerimonias.
        if (session.isReview) {
            soundComplete();
            saveState(state);
            renderHud(state);
            const menuBtn = document.createElement('button');
            menuBtn.className = 'btn btn-primary';
            menuBtn.textContent = 'Voltar ao Menu';
            menuBtn.onclick = () => session.onShowMenu();
            btns.appendChild(menuBtn);
            return;
        }

        if (firstTime) state.completedPhases.push(phase.id);
        soundComplete();

        // Fase 13.7: dispara effect equipado tambem na tela #result, nao so #celebration.
        // Atrasa um pouco para os toasts de moedas/medalhas aparecerem primeiro.
        setTimeout(() => celebrate(state), 600);

        // Fase 9.17: missoes diarias - completar fase / perfeita / por ilha.
        onPhaseCompleted(state, phase.id, perfect);

        // Fase 11.1: cerimonia de ilha 100% completa (somente quando termina pela 1a vez).
        if (firstTime) {
            const island = islandForPhase(phase.id);
            if (island) {
                const [from, to] = island.phaseRange;
                const allDone = state.completedPhases.length > 0 &&
                    Array.from({ length: to - from + 1 }, (_, i) => from + i)
                        .every((id) => state.completedPhases.includes(id));
                if (allDone) {
                    const ISLAND_BONUS = 500;
                    addCoins(state, ISLAND_BONUS);
                    // Atrasa pra dar espaco aos toasts de moeda/medalha do fim de fase normal.
                    setTimeout(() => showIslandCompletionCelebration(island, ISLAND_BONUS), 2200);
                }
            }
        }

        const prevCoins = state.coins;
        const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
        const reward = rewardForPhaseEnd(state, { phaseId: phase.id, passed, perfect, firstTime, percent });
        if (reward.coinsAwarded > 0) {
            soundBigReward();
            showCoinToast(reward.coinsAwarded, reward.breakdown);
            animateCoinGain(prevCoins, state.coins);
            onCoinEarned(state, reward.coinsAwarded);
        }
        // Mostra estrelas conquistadas
        if (reward.stars > 0) {
            const starsEl = document.createElement('div');
            starsEl.className = 'result-stars';
            for (let i = 0; i < 3; i++) {
                const s = document.createElement('span');
                s.className = 'result-star ' + (i < reward.stars ? 'on' : 'off');
                s.textContent = '⭐';
                starsEl.appendChild(s);
            }
            document.getElementById('resultScore').appendChild(starsEl);
        }

        const newBadges = checkBadgesAndRankUp(state, perfect ? 'perfect' : null);
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
