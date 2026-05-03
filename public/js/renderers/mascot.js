// Mascote animado no canto da tela. Usa equipamento salvo no state.
// Fase 14: dois personagens marcantes — Dinossauro e Unicornio.
// state.mascotType: 'dino' | 'unicorn' (selecionado pela crianca na primeira sessao).
// state.equipped.mascot: cor (mascot-default, mascot-blue, mascot-rainbow, etc).
// state.equipped.accessory: cosmetico extra (coroa, chapeu, etc) renderizado em cima.

import { shopItemById, defaultItemId } from '../data/shop.js';

let mascotEl = null;

function ensureEl() {
    if (mascotEl) return mascotEl;
    mascotEl = document.getElementById('mascot');
    return mascotEl;
}

// SVG do dinossauro (T-Rex amigavel). viewBox 100x110.
// `body` = fill da pele, `stroke` = borda escura.
function dinoSvg(body, stroke, sparkle) {
    return `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
        <!-- Cauda atras -->
        <path d="M 78 70 Q 95 55 92 38 L 86 42 Q 86 60 76 76 Z" fill="${body}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>
        <!-- Corpo redondinho -->
        <ellipse cx="50" cy="68" rx="32" ry="26" fill="${body}" stroke="${stroke}" stroke-width="2.5"/>
        <!-- Bracinhos curtos -->
        <ellipse cx="22" cy="62" rx="5" ry="8" fill="${body}" stroke="${stroke}" stroke-width="2"/>
        <ellipse cx="78" cy="62" rx="5" ry="8" fill="${body}" stroke="${stroke}" stroke-width="2"/>
        <!-- Pernas -->
        <ellipse cx="36" cy="92" rx="8" ry="9" fill="${body}" stroke="${stroke}" stroke-width="2"/>
        <ellipse cx="64" cy="92" rx="8" ry="9" fill="${body}" stroke="${stroke}" stroke-width="2"/>
        <!-- Garras -->
        <line x1="32" y1="100" x2="32" y2="103" stroke="${stroke}" stroke-width="1.8"/>
        <line x1="36" y1="100" x2="36" y2="103" stroke="${stroke}" stroke-width="1.8"/>
        <line x1="40" y1="100" x2="40" y2="103" stroke="${stroke}" stroke-width="1.8"/>
        <line x1="60" y1="100" x2="60" y2="103" stroke="${stroke}" stroke-width="1.8"/>
        <line x1="64" y1="100" x2="64" y2="103" stroke="${stroke}" stroke-width="1.8"/>
        <line x1="68" y1="100" x2="68" y2="103" stroke="${stroke}" stroke-width="1.8"/>
        <!-- Espinhos nas costas -->
        <polygon points="34,38 38,46 42,38" fill="${stroke}"/>
        <polygon points="44,32 48,40 52,32" fill="${stroke}"/>
        <polygon points="54,32 58,40 62,32" fill="${stroke}"/>
        <polygon points="64,38 68,46 72,38" fill="${stroke}"/>
        <!-- Cabeca -->
        <ellipse cx="50" cy="44" rx="24" ry="20" fill="${body}" stroke="${stroke}" stroke-width="2.5"/>
        <!-- Olhos -->
        <circle cx="40" cy="40" r="5" fill="white" stroke="${stroke}" stroke-width="1"/>
        <circle cx="60" cy="40" r="5" fill="white" stroke="${stroke}" stroke-width="1"/>
        <circle cx="40" cy="41" r="2.5" fill="#222" id="mascotEyeL"/>
        <circle cx="60" cy="41" r="2.5" fill="#222" id="mascotEyeR"/>
        <!-- Brilho nos olhos -->
        <circle cx="41" cy="40" r="0.8" fill="white"/>
        <circle cx="61" cy="40" r="0.8" fill="white"/>
        <!-- Boca -->
        <path id="mascotMouth" d="M 41 52 Q 50 58 59 52" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round"/>
        <!-- Dentinhos -->
        <polygon points="46,52 47,55 48,52" fill="white"/>
        <polygon points="52,52 53,55 54,52" fill="white"/>
        <!-- Bochecha -->
        <ellipse cx="32" cy="48" rx="3.5" ry="2.5" fill="#FFAB91" opacity="0.5"/>
        <ellipse cx="68" cy="48" rx="3.5" ry="2.5" fill="#FFAB91" opacity="0.5"/>
        ${sparkle}
    </svg>`;
}

// SVG do unicornio (cavalinho com chifre + crina colorida). viewBox 100x110.
function unicornSvg(body, stroke, sparkle) {
    return `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
        <!-- Cauda colorida com swoop -->
        <path d="M 80 72 Q 96 70 95 88" stroke="#F48FB1" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M 82 76 Q 95 78 93 92" stroke="#CE93D8" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M 84 80 Q 92 84 88 95" stroke="#90CAF9" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- Corpo -->
        <ellipse cx="50" cy="68" rx="30" ry="24" fill="${body}" stroke="${stroke}" stroke-width="2.5"/>
        <!-- Pernas -->
        <rect x="32" y="84" width="8" height="14" rx="3" fill="${body}" stroke="${stroke}" stroke-width="2"/>
        <rect x="60" y="84" width="8" height="14" rx="3" fill="${body}" stroke="${stroke}" stroke-width="2"/>
        <!-- Cabeca (oval inclinada) -->
        <ellipse cx="50" cy="42" rx="22" ry="20" fill="${body}" stroke="${stroke}" stroke-width="2.5"/>
        <!-- Orelhas -->
        <polygon points="34,28 32,18 40,24" fill="${body}" stroke="${stroke}" stroke-width="1.5"/>
        <polygon points="66,28 68,18 60,24" fill="${body}" stroke="${stroke}" stroke-width="1.5"/>
        <polygon points="34,26 33,21 38,24" fill="#F48FB1"/>
        <polygon points="66,26 67,21 62,24" fill="#F48FB1"/>
        <!-- CHIFRE dourado -->
        <polygon points="50,4 45,28 55,28" fill="#FFD54F" stroke="#FFA000" stroke-width="1.8" stroke-linejoin="round"/>
        <line x1="48" y1="12" x2="52" y2="12" stroke="#FFA000" stroke-width="1.5"/>
        <line x1="47" y1="20" x2="53" y2="20" stroke="#FFA000" stroke-width="1.5"/>
        <!-- Crina (3 pomponzinhos coloridos) -->
        <circle cx="32" cy="34" r="7" fill="#F48FB1" stroke="#AD1457" stroke-width="1"/>
        <circle cx="36" cy="22" r="6" fill="#CE93D8" stroke="#6A1B9A" stroke-width="1"/>
        <circle cx="44" cy="14" r="5" fill="#90CAF9" stroke="#1565C0" stroke-width="1"/>
        <!-- Olhos com cilios -->
        <ellipse cx="42" cy="42" rx="2" ry="3" fill="#222" id="mascotEyeL"/>
        <ellipse cx="58" cy="42" rx="2" ry="3" fill="#222" id="mascotEyeR"/>
        <line x1="40" y1="38" x2="38" y2="36" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="42" y1="37" x2="42" y2="34" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="44" y1="38" x2="46" y2="36" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="60" y1="38" x2="62" y2="36" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="58" y1="37" x2="58" y2="34" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="56" y1="38" x2="54" y2="36" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Brilho nos olhos -->
        <circle cx="43" cy="41" r="0.6" fill="white"/>
        <circle cx="59" cy="41" r="0.6" fill="white"/>
        <!-- Bochecha rosa -->
        <ellipse cx="34" cy="50" rx="4" ry="3" fill="#F8BBD0"/>
        <ellipse cx="66" cy="50" rx="4" ry="3" fill="#F8BBD0"/>
        <!-- Sorriso -->
        <path id="mascotMouth" d="M 44 54 Q 50 58 56 54" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"/>
        <!-- Focinho (linha sutil) -->
        <ellipse cx="50" cy="52" rx="6" ry="3" fill="${body}" stroke="${stroke}" stroke-width="1" opacity="0.6"/>
        ${sparkle}
    </svg>`;
}

export function applyMascotLook(state) {
    const el = ensureEl();
    if (!el) return;
    const colorId = (state.equipped && state.equipped.mascot) || defaultItemId('mascot');
    const accessoryId = (state.equipped && state.equipped.accessory) || defaultItemId('accessory');
    const color = shopItemById(colorId);
    const accessory = shopItemById(accessoryId);

    // Define paleta default por tipo (unicornio = branco/lavanda, dino = verde).
    const mascotType = state.mascotType || 'dino';
    const defaults = mascotType === 'unicorn'
        ? { color: '#FFFFFF', stroke: '#9C27B0' }
        : { color: '#66BB6A', stroke: '#1B5E20' };

    // Se a crianca equipou uma cor especifica (nao default), usa ela.
    const isCustomColor = color && !color.default;
    const bodyFill = color && color.rainbow
        ? 'url(#rainbowGrad)'
        : (isCustomColor ? color.color : defaults.color);
    const bodyStroke = isCustomColor ? color.stroke : defaults.stroke;

    const sparkle = color && color.sparkle
        ? `<circle cx="22" cy="20" r="2.5" fill="#FFF9C4"><animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/></circle>
           <circle cx="80" cy="22" r="2" fill="#FFF9C4"><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/></circle>
           <circle cx="14" cy="60" r="1.8" fill="#FFF9C4"><animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite"/></circle>`
        : '';

    // Acessorio renderizado POR CIMA do SVG do mascote, com escala maior pra ficar visivel.
    const accSvg = accessory && accessory.svg
        ? `<g class="mascot-accessory">${accessory.svg}</g>`
        : '';

    // Definicoes globais (gradient arco-iris) ficam fora dos templates.
    const rainbowDef = color && color.rainbow
        ? `<defs><linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#EF5350"/><stop offset="25%" stop-color="#FFD54F"/>
            <stop offset="50%" stop-color="#66BB6A"/><stop offset="75%" stop-color="#42A5F5"/>
            <stop offset="100%" stop-color="#AB47BC"/></linearGradient></defs>`
        : '';

    const baseSvg = mascotType === 'unicorn'
        ? unicornSvg(bodyFill, bodyStroke, sparkle)
        : dinoSvg(bodyFill, bodyStroke, sparkle);

    // Insere rainbow def + acessorio dentro do SVG ja gerado.
    // Inserimos depois do </defs> ou no inicio do SVG.
    const svgWithExtras = baseSvg
        .replace('xmlns="http://www.w3.org/2000/svg">', `xmlns="http://www.w3.org/2000/svg">${rainbowDef}`)
        .replace('</svg>', `${accSvg}</svg>`);

    el.innerHTML = svgWithExtras;

    // Fase 13.5: bounce visivel quando equip muda.
    el.classList.add('just-equipped');
    setTimeout(() => el.classList.remove('just-equipped'), 700);
}

export function setMascot(mood, state) {
    const el = ensureEl();
    if (!el) return;
    if (state) applyMascotLook(state);
    el.className = 'visible ' + mood;
    const mouth = document.getElementById('mascotMouth');
    if (!mouth) return;
    // Caminhos da boca por humor — funcionam pros dois SVGs (mesma posicao).
    switch (mood) {
        case 'happy':       mouth.setAttribute('d', 'M 41 50 Q 50 60 59 50'); break;
        case 'sad':         mouth.setAttribute('d', 'M 41 58 Q 50 50 59 58'); break;
        case 'celebrating': mouth.setAttribute('d', 'M 38 50 Q 50 64 62 50'); break;
        default:            mouth.setAttribute('d', 'M 41 54 Q 50 58 59 54'); break;
    }
}

export function hideMascot() {
    const el = ensureEl();
    if (el) el.className = '';
}

// Fase 14: renderiza os dois SVGs de preview na tela #mascotPick.
// Usa cores default de cada personagem para a crianca ver como ficam.
export function renderMascotPickPreview() {
    const dinoEl = document.getElementById('mascotPickDino');
    const unicornEl = document.getElementById('mascotPickUnicorn');
    if (dinoEl) dinoEl.innerHTML = dinoSvg('#66BB6A', '#1B5E20', '');
    if (unicornEl) unicornEl.innerHTML = unicornSvg('#FFFFFF', '#9C27B0', '');
}
