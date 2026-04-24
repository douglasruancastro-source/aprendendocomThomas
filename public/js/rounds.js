// Seleciona rodadas para uma fase aplicando dificuldade adaptativa e anti-repetição.

import { sampleWithoutRepeats } from './utils.js';
import { ROUNDS_PER_PHASE } from './data/phases.js';
import { generateFindLettersRounds } from './data/letters.js';
import { SYLLABLE_ROUNDS } from './data/syllables.js';
import { BUILD_WORD_ROUNDS, READ_MATCH_ROUNDS, FILL_BLANK_ROUNDS, TYPE_WORD_ROUNDS } from './data/words.js';
import { SENTENCE_ROUNDS } from './data/sentences.js';
import { SEQUENCE_ROUNDS, MEMORY_ROUNDS, ODD_ONE_OUT_ROUNDS, COUNT_MATCH_ROUNDS } from './data/logic.js';
import { COLOR_ROUNDS } from './data/colors.js';
import { NUMBER_ROUNDS } from './data/numbers.js';
import { ADD_ROUNDS, SUB_ROUNDS } from './data/math.js';
import { filterByDifficulty, getDifficultyLevel } from './difficulty.js';

const RECENT_HISTORY = 10;

// Pools indexados por phaseId. Fases 1-2 são procedurais e não usam pool.
const POOLS = {
    3:  SYLLABLE_ROUNDS,
    4:  BUILD_WORD_ROUNDS,
    5:  READ_MATCH_ROUNDS,
    6:  FILL_BLANK_ROUNDS,
    7:  TYPE_WORD_ROUNDS,
    8:  SENTENCE_ROUNDS,
    9:  SEQUENCE_ROUNDS,
    10: MEMORY_ROUNDS,
    11: ODD_ONE_OUT_ROUNDS,
    12: COUNT_MATCH_ROUNDS,
    13: COLOR_ROUNDS,
    14: NUMBER_ROUNDS,
    15: ADD_ROUNDS,
    16: SUB_ROUNDS,
};

export function buildRoundsForPhase(state, phaseId) {
    const count = ROUNDS_PER_PHASE[phaseId] || 6;
    const level = getDifficultyLevel(state, phaseId);

    if (phaseId === 1) return generateFindLettersRounds(true, count, level);
    if (phaseId === 2) return generateFindLettersRounds(false, count, level);

    const pool = POOLS[phaseId];
    if (!pool) return [];
    const filtered = filterByDifficulty(pool, level);
    const recent = (state.recentRounds && state.recentRounds[phaseId]) || [];
    return sampleWithoutRepeats(filtered, count, recent, (it) => it.id);
}

// Marca as rodadas vistas para anti-repetição na próxima sessão.
export function recordRoundsSeen(state, phaseId, rounds) {
    if (!state.recentRounds) state.recentRounds = {};
    const ids = rounds.map((r) => r.id).filter(Boolean);
    const prev = state.recentRounds[phaseId] || [];
    state.recentRounds[phaseId] = [...ids, ...prev].slice(0, RECENT_HISTORY);
}
