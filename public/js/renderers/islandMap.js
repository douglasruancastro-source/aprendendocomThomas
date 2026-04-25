// Mapa interativo "Mundo das Tres Ilhas".
// Amarra os hotspots da tela #islandMap para chamar callbacks de navegacao.
// Idempotente: pode ser chamado em todo showIslandMap().

import { soundClick } from '../audio.js';

export function renderIslandMap({ onPickSection, onOpenShop }) {
    const root = document.getElementById('islandMap');
    if (!root) return;

    root.querySelectorAll('.island-hotspot').forEach((btn) => {
        // Substitui handler para evitar acumular listeners em re-render.
        btn.onclick = () => {
            soundClick();
            const section = btn.dataset.section;
            if (section === 'rewards') {
                onOpenShop();
            } else {
                onPickSection(section);
            }
        };
    });
}
