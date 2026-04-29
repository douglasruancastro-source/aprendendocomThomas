// Overlay de feedback (certo/errado) com controle do mascote.

import { soundCorrect, soundWrong, soundClick, soundBigReward } from '../audio.js';
import { setMascot } from './mascot.js';
import { consumePowerup, powerupStock } from '../shop.js';
import { saveState } from '../state.js';

const SPARKLE_COUNT = 8;
const SPARKLE_GLYPH = '✨'; // ✨

// Insere camada de sparkles dentro do overlay (limpa a anterior se houver).
function injectSparkles(overlay) {
    let layer = overlay.querySelector('.sparkle-layer');
    if (layer) layer.remove();
    layer = document.createElement('div');
    layer.className = 'sparkle-layer';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < SPARKLE_COUNT; i++) {
        const sp = document.createElement('span');
        sp.className = 'sparkle';
        sp.textContent = SPARKLE_GLYPH;
        // Direcao aleatoria a partir do centro do overlay.
        const angle = (Math.PI * 2 * i) / SPARKLE_COUNT + (Math.random() - 0.5) * 0.5;
        const dist = 70 + Math.random() * 90;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        sp.style.setProperty('--dx', `${dx}px`);
        sp.style.setProperty('--dy', `${dy}px`);
        // Pequena variacao de tamanho/delay para parecer organico.
        sp.style.fontSize = `${18 + Math.floor(Math.random() * 12)}px`;
        sp.style.animationDelay = `${Math.random() * 120}ms`;
        layer.appendChild(sp);
    }
    overlay.appendChild(layer);
}

export function showFeedback(state, correct, msg) {
    const overlay = document.getElementById('feedbackOverlay');
    document.getElementById('fbEmoji').textContent = correct ? '⭐' : '😕';
    document.getElementById('fbMsg').textContent = msg || (correct ? 'Muito bem!' : 'Tenta de novo!');
    overlay.classList.add('active');
    if (correct) {
        injectSparkles(overlay);
        soundCorrect();
        setMascot('happy', state);
    } else {
        soundWrong();
        setMascot('sad', state);
    }

    // Fase 9.16: botao "Tenta de Novo" aparece quando errou e ha powerup em estoque.
    let retryBtn = overlay.querySelector('.retry-btn');
    if (retryBtn) retryBtn.remove();
    let retryClicked = false;
    if (!correct && powerupStock(state, 'powerup-retry') > 0) {
        retryBtn = document.createElement('button');
        retryBtn.className = 'retry-btn';
        retryBtn.textContent = '🔄 Tenta de Novo (-1)';
        overlay.querySelector('.feedback-box').appendChild(retryBtn);
    }

    return new Promise((r) => {
        const close = (extra) => {
            overlay.classList.remove('active');
            const layer = overlay.querySelector('.sparkle-layer');
            if (layer) layer.remove();
            const rb = overlay.querySelector('.retry-btn');
            if (rb) rb.remove();
            setMascot('idle', state);
            r(extra || {});
        };
        if (retryBtn) {
            retryBtn.onclick = () => {
                if (retryClicked) return;
                retryClicked = true;
                soundClick();
                consumePowerup(state, 'powerup-retry');
                saveState(state);
                close({ retry: true });
            };
        }
        setTimeout(() => {
            if (retryClicked) return;
            close();
        }, correct ? 1200 : 1500);
    });
}

// Confete inline para celebrar streaks altas. Reutiliza o keyframe confettiDrop.
const STREAK_BURST_COLORS = ['#FFD54F', '#66BB6A', '#FF8A65', '#4FC3F7', '#BA68C8', '#FFB74D'];
export function showStreakBurst(count = 16) {
    const layer = document.createElement('div');
    layer.className = 'streak-burst-layer';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('span');
        piece.className = 'streak-confetti';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.background = STREAK_BURST_COLORS[i % STREAK_BURST_COLORS.length];
        piece.style.animationDelay = `${Math.random() * 200}ms`;
        piece.style.animationDuration = `${1.0 + Math.random() * 0.6}s`;
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 1700);
}

// Celebração de subida de Rank (Fase 10.1).
// Mostra overlay grande com ícone do rank, nome, bônus, confete e som.
// Reusa animations existentes (bounce, confettiDrop).
const RANKUP_CONFETTI_COLORS = ['#FFD54F', '#66BB6A', '#FF8A65', '#4FC3F7', '#BA68C8', '#FFB74D'];
export function showRankUpCelebration(rank) {
    if (!rank) return;
    soundBigReward();

    const overlay = document.createElement('div');
    overlay.className = 'rankup-overlay';
    overlay.setAttribute('aria-live', 'polite');

    const card = document.createElement('div');
    card.className = 'rankup-card';
    card.dataset.rank = rank.id;

    const icon = document.createElement('div');
    icon.className = 'rankup-icon';
    icon.textContent = rank.icon;
    card.appendChild(icon);

    const subtitle = document.createElement('div');
    subtitle.className = 'rankup-subtitle';
    subtitle.textContent = 'Voce subiu de rank!';
    card.appendChild(subtitle);

    const name = document.createElement('div');
    name.className = 'rankup-name';
    name.textContent = rank.name;
    card.appendChild(name);

    if (rank.bonusPercent > 0) {
        const bonus = document.createElement('div');
        bonus.className = 'rankup-bonus';
        bonus.textContent = `+${rank.bonusPercent}% em todas as moedas!`;
        card.appendChild(bonus);
    }

    overlay.appendChild(card);

    // Confete chuva por cima
    const confetti = document.createElement('div');
    confetti.className = 'rankup-confetti';
    confetti.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 30; i++) {
        const piece = document.createElement('span');
        piece.className = 'rankup-confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.background = RANKUP_CONFETTI_COLORS[i % RANKUP_CONFETTI_COLORS.length];
        piece.style.animationDelay = `${Math.random() * 400}ms`;
        piece.style.animationDuration = `${1.4 + Math.random() * 0.8}s`;
        confetti.appendChild(piece);
    }
    overlay.appendChild(confetti);

    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 3200);
}

// Fase 13.1: overlay temporario de dica para fases que nao tem [data-correct].
// Posicionado fixed no topo, fecha sozinho em 2.5s.
export function showHintHelper(text) {
    if (!text) return;
    let el = document.getElementById('hintHelper');
    if (el) el.remove();
    el = document.createElement('div');
    el.id = 'hintHelper';
    el.className = 'hint-helper';
    el.setAttribute('aria-live', 'polite');
    const ic = document.createElement('span');
    ic.className = 'hint-helper-icon';
    ic.textContent = '\u{1F4A1}';
    const txt = document.createElement('span');
    txt.className = 'hint-helper-text';
    txt.textContent = text;
    el.appendChild(ic);
    el.appendChild(txt);
    document.body.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, 2800);
}

// Cerimonia de ilha 100% completa (Fase 11.1).
// Tela maior que o rank-up: mostra ilha conquistada com mascote + bonus de moedas.
const ISLAND_MASCOT = {
    forest:   { src: 'assets/mascots/tomi-capivara.jpg', name: 'Tomi' },
    city:     { src: 'assets/mascots/ro-macaco.jpg',     name: 'Ro' },
    rainbow:  { src: 'assets/mascots/livi-arara.jpg',    name: 'Livi' },
    clouds:   { emoji: '\u{1F99C}',                       name: 'Papagaio' },
    treasure: { emoji: '\u{1F48E}',                       name: 'Tesouro' },
};
export function showIslandCompletionCelebration(island, bonusCoins) {
    if (!island) return;
    soundBigReward();

    const overlay = document.createElement('div');
    overlay.className = 'island-completion-overlay';
    overlay.setAttribute('aria-live', 'polite');

    const card = document.createElement('div');
    card.className = 'island-completion-card';
    card.style.setProperty('--island-color', island.color);

    // Mascote da ilha
    const mascotWrap = document.createElement('div');
    mascotWrap.className = 'island-completion-mascot';
    const mascotInfo = ISLAND_MASCOT[island.id] || { emoji: island.emoji, name: '' };
    if (mascotInfo.src) {
        const img = document.createElement('img');
        img.src = mascotInfo.src;
        img.alt = mascotInfo.name;
        mascotWrap.appendChild(img);
    } else {
        const ic = document.createElement('span');
        ic.className = 'island-completion-emoji';
        ic.textContent = mascotInfo.emoji || island.emoji;
        mascotWrap.appendChild(ic);
    }
    card.appendChild(mascotWrap);

    const headline = document.createElement('div');
    headline.className = 'island-completion-headline';
    headline.textContent = '\u{1F389} Voce conquistou!';
    card.appendChild(headline);

    const islandName = document.createElement('div');
    islandName.className = 'island-completion-name';
    islandName.textContent = island.name;
    card.appendChild(islandName);

    const congrats = document.createElement('div');
    congrats.className = 'island-completion-congrats';
    congrats.textContent = `Todas as 15 fases completas! ${mascotInfo.name} esta orgulhoso de voce!`;
    card.appendChild(congrats);

    if (bonusCoins > 0) {
        const bonus = document.createElement('div');
        bonus.className = 'island-completion-bonus';
        bonus.textContent = `\u{1FA99} +${bonusCoins} moedas de bonus!`;
        card.appendChild(bonus);
    }

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-primary island-completion-close';
    closeBtn.textContent = 'Continuar a aventura';
    closeBtn.onclick = () => overlay.remove();
    card.appendChild(closeBtn);

    overlay.appendChild(card);

    // Confete grande (50 partículas)
    const confetti = document.createElement('div');
    confetti.className = 'rankup-confetti';
    confetti.setAttribute('aria-hidden', 'true');
    const colors = ['#FFD54F', '#66BB6A', '#FF8A65', '#4FC3F7', '#BA68C8', island.color];
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('span');
        piece.className = 'rankup-confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.background = colors[i % colors.length];
        piece.style.animationDelay = `${Math.random() * 600}ms`;
        piece.style.animationDuration = `${1.4 + Math.random() * 1.2}s`;
        confetti.appendChild(piece);
    }
    overlay.appendChild(confetti);

    document.body.appendChild(overlay);
    // Auto-fechamento de seguranca em 8s caso o usuario nao clique.
    setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 8000);
}

// Notificação flutuante de medalha recém-conquistada.
// Construção XSS-safe (createElement + textContent) com partículas decorativas.
export function showBadgeNotification(def) {
    if (!def) return;
    const notif = document.createElement('div');
    notif.className = 'badge-notification';
    notif.dataset.rarity = def.rarity || 'common';

    const icon = document.createElement('span');
    icon.className = 'badge-notif-icon';
    icon.textContent = def.icon || '';
    notif.appendChild(icon);

    const text = document.createElement('span');
    text.className = 'badge-notif-text';
    text.textContent = `Nova medalha: ${def.name}!`;
    notif.appendChild(text);

    // Camada de partículas decorativas (Fase 7 - Game Feel).
    const particles = document.createElement('span');
    particles.className = 'badge-particles';
    particles.setAttribute('aria-hidden', 'true');
    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('span');
        p.className = 'badge-particle';
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const dist = 40 + Math.random() * 30;
        p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        p.style.animationDelay = `${i * 50}ms`;
        particles.appendChild(p);
    }
    notif.appendChild(particles);

    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// Notificação de moedas ganhas (ex: após bônus diário ou perfeito).
export function showCoinToast(amount, breakdown) {
    const toast = document.createElement('div');
    toast.className = 'coin-toast';
    const lines = (breakdown || []).map((b) => `<div class="coin-line">${b.label} <span>+${b.coins}</span></div>`).join('');
    toast.innerHTML = `<div class="coin-toast-total">\u{1FA99} +${amount}</div>${lines}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}
