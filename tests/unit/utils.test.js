import { describe, it, expect } from 'vitest';

// We test the pure logic functions that exist in the app
// Since the app is a single HTML file, we recreate the testable functions here

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}

describe('shuffle', () => {
    it('returns an array with the same length', () => {
        const input = [1, 2, 3, 4, 5];
        const result = shuffle(input);
        expect(result).toHaveLength(input.length);
    });

    it('contains all original elements', () => {
        const input = ['A', 'B', 'C', 'D', 'E'];
        const result = shuffle(input);
        expect(result.sort()).toEqual(input.sort());
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
        let differentOrderCount = 0;
        for (let i = 0; i < 10; i++) {
            const result = shuffle(input);
            if (result.join(',') !== input.join(',')) differentOrderCount++;
        }
        expect(differentOrderCount).toBeGreaterThan(0);
    });
});

describe('wait', () => {
    it('resolves after the specified delay', async () => {
        const start = Date.now();
        await wait(50);
        const elapsed = Date.now() - start;
        expect(elapsed).toBeGreaterThanOrEqual(40); // Allow small tolerance
    });

    it('returns a promise', () => {
        const result = wait(1);
        expect(result).toBeInstanceOf(Promise);
    });
});
