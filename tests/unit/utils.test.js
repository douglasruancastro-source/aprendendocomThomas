import { describe, it, expect } from 'vitest';
import {
    shuffle,
    wait,
    randInt,
    sampleN,
    sampleWithoutRepeats,
    todayStr,
    daysBetween,
} from '../../public/js/utils.js';

describe('shuffle', () => {
    it('returns an array with the same length', () => {
        expect(shuffle([1, 2, 3, 4, 5])).toHaveLength(5);
    });

    it('contains all original elements', () => {
        expect(shuffle(['A', 'B', 'C']).sort()).toEqual(['A', 'B', 'C']);
    });

    it('does not mutate the original array', () => {
        const input = [1, 2, 3, 4, 5];
        const copy = [...input];
        shuffle(input);
        expect(input).toEqual(copy);
    });

    it('handles empty array', () => {
        expect(shuffle([])).toEqual([]);
    });

    it('handles single element', () => {
        expect(shuffle([42])).toEqual([42]);
    });

    it('returns a different order at least sometimes (statistical)', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        let diff = 0;
        for (let i = 0; i < 10; i++) {
            if (shuffle(input).join(',') !== input.join(',')) diff++;
        }
        expect(diff).toBeGreaterThan(0);
    });
});

describe('wait', () => {
    it('resolves after the specified delay', async () => {
        const start = Date.now();
        await wait(50);
        expect(Date.now() - start).toBeGreaterThanOrEqual(40);
    });

    it('returns a promise', () => {
        expect(wait(1)).toBeInstanceOf(Promise);
    });
});

describe('randInt', () => {
    it('returns integer within [min, max] inclusive', () => {
        for (let i = 0; i < 50; i++) {
            const n = randInt(3, 7);
            expect(Number.isInteger(n)).toBe(true);
            expect(n).toBeGreaterThanOrEqual(3);
            expect(n).toBeLessThanOrEqual(7);
        }
    });
});

describe('sampleN', () => {
    it('returns n items when n <= pool size', () => {
        expect(sampleN([1, 2, 3, 4, 5], 3)).toHaveLength(3);
    });

    it('caps at pool size when n > pool size', () => {
        expect(sampleN([1, 2], 5)).toHaveLength(2);
    });
});

describe('sampleWithoutRepeats', () => {
    it('prefers fresh items over recent ones', () => {
        const pool = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
        const recent = ['a', 'b'];
        // com pool=4, recent=2, n=2 → deve trazer só c,d
        for (let i = 0; i < 20; i++) {
            const picked = sampleWithoutRepeats(pool, 2, recent, (x) => x.id);
            const ids = picked.map((x) => x.id).sort();
            expect(ids).toEqual(['c', 'd']);
        }
    });

    it('falls back to recent when fresh pool is too small', () => {
        const pool = [{ id: 'a' }, { id: 'b' }];
        const recent = ['a', 'b'];
        const picked = sampleWithoutRepeats(pool, 2, recent, (x) => x.id);
        expect(picked).toHaveLength(2);
    });
});

describe('todayStr / daysBetween', () => {
    it('todayStr formats YYYY-MM-DD', () => {
        const s = todayStr(new Date(2026, 3, 5));
        expect(s).toBe('2026-04-05');
    });

    it('daysBetween counts whole days', () => {
        expect(daysBetween('2026-04-01', '2026-04-05')).toBe(4);
        expect(daysBetween('2026-04-05', '2026-04-05')).toBe(0);
    });
});
