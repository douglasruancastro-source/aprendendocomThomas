// Tela #badges: tabs por raridade + grid paginado.

import { BADGE_DEFS, RARITY_ORDER, RARITY_LABELS } from '../rewards.js';
import { Pager } from '../components/Pager.js';
import { Tabs } from '../components/Tabs.js';

const PAGE_SIZE = 6;
const RARITY_EMOJI = { common: '⚪', rare: '🔵', epic: '🟣', legendary: '🟡' };
let currentRarity = 'all';

export function renderBadges(state) {
    const grid = document.getElementById('badgesGridLarge');
    if (!grid) return;
    grid.innerHTML = '';

    const earnedCount = BADGE_DEFS.filter((b) => state.badges.includes(b.id)).length;
    const summary = document.createElement('div');
    summary.className = 'badges-summary';
    summary.textContent = `🏅 ${earnedCount} / ${BADGE_DEFS.length} medalhas`;
    grid.appendChild(summary);

    // Tabs: Todas + 4 raridades
    const tabs = Tabs({
        tabs: [
            { key: 'all', label: 'Todas', emoji: '🏅' },
            ...RARITY_ORDER.map((r) => ({ key: r, label: RARITY_LABELS[r], emoji: RARITY_EMOJI[r] })),
        ],
        active: currentRarity,
        onChange: (k) => { currentRarity = k; renderBadges(state); },
    });
    grid.appendChild(tabs.element);

    const items = currentRarity === 'all'
        ? BADGE_DEFS
        : BADGE_DEFS.filter((b) => b.rarity === currentRarity);

    Pager({
        items,
        pageSize: PAGE_SIZE,
        container: grid,
        emptyText: 'Sem medalhas dessa raridade ainda.',
        renderItem: (b) => {
            const earned = state.badges.includes(b.id);
            const item = document.createElement('div');
            item.className = `badge-card rarity-${b.rarity || 'common'} ` + (earned ? 'earned' : 'locked');
            item.setAttribute('data-state', earned ? 'earned' : 'locked');
            item.setAttribute('data-rarity', b.rarity || 'common');

            const ribbon = document.createElement('div');
            ribbon.className = 'badge-rarity-ribbon';
            ribbon.textContent = RARITY_LABELS[b.rarity] || 'Comum';
            item.appendChild(ribbon);

            const icon = document.createElement('div');
            icon.className = 'badge-card-icon';
            icon.textContent = earned ? b.icon : '🔒';
            item.appendChild(icon);

            const name = document.createElement('div');
            name.className = 'badge-card-name';
            name.textContent = b.name;
            item.appendChild(name);

            if (b.desc) {
                const desc = document.createElement('div');
                desc.className = 'badge-card-desc';
                desc.textContent = b.desc;
                item.appendChild(desc);
            }
            return item;
        },
    });
    const innerGrid = grid.querySelector('.pager-grid');
    if (innerGrid) innerGrid.classList.add('cols-3', 'badges-pager-grid');
}
