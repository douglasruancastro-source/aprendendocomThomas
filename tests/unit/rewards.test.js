import { describe, it, expect, beforeEach } from 'vitest';
import {
    BADGE_DEFS,
    COIN_REWARDS,
    FAST_ANSWER_MS,
    checkBadges,
    addCoins,
    spendCoins,
    rewardForAnswer,
    rewardForPhaseEnd,
    applyDailyBonus,
} from '../../public/js/rewards.js';
import { defaultState } from '../../public/js/state.js';

function makeState(overrides = {}) {
    return { ...defaultState(), ...overrides };
}

describe('checkBadges', () => {
    it('awards first-star when 1 phase completed', () => {
        const state = makeState({ completedPhases: [1] });
        expect(checkBadges(state)).toContain('first-star');
        expect(state.badges).toContain('first-star');
    });

    it('does not award first-star when no phases completed', () => {
        expect(checkBadges(makeState())).not.toContain('first-star');
    });

    it('awards halfway at 6 phases, all-complete at 12', () => {
        const half = makeState({ completedPhases: [1, 2, 3, 4, 5, 6] });
        expect(checkBadges(half)).toContain('halfway');
        const all = makeState({ completedPhases: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] });
        expect(checkBadges(all)).toContain('all-complete');
    });

    it('awards streak badges by bestStreak threshold', () => {
        expect(checkBadges(makeState({ bestStreak: 3 }))).toContain('streak-3');
        expect(checkBadges(makeState({ bestStreak: 5 }))).toContain('streak-5');
        expect(checkBadges(makeState({ bestStreak: 10 }))).toContain('streak-10');
    });

    it('awards perfect and memory-master via extra argument', () => {
        expect(checkBadges(makeState(), 'perfect')).toContain('perfect');
        expect(checkBadges(makeState(), 'memory-master')).toContain('memory-master');
    });

    it('awards logic-start only when a phase >= 9 completed', () => {
        expect(checkBadges(makeState({ completedPhases: [1, 2, 3, 4, 5, 6, 7, 8] }))).not.toContain('logic-start');
        expect(checkBadges(makeState({ completedPhases: [9] }))).toContain('logic-start');
    });

    it('awards coin badges when totalCoinsEarned crosses thresholds', () => {
        expect(checkBadges(makeState({ totalCoinsEarned: 100 }))).toContain('coin-100');
        expect(checkBadges(makeState({ totalCoinsEarned: 1000 }))).toContain('coin-1000');
    });

    it('awards shopper after buying first item', () => {
        expect(checkBadges(makeState({ ownedItems: ['theme-space'] }))).toContain('shopper');
    });

    it('awards daily-3 and daily-7 by dailyStreak', () => {
        expect(checkBadges(makeState({ dailyStreak: 3 }))).toContain('daily-3');
        expect(checkBadges(makeState({ dailyStreak: 7 }))).toContain('daily-7');
    });

    it('does not duplicate badges', () => {
        const state = makeState({ completedPhases: [1], badges: ['first-star'] });
        expect(checkBadges(state)).not.toContain('first-star');
        expect(state.badges.filter((b) => b === 'first-star')).toHaveLength(1);
    });
});

describe('BADGE_DEFS', () => {
    it('has unique ids', () => {
        const ids = BADGE_DEFS.map((b) => b.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('includes the new coin / shop / daily badges', () => {
        const ids = BADGE_DEFS.map((b) => b.id);
        expect(ids).toEqual(expect.arrayContaining([
            'first-star','streak-3','streak-5','perfect','halfway','logic-start',
            'all-complete','memory-master','coin-100','coin-1000','shopper',
            'daily-3','daily-7',
        ]));
    });
});

describe('addCoins / spendCoins', () => {
    it('adds coins and tracks totalCoinsEarned', () => {
        const state = makeState();
        addCoins(state, 50);
        addCoins(state, 30);
        expect(state.coins).toBe(80);
        expect(state.totalCoinsEarned).toBe(80);
    });

    it('ignores non-positive amounts', () => {
        const state = makeState();
        const r = addCoins(state, 0);
        expect(r.coinsAwarded).toBe(0);
        expect(state.coins).toBe(0);
        addCoins(state, -5);
        expect(state.coins).toBe(0);
    });

    it('spendCoins only succeeds if funds available; never touches totalCoinsEarned', () => {
        const state = makeState();
        addCoins(state, 100);
        expect(spendCoins(state, 30)).toBe(true);
        expect(state.coins).toBe(70);
        expect(state.totalCoinsEarned).toBe(100);
        expect(spendCoins(state, 500)).toBe(false);
        expect(state.coins).toBe(70);
    });
});

describe('rewardForAnswer', () => {
    it('awards 0 when incorrect', () => {
        const r = rewardForAnswer(makeState(), { correct: false, responseMs: 500, newStreak: 0 });
        expect(r.coinsAwarded).toBe(0);
    });

    it('awards fastCorrect when under FAST_ANSWER_MS', () => {
        const s = makeState();
        const r = rewardForAnswer(s, { correct: true, responseMs: 1000, newStreak: 1 });
        expect(r.coinsAwarded).toBe(COIN_REWARDS.fastCorrect);
        expect(s.coins).toBe(COIN_REWARDS.fastCorrect);
    });

    it('awards normal correct when over FAST_ANSWER_MS', () => {
        const r = rewardForAnswer(makeState(), { correct: true, responseMs: FAST_ANSWER_MS + 500, newStreak: 1 });
        expect(r.coinsAwarded).toBe(COIN_REWARDS.correct);
    });

    it('stacks streak bonus at 3, 5, 10', () => {
        const r3 = rewardForAnswer(makeState(), { correct: true, responseMs: 500, newStreak: 3 });
        expect(r3.coinsAwarded).toBe(COIN_REWARDS.fastCorrect + COIN_REWARDS.streakBonus3);
        const r5 = rewardForAnswer(makeState(), { correct: true, responseMs: 500, newStreak: 5 });
        expect(r5.coinsAwarded).toBe(COIN_REWARDS.fastCorrect + COIN_REWARDS.streakBonus5);
        const r10 = rewardForAnswer(makeState(), { correct: true, responseMs: 500, newStreak: 10 });
        expect(r10.coinsAwarded).toBe(COIN_REWARDS.fastCorrect + COIN_REWARDS.streakBonus10);
    });
});

describe('rewardForPhaseEnd', () => {
    it('awards nothing when not passed', () => {
        expect(rewardForPhaseEnd(makeState(), { phaseId: 1, passed: false }).coinsAwarded).toBe(0);
    });

    it('awards phaseComplete when passed, extra when perfect and firstTime', () => {
        const base = rewardForPhaseEnd(makeState(), { phaseId: 1, passed: true, perfect: false, firstTime: false });
        expect(base.coinsAwarded).toBe(COIN_REWARDS.phaseComplete);
        const perf = rewardForPhaseEnd(makeState(), { phaseId: 1, passed: true, perfect: true, firstTime: true });
        expect(perf.coinsAwarded).toBe(
            COIN_REWARDS.phaseComplete + COIN_REWARDS.phasePerfect + COIN_REWARDS.firstTimeCompletePhase,
        );
    });
});

describe('applyDailyBonus', () => {
    let state;
    beforeEach(() => { state = makeState(); });

    it('grants dailyLogin on first play ever', () => {
        const r = applyDailyBonus(state, new Date(2026, 3, 23));
        expect(r.coinsAwarded).toBe(COIN_REWARDS.dailyLogin);
        expect(state.dailyStreak).toBe(1);
        expect(state.lastPlayDay).toBe('2026-04-23');
    });

    it('is idempotent on the same day', () => {
        applyDailyBonus(state, new Date(2026, 3, 23));
        const r = applyDailyBonus(state, new Date(2026, 3, 23));
        expect(r.coinsAwarded).toBe(0);
    });

    it('increments streak on consecutive days', () => {
        applyDailyBonus(state, new Date(2026, 3, 23));
        applyDailyBonus(state, new Date(2026, 3, 24));
        const r = applyDailyBonus(state, new Date(2026, 3, 25));
        expect(state.dailyStreak).toBe(3);
        expect(r.coinsAwarded).toBe(COIN_REWARDS.dailyLogin + COIN_REWARDS.dailyStreak3);
    });

    it('grants big 7-day bonus on 7th consecutive day', () => {
        state.lastPlayDay = '2026-04-22';
        state.dailyStreak = 6;
        const r = applyDailyBonus(state, new Date(2026, 3, 23));
        expect(state.dailyStreak).toBe(7);
        expect(r.coinsAwarded).toBe(COIN_REWARDS.dailyLogin + COIN_REWARDS.dailyStreak7);
    });

    it('resets streak when gap > 1 day', () => {
        state.lastPlayDay = '2026-04-20';
        state.dailyStreak = 5;
        applyDailyBonus(state, new Date(2026, 3, 25));
        expect(state.dailyStreak).toBe(1);
    });
});
