// Fase 14: Reconhecer numero. Mostra numeral grande, crianca escolhe entre 4 grupos
// de objetos qual tem aquela quantidade.

// Usa chaves de SHAPE_SVG para desenhar os grupos (formas simples, coloridas).
const ITEMS = ['star', 'heart', 'circle', 'square', 'triangle', 'diamond'];

function uniqueOptions(correct, maxVal) {
    const opts = new Set([correct]);
    while (opts.size < 4) {
        const candidate = 1 + Math.floor(Math.random() * maxVal);
        opts.add(candidate);
    }
    return [...opts];
}

// Geramos deterministico-ish: para cada numero N, criamos 2 rounds com items diferentes.
const LEVEL_1 = [];
for (let n = 1; n <= 5; n++) {
    ITEMS.slice(0, 2).forEach((item, i) => {
        LEVEL_1.push({
            id: `num-l1-${n}-${item}`,
            number: n,
            item,
            correctCount: n,
            counts: [n, n + 1, Math.max(1, n - 1), n + 2].slice(0, 4),
            level: 1,
        });
    });
}

const LEVEL_2 = [];
for (let n = 6; n <= 10; n++) {
    ITEMS.slice(2, 4).forEach((item, i) => {
        LEVEL_2.push({
            id: `num-l2-${n}-${item}`,
            number: n,
            item,
            correctCount: n,
            counts: [n, n - 2, n + 1, n - 1],
            level: 2,
        });
    });
}

// Garante que o correto esta na primeira posicao; o renderer embaralha.
export const NUMBER_ROUNDS = [...LEVEL_1, ...LEVEL_2].map((r) => {
    // Forca unicidade dos counts e inclui o correto
    const uniq = [...new Set(r.counts.filter((c) => c > 0))];
    if (!uniq.includes(r.correctCount)) uniq.unshift(r.correctCount);
    while (uniq.length < 4) uniq.push(uniq[uniq.length - 1] + 1);
    return { ...r, counts: uniq.slice(0, 4) };
});
