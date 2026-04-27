import { describe, it, expect, beforeEach } from 'vitest';
import {
    STATE_KEY,
    LEGACY_V2_KEY,
    LEGACY_V1_KEY,
    MIGRATION_BONUS_COINS,
    defaultState,
    loadState,
    saveState,
    resetState,
} from '../../public/js/state.js';

describe('defaultState', () => {
    it('returns object with all required fields', () => {
        const s = defaultState();
        ['completedPhases','drawingsUsed','badges','streak','bestStreak','totalCorrect',
         'coins','totalCoinsEarned','ownedItems','equipped','lastPlayDay','dailyStreak',
         'recentRounds','phaseStats','phaseStars','hasSeenTutorial','parentsPin','version'].forEach((k) => {
            expect(s).toHaveProperty(k);
        });
    });

    it('starts with empty arrays and zero counters', () => {
        const s = defaultState();
        expect(s.completedPhases).toEqual([]);
        expect(s.badges).toEqual([]);
        expect(s.ownedItems).toEqual([]);
        expect(s.coins).toBe(0);
        expect(s.totalCoinsEarned).toBe(0);
        expect(s.dailyStreak).toBe(0);
        expect(s.phaseStars).toEqual({});
        expect(s.hasSeenTutorial).toBe(false);
        expect(s.parentsPin).toBeNull();
        expect(s.version).toBe(5);
    });

    it('equipped has defaults per category', () => {
        const s = defaultState();
        expect(s.equipped.theme).toBe('theme-default');
        expect(s.equipped.mascot).toBe('mascot-default');
        expect(s.equipped.accessory).toBe('acc-none');
        expect(s.equipped.effect).toBe('effect-default');
    });

    it('returns a new object each time', () => {
        const a = defaultState();
        const b = defaultState();
        a.completedPhases.push(1);
        expect(b.completedPhases).toEqual([]);
        a.equipped.theme = 'theme-space';
        expect(b.equipped.theme).toBe('theme-default');
    });
});

describe('loadState', () => {
    beforeEach(() => localStorage.clear());

    it('returns default state when localStorage is empty', () => {
        expect(loadState()).toEqual(defaultState());
    });

    it('loads v5 state from localStorage', () => {
        const saved = { ...defaultState(), completedPhases: [1, 2, 3], coins: 450, bestStreak: 5, phaseStars: { 1: 3, 2: 2 } };
        localStorage.setItem(STATE_KEY, JSON.stringify(saved));
        const s = loadState();
        expect(s.completedPhases).toEqual([1, 2, 3]);
        expect(s.coins).toBe(450);
        expect(s.bestStreak).toBe(5);
        expect(s.phaseStars).toEqual({ 1: 3, 2: 2 });
    });

    it('migrates v3 -> v4 -> v5 (assigns 1 star per completed phase + tutorial flag)', () => {
        const v3 = { ...defaultState(), version: 3, completedPhases: [1, 2, 3], coins: 100 };
        delete v3.phaseStars;
        delete v3.hasSeenTutorial;
        delete v3.parentsPin;
        localStorage.setItem(STATE_KEY, JSON.stringify(v3));
        const s = loadState();
        expect(s.version).toBe(5);
        expect(s.phaseStars[1]).toBe(1);
        expect(s.phaseStars[2]).toBe(1);
        expect(s.phaseStars[3]).toBe(1);
        expect(s.coins).toBe(100);
        expect(s.hasSeenTutorial).toBe(false);
        expect(s.parentsPin).toBeNull();
    });

    it('migrates v4 -> v5 (lossless, adds tutorial+pin defaults)', () => {
        const v4 = { ...defaultState(), version: 4, completedPhases: [1, 2], coins: 200, phaseStars: { 1: 2 } };
        delete v4.hasSeenTutorial;
        delete v4.parentsPin;
        localStorage.setItem(STATE_KEY, JSON.stringify(v4));
        const s = loadState();
        expect(s.version).toBe(5);
        expect(s.completedPhases).toEqual([1, 2]);
        expect(s.coins).toBe(200);
        expect(s.phaseStars).toEqual({ 1: 2 });
        expect(s.hasSeenTutorial).toBe(false);
        expect(s.parentsPin).toBeNull();
    });

    it('returns default state for corrupted JSON', () => {
        localStorage.setItem(STATE_KEY, 'not-json-{{{');
        expect(loadState()).toEqual(defaultState());
    });

    it('migrates from v2 and grants welcome bonus', () => {
        const v2 = { completedPhases: [1, 2], badges: ['first-star'], bestStreak: 3, totalCorrect: 15 };
        localStorage.setItem(LEGACY_V2_KEY, JSON.stringify(v2));
        const s = loadState();
        expect(s.completedPhases).toEqual([1, 2]);
        expect(s.badges).toContain('first-star');
        expect(s.coins).toBe(MIGRATION_BONUS_COINS);
        expect(s.totalCoinsEarned).toBe(MIGRATION_BONUS_COINS);
        // após migrar, o v3 fica persistido
        expect(JSON.parse(localStorage.getItem(STATE_KEY)).coins).toBe(MIGRATION_BONUS_COINS);
    });

    it('migrates from v1 with welcome bonus', () => {
        localStorage.setItem(LEGACY_V1_KEY, JSON.stringify({ completedPhases: [1, 2, 3], drawingsUsed: [0, 1] }));
        const s = loadState();
        expect(s.completedPhases).toEqual([1, 2, 3]);
        expect(s.drawingsUsed).toEqual([0, 1]);
        expect(s.coins).toBe(MIGRATION_BONUS_COINS);
    });

    it('merges nested equipped when saved state lacks new fields', () => {
        const partial = { ...defaultState(), equipped: { theme: 'theme-space' }, version: 3 };
        localStorage.setItem(STATE_KEY, JSON.stringify(partial));
        const s = loadState();
        expect(s.equipped.theme).toBe('theme-space');
        expect(s.equipped.mascot).toBe('mascot-default');
    });
});

describe('saveState', () => {
    beforeEach(() => localStorage.clear());

    it('saves state to localStorage', () => {
        const s = defaultState();
        s.coins = 120;
        saveState(s);
        const loaded = JSON.parse(localStorage.getItem(STATE_KEY));
        expect(loaded.coins).toBe(120);
    });

    it('overwrites previous state', () => {
        const s = defaultState();
        s.completedPhases = [1];
        saveState(s);
        s.completedPhases = [1, 2];
        saveState(s);
        expect(JSON.parse(localStorage.getItem(STATE_KEY)).completedPhases).toEqual([1, 2]);
    });
});

describe('resetState', () => {
    it('clears localStorage and returns default state', () => {
        localStorage.setItem(STATE_KEY, JSON.stringify({ completedPhases: [1, 2] }));
        const s = resetState();
        expect(s).toEqual(defaultState());
        expect(localStorage.getItem(STATE_KEY)).toBeNull();
    });
});
