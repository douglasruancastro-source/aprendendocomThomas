// Mapa interativo "Mundo das Tres Ilhas".
// Amarra os hotspots da tela #islandMap para chamar callbacks de navegacao.
// Idempotente: pode ser chamado em todo showIslandMap().

import { soundClick } from '../audio.js';
import { ISLANDS } from '../data/islands.js';

// Mapa de section (data-attribute do hotspot) -> ilha do dominio.
const SECTION_TO_ISLAND = {
    letters:   'forest',
    numbers:   'city',
    colors:    'rainbow',
    syllables: 'clouds',
    rewards:   'treasure',
};

function isIslandComplete(island, state) {
    if (!island || !state || !Array.isArray(state.completedPhases)) return false;
    const [from, to] = island.phaseRange;
    for (let id = from; id <= to; id++) {
        if (!state.completedPhases.includes(id)) return false;
    }
    return true;
}

export function renderIslandMap({ state, onPickSection, onOpenShop }) {
    const root = document.getElementById('islandMap');
    if (!root) return;

    root.querySelectorAll('.island-hotspot').forEach((btn) => {
        const section = btn.dataset.section;
        const islandId = SECTION_TO_ISLAND[section];
        const island = ISLANDS.find((i) => i.id === islandId);

        // Aplica/remove halo dourado se a ilha esta 100% completa.
        if (state && isIslandComplete(island, state)) {
            btn.classList.add('island-complete');
        } else {
            btn.classList.remove('island-complete');
        }

        // Substitui handler para evitar acumular listeners em re-render.
        btn.onclick = () => {
            soundClick();
            // 'rewards' = Ilha do Tesouro (fases 61-75)
            onPickSection(section);
        };
    });
}
