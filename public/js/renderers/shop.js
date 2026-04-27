// Loja: tabs (Mascotes / Temas / Acessorios / Efeitos) + grid 2 col paginado.
// Estado da tab persistido em memoria (modulo). Sem scroll vertical.

import { soundClick, soundCoin } from '../audio.js';
import { shopCatalogView, buyItem, equipItem, applyTheme } from '../shop.js';
import { saveState } from '../state.js';
import { applyMascotLook } from './mascot.js';
import { renderHud, animateCoinGain } from './menu.js';
import { CurrencyBadge } from '../components/CurrencyBadge.js';
import { Tabs } from '../components/Tabs.js';
import { Pager } from '../components/Pager.js';
import { BADGE_DEFS } from '../rewards.js';

const CATEGORY_ORDER = ['powerup', 'mascot', 'theme', 'accessory', 'effect', 'frame'];
const CATEGORY_META = {
    powerup:   { emoji: '💡', label: 'Powerups' },
    theme:     { emoji: '🎨', label: 'Temas' },
    mascot:    { emoji: '🐾', label: 'Mascotes' },
    accessory: { emoji: '🎁', label: 'Acessorios' },
    effect:    { emoji: '✨', label: 'Efeitos' },
    frame:     { emoji: '🖼️', label: 'Molduras' },
};
const PAGE_SIZE = 4;
let currentTab = 'mascot';

export function renderShop(state, onBack) {
    const container = document.getElementById('shopContent');
    if (!container) return;
    container.innerHTML = '';

    // Top bar: titulo + saldo
    const topbar = document.createElement('div');
    topbar.className = 'shop-topbar';
    const title = document.createElement('h2');
    title.className = 'shop-screen-title';
    title.textContent = 'Loja';
    topbar.appendChild(title);
    topbar.appendChild(CurrencyBadge(state.coins || 0));
    container.appendChild(topbar);

    // Tabs
    const tabs = Tabs({
        tabs: CATEGORY_ORDER.map((k) => ({ key: k, label: CATEGORY_META[k].label, emoji: CATEGORY_META[k].emoji })),
        active: currentTab,
        onChange: (k) => { currentTab = k; renderShop(state, onBack); },
    });
    container.appendChild(tabs.element);

    // Catalogo filtrado pela tab
    const catalog = shopCatalogView(state).filter((entry) => entry.item.category === currentTab);

    Pager({
        items: catalog,
        pageSize: PAGE_SIZE,
        container,
        emptyText: 'Nada por aqui ainda.',
        renderItem: (entry) => renderCard(entry, state, () => renderShop(state, onBack)),
    });
    const grid = container.querySelector('.pager-grid');
    if (grid) grid.classList.add('cols-2', 'shop-pager-grid');

    const backBtn = document.getElementById('shopBackBtn');
    if (backBtn) backBtn.onclick = () => { soundClick(); onBack(); };
}

function renderCard(entry, state, refresh) {
    const { item, owned, equipped, locked, canAfford } = entry;
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.dataset.category = item.category; // Fase 7: drives preview animation
    if (equipped) card.classList.add('equipped');
    if (locked) card.classList.add('locked');

    const preview = document.createElement('div');
    preview.className = 'shop-card-preview';
    const iconEl = document.createElement('span');
    iconEl.className = 'shop-card-icon';
    iconEl.textContent = item.icon;
    preview.appendChild(iconEl);
    card.appendChild(preview);

    if (equipped) {
        const seal = document.createElement('div');
        seal.className = 'shop-card-seal';
        seal.setAttribute('aria-hidden', 'true');
        seal.textContent = '✓';
        card.appendChild(seal);
    }

    // Fase 9 - Onda 3: powerups consumiveis mostram estoque atual.
    if (item.consumable) {
        const stock = (state.powerups && state.powerups[item.id]) || 0;
        if (stock > 0) {
            const stockBadge = document.createElement('div');
            stockBadge.className = 'shop-card-seal';
            stockBadge.setAttribute('aria-hidden', 'true');
            stockBadge.textContent = `x${stock}`;
            card.appendChild(stockBadge);
        }
    }

    const name = document.createElement('div');
    name.className = 'shop-card-name';
    name.textContent = item.name;
    card.appendChild(name);

    // Descricao curta para powerups (explica o que faz).
    if (item.desc) {
        const desc = document.createElement('div');
        desc.className = 'shop-card-desc';
        desc.textContent = item.desc;
        card.appendChild(desc);
    }

    const price = document.createElement('div');
    price.className = 'shop-card-price';
    if (item.default) {
        price.textContent = 'Padrao';
    } else if (owned && !item.consumable) {
        price.textContent = 'Comprado';
    } else {
        const priceIcon = document.createElement('span');
        priceIcon.setAttribute('aria-hidden', 'true');
        priceIcon.textContent = '🪙';
        price.appendChild(priceIcon);
        price.appendChild(document.createTextNode(' ' + item.price));
    }
    card.appendChild(price);

    const action = document.createElement('button');
    action.className = 'shop-card-action';

    if (locked && !owned && !item.consumable) {
        action.textContent = 'Bloqueado';
        action.disabled = true;
        const req = item.requires || {};
        const hint = document.createElement('div');
        hint.className = 'shop-card-hint';
        if (req.badge) {
            const badgeDef = BADGE_DEFS.find((b) => b.id === req.badge);
            const badgeName = badgeDef ? badgeDef.name : req.badge;
            const badgeIcon = badgeDef ? badgeDef.icon : '\u{1F3C5}';
            hint.textContent = `${badgeIcon} Ganhe "${badgeName}"`;
        } else if (req.totalCoinsEarned) hint.textContent = `Ganhe ${req.totalCoinsEarned} moedas`;
        else if (req.completedPhases) hint.textContent = `Complete ${req.completedPhases} fases`;
        card.appendChild(hint);
    } else if (item.consumable) {
        // Powerups: sempre comprar +1, nao tem "equipar" (gasta na hora).
        action.textContent = 'Comprar +1';
        if (!canAfford) {
            action.disabled = true;
            action.classList.add('disabled');
        }
        action.onclick = () => {
            const prev = state.coins;
            const res = buyItem(state, item.id);
            if (!res.ok) {
                if (res.reason === 'moedas-insuficientes') flash(card, 'Moedas insuficientes!');
                else if (res.reason === 'bloqueado') flash(card, 'Item bloqueado!');
                return;
            }
            soundCoin();
            saveState(state);
            animateCoinGain(prev, state.coins);
            renderHud(state);
            refresh();
        };
    } else if (equipped) {
        action.textContent = 'Equipado';
        action.disabled = true;
    } else if (owned) {
        action.textContent = 'Equipar';
        action.onclick = () => {
            soundClick();
            const res = equipItem(state, item.id);
            if (res.ok) {
                if (item.category === 'theme') applyTheme(state);
                if (item.category === 'mascot' || item.category === 'accessory') applyMascotLook(state);
                saveState(state);
                refresh();
            }
        };
    } else {
        action.textContent = `Comprar`;
        if (!canAfford) {
            action.disabled = true;
            action.classList.add('disabled');
        }
        action.onclick = () => {
            const prev = state.coins;
            const res = buyItem(state, item.id);
            if (!res.ok) {
                if (res.reason === 'moedas-insuficientes') flash(card, 'Moedas insuficientes!');
                else if (res.reason === 'bloqueado') flash(card, 'Item bloqueado!');
                return;
            }
            soundCoin();
            saveState(state);
            animateCoinGain(prev, state.coins);
            renderHud(state);
            equipItem(state, item.id);
            if (item.category === 'theme') applyTheme(state);
            if (item.category === 'mascot' || item.category === 'accessory') applyMascotLook(state);
            saveState(state);
            refresh();
        };
    }
    card.appendChild(action);
    return card;
}

function flash(card, text) {
    const tip = document.createElement('div');
    tip.className = 'shop-flash';
    tip.textContent = text;
    card.appendChild(tip);
    setTimeout(() => tip.remove(), 1400);
}
