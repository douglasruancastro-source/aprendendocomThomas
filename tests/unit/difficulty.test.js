import { describe, it, expect } from 'vitest';
import {
    recordPhaseResult,
    getDifficultyLevel,
    filterByDifficulty,
} from '../../public/js/difficulty.js';
import { defaultState } from '../../public/js/state.js';

function makeState() {
    return defaultState();
}

describe('recordPhaseResult', () => {
    it('incrementa plays e guarda pct em lastScores', () => {
        const s = makeState();
        recordPhaseResult(s, 1, 4, 5);
        expect(s.phaseStats[1].plays).toBe(1);
        expect(s.phaseStats[1].lastScores).toEqual([0.8]);
    });

    it('mantém apenas as últimas 3 pontuações (janela)', () => {
        const s = makeState();
        [1, 0.8, 0.6, 0.4, 1].forEach((_, i, arr) => recordPhaseResult(s, 1, Math.round(arr[i] * 10), 10));
        expect(s.phaseStats[1].lastScores).toHaveLength(3);
        expect(s.phaseStats[1].plays).toBe(5);
    });

    it('ignora chamadas com total=0', () => {
        const s = makeState();
        recordPhaseResult(s, 1, 0, 0);
        expect(s.phaseStats[1]).toBeUndefined();
    });
});

describe('getDifficultyLevel', () => {
    it('retorna 1 quando não há histórico suficiente', () => {
        const s = makeState();
        expect(getDifficultyLevel(s, 1)).toBe(1);
        recordPhaseResult(s, 1, 10, 10);
        expect(getDifficultyLevel(s, 1)).toBe(1); // precisa de 3 jogadas
    });

    it('promove para level 2 quando média >= 0.9 em 3 jogadas', () => {
        const s = makeState();
        recordPhaseResult(s, 1, 10, 10);
        recordPhaseResult(s, 1, 9, 10);
        recordPhaseResult(s, 1, 10, 10);
        expect(getDifficultyLevel(s, 1)).toBe(2);
    });

    it('mantém level 1 quando média baixa', () => {
        const s = makeState();
        recordPhaseResult(s, 1, 3, 10);
        recordPhaseResult(s, 1, 4, 10);
        recordPhaseResult(s, 1, 5, 10);
        expect(getDifficultyLevel(s, 1)).toBe(1);
    });

    it('zona intermediária: 0.7 < avg < 0.9 -> level 2; avg <= 0.7 -> level 1', () => {
        const sHigh = makeState();
        recordPhaseResult(sHigh, 1, 8, 10);
        recordPhaseResult(sHigh, 1, 8, 10);
        recordPhaseResult(sHigh, 1, 8, 10);
        expect(getDifficultyLevel(sHigh, 1)).toBe(2);
        const sMid = makeState();
        recordPhaseResult(sMid, 1, 7, 10);
        recordPhaseResult(sMid, 1, 7, 10);
        recordPhaseResult(sMid, 1, 7, 10);
        expect(getDifficultyLevel(sMid, 1)).toBe(1);
    });
});

describe('filterByDifficulty', () => {
    const pool = [
        { id: 'a', level: 1 },
        { id: 'b', level: 1 },
        { id: 'c', level: 2 },
        { id: 'd' }, // sem level → aceito em qualquer nível
    ];

    it('level 1 só deixa passar level 1 e sem-level', () => {
        const filtered = filterByDifficulty(pool, 1);
        expect(filtered.map((x) => x.id).sort()).toEqual(['a', 'b', 'd']);
    });

    it('level 2 aceita tudo', () => {
        expect(filterByDifficulty(pool, 2)).toHaveLength(4);
    });

    it('fallback quando filtro retorna vazio', () => {
        const only2 = [{ id: 'c', level: 2 }];
        expect(filterByDifficulty(only2, 1)).toEqual(only2);
    });

    it('retorna pool vazio quando entra vazio', () => {
        expect(filterByDifficulty([], 1)).toEqual([]);
    });
});
