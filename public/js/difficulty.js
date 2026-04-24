// Dificuldade adaptativa simples.
// Guarda histórico por fase em state.phaseStats[phaseId] = { plays, lastScores: [pct,...] }
// Decide o nível (1 fácil, 2 difícil) com base na média das últimas N pontuações.

const HISTORY_WINDOW = 3;
const PROMOTE_THRESHOLD = 0.9;  // acima disso, sobe para level 2
const DEMOTE_THRESHOLD = 0.5;   // abaixo disso, volta para level 1

export function recordPhaseResult(state, phaseId, correctCount, total) {
    if (!total) return;
    const pct = correctCount / total;
    if (!state.phaseStats) state.phaseStats = {};
    const stats = state.phaseStats[phaseId] || { plays: 0, lastScores: [] };
    stats.plays++;
    stats.lastScores = [...stats.lastScores, pct].slice(-HISTORY_WINDOW);
    state.phaseStats[phaseId] = stats;
}

export function getDifficultyLevel(state, phaseId) {
    if (!state.phaseStats) return 1;
    const stats = state.phaseStats[phaseId];
    if (!stats || stats.lastScores.length < HISTORY_WINDOW) return 1;
    const avg = stats.lastScores.reduce((a, b) => a + b, 0) / stats.lastScores.length;
    if (avg >= PROMOTE_THRESHOLD) return 2;
    if (avg <= DEMOTE_THRESHOLD) return 1;
    // Zona intermediária: mantém o nível da última sessão se informado, senão level 1.
    // Simplificação: derivar do avg.
    return avg > 0.7 ? 2 : 1;
}

// Retorna pool filtrado pelo nível. Se o pool resultante ficar vazio (ex: só tem level 2),
// devolve o pool original como fallback seguro.
export function filterByDifficulty(pool, level) {
    if (!pool || pool.length === 0) return pool;
    const filtered = pool.filter((it) => !it.level || it.level <= level);
    return filtered.length > 0 ? filtered : pool;
}
