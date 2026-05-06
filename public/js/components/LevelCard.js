// LevelCard: card de fase usado no menu. Mostra ate 3 estrelas conquistadas.
// Mantem a API antiga (onclick em <div> com role=button) para nao quebrar testes existentes.

export function LevelCard({ phase, isCompleted, isUnlocked, onClick, stars = 0, frame = null }) {
    const card = document.createElement('div');
    const state = isCompleted ? 'completed' : (isUnlocked ? 'available' : 'locked');
    card.className = 'phase-card card card--interactive' + (isUnlocked ? '' : ' locked');
    card.setAttribute('data-state', state);
    card.setAttribute('data-phase-id', String(phase.id));
    // Fase 9 - Onda 3.2: aplica moldura equipada nas fases completas.
    if (isCompleted && frame && frame !== 'frame-default') {
        card.dataset.frame = frame;
    }
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Fase ${phase.id}: ${phase.subtitle}${isUnlocked ? '' : ' (bloqueada)'}`);
    card.style.borderLeft = `5px solid ${phase.color}`;

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
        const starsEl = document.createElement('div');
        starsEl.className = 'phase-stars';
        starsEl.setAttribute('aria-label', `${stars || 1} de 3 estrelas`);
        const earned = Math.max(1, stars || 0);
        for (let i = 0; i < 3; i++) {
            const s = document.createElement('span');
            s.className = 'phase-star ' + (i < earned ? 'on' : 'off');
            s.textContent = '⭐';
            starsEl.appendChild(s);
        }
        card.appendChild(starsEl);
    }

    if (!isUnlocked) {
        const lock = document.createElement('div');
        lock.className = 'phase-lock';
        lock.textContent = '🔒';
        lock.setAttribute('aria-hidden', 'true');
        card.appendChild(lock);
    }

    if (isUnlocked && onClick) {
        card.onclick = onClick;
    }

    return card;
}
