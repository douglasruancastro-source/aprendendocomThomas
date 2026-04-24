// Estado persistido (localStorage). Pode ser usado em testes via jsdom.

export const STATE_KEY = 'thomas_learning_v3';
export const LEGACY_V2_KEY = 'thomas_learning_v2';
export const LEGACY_V1_KEY = 'thomas_learning_v1';

// Bônus concedido ao migrar de v2 para v3 (moedas de boas-vindas)
export const MIGRATION_BONUS_COINS = 500;

export function defaultState() {
    return {
        playerName: '',
        completedPhases: [],
        drawingsUsed: [],
        badges: [],
        streak: 0,
        bestStreak: 0,
        totalCorrect: 0,
        coins: 0,
        totalCoinsEarned: 0,
        ownedItems: [],
        equipped: { theme: 'theme-default', mascot: 'mascot-default', accessory: 'acc-none', effect: 'effect-default' },
        lastPlayDay: null,
        dailyStreak: 0,
        recentRounds: {}, // { phaseId: [lastIds...] }
        phaseStats: {}, // { phaseId: { plays, lastScores: [pct,...] } }
        version: 3,
    };
}

// Faz merge profundo do state default com o carregado, preservando campos aninhados novos.
function mergeState(defaults, loaded) {
    const out = { ...defaults, ...loaded };
    out.equipped = { ...defaults.equipped, ...(loaded.equipped || {}) };
    out.recentRounds = { ...(loaded.recentRounds || {}) };
    out.phaseStats = { ...(loaded.phaseStats || {}) };
    return out;
}

export function loadState(storage) {
    const store = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!store) return defaultState();
    try {
        const v3 = JSON.parse(store.getItem(STATE_KEY));
        if (v3 && v3.completedPhases && v3.version === 3) {
            return mergeState(defaultState(), v3);
        }
        const v2 = JSON.parse(store.getItem(LEGACY_V2_KEY));
        if (v2 && v2.completedPhases) {
            const migrated = mergeState(defaultState(), {
                completedPhases: v2.completedPhases || [],
                drawingsUsed: v2.drawingsUsed || [],
                badges: v2.badges || [],
                bestStreak: v2.bestStreak || 0,
                totalCorrect: v2.totalCorrect || 0,
                coins: MIGRATION_BONUS_COINS,
                totalCoinsEarned: MIGRATION_BONUS_COINS,
            });
            saveState(migrated, store);
            return migrated;
        }
        const v1 = JSON.parse(store.getItem(LEGACY_V1_KEY));
        if (v1 && v1.completedPhases) {
            return mergeState(defaultState(), {
                completedPhases: v1.completedPhases,
                drawingsUsed: v1.drawingsUsed || [],
                coins: MIGRATION_BONUS_COINS,
                totalCoinsEarned: MIGRATION_BONUS_COINS,
            });
        }
        return defaultState();
    } catch {
        return defaultState();
    }
}

export function saveState(state, storage) {
    const store = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!store) return;
    try {
        store.setItem(STATE_KEY, JSON.stringify(state));
    } catch {
        /* storage cheio ou indisponível — ignora silenciosamente */
    }
}

export function resetState(storage) {
    const store = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (store) {
        store.removeItem(STATE_KEY);
        store.removeItem(LEGACY_V2_KEY);
        store.removeItem(LEGACY_V1_KEY);
    }
    return defaultState();
}
