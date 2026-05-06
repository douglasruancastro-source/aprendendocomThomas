// Tutorial inicial (Fase 10.2).
// Mostra overlay sequencial com cards explicativos. Cada step pode apontar
// para um elemento alvo (CSS selector) e renderiza balão/seta perto dele.

import { soundClick } from '../audio.js';

// steps: [{ title, text, target?, position?: 'top'|'bottom'|'center' }]
export function startTutorial({ steps, onDone }) {
    if (!steps || steps.length === 0) {
        if (onDone) onDone();
        return;
    }
    let idx = 0;
    const overlay = document.createElement('div');
    overlay.className = 'tutorial-overlay overlay overlay--tutorial';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Tutorial');

    const card = document.createElement('div');
    card.className = 'tutorial-card';

    const title = document.createElement('h3');
    title.className = 'tutorial-title';
    card.appendChild(title);

    const text = document.createElement('p');
    text.className = 'tutorial-text';
    card.appendChild(text);

    const counter = document.createElement('div');
    counter.className = 'tutorial-counter';
    card.appendChild(counter);

    const actions = document.createElement('div');
    actions.className = 'tutorial-actions';

    const skipBtn = document.createElement('button');
    skipBtn.className = 'tutorial-skip btn-secondary btn--secondary';
    skipBtn.textContent = 'Pular';
    skipBtn.type = 'button';
    actions.appendChild(skipBtn);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'tutorial-next btn-primary btn--primary';
    nextBtn.type = 'button';
    actions.appendChild(nextBtn);

    card.appendChild(actions);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    function close() {
        overlay.remove();
        if (onDone) onDone();
    }

    function renderStep() {
        const step = steps[idx];
        title.textContent = step.title;
        text.textContent = step.text;
        counter.textContent = `${idx + 1} / ${steps.length}`;
        nextBtn.textContent = idx === steps.length - 1 ? 'Bora jogar! \u{1F3AE}' : 'Proximo \u{2192}';
        // Posiciona o card. Se houver target, posiciona perto dele.
        card.style.position = '';
        card.style.top = '';
        card.style.left = '';
        card.style.right = '';
        card.style.bottom = '';
        card.style.transform = '';
        if (step.target) {
            const el = document.querySelector(step.target);
            if (el) {
                const rect = el.getBoundingClientRect();
                const cardW = 320;
                const cardH = 200;
                let top, left;
                if (step.position === 'top' || rect.top > window.innerHeight - cardH - 30) {
                    top = Math.max(20, rect.top - cardH - 16);
                } else {
                    top = Math.min(window.innerHeight - cardH - 20, rect.bottom + 16);
                }
                left = Math.max(16, Math.min(window.innerWidth - cardW - 16, rect.left + rect.width / 2 - cardW / 2));
                card.style.position = 'fixed';
                card.style.top = `${top}px`;
                card.style.left = `${left}px`;
            }
        }
    }

    nextBtn.onclick = () => {
        soundClick();
        idx++;
        if (idx >= steps.length) close();
        else renderStep();
    };
    skipBtn.onclick = () => {
        soundClick();
        close();
    };

    renderStep();
}
