// Fase 13: Cores. Nivel 1 mostra o NOME, crianca toca na cor.
// Nivel 2 inverte: mostra a cor, crianca escolhe o nome (requer leitura).

export const COLORS = [
    { name: 'VERMELHO', hex: '#E53935' },
    { name: 'AMARELO',  hex: '#FFEB3B' },
    { name: 'VERDE',    hex: '#2E7D32' },
    { name: 'AZUL',     hex: '#1E88E5' },
    { name: 'ROSA',     hex: '#EC407A' },
    { name: 'ROXO',     hex: '#8E24AA' },
    { name: 'LARANJA',  hex: '#FB8C00' },
    { name: 'PRETO',    hex: '#212121' },
    { name: 'BRANCO',   hex: '#FAFAFA' },
    { name: 'MARROM',   hex: '#6D4C41' },
];

function pickOthers(correct, n) {
    const pool = COLORS.filter((c) => c.name !== correct.name);
    // Pseudo-shuffle deterministic para manter o pool — o renderer embaralha em runtime.
    return pool.slice(0, n);
}

// Level 1: mostra nome, 4 opcoes de cor (circulos).
const LEVEL_1 = COLORS.map((c, idx) => ({
    id: `col-l1-${c.name.toLowerCase()}`,
    mode: 'name-to-color',
    colorName: c.name,
    correctHex: c.hex,
    options: [c, ...pickOthers(c, 3 + (idx % 2 === 0 ? 0 : 0))].slice(0, 4).map((o) => ({ name: o.name, hex: o.hex })),
    level: 1,
}));

// Level 2: mostra a cor, 4 opcoes de NOME.
const LEVEL_2 = COLORS.map((c) => ({
    id: `col-l2-${c.name.toLowerCase()}`,
    mode: 'color-to-name',
    colorName: c.name,
    correctHex: c.hex,
    options: [c, ...pickOthers(c, 3)].slice(0, 4).map((o) => ({ name: o.name, hex: o.hex })),
    level: 2,
}));

export const COLOR_ROUNDS = [...LEVEL_1, ...LEVEL_2];
