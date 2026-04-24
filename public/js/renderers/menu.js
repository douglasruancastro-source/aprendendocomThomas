// Menu principal: barra de estrelas, grid de fases, HUD de moedas, medalhas.

import { PHASES } from '../data/phases.js';
import { BADGE_DEFS } from '../rewards.js';
import { soundClick } from '../audio.js';

export function renderMenu(state, onStartPhase, onOpenShop) {
    const grid = document.getElementById('phasesGrid');
    const gridLogic = document.getElementById('phasesGridLogic');
    const gridMath = document.getElementById('phasesGridMath');
    const starsBar = document.getElementById('starsBar');
    grid.innerHTML = '';
    gridLogic.innerHTML = '';
    if (gridMath) gridMath.innerHTML = '';

    const starCount = state.completedPhases.length;
    starsBar.textContent = '\u2B50'.repeat(starCount) + '\u2606'.repeat(PHASES.length - starCount);

    PHASES.forEach((phase) => {
        const isCompleted = state.completedPhases.includes(phase.id);
        // Desbloqueio: fase 1 sempre; demais precisam da anterior OU ja completaram.
        // Secoes 9-12 (logica) pedem fase 8 pra iniciar; 13-16 (math) pedem fase 12 pra iniciar.
        let unlocked;
        if (phase.id === 1) {
            unlocked = true;
        } else if (phase.id === 9) {
            unlocked = state.completedPhases.includes(8) || isCompleted;
        } else if (phase.id === 13) {
            unlocked = state.completedPhases.includes(12) || isCompleted;
        } else {
            unlocked = state.completedPhases.includes(phase.id - 1) || isCompleted;
        }

        const card = document.createElement('div');
        card.className = 'phase-card' + (unlocked ? '' : ' locked');
        card.style.borderLeft = `5px solid ${phase.color}`;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Fase ${phase.id}: ${phase.subtitle}${unlocked ? '' : ' (bloqueada)'}`);

        const num = document.createElement('div');
        num.className = 'phase-num';
        num.style.color = phase.color;
        num.textContent = String(phase.id);
        card.appendChild(num);

        const titleEl = document.createElement('div');
        titleEl.className = 'phase-title';
        titleEl.textContent = phase.subtitle;
        card.appendChild(titleEl);

        if (isCompleted) {
            const star = document.createElement('div');
            star.className = 'phase-star';
            star.textContent = '\u2B50';
            card.appendChild(star);
        }

        if (unlocked) {
            card.onclick = () => { soundClick(); onStartPhase(phase.id); };
        }

        let targetGrid;
        if (phase.id <= 8) targetGrid = grid;
        else if (phase.id <= 12) targetGrid = gridLogic;
        else targetGrid = gridMath || gridLogic;
        targetGrid.appendChild(card);
    });

    renderBadges(state);
    renderHud(state);

    const shopBtn = document.getElementById('shopBtn');
    if (shopBtn) shopBtn.onclick = () => { soundClick(); onOpenShop(); };
}

export function renderBadges(state) {
    const grid = document.getElementById('badgesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    BADGE_DEFS.forEach((b) => {
        const item = document.createElement('div');
        item.className = 'badge-item';
        const earned = state.badges.includes(b.id);
        const icon = document.createElement('div');
        icon.className = 'badge-icon ' + (earned ? 'earned' : 'locked');
        icon.textContent = b.icon;
        const nameEl = document.createElement('div');
        nameEl.className = 'badge-name';
        nameEl.textContent = b.name;
        item.appendChild(icon);
        item.appendChild(nameEl);
        item.title = b.desc;
        grid.appendChild(item);
    });
}

// Atualiza HUD de moedas (contador no topo).
export function renderHud(state) {
    const el = document.getElementById('coinCount');
    if (el) el.textContent = state.coins || 0;
}

// Anima a subida do contador de moedas quando ganha algo.
// Tween simples com requestAnimationFrame.
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
