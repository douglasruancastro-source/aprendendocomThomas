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

    // ===== Acessórios — Fase 14: SVGs grandes, ajustados ao mascote 100x110 =====
    { id: 'acc-none',    name: 'Sem acessorio', category: 'accessory', icon: '\u{2716}\u{FE0F}',  price: 0, default: true },
    // Oculos grandes nos olhos (cabeca centro ~50,42)
    { id: 'acc-glasses', name: 'Oculos Estilosos', category: 'accessory', icon: '\u{1F453}', price: 250,
      svg: '<rect x="28" y="34" width="18" height="14" rx="7" fill="rgba(0,180,255,0.18)" stroke="#1565C0" stroke-width="3"/><rect x="54" y="34" width="18" height="14" rx="7" fill="rgba(0,180,255,0.18)" stroke="#1565C0" stroke-width="3"/><line x1="46" y1="41" x2="54" y2="41" stroke="#1565C0" stroke-width="3"/><circle cx="33" cy="38" r="1.5" fill="white" opacity="0.9"/><circle cx="59" cy="38" r="1.5" fill="white" opacity="0.9"/>' },
    // Coroa enorme com pedras coloridas
    { id: 'acc-crown',   name: 'Coroa Real',    category: 'accessory', icon: '\u{1F451}', price: 400,
      svg: '<path d="M 18 22 L 32 4 L 42 18 L 50 0 L 58 18 L 68 4 L 82 22 L 82 30 L 18 30 Z" fill="#FFD54F" stroke="#FF8F00" stroke-width="2.5" stroke-linejoin="round"/><rect x="18" y="28" width="64" height="5" fill="#FFC107" stroke="#FF8F00" stroke-width="2"/><circle cx="50" cy="14" r="3.5" fill="#E91E63" stroke="#880E4F" stroke-width="1"/><circle cx="32" cy="20" r="3" fill="#1976D2" stroke="#0D47A1" stroke-width="1"/><circle cx="68" cy="20" r="3" fill="#1976D2" stroke="#0D47A1" stroke-width="1"/><circle cx="20" cy="28" r="2.2" fill="#43A047"/><circle cx="80" cy="28" r="2.2" fill="#43A047"/><circle cx="50" cy="14" r="1" fill="white" opacity="0.7"/>' },
    // Cartola gigante com fita vermelha + estrela
    { id: 'acc-hat',     name: 'Cartola Magica', category: 'accessory', icon: '\u{1F3A9}', price: 350,
      svg: '<rect x="14" y="26" width="72" height="8" rx="2" fill="#212121" stroke="#000" stroke-width="2"/><rect x="22" y="0" width="56" height="28" fill="#212121" stroke="#000" stroke-width="2"/><rect x="22" y="18" width="56" height="6" fill="#E53935" stroke="#B71C1C" stroke-width="1.5"/><polygon points="32,8 36,14 30,16 36,18 32,22 38,18 44,20 40,14 44,8 38,10" fill="#FFD54F" stroke="#FFA000" stroke-width="0.8"/>' },
    // Chapeu de festa colorido com bolinhas
    { id: 'acc-party',   name: 'Chapeu de Festa', category: 'accessory', icon: '\u{1F389}', price: 400,
      svg: '<polygon points="30,28 50,-6 70,28" fill="#E91E63" stroke="#880E4F" stroke-width="2.5" stroke-linejoin="round"/><polygon points="30,28 50,-6 50,28" fill="#F8BBD0" opacity="0.5"/><circle cx="40" cy="18" r="3" fill="#FFD54F" stroke="#FFA000" stroke-width="1"/><circle cx="58" cy="10" r="3" fill="#42A5F5" stroke="#1565C0" stroke-width="1"/><circle cx="50" cy="22" r="2.5" fill="#66BB6A" stroke="#2E7D32" stroke-width="1"/><circle cx="50" cy="-4" r="3.5" fill="#FFEB3B" stroke="#F57F17" stroke-width="1"/>' },
    // Capacete de aventureiro com lampada
    { id: 'acc-helmet',  name: 'Capacete Aventureiro', category: 'accessory', icon: '\u{1FA96}', price: 500,
      svg: '<path d="M 12 38 Q 12 4 50 4 Q 88 4 88 38 L 88 42 L 12 42 Z" fill="#FF9800" stroke="#E65100" stroke-width="2.5" stroke-linejoin="round"/><rect x="14" y="36" width="72" height="8" fill="#5D4037" stroke="#3E2723" stroke-width="1.5"/><circle cx="50" cy="22" r="6" fill="#FFEB3B" stroke="#F57F17" stroke-width="2"/><circle cx="50" cy="22" r="2" fill="white"/><line x1="20" y1="38" x2="20" y2="44" stroke="#3E2723" stroke-width="2"/><line x1="80" y1="38" x2="80" y2="44" stroke="#3E2723" stroke-width="2"/>' },
    // Bombacha gauchinha grande nas pernas (y >=78)
    { id: 'acc-bombacha', name: 'Bombacha Gauchinha', category: 'accessory', icon: '\u{1F454}', price: 350,
      svg: '<path d="M 22 78 L 78 78 L 76 102 L 56 104 L 50 86 L 44 104 L 24 102 Z" fill="#1B5E20" stroke="#0D2818" stroke-width="2.5" stroke-linejoin="round"/><rect x="24" y="80" width="52" height="4" fill="#0D2818"/><circle cx="32" cy="92" r="1.8" fill="#FFEB3B"/><circle cx="68" cy="92" r="1.8" fill="#FFEB3B"/><line x1="50" y1="86" x2="50" y2="100" stroke="#0D2818" stroke-width="1.5"/>' },
    // Lenço tche grande no pescoço
    { id: 'acc-lenco',    name: 'Lenco Tche',   category: 'accessory', icon: '\u{1F9E3}', price: 300,
      svg: '<path d="M 22 60 L 50 78 L 78 60 L 50 50 Z" fill="#E53935" stroke="#B71C1C" stroke-width="2.5" stroke-linejoin="round"/><path d="M 50 78 L 46 92 L 54 92 Z" fill="#C62828" stroke="#B71C1C" stroke-width="1.5"/><path d="M 30 62 L 50 60 L 70 62" stroke="#FFEB3B" stroke-width="2" fill="none"/><circle cx="50" cy="64" r="2.5" fill="#FFEB3B"/>' },
    // Chimarrão grande do lado
    { id: 'acc-chimarrao', name: 'Chimarrao',   category: 'accessory', icon: '\u{1FAD6}', price: 450, requires: { totalCoinsEarned: 400 },
      svg: '<ellipse cx="78" cy="74" rx="14" ry="16" fill="#6D4C41" stroke="#3E2723" stroke-width="2"/><ellipse cx="78" cy="62" rx="12" ry="3" fill="#43A047" stroke="#1B5E20" stroke-width="1.5"/><rect x="78" y="42" width="3" height="22" fill="#9E9E9E" stroke="#424242" stroke-width="1"/><circle cx="79" cy="42" r="2.5" fill="#BDBDBD" stroke="#616161" stroke-width="1"/><path d="M 70 70 Q 86 70 86 80" stroke="#5D4037" stroke-width="3" fill="none" stroke-linecap="round"/>' },

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
