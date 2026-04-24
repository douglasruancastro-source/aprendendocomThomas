// Overlay de feedback (certo/errado) com controle do mascote.

import { soundCorrect, soundWrong } from '../audio.js';
import { setMascot } from './mascot.js';

export function showFeedback(state, correct, msg) {
    const overlay = document.getElementById('feedbackOverlay');
    document.getElementById('fbEmoji').textContent = correct ? '\u2B50' : '\uD83D\uDE15';
    document.getElementById('fbMsg').textContent = msg || (correct ? 'Muito bem!' : 'Tenta de novo!');
    overlay.classList.add('active');
    if (correct) {
        soundCorrect();
        setMascot('happy', state);
    } else {
        soundWrong();
        setMascot('sad', state);
    }
    return new Promise((r) => {
        setTimeout(() => {
            overlay.classList.remove('active');
            setMascot('idle', state);
            r();
        }, correct ? 1200 : 1500);
    });
}

// Notificação flutuante de medalha recém-conquistada.
export function showBadgeNotification(def) {
    if (!def) return;
    const notif = document.createElement('div');
    notif.className = 'badge-notification';
    notif.innerHTML = `<span class="badge-notif-icon">${def.icon}</span> <span>Nova medalha: ${def.name}!</span>`;
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
