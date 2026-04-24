// Fases 15 e 16: Somas e Subtracoes. Pools pre-computados.
// Nivel 1: resultados ate 5. Nivel 2: resultados ate 10.

function uniqueOptions(answer, maxAnswer) {
    const opts = new Set([answer]);
    while (opts.size < 4) {
        const candidate = Math.max(0, Math.floor(Math.random() * (maxAnswer + 2)));
        opts.add(candidate);
    }
    return [...opts].sort((a, b) => a - b);
}

function makeAdd(a, b, level) {
    const answer = a + b;
    return {
        id: `add-l${level}-${a}-${b}`,
        a, b, op: '+', answer,
        options: uniqueOptions(answer, level === 1 ? 5 : 10),
        level,
    };
}

function makeSub(a, b, level) {
    const answer = a - b;
    return {
        id: `sub-l${level}-${a}-${b}`,
        a, b, op: '-', answer,
        options: uniqueOptions(answer, level === 1 ? 5 : 10),
        level,
    };
}

// ========== SOMAS ==========
export const ADD_ROUNDS = (() => {
    const out = [];
    // Level 1: somas com resultado ate 5
    for (let a = 1; a <= 4; a++) {
        for (let b = 1; b <= 5 - a; b++) {
            out.push(makeAdd(a, b, 1));
        }
    }
    // Level 2: somas com resultado 6..10
    for (let a = 1; a <= 9; a++) {
        for (let b = 1; b <= 10 - a; b++) {
            const sum = a + b;
            if (sum >= 6 && sum <= 10) out.push(makeAdd(a, b, 2));
        }
    }
    return out;
})();

// ========== SUBTRACOES ==========
export const SUB_ROUNDS = (() => {
    const out = [];
    // Level 1: minuendo ate 5, resultado >= 0
    for (let a = 1; a <= 5; a++) {
        for (let b = 0; b <= a; b++) {
            if (b === 0 && a === 0) continue;
            out.push(makeSub(a, b, 1));
        }
    }
    // Level 2: minuendo 6..10, resultado >= 0
    for (let a = 6; a <= 10; a++) {
        for (let b = 1; b <= a; b++) {
            out.push(makeSub(a, b, 2));
        }
    }
    return out;
})();
