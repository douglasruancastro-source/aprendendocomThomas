// Lógica pura da loja: pode comprar? comprar, equipar, aplicar tema/efeito.
// Separado do renderer para facilitar testes.

import { SHOP_ITEMS, shopItemById, defaultItemId } from './data/shop.js';
import { spendCoins, checkBadges } from './rewards.js';

// Retorna true se o usuário atende os requisitos do item (pré-requisitos de progressão).
// Fase 9 - Onda 2: agora suporta `requires.badge` (medalha que destranca o item).
export function meetsRequirements(item, state) {
    if (!item || !item.requires) return true;
    const req = item.requires;
    if (req.totalCoinsEarned != null && (state.totalCoinsEarned || 0) < req.totalCoinsEarned) return false;
    if (req.completedPhases != null && (state.completedPhases.length || 0) < req.completedPhases) return false;
    if (req.badge != null && !(state.badges || []).includes(req.badge)) return false;
    return true;
}

export function isOwned(item, state) {
    if (!item) return false;
    if (item.default) return true; // itens padrão são "sempre comprados"
    return (state.ownedItems || []).includes(item.id);
}

export function isEquipped(item, state) {
    if (!item) return false;
    const eq = state.equipped || {};
    return eq[item.category] === item.id;
}

// Tenta comprar: retorna { ok, reason }. 'reason' descreve a falha para UI.
// Fase 9 - Onda 3: powerups (consumable=true) podem ser comprados varias vezes;
// cada compra incrementa state.powerups[id]. Outros itens permanecem em ownedItems.
export function buyItem(state, itemId) {
    const item = shopItemById(itemId);
    if (!item) return { ok: false, reason: 'item-inexistente' };
    if (!meetsRequirements(item, state)) return { ok: false, reason: 'bloqueado' };
    if ((state.coins || 0) < item.price) return { ok: false, reason: 'moedas-insuficientes' };

    // Consumiveis acumulam estoque, nao usam ownedItems.
    if (item.consumable) {
        if (!spendCoins(state, item.price)) return { ok: false, reason: 'moedas-insuficientes' };
        if (!state.powerups) state.powerups = {};
        state.powerups[item.id] = (state.powerups[item.id] || 0) + 1;
        checkBadges(state);
        return { ok: true, item, consumable: true, stock: state.powerups[item.id] };
    }

    // Itens normais (theme/mascot/accessory/effect/frame) — comprados uma vez.
    if (isOwned(item, state)) return { ok: false, reason: 'ja-comprado' };
    if (!spendCoins(state, item.price)) return { ok: false, reason: 'moedas-insuficientes' };
    if (!state.ownedItems) state.ownedItems = [];
    state.ownedItems.push(item.id);
    checkBadges(state);
    return { ok: true, item };
}

// Consome 1 unidade do powerup. Retorna true se tinha estoque, false caso contrario.
// Fase 9 - Onda 3
export function consumePowerup(state, powerupId) {
    if (!state.powerups || !state.powerups[powerupId]) return false;
    state.powerups[powerupId]--;
    if (state.powerups[powerupId] <= 0) delete state.powerups[powerupId];
    return true;
}

export function powerupStock(state, powerupId) {
    return (state.powerups && state.powerups[powerupId]) || 0;
}

// Equipa um item. O item precisa estar comprado (ou ser default).
// Fase 9 - Onda 2: registra historico de visuais ja equipados (para a medalha 'fashionista').
export function equipItem(state, itemId) {
    const item = shopItemById(itemId);
    if (!item) return { ok: false, reason: 'item-inexistente' };
    if (!isOwned(item, state)) return { ok: false, reason: 'nao-comprado' };
    if (!state.equipped) state.equipped = {};
    state.equipped[item.category] = item.id;
    if (!state.equippedHistory) state.equippedHistory = [];
    if (!state.equippedHistory.includes(item.id)) state.equippedHistory.push(item.id);
    return { ok: true, item };
}

// Fase 13.4: tema agora SUBSTITUI o bg de cada screen (via --screen-bg).
// Antes era overlay com mix-blend-mode: 0.55 -> quase invisivel para temas claros.
// Agora cada .screen usa `background: var(--screen-bg, /* fallback hardcoded */)`.
// Quando ha tema ativo, --screen-bg é setado no root e cobre TUDO.
export function applyTheme(state) {
    const themeId = (state.equipped && state.equipped.theme) || defaultItemId('theme');
    const theme = shopItemById(themeId);
    if (!theme) return;
    const root = document.documentElement;
    if (theme.bg) {
        root.style.setProperty('--screen-bg', theme.bg);
        root.style.setProperty('--theme-bg', theme.bg); // mantem compat com overlay sutil
        root.dataset.themeActive = '1';
    } else {
        root.style.removeProperty('--screen-bg');
        root.style.removeProperty('--theme-bg');
        delete root.dataset.themeActive;
    }
    if (theme.title) {
        root.style.setProperty('--title-color', theme.title);
    }
    document.body.classList.toggle('theme-animated', !!theme.animated);
    document.body.dataset.theme = theme.id;
}

// Lista completa com metadados computados para a tela da loja.
export function shopCatalogView(state) {
    return SHOP_ITEMS.map((item) => ({
        item,
        owned: isOwned(item, state),
        equipped: isEquipped(item, state),
        locked: !meetsRequirements(item, state),
        canAfford: (state.coins || 0) >= item.price,
    }));
}
