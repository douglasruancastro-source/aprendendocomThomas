// Seleciona rodadas para uma fase aplicando dificuldade adaptativa e anti-repeticao.
// Para 75 fases, mapeia phase.type -> pool generico, e fases especificas (1-20)
// preservam o comportamento legado para nao quebrar testes/observacoes.

import { sampleWithoutRepeats } from './utils.js';
import { ROUNDS_PER_PHASE, phaseById } from './data/phases.js';
import { generateFindLettersRounds } from './data/letters.js';
import { SYLLABLE_ROUNDS, SYLLABLE_BUILD_ROUNDS } from './data/syllables.js';
import { BUILD_WORD_ROUNDS, READ_MATCH_ROUNDS, FILL_BLANK_ROUNDS, TYPE_WORD_ROUNDS } from './data/words.js';
import { SENTENCE_ROUNDS } from './data/sentences.js';
import { SEQUENCE_ROUNDS, MEMORY_ROUNDS, ODD_ONE_OUT_ROUNDS, COUNT_MATCH_ROUNDS } from './data/logic.js';
import { COLOR_ROUNDS } from './data/colors.js';
import { NUMBER_ROUNDS } from './data/numbers.js';
import { ADD_ROUNDS, SUB_ROUNDS } from './data/math.js';
import { filterByDifficulty, getDifficultyLevel } from './difficulty.js';
import { tierForPhase } from './data/islands.js';

const RECENT_HISTORY = 10;

// Pool por type. Fase com pool especifico (ex.: SYLLABLE_BUILD por fase) usa override.
const POOL_BY_TYPE = {
    'syllables':        SYLLABLE_ROUNDS,
    'build-word':       BUILD_WORD_ROUNDS,
    'read-match':       READ_MATCH_ROUNDS,
    'fill-blank':       FILL_BLANK_ROUNDS,
    'type-word':        TYPE_WORD_ROUNDS,
    'build-sentence':   SENTENCE_ROUNDS,
    'logical-sequence': SEQUENCE_ROUNDS,
    'memory-game':      MEMORY_ROUNDS,
    'odd-one-out':      ODD_ONE_OUT_ROUNDS,
    'count-match':      COUNT_MATCH_ROUNDS,
    'color-match':      COLOR_ROUNDS,
    'number-recognize': NUMBER_ROUNDS,
    'math-add':         ADD_ROUNDS,
    'math-sub':         SUB_ROUNDS,
};

// Overrides por phaseId (subconjuntos especificos do pool, ex.: silabas BA/CA/MA por ilha)
const POOL_OVERRIDES = {
    46: SYLLABLE_BUILD_ROUNDS.filter((r) => r.phase === 17 || r.word.startsWith('B')),
    47: SYLLABLE_BUILD_ROUNDS.filter((r) => r.phase === 18 || r.word.startsWith('C')),
    48: SYLLABLE_BUILD_ROUNDS.filter((r) => r.phase === 19 || r.word.startsWith('M')),
    49: SYLLABLE_BUILD_ROUNDS,
    53: SYLLABLE_BUILD_ROUNDS,
    54: SYLLABLE_BUILD_ROUNDS,
    56: SYLLABLE_BUILD_ROUNDS,
    58: SYLLABLE_BUILD_ROUNDS,
    60: SYLLABLE_BUILD_ROUNDS,
    75: SYLLABLE_BUILD_ROUNDS,
};

function poolFor(phaseId) {
    if (POOL_OVERRIDES[phaseId]) return POOL_OVERRIDES[phaseId];
    const phase = phaseById(phaseId);
    if (!phase) return null;
    if (phase.type === 'syllable-build') return SYLLABLE_BUILD_ROUNDS;
    return POOL_BY_TYPE[phase.type] || null;
}

// Fase 12.1: tier-aware difficulty. Combina dificuldade adaptativa com tier da fase
// dentro da ilha (1-5 = facil, 6-10 = medio, 11-15 = dificil), forcando level >= 2
// nas fases finais de cada ilha mesmo se a crianca esta indo bem.
function effectiveLevel(state, phase) {
    const adaptive = getDifficultyLevel(state, phase.id);
    const tier = tierForPhase(phase);
    const tierMin = tier === 3 ? 2 : 1; // tier 3 forca dificuldade alta
    return Math.max(adaptive, tierMin);
}

export function buildRoundsForPhase(state, phaseId) {
    const count = ROUNDS_PER_PHASE[phaseId] || 6;
    const phase = phaseById(phaseId);
    if (!phase) return [];

    const level = effectiveLevel(state, phase);

    if (phase.type === 'find-vowels') return generateFindLettersRounds(true, count, level);
    if (phase.type === 'find-consonants') return generateFindLettersRounds(false, count, level);

    const pool = poolFor(phaseId);
    if (!pool || pool.length === 0) return [];
    const filtered = filterByDifficulty(pool, level);
    const recent = (state.recentRounds && state.recentRounds[phaseId]) || [];
    return sampleWithoutRepeats(filtered, count, recent, (it) => it.id);
}

// Marca as rodadas vistas para anti-repeticao na proxima sessao.
export function recordRoundsSeen(state, phaseId, rounds) {
    if (!state.recentRounds) state.recentRounds = {};
    const ids = rounds.map((r) => r.id).filter(Boolean);
    const prev = state.recentRounds[phaseId] || [];
    state.recentRounds[phaseId] = [...ids, ...prev].slice(0, RECENT_HISTORY);
}
