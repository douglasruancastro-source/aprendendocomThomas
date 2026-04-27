// Sistema de medalhas + economia de moedas + bônus diário.
// Todas as funções aqui são puras ou mutam o state passado como argumento
// para facilitar testes e reutilização.

import { todayStr, daysBetween } from './utils.js';

// Raridades:
//   common    — facil de conquistar, primeiros marcos
//   rare      — exige progresso consistente
//   epic      — desafios significativos
//   legendary — feito de fim de jogo / mestre
export const RARITY_ORDER = ['common', 'rare', 'epic', 'legendary'];
export const RARITY_LABELS = {
    common:    'Comum',
    rare:      'Raro',
    epic:      'Epico',
    legendary: 'Lendario',
};

// Recompensa em moedas ao conquistar a medalha (Fase 9 - Onda 2).
export const BADGE_COIN_REWARD = {
    common:    50,
    rare:      150,
    epic:      400,
    legendary: 1000,
};

// ===== Sistema de Ranks (Fase 9.18) =====
// Cada rank tem requisito de medalhas e bonus em % de moedas extra.
// Ranks dao sensacao de progressao e recompensa "passiva" (multiplicador permanente).
export const RANKS = [
    { id: 'rookie',    name: 'Pequeno',         icon: '\u{1F423}', minBadges: 0,  bonusPercent: 0  },
    { id: 'adventurer',name: 'Aventureiro',     icon: '\u{1F424}', minBadges: 5,  bonusPercent: 5  },
    { id: 'master',    name: 'Mestre Pampa',    icon: '\u{1F985}', minBadges: 12, bonusPercent: 10 },
    { id: 'legend',    name: 'Lenda do Sul',    icon: '\u{1F31F}', minBadges: 20, bonusPercent: 20 },
];

// Determina o rank atual com base na quantidade de medalhas conquistadas.
export function getRank(state) {
    const count = (state.badges || []).length;
    let current = RANKS[0];
    for (const r of RANKS) {
        if (count >= r.minBadges) current = r;
    }
    return current;
}

// Retorna o proximo rank (ou null se ja estiver no maximo) - util para mostrar progresso.
export function getNextRank(state) {
    const count = (state.badges || []).length;
    return RANKS.find((r) => r.minBadges > count) || null;
}

export const BADGE_DEFS = [
    // ===== Comuns =====
    { id: 'first-star',    name: 'Primeira Estrela', icon: '\u{1F31F}', desc: 'Complete sua primeira fase',     rarity: 'common' },
    { id: 'streak-3',      name: 'Combo 3',           icon: '\u{1F525}', desc: '3 acertos seguidos',             rarity: 'common' },
    { id: 'tche-legal',    name: 'Bom Comeco',        icon: '\u{1F3C7}', desc: 'Complete 3 fases',                rarity: 'common' },
    { id: 'shopper',       name: 'Comprador',         icon: '\u{1F6D2}', desc: 'Compre seu primeiro item',        rarity: 'common' },
    { id: 'coin-100',      name: 'Moedeiro',          icon: '\u{1FA99}', desc: 'Ganhe 100 moedas',                rarity: 'common' },
    { id: 'logic-start',   name: 'Logico',            icon: '\u{1F9E0}', desc: 'Complete uma fase de logica',     rarity: 'common' },
    // Novas (Fase 9 - Onda 2)
    { id: 'island-explorer', name: 'Explorador',      icon: '\u{1F5FA}\u{FE0F}', desc: 'Visite as 5 ilhas',         rarity: 'common' },
    { id: 'fashionista',     name: 'Estiloso',        icon: '\u{1F3A8}', desc: 'Equipe 3 visuais diferentes',         rarity: 'common' },

    // ===== Raros =====
    { id: 'streak-5',      name: 'Combo 5',           icon: '\u{1F4A5}', desc: '5 acertos seguidos',             rarity: 'rare' },
    { id: 'halfway',       name: 'Metade',            icon: '\u{1F3C5}', desc: 'Complete 15 fases',              rarity: 'rare' },
    { id: 'farroupilha',   name: 'Aventureiro',       icon: '\u{1F3F3}\u{FE0F}', desc: 'Complete 30 fases',      rarity: 'rare' },
    { id: 'memory-master', name: 'Memoria',           icon: '\u{1F0CF}', desc: 'Complete o jogo da memoria',      rarity: 'rare' },
    { id: 'letters-master', name: 'Mestre das Letras', icon: '\u{1F4DA}', desc: 'Complete a Ilha das Letras',      rarity: 'rare' },
    { id: 'numbers-master', name: 'Mestre dos Numeros', icon: '\u{1F522}', desc: 'Complete a Ilha dos Numeros',     rarity: 'rare' },
    { id: 'daily-3',       name: 'Dedicado',          icon: '\u{1F4C5}', desc: '3 dias seguidos',                 rarity: 'rare' },
    { id: 'pila-500',      name: 'Tesoureiro',        icon: '\u{1F911}', desc: 'Junte 500 moedas',                rarity: 'rare' },
    // Nova (Fase 9 - Onda 2)
    { id: 'coin-spent-500', name: 'Gastador',          icon: '\u{1F4B8}', desc: 'Gaste 500 moedas na loja',         rarity: 'rare' },

    // ===== Epicos =====
    { id: 'streak-10',     name: 'Combo 10',          icon: '\u{26A1}',  desc: '10 acertos seguidos',             rarity: 'epic' },
    { id: 'bah-tri',       name: 'Sequencia Triplice', icon: '\u{1F947}', desc: 'Streak de 7 acertos',            rarity: 'epic' },
    { id: 'perfect',       name: 'Perfeito',          icon: '\u{1F48E}', desc: '100% em uma fase',                rarity: 'epic' },
    { id: 'math-star',     name: 'Pequeno Matematico',icon: '\u{2795}',  desc: 'Complete 3 fases de Somas/Subtracoes', rarity: 'epic' },
    { id: 'coin-1000',     name: 'Rico',              icon: '\u{1F4B0}', desc: 'Ganhe 1000 moedas',               rarity: 'epic' },
    { id: 'daily-7',       name: 'Semanal',           icon: '\u{1F3C6}', desc: '7 dias seguidos',                 rarity: 'epic' },
    { id: 'colors-master', name: 'Arco-Iris Mestre', icon: '\u{1F308}', desc: 'Complete a Ilha das Cores',         rarity: 'epic' },
    { id: 'syllables-master', name: 'Mestre das Silabas', icon: '\u{1F388}', desc: 'Complete a Ilha das Silabas',  rarity: 'epic' },
    // Nova (Fase 9 - Onda 2)
    { id: 'three-stars-10', name: 'Tres Estrelas',     icon: '\u{2B50}', desc: 'Conquiste 3 estrelas em 10 fases', rarity: 'epic' },

    // ===== Lendarios =====
    { id: 'all-complete',  name: 'Mestre',            icon: '\u{1F451}', desc: 'Complete 50 fases',                rarity: 'legendary' },
    { id: 'educatche-mestre', name: 'Mestre EducaTche', icon: '\u{1F31F}', desc: 'Complete todas as 75 fases',     rarity: 'legendary' },
    { id: 'treasure-master', name: 'Mestre do Tesouro', icon: '\u{1F48E}', desc: 'Complete a Ilha do Tesouro',     rarity: 'legendary' },
];

// Verifica se TODAS as fases de uma faixa foram completas.
function allPhasesIn(state, from, to) {
    for (let id = from; id <= to; id++) {
        if (!state.completedPhases.includes(id)) return false;
    }
    return true;
}

// Conta quantas ilhas tem pelo menos 1 fase completada (usado pra `island-explorer`).
function islandsVisited(state) {
    const ranges = [[1,15],[16,30],[31,45],[46,60],[61,75]];
    return ranges.filter(([f,t]) => state.completedPhases.some((id) => id >= f && id <= t)).length;
}

// Conta fases com 3 estrelas.
function threeStarsCount(state) {
    if (!state.phaseStars) return 0;
    return Object.values(state.phaseStars).filter((s) => s >= 3).length;
}

// Concede medalhas novas. Retorna array com os ids recém-concedidos.
// Tambem credita moedas via BADGE_COIN_REWARD (Fase 9 - Onda 2).
export function checkBadges(state, extra) {
    const newBadges = [];
    const award = (id) => {
        if (!state.badges.includes(id)) {
            state.badges.push(id);
            newBadges.push(id);
            // Recompensa em moedas pela raridade.
            const def = BADGE_DEFS.find((b) => b.id === id);
            if (def) {
                const coins = BADGE_COIN_REWARD[def.rarity] || 0;
                if (coins > 0) addCoins(state, coins);
            }
        }
    };

    // ===== Marcos por completude (criterios atualizados pras 75 fases) =====
    if (state.completedPhases.length >= 1)  award('first-star');
    if (state.completedPhases.length >= 3)  award('tche-legal');
    if (state.completedPhases.length >= 15) award('halfway');     // antes 6 -> agora 15 (1 ilha completa)
    if (state.completedPhases.length >= 30) award('farroupilha'); // antes 9 -> agora 30 (2 ilhas)
    if (state.completedPhases.length >= 50) award('all-complete'); // antes 12 -> agora 50
    if (state.completedPhases.length >= 75) award('educatche-mestre'); // antes 16 -> agora 75 (todas)

    // ===== Mestria por ilha (todas as fases da ilha) =====
    if (allPhasesIn(state,  1, 15)) award('letters-master');
    if (allPhasesIn(state, 16, 30)) award('numbers-master');
    if (allPhasesIn(state, 31, 45)) award('colors-master');
    if (allPhasesIn(state, 46, 60)) award('syllables-master');
    if (allPhasesIn(state, 61, 75)) award('treasure-master');

    // ===== Streak / acertos =====
    if (state.bestStreak >= 3)  award('streak-3');
    if (state.bestStreak >= 5)  award('streak-5');
    if (state.bestStreak >= 7)  award('bah-tri');
    if (state.bestStreak >= 10) award('streak-10');

    // ===== Eventos pontuais =====
    if (extra === 'perfect') award('perfect');
    if (extra === 'memory-master') award('memory-master');

    // ===== Logica = qualquer fase com types de logica concluida.
    // Usa heuristica simples: se tem fases >= 6 da ilha das letras (que cobrem logica), entra. =====
    if (state.completedPhases.some((id) => id >= 6 && id <= 15)) award('logic-start');

    // ===== Matematica: 3 fases de math-add ou math-sub (estao em 16-30) =====
    const mathPhases = state.completedPhases.filter((id) => id >= 16 && id <= 30).length;
    if (mathPhases >= 3) award('math-star');

    // ===== Moedas =====
    if (state.totalCoinsEarned >= 100)  award('coin-100');
    if (state.totalCoinsEarned >= 500)  award('pila-500');
    if (state.totalCoinsEarned >= 1000) award('coin-1000');

    // ===== Loja =====
    if (state.ownedItems && state.ownedItems.length > 0) award('shopper');
    if ((state.totalCoinsSpent || 0) >= 500) award('coin-spent-500');

    // ===== Dia a dia =====
    if (state.dailyStreak >= 3) award('daily-3');
    if (state.dailyStreak >= 7) award('daily-7');

    // ===== Novas (Fase 9 - Onda 2) =====
    if (islandsVisited(state) >= 5) award('island-explorer');
    if (threeStarsCount(state) >= 10) award('three-stars-10');

    // Conta quantos visuais diferentes foram equipados ao longo do tempo.
    if ((state.equippedHistory && state.equippedHistory.length >= 3)) award('fashionista');

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
// Fase 9.18: aplica bonus do rank atual antes de creditar.
export function addCoins(state, amount) {
    if (!amount || amount <= 0) return { coinsAwarded: 0, total: state.coins || 0 };
    const rank = getRank(state);
    const bonus = rank.bonusPercent > 0 ? Math.round(amount * rank.bonusPercent / 100) : 0;
    const finalAmount = amount + bonus;
    const prev = state.coins || 0;
    state.coins = prev + finalAmount;
    state.totalCoinsEarned = (state.totalCoinsEarned || 0) + finalAmount;
    return { coinsAwarded: finalAmount, total: state.coins, rankBonus: bonus };
}

export function spendCoins(state, amount) {
    if (!amount || amount < 0) return false;
    if ((state.coins || 0) < amount) return false;
    state.coins -= amount;
    state.totalCoinsSpent = (state.totalCoinsSpent || 0) + amount;
    return true;
}

// Recompensa por uma resposta correta. Considera tempo de resposta e streak.
// Retorna objeto com detalhamento para a UI mostrar os bônus.
// Fase 9 - Onda 3: aplica multiplicador 2x quando state.coinMultiplier=2 (powerup ativo).
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
    // Powerup 2x moedas: dobra antes de creditar.
    const mult = state.coinMultiplier || 1;
    if (mult > 1) {
        breakdown.push({ label: `\u{1F4B0} 2x Moedas`, coins: total * (mult - 1) });
        total = total * mult;
    }
    addCoins(state, total);
    return { coinsAwarded: total, breakdown };
}

// Calcula 0..3 estrelas com base em % de acertos.
//   < 70%  -> 0 (nao passou)
//   70-84  -> 1
//   85-94  -> 2
//   >=95   -> 3
export function starsForScore(percent) {
    if (percent >= 95) return 3;
    if (percent >= 85) return 2;
    if (percent >= 70) return 1;
    return 0;
}

// Atualiza phaseStars[id] preservando o melhor resultado.
export function updatePhaseStars(state, phaseId, stars) {
    if (!state.phaseStars) state.phaseStars = {};
    const prev = state.phaseStars[phaseId] || 0;
    if (stars > prev) state.phaseStars[phaseId] = stars;
    return state.phaseStars[phaseId];
}

// Recompensa no fim de uma fase.
// percent: 0-100. Calcula estrelas (0-3) e atualiza state.phaseStars.
export function rewardForPhaseEnd(state, { phaseId, passed, perfect, firstTime, percent }) {
    if (!passed) return { coinsAwarded: 0, breakdown: [], stars: 0 };
    const breakdown = [];
    let total = COIN_REWARDS.phaseComplete;
    breakdown.push({ label: 'Passou de fase', coins: COIN_REWARDS.phaseComplete });

    // Estrelas: se percent foi passado, calcula. Senao, deduz: perfect=3, passed=1.
    const stars = (typeof percent === 'number') ? starsForScore(percent) : (perfect ? 3 : 1);
    const prevStars = (state.phaseStars && state.phaseStars[phaseId]) || 0;
    updatePhaseStars(state, phaseId, stars);

    // Bonus por estrela: 1=0, 2=15, 3=40
    const starBonus = stars >= 3 ? 40 : (stars >= 2 ? 15 : 0);
    if (starBonus > 0) {
        total += starBonus;
        breakdown.push({ label: `${stars} estrelas!`, coins: starBonus });
    }

    if (perfect) {
        total += COIN_REWARDS.phasePerfect;
        breakdown.push({ label: 'Perfeito!', coins: COIN_REWARDS.phasePerfect });
    }
    if (firstTime) {
        total += COIN_REWARDS.firstTimeCompletePhase;
        breakdown.push({ label: 'Primeira vez', coins: COIN_REWARDS.firstTimeCompletePhase });
    }
    addCoins(state, total);
    return { coinsAwarded: total, breakdown, stars, prevStars };
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
