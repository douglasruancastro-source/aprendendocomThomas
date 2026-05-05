// Mapa interativo "Mundo das Tres Ilhas" — home redesenhada (Fase 15).
// Popula os 5 island-cards com progresso (X/15) + estado (locked/available/complete),
// preenche a top-strip (X/75 + streak diario) e o CTA "Continuar — proxima fase desbloqueada".
// Idempotente: pode ser chamado em todo showIslandMap().

import { soundClick } from '../audio.js';
import { ISLANDS, islandForPhase } from '../data/islands.js';
import { PHASES } from '../data/phases.js';

// section (data-attribute do card) -> ilha do dominio.
const SECTION_TO_ISLAND = {
    letters:   'forest',
    numbers:   'city',
    colors:    'rainbow',
    syllables: 'clouds',
    rewards:   'treasure',
};

function islandProgress(island, state) {
    if (!island || !state || !Array.isArray(state.completedPhases)) {
        return { done: 0, total: 0, complete: false };
    }
    const [from, to] = island.phaseRange;
    const total = to - from + 1;
    let done = 0;
    for (let id = from; id <= to; id++) {
        if (state.completedPhases.includes(id)) done++;
    }
    return { done, total, complete: done === total };
}

// Determina se a ilha esta destravada: a primeira (forest) sempre, as demais
// abrem com a ultima fase da ilha anterior completa.
function isIslandUnlocked(island, state) {
    if (!island) return false;
    if (island.id === 'forest') return true;
    const idx = ISLANDS.findIndex((i) => i.id === island.id);
    if (idx <= 0) return true;
    const prev = ISLANDS[idx - 1];
    const lastPrev = prev.phaseRange[1];
    return Array.isArray(state.completedPhases) && state.completedPhases.includes(lastPrev);
}

// Proxima fase desbloqueada (a primeira com id > 0 que nao esta em completedPhases
// e cuja anterior foi feita — ou a fase 1 se nao ha nada feito).
function nextUnlockedPhase(state) {
    const completed = new Set(state.completedPhases || []);
    if (!completed.size) return PHASES[0];
    for (let i = 0; i < PHASES.length; i++) {
        const p = PHASES[i];
        if (completed.has(p.id)) continue;
        // Verifica se esta destravada: id 1 sempre, primeira da ilha = ultima da anterior, demais = id-1 feito.
        if (p.id === 1) return p;
        const island = islandForPhase(p.id);
        if (island && p.id === island.phaseRange[0]) {
            const prev = p.id - 1;
            if (prev <= 0 || completed.has(prev)) return p;
            continue;
        }
        if (completed.has(p.id - 1)) return p;
    }
    return null; // tudo completo
}

function renderTopStrip(state) {
    const totalPhases = PHASES.length;
    const done = (state.completedPhases || []).filter((id) => id > 0 && id <= totalPhases).length;
    const text = document.getElementById('homeProgressText');
    if (text) text.textContent = `${done}/${totalPhases}`;
    const streakWrap = document.getElementById('homeProgressStreak');
    const streakCount = document.getElementById('homeStreakCount');
    if (streakWrap && streakCount) {
        const s = state.dailyStreak || 0;
        if (s > 0) {
            streakCount.textContent = String(s);
            streakWrap.hidden = false;
        } else {
            streakWrap.hidden = true;
        }
    }
}

function renderIslandCards(state, onPickSection) {
    const root = document.getElementById('islandMap');
    if (!root) return;
    root.querySelectorAll('.island-card').forEach((card) => {
        const section = card.dataset.section;
        const islandId = SECTION_TO_ISLAND[section];
        const island = ISLANDS.find((i) => i.id === islandId);
        if (!island) return;

        const { done, total, complete } = islandProgress(island, state);
        const unlocked = isIslandUnlocked(island, state);

        // Progress bar + meta
        const fill = card.querySelector('.island-card-bar-fill');
        if (fill) fill.style.width = total > 0 ? `${Math.round((done / total) * 100)}%` : '0%';
        const progress = card.querySelector('.island-card-progress');
        if (progress) progress.textContent = `${done}/${total}`;

        // Estados visuais (cardapio sempre clicavel — gating fica no menu de fases).
        card.classList.toggle('island-complete', complete);
        card.removeAttribute('aria-disabled');
        if (!unlocked) card.dataset.state = 'locked';
        else if (complete) card.dataset.state = 'completed';
        else card.dataset.state = 'available';

        // Click handler (substitui pra evitar acumular listeners).
        // Sempre abre o menu da ilha — gating fica nas fases (menu.js).
        card.onclick = () => {
            soundClick();
            onPickSection(section);
        };
    });
}

function renderContinueCTA(state, onContinue) {
    const btn = document.getElementById('continueBtn');
    if (!btn) return;
    const next = nextUnlockedPhase(state);
    const subEl = btn.querySelector('#continueLabel');
    const labelEl = btn.querySelector('.home-cta-label');

    if (!next) {
        // Tudo completo
        if (labelEl) labelEl.textContent = 'Aventura completa!';
        if (subEl) subEl.textContent = 'Volte pra revisar suas fases favoritas';
        btn.classList.add('home-cta-done');
    } else {
        const island = islandForPhase(next.id);
        const islandName = island ? island.name.replace(/^Ilha\s+/i, '') : '';
        const totalDone = (state.completedPhases || []).length;
        if (labelEl) labelEl.textContent = totalDone === 0 ? 'Comecar' : 'Continuar';
        if (subEl) subEl.textContent = `Fase ${next.id} - ${next.title}${islandName ? ' · ' + islandName : ''}`;
        btn.classList.remove('home-cta-done');
    }

    btn.onclick = () => {
        soundClick();
        onContinue(next);
    };
}

export function renderIslandMap({ state, onPickSection, onContinue }) {
    renderTopStrip(state);
    renderIslandCards(state, onPickSection);
    renderContinueCTA(state, onContinue || (() => {}));
}
