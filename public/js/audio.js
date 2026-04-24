// Sons procedurais via Web Audio API. Init preguiçoso para não travar em ambientes sem áudio.

let audioCtx = null;

function getCtx() {
    if (audioCtx) return audioCtx;
    if (typeof window === 'undefined') return null;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    try {
        audioCtx = new Ctx();
    } catch {
        audioCtx = null;
    }
    return audioCtx;
}

export function playTone(freq, duration, type = 'sine') {
    const ctx = getCtx();
    if (!ctx) return;
    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = 0.15;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.stop(ctx.currentTime + duration);
    } catch {
        /* áudio bloqueado pelo navegador até primeira interação */
    }
}

export function soundCorrect() {
    playTone(523, 0.15);
    setTimeout(() => playTone(659, 0.2), 100);
}

export function soundWrong() {
    playTone(200, 0.3, 'triangle');
}

export function soundComplete() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.2), i * 120));
}

export function soundClick() {
    playTone(800, 0.05, 'square');
}

export function soundFlipCard() {
    playTone(600, 0.08);
    setTimeout(() => playTone(900, 0.06), 50);
}

export function soundMatch() {
    playTone(523, 0.15);
    setTimeout(() => playTone(659, 0.15), 80);
    setTimeout(() => playTone(784, 0.2), 160);
}

export function soundStreak() {
    [523, 587, 659, 698, 784].forEach((f, i) => setTimeout(() => playTone(f, 0.1), i * 60));
}

export function soundBadge() {
    [784, 988, 1175, 1319].forEach((f, i) => setTimeout(() => playTone(f, 0.15), i * 100));
}

export function soundCoin() {
    playTone(1175, 0.08);
    setTimeout(() => playTone(1568, 0.12), 60);
}

export function soundBigReward() {
    [659, 784, 988, 1175, 1319, 1568].forEach((f, i) =>
        setTimeout(() => playTone(f, 0.12), i * 70)
    );
}

export function speak(text) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'pt-BR';
        u.rate = 0.85;
        window.speechSynthesis.speak(u);
    } catch {
        /* ignora erros de speech */
    }
}
