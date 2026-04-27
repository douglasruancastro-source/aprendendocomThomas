// Sistema de Missoes Diarias (Fase 9.17).
// Sorteia 3 missoes do pool por dia (deterministico via seed do dia + state.id),
// rastreia progresso e concede moedas no claim.

import { MISSION_POOL, missionById } from './data/missions.js';
import { todayStr } from './utils.js';
import { addCoins } from './rewards.js';
import { islandForPhase } from './data/islands.js';

const DAILY_COUNT = 3;

// PRNG simples seed-based (LCG) para sortear de forma estavel por dia.
function seededShuffle(arr, seed) {
    const out = [...arr];
    let s = seed >>> 0;
    for (let i = out.length - 1; i > 0; i--) {
        s = (s * 1664525 + 1013904223) >>> 0;
        const j = s % (i + 1);
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

// Converte data string YYYY-MM-DD em seed numerica.
function seedFromDate(dateStr) {
    let h = 0;
    for (let i = 0; i < dateStr.length; i++) h = ((h << 5) - h + dateStr.charCodeAt(i)) | 0;
    return h >>> 0;
}

// Garante que state.dailyMissions esta inicializado para o dia atual.
// Se for um novo dia, sorteia 3 novas missoes e zera progresso.
export function ensureDailyMissions(state, now = new Date()) {
    const today = todayStr(now);
    if (!state.dailyMissions || state.dailyMissions.date !== today) {
        const shuffled = seededShuffle(MISSION_POOL, seedFromDate(today));
        state.dailyMissions = {
            date: today,
            missionIds: shuffled.slice(0, DAILY_COUNT).map((m) => m.id),
            progress: {},
            claimed: [],
        };
    }
    return state.dailyMissions;
}

// Retorna as missoes de hoje com metadata { mission, progress, isComplete, isClaimed }.
export function getTodayMissions(state) {
    const dm = ensureDailyMissions(state);
    return dm.missionIds.map((id) => {
        const mission = missionById(id);
        const progress = dm.progress[id] || 0;
        const isComplete = progress >= mission.target;
        const isClaimed = dm.claimed.includes(id);
        return { mission, progress, isComplete, isClaimed };
    });
}

// Helper: incrementa o progresso de qualquer missao ativa cujo eventType bate.
function bump(state, eventType, amount, condition) {
    const dm = ensureDailyMissions(state);
    let touched = false;
    for (const id of dm.missionIds) {
        if (dm.claimed.includes(id)) continue;
        const m = missionById(id);
        if (!m || m.eventType !== eventType) continue;
        if (condition && !condition(m)) continue;
        dm.progress[id] = Math.min((dm.progress[id] || 0) + amount, m.target);
        touched = true;
    }
    return touched;
}

// API publicas — chamadas do engine / rewards.

export function onCorrectAnswer(state) {
    bump(state, 'correctAnswer', 1);
}

export function onPhaseCompleted(state, phaseId, isPerfect) {
    bump(state, 'completePhase', 1);
    if (isPerfect) bump(state, 'perfectPhase', 1);
    // por-ilha
    const island = islandForPhase(phaseId);
    if (island) bump(state, `islandPhase:${island.id}`, 1);
}

export function onStreakReached(state, streak) {
    // Marca todas as missoes streakReached cujo threshold foi alcancado.
    bump(state, 'streakReached', 1, (m) => streak >= (m.threshold || 1));
}

export function onCoinEarned(state, amount) {
    bump(state, 'coinEarned', amount);
}

// Resgata recompensa de uma missao concluida. Retorna { ok, reward } ou { ok:false }.
export function claimMission(state, missionId) {
    const dm = ensureDailyMissions(state);
    const m = missionById(missionId);
    if (!m) return { ok: false, reason: 'missao-inexistente' };
    if (!dm.missionIds.includes(missionId)) return { ok: false, reason: 'missao-nao-de-hoje' };
    if (dm.claimed.includes(missionId)) return { ok: false, reason: 'ja-resgatada' };
    if ((dm.progress[missionId] || 0) < m.target) return { ok: false, reason: 'incompleta' };
    dm.claimed.push(missionId);
    addCoins(state, m.reward);
    return { ok: true, reward: m.reward };
}
