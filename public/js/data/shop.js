// Catálogo da loja. Cada item tem categoria, preço e preview.
// category: 'theme' | 'mascot' | 'accessory' | 'effect'
// requires: opcional — { totalCoinsEarned, completedPhases }

export const SHOP_ITEMS = [
    // ===== Temas de fundo =====
    { id: 'theme-default',  name: 'Classico',  category: 'theme', icon: '\u{1F3E0}', price: 0,   default: true, bg: null, title: '#1565C0' },
    { id: 'theme-space',    name: 'Espaco',    category: 'theme', icon: '\u{1F30C}', price: 200, bg: 'radial-gradient(ellipse at top, #1a237e 0%, #0d0d1a 100%)', title: '#E1F5FE' },
    { id: 'theme-forest',   name: 'Floresta',  category: 'theme', icon: '\u{1F332}', price: 200, bg: 'linear-gradient(180deg, #C8E6C9 0%, #4CAF50 100%)', title: '#1B5E20' },
    { id: 'theme-ocean',    name: 'Oceano',    category: 'theme', icon: '\u{1F30A}', price: 200, bg: 'linear-gradient(180deg, #B3E5FC 0%, #0277BD 100%)', title: '#01579B' },
    { id: 'theme-desert',   name: 'Deserto',   category: 'theme', icon: '\u{1F3DC}\u{FE0F}',  price: 200, bg: 'linear-gradient(180deg, #FFF9C4 0%, #FFA726 100%)', title: '#E65100' },
    { id: 'theme-snow',     name: 'Neve',      category: 'theme', icon: '\u{2744}\u{FE0F}',   price: 200, bg: 'linear-gradient(180deg, #E1F5FE 0%, #81D4FA 100%)', title: '#01579B' },
    { id: 'theme-galaxy',   name: 'Galaxia',   category: 'theme', icon: '\u{1F30C}', price: 1500, requires: { badge: 'all-complete' }, bg: 'linear-gradient(135deg, #6A1B9A 0%, #1A237E 50%, #000000 100%)', title: '#FFF9C4', animated: true },
    { id: 'theme-pampas',   name: 'Pampas',    category: 'theme', icon: '\u{1F40E}', price: 300, bg: 'linear-gradient(180deg, #FFF8E1 0%, #FFEB3B 50%, #A5D6A7 100%)', title: '#B71C1C' },
    { id: 'theme-bandeira', name: 'Tricolor',  category: 'theme', icon: '\u{1F3C1}', price: 400, bg: 'linear-gradient(180deg, #E53935 0%, #E53935 33%, #FFEB3B 33%, #FFEB3B 66%, #2E7D32 66%, #2E7D32 100%)', title: '#FFFFFF', animated: true },
    { id: 'theme-serra',    name: 'Serra',     category: 'theme', icon: '\u{1F3D4}\u{FE0F}', price: 350, bg: 'linear-gradient(180deg, #B3E5FC 0%, #81D4FA 40%, #2E7D32 100%)', title: '#01579B' },

    // ===== Cores do mascote =====
    { id: 'mascot-default', name: 'Amarelo',   category: 'mascot', icon: '\u{1F7E1}', price: 0,   default: true, color: '#FFD54F', stroke: '#F57F17' },
    { id: 'mascot-blue',    name: 'Azul',      category: 'mascot', icon: '\u{1F535}', price: 100, color: '#42A5F5', stroke: '#1565C0' },
    { id: 'mascot-red',     name: 'Vermelho',  category: 'mascot', icon: '\u{1F534}', price: 100, color: '#EF5350', stroke: '#B71C1C' },
    { id: 'mascot-green',   name: 'Verde',     category: 'mascot', icon: '\u{1F7E2}', price: 100, color: '#66BB6A', stroke: '#2E7D32' },
    { id: 'mascot-purple',  name: 'Roxo',      category: 'mascot', icon: '\u{1F7E3}', price: 100, color: '#AB47BC', stroke: '#6A1B9A' },
    { id: 'mascot-pink',    name: 'Rosa',      category: 'mascot', icon: '\u{1F338}', price: 100, color: '#F48FB1', stroke: '#AD1457' },
    { id: 'mascot-gold',    name: 'Dourado',   category: 'mascot', icon: '\u{1F31F}', price: 500, requires: { badge: 'streak-10' }, color: '#FFC107', stroke: '#FF6F00', sparkle: true },
    { id: 'mascot-rainbow', name: 'Arco-iris', category: 'mascot', icon: '\u{1F308}', price: 800, requires: { badge: 'three-stars-10' }, color: 'url(#rainbowGrad)', stroke: '#6A1B9A', rainbow: true },
    { id: 'mascot-gaucho',  name: 'Gauchinho', category: 'mascot', icon: '\u{1F3C7}', price: 300, color: '#E53935', stroke: '#B71C1C' },
    { id: 'mascot-pampa',   name: 'Pampa',     category: 'mascot', icon: '\u{1F33F}', price: 300, color: '#66BB6A', stroke: '#1B5E20' },

    // ===== Acessórios =====
    { id: 'acc-none',    name: 'Sem acessorio', category: 'accessory', icon: '\u{2716}\u{FE0F}',  price: 0, default: true },
    { id: 'acc-glasses', name: 'Oculos',        category: 'accessory', icon: '\u{1F453}',         price: 250, svg: '<rect x="26" y="36" width="16" height="12" rx="6" fill="none" stroke="#333" stroke-width="2.5"/><rect x="58" y="36" width="16" height="12" rx="6" fill="none" stroke="#333" stroke-width="2.5"/><line x1="42" y1="42" x2="58" y2="42" stroke="#333" stroke-width="2.5"/>' },
    { id: 'acc-crown',   name: 'Coroa',         category: 'accessory', icon: '\u{1F451}',         price: 400, svg: '<path d="M24 24 L34 12 L44 22 L50 10 L56 22 L66 12 L76 24 L76 30 L24 30 Z" fill="#FFD54F" stroke="#F57F17" stroke-width="1.5"/><circle cx="50" cy="18" r="2" fill="#E91E63"/><circle cx="34" cy="22" r="2" fill="#42A5F5"/><circle cx="66" cy="22" r="2" fill="#42A5F5"/>' },
    { id: 'acc-hat',     name: 'Chapeu',        category: 'accessory', icon: '\u{1F3A9}',         price: 350, svg: '<rect x="22" y="28" width="56" height="6" fill="#5D4037"/><rect x="32" y="8" width="36" height="24" fill="#3E2723" stroke="#000" stroke-width="1.5"/><rect x="32" y="22" width="36" height="5" fill="#F44336"/>' },
    { id: 'acc-party',   name: 'Chapeu Festa',  category: 'accessory', icon: '\u{1F389}',         price: 400, svg: '<polygon points="36,28 50,0 64,28" fill="#E91E63" stroke="#880E4F" stroke-width="1.5"/><circle cx="42" cy="14" r="2" fill="#FFD54F"/><circle cx="56" cy="10" r="2" fill="#42A5F5"/><circle cx="50" cy="22" r="2" fill="#66BB6A"/>' },
    { id: 'acc-helmet',  name: 'Capacete',      category: 'accessory', icon: '\u{1F3EE}',         price: 500, svg: '<path d="M20 40 Q20 14 50 14 Q80 14 80 40 L80 44 L20 44 Z" fill="#FF9800" stroke="#E65100" stroke-width="2"/><rect x="38" y="44" width="24" height="6" fill="#5D4037"/>' },
    { id: 'acc-bombacha', name: 'Bombacha',     category: 'accessory', icon: '\u{1F454}',         price: 350, svg: '<rect x="26" y="28" width="48" height="10" rx="3" fill="#2E7D32" stroke="#1B5E20" stroke-width="1.5"/><rect x="28" y="38" width="20" height="12" fill="#388E3C" stroke="#1B5E20" stroke-width="1.5"/><rect x="52" y="38" width="20" height="12" fill="#388E3C" stroke="#1B5E20" stroke-width="1.5"/>' },
    { id: 'acc-lenco',    name: 'Lenco Tche',   category: 'accessory', icon: '\u{1F9E3}',         price: 300, svg: '<path d="M30 38 L50 52 L70 38 L50 30 Z" fill="#E53935" stroke="#B71C1C" stroke-width="1.5"/><path d="M50 52 L50 62" stroke="#B71C1C" stroke-width="2"/>' },
    { id: 'acc-chimarrao', name: 'Chimarrao',   category: 'accessory', icon: '\u{1FAD6}',         price: 450, requires: { totalCoinsEarned: 400 }, svg: '<ellipse cx="50" cy="46" rx="16" ry="18" fill="#8D6E63" stroke="#4E342E" stroke-width="2"/><rect x="38" y="32" width="24" height="6" rx="2" fill="#FFD54F" stroke="#F57F17" stroke-width="1.5"/><rect x="58" y="20" width="4" height="24" fill="#BDBDBD" stroke="#616161" stroke-width="1"/>' },

    // ===== Efeitos especiais =====
    { id: 'effect-default',  name: 'Confete',     category: 'effect', icon: '\u{1F389}', price: 0,   default: true },
    { id: 'effect-fireworks', name: 'Fogos',      category: 'effect', icon: '\u{1F386}', price: 600, requires: { badge: 'perfect' } },
    { id: 'effect-rainbow',  name: 'Arco-iris',  category: 'effect', icon: '\u{1F308}', price: 700, requires: { badge: 'colors-master' } },
    { id: 'effect-stars',    name: 'Chuva Estrelas', category: 'effect', icon: '\u{1F31F}', price: 700, requires: { badge: 'streak-5' } },

    // ===== Powerups (Fase 9 - Onda 3) — consumiveis usaveis durante atividade =====
    // Diferente das outras categorias: nao se "equipa", se acumula no estoque e gasta na hora.
    { id: 'powerup-hint',    name: 'Dica',         category: 'powerup', icon: '\u{1F4A1}', price: 50,  consumable: true, desc: 'Pisca a resposta certa por 1s' },
    { id: 'powerup-retry',   name: 'Tenta de Novo', category: 'powerup', icon: '\u{1F504}', price: 75,  consumable: true, desc: 'Errou? Tenta a mesma rodada de novo' },
    { id: 'powerup-2x',      name: '2x Moedas',    category: 'powerup', icon: '\u{1F4B0}', price: 200, consumable: true, desc: 'Proxima fase paga em dobro' },
    { id: 'powerup-skip',    name: 'Pular',        category: 'powerup', icon: '\u{23ED}\u{FE0F}', price: 150, consumable: true, desc: 'Pula a rodada sem perder o streak' },

    // ===== Molduras de fase (Fase 9 - Onda 3) — aparecem no phase-card completo do menu =====
    { id: 'frame-default',  name: 'Sem Moldura',  category: 'frame', icon: '\u{1F5BC}\u{FE0F}', price: 0, default: true },
    { id: 'frame-gold',     name: 'Dourada',      category: 'frame', icon: '\u{1F31F}', price: 250 },
    { id: 'frame-neon',     name: 'Neon',         category: 'frame', icon: '\u{1F4A0}', price: 350 },
    { id: 'frame-holo',     name: 'Holografica',  category: 'frame', icon: '\u{1F308}', price: 500, requires: { badge: 'three-stars-10' } },
];

export function shopItemById(id) {
    return SHOP_ITEMS.find((i) => i.id === id) || null;
}

export function defaultItemId(category) {
    const found = SHOP_ITEMS.find((i) => i.category === category && i.default);
    return found ? found.id : null;
}
