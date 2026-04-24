// Animações de fim de fase: confete, fogos, chuva de estrelas, arco-íris.

import { shopItemById, defaultItemId } from '../data/shop.js';

// Paleta com enfase nas cores do RS (vermelho, amarelo, verde) mais alguns acentos.
const CONFETTI_COLORS = ['#E53935','#FFEB3B','#2E7D32','#66BB6A','#FFD54F','#B71C1C','#AB47BC','#42A5F5'];

export function celebrate(state) {
    const effectId = (state.equipped && state.equipped.effect) || defaultItemId('effect');
    const effect = shopItemById(effectId);
    switch (effect && effect.id) {
        case 'effect-fireworks': return spawnFireworks();
        case 'effect-rainbow':   return spawnRainbow();
        case 'effect-stars':     return spawnStarRain();
        default:                 return spawnConfetti();
    }
}

export function spawnConfetti() {
    for (let i = 0; i < 40; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        c.style.animationDuration = (2 + Math.random() * 3) + 's';
        c.style.animationDelay = (Math.random() * 2) + 's';
        c.style.width = (8 + Math.random() * 10) + 'px';
        c.style.height = (8 + Math.random() * 10) + 'px';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 6000);
    }
}

export function spawnStarRain() {
    for (let i = 0; i < 30; i++) {
        const s = document.createElement('div');
        s.className = 'confetti star-rain';
        s.textContent = '\u2B50';
        s.style.left = Math.random() * 100 + 'vw';
        s.style.animationDuration = (2 + Math.random() * 2.5) + 's';
        s.style.animationDelay = (Math.random() * 2) + 's';
        s.style.fontSize = (16 + Math.random() * 18) + 'px';
        s.style.background = 'transparent';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 6000);
    }
}

export function spawnFireworks() {
    for (let k = 0; k < 6; k++) {
        setTimeout(() => {
            const cx = 15 + Math.random() * 70;
            const cy = 15 + Math.random() * 40;
            const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
            for (let i = 0; i < 14; i++) {
                const p = document.createElement('div');
                p.className = 'firework-particle';
                p.style.left = cx + 'vw';
                p.style.top = cy + 'vh';
                p.style.background = color;
                const angle = (i / 14) * Math.PI * 2;
                const dist = 80 + Math.random() * 60;
                p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
                p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 1100);
            }
        }, k * 350);
    }
}

export function spawnRainbow() {
    const arc = document.createElement('div');
    arc.className = 'rainbow-arc';
    document.body.appendChild(arc);
    setTimeout(() => arc.remove(), 3500);
    spawnConfetti();
}
