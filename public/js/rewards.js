// Sistema de medalhas + economia de moedas + bônus diário.
// Todas as funções aqui são puras ou mutam o state passado como argumento
// para facilitar testes e reutilização.

import { todayStr, daysBetween } from './utils.js';

export const BADGE_DEFS = [
    { id: 'first-star',    name: 'Primeira Estrela', icon: '\u{1F31F}', desc: 'Complete sua primeira fase' },
    { id: 'streak-3',      name: 'Combo 3',           icon: '\u{1F525}', desc: '3 acertos seguidos' },
    { id: 'streak-5',      name: 'Combo 5',           icon: '\u{1F4A5}', desc: '5 acertos seguidos' },
    { id: 'streak-10',     name: 'Combo 10',          icon: '\u{26A1}',  desc: '10 acertos seguidos' },
    { id: 'perfect',       name: 'Perfeito',          icon: '\u{1F48E}', desc: '100% em uma fase' },
    { id: 'halfway',       name: 'Metade',            icon: '\u{1F3C5}', desc: 'Complete 6 fases' },
    { id: 'logic-start',   name: 'Logico',            icon: '\u{1F9E0}', desc: 'Complete uma fase de logica' },
    { id: 'all-complete',  name: 'Mestre',            icon: '\u{1F451}', desc: 'Complete todas as fases' },
    { id: 'memory-master', name: 'Memoria',           icon: '\u{1F0CF}', desc: 'Complete o jogo da memoria' },
    { id: 'coin-100',      name: 'Moedeiro',          icon: '\u{1FA99}', desc: 'Ganhe 100 moedas' },
    { id: 'coin-1000',     name: 'Rico',              icon: '\u{1F4B0}', desc: 'Ganhe 1000 moedas' },
    { id: 'shopper',       name: 'Comprador',         icon: '\u{1F6D2}', desc: 'Compre seu primeiro item' },
    { id: 'daily-3',       name: 'Dedicado',          icon: '\u{1F4C5}', desc: '3 dias seguidos' },
    { id: 'daily-7',       name: 'Semanal',           icon: '\u{1F3C6}', desc: '7 dias seguidos' },
    { id: 'pila-500',      name: 'Pila',              icon: '\u{1F911}', desc: 'Junte 500 pilas' },
    { id: 'tche-legal',    name: 'Tche Legal',        icon: '\u{1F3C7}', desc: 'Complete 3 fases' },
    { id: 'farroupilha',   name: 'Farroupilha',       icon: '\u{1F3F3}\u{FE0F}', desc: 'Complete 9 fases' },
    { id: 'bah-tri',       name: 'Bah Tri!',          icon: '\u{1F947}', desc: 'Streak de 7 acertos' },
    { id: 'colors-master', name: 'Arco-Iris',         icon: '\u{1F308}', desc: 'Complete a fase das Cores' },
    { id: 'numbers-master',name: 'Numero 1',          icon: '\u{1F522}', desc: 'Complete a fase dos Numeros' },
    { id: 'math-star',     name: 'Pequeno Matematico',icon: '\u{2795}',  desc: 'Complete Somas e Subtracoes' },
    { id: 'educatche-mestre', name: 'Mestre EducaTche', icon: '\u{1F3C5}', desc: 'Complete todas as 16 fases' },
];

// Concede medalhas novas. Retorna array com os ids recém-concedidos.
export function checkBadges(state, extra) {
    const newBadges = [];
    const award = (id) => {
        if (!state.badges.includes(id)) {
            state.badges.push(id);
            newBadges.push(id);
        }
    };
    if (state.completedPhases.length >= 1) award('first-star');
    if (state.completedPhases.length >= 6) award('halfway');
    if (state.completedPhases.length >= 12) award('all-complete');
    if (state.completedPhases.length >= 16) award('educatche-mestre');
    if (state.completedPhases.includes(13)) award('colors-master');
    if (state.completedPhases.includes(14)) award('numbers-master');
    if (state.completedPhases.includes(15) && state.completedPhases.includes(16)) award('math-star');
    if (state.bestStreak >= 3) award('streak-3');
    if (state.bestStreak >= 5) award('streak-5');
    if (state.bestStreak >= 10) award('streak-10');
    if (extra === 'perfect') award('perfect');
    if (state.completedPhases.some((id) => id >= 9)) award('logic-start');
    if (extra === 'memory-master') award('memory-master');
    if (state.totalCoinsEarned >= 100) award('coin-100');
    if (state.totalCoinsEarned >= 1000) award('coin-1000');
    if (state.ownedItems && state.ownedItems.length > 0) award('shopper');
    if (state.dailyStreak >= 3) award('daily-3');
    if (state.dailyStreak >= 7) award('daily-7');
    if (state.totalCoinsEarned >= 500) award('pila-500');
    if (state.completedPhases.length >= 3) award('tche-legal');
    if (state.completedPhases.length >= 9) award('farroupilha');
    if (state.bestStreak >= 7) award('bah-tri');
    return newBadges;
}

// ========== Economia de Moedas ==========

export const COIN_REWARDS = {
    correct: 5,
    fastCorrect: 10,         // substitui correct quando respondeu rápido
    streakBonus3: 15,        // ao atingir streak=3
    streakBonus5: 30,        // ao atingir streak=5
    streakBonus10: 100,      // ao atingir streak=10
    phaseComplete: 50,       // ao passar fase (≥70%)
    phasePerfect: 150,       // bônus extra se 100%
    dailyLogin: 100,         // primeiro acesso do dia
    dailyStreak3: 300,       // bônus ao completar 3º dia seguido
    dailyStreak7: 1000,      // bônus ao completar 7º dia seguido
    firstTimeCompletePhase: 25, // extra na primeira vez que completa uma fase nova
};

export const FAST_ANSWER_MS = 3000;

// Adiciona `amount` moedas. Não aceita valores negativos.
// Retorna { coinsAwarded, total } para a UI animar.
export function addCoins(state, amount) {
    if (!amount || amount <= 0) return { coinsAwarded: 0, total: state.coins || 0 };
    const prev = state.coins || 0;
    state.coins = prev + amount;
    state.totalCoinsEarned = (state.totalCoinsEarned || 0) + amount;
    return { coinsAwarded: amount, total: state.coins };
}

export function spendCoins(state, amount) {
    if (!amount || amount < 0) return false;
    if ((state.coins || 0) < amount) return false;
    state.coins -= amount;
    return true;
}

// Recompensa por uma resposta correta. Considera tempo de resposta e streak.
// Retorna objeto com detalhamento para a UI mostrar os bônus.
export function rewardForAnswer(state, { correct, responseMs, newStreak }) {
    if (!correct) return { coinsAwarded: 0, breakdown: [] };
    const breakdown = [];
    let total = 0;
    if (responseMs != null && responseMs < FAST_ANSWER_MS) {
        breakdown.push({ label: 'Rapido!', coins: COIN_REWARDS.fastCorrect });
        total += COIN_REWARDS.fastCorrect;
    } else {
        breakdown.push({ label: 'Acertou', coins: COIN_REWARDS.correct });
        total += COIN_REWARDS.correct;
    }
    if (newStreak === 3) {
        breakdown.push({ label: 'Combo 3!',  coins: COIN_REWARDS.streakBonus3 });
        total += COIN_REWARDS.streakBonus3;
    } else if (newStreak === 5) {
        breakdown.push({ label: 'Combo 5!',  coins: COIN_REWARDS.streakBonus5 });
        total += COIN_REWARDS.streakBonus5;
    } else if (newStreak === 10) {
        breakdown.push({ label: 'Combo 10!', coins: COIN_REWARDS.streakBonus10 });
        total += COIN_REWARDS.streakBonus10;
    }
    addCoins(state, total);
    return { coinsAwarded: total, breakdown };
}

// Recompensa no fim de uma fase.
export function rewardForPhaseEnd(state, { phaseId, passed, perfect, firstTime }) {
    if (!passed) return { coinsAwarded: 0, breakdown: [] };
    const breakdown = [];
    let total = COIN_REWARDS.phaseComplete;
    breakdown.push({ label: 'Passou de fase', coins: COIN_REWARDS.phaseComplete });
    if (perfect) {
        total += COIN_REWARDS.phasePerfect;
        breakdown.push({ label: 'Perfeito!', coins: COIN_REWARDS.phasePerfect });
    }
    if (firstTime) {
        total += COIN_REWARDS.firstTimeCompletePhase;
        breakdown.push({ label: 'Primeira vez', coins: COIN_REWARDS.firstTimeCompletePhase });
    }
    addCoins(state, total);
    return { coinsAwarded: total, breakdown };
}

// Chamado ao carregar o app. Se for o primeiro acesso do dia, concede bônus
// e atualiza dailyStreak. Retorna o bônus concedido ou 0.
export function applyDailyBonus(state, now) {
    const today = todayStr(now);
    if (state.lastPlayDay === today) return { coinsAwarded: 0, breakdown: [], newStreak: state.dailyStreak };
    const breakdown = [{ label: 'Entrou hoje!', coins: COIN_REWARDS.dailyLogin }];
    let total = COIN_REWARDS.dailyLogin;

    if (state.lastPlayDay) {
        const gap = daysBetween(state.lastPlayDay, today);
        if (gap === 1) {
            state.dailyStreak = (state.dailyStreak || 0) + 1;
        } else {
            state.dailyStreak = 1;
        }
    } else {
        state.dailyStreak = 1;
    }

    if (state.dailyStreak === 3) {
        total += COIN_REWARDS.dailyStreak3;
        breakdown.push({ label: '3 dias seguidos!', coins: COIN_REWARDS.dailyStreak3 });
    } else if (state.dailyStreak === 7) {
        total += COIN_REWARDS.dailyStreak7;
        breakdown.push({ label: '7 dias seguidos!', coins: COIN_REWARDS.dailyStreak7 });
    }

    state.lastPlayDay = today;
    addCoins(state, total);
    return { coinsAwarded: total, breakdown, newStreak: state.dailyStreak };
}
