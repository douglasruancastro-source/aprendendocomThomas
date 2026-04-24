// Lógica pura da loja: pode comprar? comprar, equipar, aplicar tema/efeito.
// Separado do renderer para facilitar testes.

import { SHOP_ITEMS, shopItemById, defaultItemId } from './data/shop.js';
import { spendCoins, checkBadges } from './rewards.js';

// Retorna true se o usuário atende os requisitos do item (pré-requisitos de progressão).
export function meetsRequirements(item, state) {
    if (!item || !item.requires) return true;
    const req = item.requires;
    if (req.totalCoinsEarned != null && (state.totalCoinsEarned || 0) < req.totalCoinsEarned) return false;
    if (req.completedPhases != null && (state.completedPhases.length || 0) < req.completedPhases) return false;
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
export function buyItem(state, itemId) {
    const item = shopItemById(itemId);
    if (!item) return { ok: false, reason: 'item-inexistente' };
    if (isOwned(item, state)) return { ok: false, reason: 'ja-comprado' };
    if (!meetsRequirements(item, state)) return { ok: false, reason: 'bloqueado' };
    if ((state.coins || 0) < item.price) return { ok: false, reason: 'moedas-insuficientes' };
    if (!spendCoins(state, item.price)) return { ok: false, reason: 'moedas-insuficientes' };
    if (!state.ownedItems) state.ownedItems = [];
    state.ownedItems.push(item.id);
    checkBadges(state);
    return { ok: true, item };
}

// Equipa um item. O item precisa estar comprado (ou ser default).
export function equipItem(state, itemId) {
    const item = shopItemById(itemId);
    if (!item) return { ok: false, reason: 'item-inexistente' };
    if (!isOwned(item, state)) return { ok: false, reason: 'nao-comprado' };
    if (!state.equipped) state.equipped = {};
    state.equipped[item.category] = item.id;
    return { ok: true, item };
}

// Aplica tema atual ao <body>. Chamado no boot e após equipar.
export function applyTheme(state) {
    const themeId = (state.equipped && state.equipped.theme) || defaultItemId('theme');
    const theme = shopItemById(themeId);
    if (!theme) return;
    const body = document.body;
    if (theme.bg) body.style.background = theme.bg;
    else body.style.background = ''; // volta ao CSS default
    if (theme.title) {
        document.documentElement.style.setProperty('--title-color', theme.title);
    }
    body.classList.toggle('theme-animated', !!theme.animated);
    body.dataset.theme = theme.id;
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
