// Menu de fases — paginado por ilha (5 fases por pagina, sem scroll vertical).
// Header com nome da ilha + estrelas. Cards grandes via LevelCard.

import { PHASES } from '../data/phases.js';
import { ISLANDS, islandForPhase } from '../data/islands.js';
import { soundClick } from '../audio.js';
import { LevelCard } from '../components/LevelCard.js';
import { Pager } from '../components/Pager.js';

const FILTER_CLASSES = ['filter-letters', 'filter-numbers', 'filter-colors', 'filter-syllables', 'filter-rewards', 'filter-treasure'];

// Mapa de filtro semantico -> ilha
const SECTION_TO_ISLAND = {
    letters:   'forest',
    numbers:   'city',
    colors:    'rainbow',
    syllables: 'clouds',
    rewards:   'treasure',
    treasure:  'treasure',
};

const PAGE_SIZE = 6;

function isPhaseUnlocked(phase, state, isCompleted) {
    if (phase.id === 1) return true;
    // Primeira fase de cada ilha desbloqueia ao completar a ultima da anterior.
    const island = islandForPhase(phase.id);
    if (island && phase.id === island.phaseRange[0]) {
        const prev = phase.id - 1;
        return prev <= 0 || state.completedPhases.includes(prev) || isCompleted;
    }
    return state.completedPhases.includes(phase.id - 1) || isCompleted;
}

export function renderMenu(state, onStartPhase, _onOpenShop, filter = 'all', onStartReview) {
    const menuRoot = document.getElementById('menu');
    if (!menuRoot) return;

    // Limpar filter classes (compat com selectors antigos)
    FILTER_CLASSES.forEach((c) => menuRoot.classList.remove(c));
    if (filter && filter !== 'all') menuRoot.classList.add(`filter-${filter}`);
    menuRoot.dataset.island = filter || 'all';

    // Limpar host criado em renderizacao anterior (mantem botao voltar)
    const oldHost = document.getElementById('menuPagerHost');
    if (oldHost) oldHost.remove();

    // Header da ilha (hero) + estrelas
    const islandId = SECTION_TO_ISLAND[filter];
    const island = ISLANDS.find((i) => i.id === islandId) || {
        id: 'all', name: 'Todas as Fases', emoji: '🎮', color: '#7E57C2', phaseRange: [1, 999],
    };
    const filtered = PHASES.filter((p) => p.id >= island.phaseRange[0] && p.id <= island.phaseRange[1]);
    const completedInIsland = filtered.filter((p) => state.completedPhases.includes(p.id)).length;

    const host = document.createElement('div');
    host.id = 'menuPagerHost';
    host.className = 'menu-host';

    // Propaga a cor da ilha para o root do #menu para o CSS aplicar bg/borders sutis.
    menuRoot.style.setProperty('--island-color', island.color);

    const header = document.createElement('div');
    header.className = 'menu-island-header';
    header.style.setProperty('--island-color', island.color);
    const emoji = document.createElement('span');
    emoji.className = 'menu-island-emoji';
    emoji.textContent = island.emoji;
    const titleBlock = document.createElement('div');
    titleBlock.className = 'menu-island-titleblock';
    const title = document.createElement('h2');
    title.className = 'menu-island-title';
    title.textContent = island.name;
    const progress = document.createElement('div');
    progress.className = 'menu-island-progress';
    progress.textContent = `⭐ ${completedInIsland} / ${filtered.length}`;
    titleBlock.appendChild(title);
    titleBlock.appendChild(progress);
    header.appendChild(emoji);
    header.appendChild(titleBlock);

    // Fase 12.2: botao "Treinar" so aparece se ha pelo menos 1 fase completa na ilha.
    if (onStartReview && completedInIsland > 0) {
        const trainBtn = document.createElement('button');
        trainBtn.className = 'menu-train-btn';
        trainBtn.type = 'button';
        trainBtn.title = 'Joga uma fase aleatoria que voce ja completou (50% das moedas)';
        const ic = document.createElement('span');
        ic.textContent = '\u{1F3B2}'; // 🎲
        ic.className = 'menu-train-icon';
        const lbl = document.createElement('span');
        lbl.textContent = 'Treinar';
        trainBtn.appendChild(ic);
        trainBtn.appendChild(lbl);
        trainBtn.onclick = () => {
            soundClick();
            const completedPhases = filtered.filter((p) => state.completedPhases.includes(p.id));
            if (completedPhases.length === 0) return;
            const random = completedPhases[Math.floor(Math.random() * completedPhases.length)];
            onStartReview(random.id);
        };
        header.appendChild(trainBtn);
    }

    host.appendChild(header);

    Pager({
        items: filtered,
        pageSize: PAGE_SIZE,
        container: host,
        emptyText: 'Em breve!',
        renderItem: (phase) => {
            const isCompleted = state.completedPhases.includes(phase.id);
            const isUnlocked = isPhaseUnlocked(phase, state, isCompleted);
            const stars = (state.phaseStars && state.phaseStars[phase.id]) || (isCompleted ? 1 : 0);
            const frame = (state.equipped && state.equipped.frame) || null;
            return LevelCard({
                phase,
                isCompleted,
                isUnlocked,
                stars,
                frame,
                onClick: isUnlocked ? () => { soundClick(); onStartPhase(phase.id); } : null,
            });
        },
    });
    // Aplica grid 3 colunas no pager
    const grid = host.querySelector('.pager-grid');
    if (grid) grid.classList.add('cols-3', 'menu-pager-grid');

    menuRoot.appendChild(host);
    renderHud(state);
}

// Atualiza HUD de moedas (contador no topo) + rank pill (Fase 9.18).
export function renderHud(state) {
    const el = document.getElementById('coinCount');
    if (el) el.textContent = state.coins || 0;
    // Rank pill: pega rank atual do estado
    import('../rewards.js').then(({ getRank }) => {
        const rank = getRank(state);
        const pill = document.getElementById('rankPill');
        if (pill) {
            pill.dataset.rank = rank.id;
            pill.title = `Rank ${rank.name} - bonus +${rank.bonusPercent}% em moedas`;
        }
        const ic = document.getElementById('rankIcon');
        if (ic) ic.textContent = rank.icon;
        const nm = document.getElementById('rankName');
        if (nm) nm.textContent = rank.name;
    });
}

// Anima a subida do contador de moedas quando ganha algo.
export function animateCoinGain(fromValue, toValue) {
    const el = document.getElementById('coinCount');
    if (!el) return;
    const duration = 600;
    const start = performance.now();
    const delta = toValue - fromValue;
    function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(fromValue + delta * eased);
        if (t < 1) requestAnimationFrame(frame);
        else el.textContent = toValue;
    }
    requestAnimationFrame(frame);
    el.classList.add('coin-pulse');
    setTimeout(() => el.classList.remove('coin-pulse'), 700);
}
