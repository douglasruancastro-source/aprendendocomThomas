// Utilitários puros (sem DOM)

export function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sampleN(arr, n) {
    return shuffle(arr).slice(0, Math.min(n, arr.length));
}

// Sorteia n itens do pool priorizando os que NÃO estão em recentIds.
// Se o pool "fresco" tiver menos que n, completa com sobras.
export function sampleWithoutRepeats(pool, n, recentIds, idFn) {
    const key = idFn || ((x) => x);
    const recent = new Set(recentIds || []);
    const fresh = pool.filter((it) => !recent.has(key(it)));
    const stale = pool.filter((it) => recent.has(key(it)));
    const chosen = sampleN(fresh, n);
    if (chosen.length < n) {
        chosen.push(...sampleN(stale, n - chosen.length));
    }
    return chosen;
}

export function todayStr(date) {
    const d = date || new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export function daysBetween(a, b) {
    const d1 = new Date(a + 'T00:00:00');
    const d2 = new Date(b + 'T00:00:00');
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}
