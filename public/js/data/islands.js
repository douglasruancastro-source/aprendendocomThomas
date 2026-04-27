// Mundo das Tres Ilhas — metadados das 5 ilhas + faixa de fases.
// Cada ilha tem 15 fases. Fases novas reaproveitam mecanicas existentes via `type`.

export const ISLANDS = [
    {
        id: 'forest',
        name: 'Ilha das Letras',
        emoji: '🌳',
        color: '#66BB6A',
        mascot: 'tomi',
        phaseRange: [1, 15],
        description: 'Floresta das letras com Tomi a capivara',
    },
    {
        id: 'city',
        name: 'Ilha dos Numeros',
        emoji: '🏙',
        color: '#42A5F5',
        mascot: 'ro',
        phaseRange: [16, 30],
        description: 'Cidade dos numeros com Ro o macaco',
    },
    {
        id: 'rainbow',
        name: 'Ilha das Cores',
        emoji: '🌈',
        color: '#FF7043',
        mascot: 'livi',
        phaseRange: [31, 45],
        description: 'Arco-iris vibrante com Livi a arara',
    },
    {
        id: 'clouds',
        name: 'Ilha das Silabas',
        emoji: '☁️',
        color: '#9C27B0',
        mascot: 'papagaio',
        phaseRange: [46, 60],
        description: 'Ceu magico das silabas',
    },
    {
        id: 'treasure',
        name: 'Ilha do Tesouro',
        emoji: '💎',
        color: '#FFB300',
        mascot: 'pirata',
        phaseRange: [61, 75],
        description: 'Desafios mistos para mestres',
    },
];

export function islandForPhase(phaseId) {
    return ISLANDS.find((i) => phaseId >= i.phaseRange[0] && phaseId <= i.phaseRange[1]);
}

export function islandById(id) {
    return ISLANDS.find((i) => i.id === id);
}

// Determina o tier (dificuldade) dentro da ilha pela posicao da fase.
// 1-5  -> tier 1 (facil)
// 6-10 -> tier 2 (medio)
// 11-15-> tier 3 (dificil)
export function tierForPhase(phase) {
    const island = islandForPhase(phase.id);
    if (!island) return 1;
    const offset = phase.id - island.phaseRange[0]; // 0..14
    if (offset < 5) return 1;
    if (offset < 10) return 2;
    return 3;
}
