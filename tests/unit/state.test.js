import { describe, it, expect, beforeEach } from 'vitest';

// Recreate state functions for testing
const STATE_KEY = 'thomas_learning_v2';

function defaultState() {
    return { completedPhases: [], drawingsUsed: [], badges: [], streak: 0, bestStreak: 0, totalCorrect: 0 };
}

function loadState() {
    try {
        const s = JSON.parse(localStorage.getItem(STATE_KEY));
        if (s && s.completedPhases) {
            const def = defaultState();
            return { ...def, ...s };
        }
        const v1 = JSON.parse(localStorage.getItem('thomas_learning_v1'));
        if (v1 && v1.completedPhases) {
            const def = defaultState();
            return { ...def, completedPhases: v1.completedPhases, drawingsUsed: v1.drawingsUsed || [] };
        }
        return defaultState();
    } catch { return defaultState(); }
}

function saveState(state) {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

describe('defaultState', () => {
    it('returns object with all required fields', () => {
        const state = defaultState();
        expect(state).toHaveProperty('completedPhases');
        expect(state).toHaveProperty('drawingsUsed');
        expect(state).toHaveProperty('badges');
        expect(state).toHaveProperty('streak');
        expect(state).toHaveProperty('bestStreak');
        expect(state).toHaveProperty('totalCorrect');
    });

    it('starts with empty arrays and zero counters', () => {
        const state = defaultState();
        expect(state.completedPhases).toEqual([]);
        expect(state.drawingsUsed).toEqual([]);
        expect(state.badges).toEqual([]);
        expect(state.streak).toBe(0);
        expect(state.bestStreak).toBe(0);
        expect(state.totalCorrect).toBe(0);
    });

    it('returns a new object each time', () => {
        const a = defaultState();
        const b = defaultState();
        expect(a).not.toBe(b);
        a.completedPhases.push(1);
        expect(b.completedPhases).toEqual([]);
    });
});

describe('loadState', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('returns default state when localStorage is empty', () => {
        const state = loadState();
        expect(state).toEqual(defaultState());
    });

    it('loads saved state from localStorage', () => {
        const saved = { completedPhases: [1, 2, 3], drawingsUsed: [0], badges: ['first-star'], streak: 0, bestStreak: 5, totalCorrect: 20 };
        localStorage.setItem(STATE_KEY, JSON.stringify(saved));
        const state = loadState();
        expect(state.completedPhases).toEqual([1, 2, 3]);
        expect(state.badges).toEqual(['first-star']);
        expect(state.bestStreak).toBe(5);
    });

    it('returns default state for corrupted JSON', () => {
        localStorage.setItem(STATE_KEY, 'not-json-{{{');
        const state = loadState();
        expect(state).toEqual(defaultState());
    });

    it('merges with defaults for partial saved state (backward compat)', () => {
        const partial = { completedPhases: [1, 2] };
        localStorage.setItem(STATE_KEY, JSON.stringify(partial));
        const state = loadState();
        expect(state.completedPhases).toEqual([1, 2]);
        expect(state.badges).toEqual([]);
        expect(state.bestStreak).toBe(0);
    });

    it('migrates from v1 state', () => {
        const v1State = { completedPhases: [1, 2, 3], drawingsUsed: [0, 1] };
        localStorage.setItem('thomas_learning_v1', JSON.stringify(v1State));
        const state = loadState();
        expect(state.completedPhases).toEqual([1, 2, 3]);
        expect(state.drawingsUsed).toEqual([0, 1]);
        expect(state.badges).toEqual([]);
    });
});

describe('saveState', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('saves state to localStorage', () => {
        const state = { completedPhases: [1], drawingsUsed: [], badges: [], streak: 0, bestStreak: 3, totalCorrect: 10 };
        saveState(state);
        const loaded = JSON.parse(localStorage.getItem(STATE_KEY));
        expect(loaded.completedPhases).toEqual([1]);
        expect(loaded.bestStreak).toBe(3);
    });

    it('overwrites previous state', () => {
        saveState({ completedPhases: [1], drawingsUsed: [], badges: [], streak: 0, bestStreak: 0, totalCorrect: 0 });
        saveState({ completedPhases: [1, 2], drawingsUsed: [], badges: ['first-star'], streak: 0, bestStreak: 0, totalCorrect: 0 });
        const loaded = JSON.parse(localStorage.getItem(STATE_KEY));
        expect(loaded.completedPhases).toEqual([1, 2]);
        expect(loaded.badges).toEqual(['first-star']);
    });
});
