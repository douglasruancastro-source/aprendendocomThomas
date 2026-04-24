// Mascote animado no canto da tela. Usa equipamento salvo no state.

import { shopItemById, defaultItemId } from '../data/shop.js';

let mascotEl = null;

function ensureEl() {
    if (mascotEl) return mascotEl;
    mascotEl = document.getElementById('mascot');
    return mascotEl;
}

export function applyMascotLook(state) {
    const el = ensureEl();
    if (!el) return;
    const colorId = (state.equipped && state.equipped.mascot) || defaultItemId('mascot');
    const accessoryId = (state.equipped && state.equipped.accessory) || defaultItemId('accessory');
    const color = shopItemById(colorId);
    const accessory = shopItemById(accessoryId);

    const rainbowDef = color && color.rainbow
        ? `<defs><linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#EF5350"/><stop offset="25%" stop-color="#FFD54F"/>
            <stop offset="50%" stop-color="#66BB6A"/><stop offset="75%" stop-color="#42A5F5"/>
            <stop offset="100%" stop-color="#AB47BC"/></linearGradient></defs>`
        : '';

    const bodyFill = color && color.rainbow ? 'url(#rainbowGrad)' : (color ? color.color : '#FFD54F');
    const bodyStroke = color ? color.stroke : '#F57F17';
    const accSvg = accessory && accessory.svg ? accessory.svg : '';
    const sparkle = color && color.sparkle
        ? '<circle cx="30" cy="28" r="2" fill="#FFF9C4"><animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="72" cy="36" r="1.5" fill="#FFF9C4"><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/></circle>'
        : '';

    el.innerHTML = `<svg viewBox="0 0 100 100">
        ${rainbowDef}
        <circle cx="50" cy="45" r="30" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="2"/>
        ${accSvg}
        <circle cx="40" cy="38" r="4" fill="#333" id="mascotEyeL"/>
        <circle cx="60" cy="38" r="4" fill="#333" id="mascotEyeR"/>
        <path id="mascotMouth" d="M38 55 Q50 65 62 55" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="30" cy="50" r="5" fill="#FFAB91" opacity="0.6"/>
        <circle cx="70" cy="50" r="5" fill="#FFAB91" opacity="0.6"/>
        ${sparkle}
    </svg>`;
}

export function setMascot(mood, state) {
    const el = ensureEl();
    if (!el) return;
    if (state) applyMascotLook(state);
    el.className = 'visible ' + mood;
    const mouth = document.getElementById('mascotMouth');
    if (!mouth) return;
    switch (mood) {
        case 'happy':       mouth.setAttribute('d', 'M38 52 Q50 66 62 52'); break;
        case 'sad':         mouth.setAttribute('d', 'M38 60 Q50 50 62 60'); break;
        case 'celebrating': mouth.setAttribute('d', 'M35 52 Q50 70 65 52'); break;
        default:            mouth.setAttribute('d', 'M38 55 Q50 65 62 55'); break;
    }
}

export function hideMascot() {
    const el = ensureEl();
    if (el) el.className = '';
}
