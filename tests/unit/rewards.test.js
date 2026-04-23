import { describe, it, expect } from 'vitest';

// Recreate badge logic for testing

const BADGE_DEFS = [
    { id: 'first-star', name: 'Primeira Estrela' },
    { id: 'streak-3', name: 'Combo 3' },
    { id: 'streak-5', name: 'Combo 5' },
    { id: 'perfect', name: 'Perfeito' },
    { id: 'halfway', name: 'Metade' },
    { id: 'logic-start', name: 'Logico' },
    { id: 'all-complete', name: 'Mestre' },
    { id: 'memory-master', name: 'Memoria' }
];

function checkBadges(state, extra) {
    const newBadges = [];
    function award(id) {
        if (!state.badges.includes(id)) {
            state.badges.push(id);
            newBadges.push(id);
        }
    }
    if (state.completedPhases.length >= 1) award('first-star');
    if (state.completedPhases.length >= 6) award('halfway');
    if (state.completedPhases.length >= 12) award('all-complete');
    if (state.bestStreak >= 3) award('streak-3');
    if (state.bestStreak >= 5) award('streak-5');
    if (extra === 'perfect') award('perfect');
    if (state.completedPhases.some(id => id >= 9)) award('logic-start');
    if (extra === 'memory-master') award('memory-master');
    return newBadges;
}

function makeState(overrides = {}) {
    return {
        completedPhases: [],
        drawingsUsed: [],
        badges: [],
        streak: 0,
        bestStreak: 0,
        totalCorrect: 0,
        ...overrides
    };
}

describe('checkBadges', () => {
    it('awards first-star when 1 phase completed', () => {
        const state = makeState({ completedPhases: [1] });
        const newBadges = checkBadges(state);
        expect(newBadges).toContain('first-star');
        expect(state.badges).toContain('first-star');
    });

    it('does not award first-star when no phases completed', () => {
        const state = makeState();
        const newBadges = checkBadges(state);
        expect(newBadges).not.toContain('first-star');
    });

    it('awards halfway when 6 phases completed', () => {
        const state = makeState({ completedPhases: [1, 2, 3, 4, 5, 6] });
        const newBadges = checkBadges(state);
        expect(newBadges).toContain('halfway');
    });

    it('does not award halfway when less than 6 phases completed', () => {
        const state = makeState({ completedPhases: [1, 2, 3, 4, 5] });
        const newBadges = checkBadges(state);
        expect(newBadges).not.toContain('halfway');
    });

    it('awards all-complete when 12 phases completed', () => {
        const state = makeState({ completedPhases: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] });
        const newBadges = checkBadges(state);
        expect(newBadges).toContain('all-complete');
    });

    it('awards streak-3 when bestStreak >= 3', () => {
        const state = makeState({ bestStreak: 3 });
        const newBadges = checkBadges(state);
        expect(newBadges).toContain('streak-3');
    });

    it('awards streak-5 when bestStreak >= 5', () => {
        const state = makeState({ bestStreak: 5 });
        const newBadges = checkBadges(state);
        expect(newBadges).toContain('streak-5');
    });

    it('awards perfect when extra is "perfect"', () => {
        const state = makeState();
        const newBadges = checkBadges(state, 'perfect');
        expect(newBadges).toContain('perfect');
    });

    it('awards logic-start when a phase >= 9 is completed', () => {
        const state = makeState({ completedPhases: [1, 2, 3, 4, 5, 6, 7, 8, 9] });
        const newBadges = checkBadges(state);
        expect(newBadges).toContain('logic-start');
    });

    it('does not award logic-start without logic phases', () => {
        const state = makeState({ completedPhases: [1, 2, 3, 4, 5, 6, 7, 8] });
        const newBadges = checkBadges(state);
        expect(newBadges).not.toContain('logic-start');
    });

    it('awards memory-master when extra is "memory-master"', () => {
        const state = makeState();
        const newBadges = checkBadges(state, 'memory-master');
        expect(newBadges).toContain('memory-master');
    });

    it('does not duplicate badges', () => {
        const state = makeState({ completedPhases: [1], badges: ['first-star'] });
        const newBadges = checkBadges(state);
        expect(newBadges).not.toContain('first-star');
        expect(state.badges.filter(b => b === 'first-star')).toHaveLength(1);
    });

    it('awards multiple badges at once', () => {
        const state = makeState({ completedPhases: [1, 2, 3, 4, 5, 6], bestStreak: 5 });
        const newBadges = checkBadges(state);
        expect(newBadges).toContain('first-star');
        expect(newBadges).toContain('halfway');
        expect(newBadges).toContain('streak-3');
        expect(newBadges).toContain('streak-5');
    });
});

describe('BADGE_DEFS', () => {
    it('has 8 badges defined', () => {
        expect(BADGE_DEFS).toHaveLength(8);
    });

    it('each badge has unique id', () => {
        const ids = BADGE_DEFS.map(b => b.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
