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
        // v4: estrelas por fase (1..3). Fase nao completada = ausente ou 0.
        phaseStars: {}, // { phaseId: 0|1|2|3 }
        // v5 (Fase 10): tutorial inicial + PIN da Area dos Pais.
        hasSeenTutorial: false,
        parentsPin: null, // string de 4 digitos ou null
        version: 5,
    };
}

// Faz merge profundo do state default com o carregado, preservando campos aninhados novos.
function mergeState(defaults, loaded) {
    const out = { ...defaults, ...loaded };
    out.equipped = { ...defaults.equipped, ...(loaded.equipped || {}) };
    out.recentRounds = { ...(loaded.recentRounds || {}) };
    out.phaseStats = { ...(loaded.phaseStats || {}) };
    out.phaseStars = { ...(loaded.phaseStars || {}) };
    return out;
}

// Migracao v3 -> v4: assume 1 estrela em cada fase ja completada.
function migrateV3toV4(v3) {
    const stars = { ...(v3.phaseStars || {}) };
    (v3.completedPhases || []).forEach((id) => {
        if (!stars[id]) stars[id] = 1;
    });
    return { ...v3, phaseStars: stars, version: 4 };
}

// Migracao v4 -> v5: adiciona hasSeenTutorial=false e parentsPin=null (lossless).
// Usuarios antigos veem o tutorial uma vez.
function migrateV4toV5(v4) {
    return {
        ...v4,
        hasSeenTutorial: v4.hasSeenTutorial ?? false,
        parentsPin: v4.parentsPin ?? null,
        version: 5,
    };
}

export function loadState(storage) {
    const store = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!store) return defaultState();
    try {
        const stored = JSON.parse(store.getItem(STATE_KEY));
        if (stored && stored.completedPhases) {
            // v5 ja tem hasSeenTutorial/parentsPin
            if (stored.version === 5) {
                return mergeState(defaultState(), stored);
            }
            // v4 -> v5
            if (stored.version === 4) {
                const migrated = mergeState(defaultState(), migrateV4toV5(stored));
                saveState(migrated, store);
                return migrated;
            }
            // v3 -> v4 -> v5
            if (stored.version === 3) {
                const v4 = migrateV3toV4(stored);
                const migrated = mergeState(defaultState(), migrateV4toV5(v4));
                saveState(migrated, store);
                return migrated;
            }
            // versao desconhecida — tratar como v3 (legacy mais comum)
            const v4 = migrateV3toV4(stored);
            const migrated = mergeState(defaultState(), migrateV4toV5(v4));
            saveState(migrated, store);
            return migrated;
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
