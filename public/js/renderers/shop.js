// Tela da loja: grid de cards com status (comprar / equipar / equipado / bloqueado).

import { soundClick, soundCoin } from '../audio.js';
import { shopCatalogView, buyItem, equipItem, applyTheme } from '../shop.js';
import { saveState } from '../state.js';
import { applyMascotLook } from './mascot.js';
import { renderHud, animateCoinGain } from './menu.js';

const CATEGORY_LABELS = {
    theme: 'Temas',
    mascot: 'Cores do Mascote',
    accessory: 'Acessorios',
    effect: 'Efeitos de Festa',
};

export function renderShop(state, onBack) {
    const container = document.getElementById('shopContent');
    if (!container) return;
    container.innerHTML = '';

    const coinBanner = document.createElement('div');
    coinBanner.className = 'shop-banner';
    coinBanner.innerHTML = `<span class="shop-coins">\u{1FA99} <b>${state.coins || 0}</b> moedas</span>`;
    container.appendChild(coinBanner);

    const catalog = shopCatalogView(state);
    const byCat = {};
    catalog.forEach((entry) => {
        const cat = entry.item.category;
        (byCat[cat] = byCat[cat] || []).push(entry);
    });

    Object.keys(CATEGORY_LABELS).forEach((cat) => {
        const entries = byCat[cat];
        if (!entries) return;
        const section = document.createElement('div');
        section.className = 'shop-section';
        section.innerHTML = `<h3 class="shop-section-title">${CATEGORY_LABELS[cat]}</h3>`;
        const grid = document.createElement('div');
        grid.className = 'shop-grid';
        entries.forEach((entry) => grid.appendChild(renderCard(entry, state, () => renderShop(state, onBack))));
        section.appendChild(grid);
        container.appendChild(section);
    });

    const backBtn = document.getElementById('shopBackBtn');
    if (backBtn) backBtn.onclick = () => { soundClick(); onBack(); };
}

function renderCard(entry, state, refresh) {
    const { item, owned, equipped, locked, canAfford } = entry;
    const card = document.createElement('div');
    card.className = 'shop-card';
    if (equipped) card.classList.add('equipped');
    if (locked) card.classList.add('locked');

    const preview = document.createElement('div');
    preview.className = 'shop-card-preview';
    preview.innerHTML = `<span class="shop-card-icon">${item.icon}</span>`;
    card.appendChild(preview);

    const name = document.createElement('div');
    name.className = 'shop-card-name';
    name.textContent = item.name;
    card.appendChild(name);

    const price = document.createElement('div');
    price.className = 'shop-card-price';
    if (item.default) price.textContent = 'Padrao';
    else if (owned) price.textContent = 'Comprado';
    else price.innerHTML = `\u{1FA99} ${item.price}`;
    card.appendChild(price);

    const action = document.createElement('button');
    action.className = 'shop-card-action';

    if (locked && !owned) {
        action.textContent = 'Bloqueado';
        action.disabled = true;
        const req = item.requires || {};
        const hint = document.createElement('div');
        hint.className = 'shop-card-hint';
        if (req.totalCoinsEarned) hint.textContent = `Ganhe ${req.totalCoinsEarned} moedas ao todo`;
        else if (req.completedPhases) hint.textContent = `Complete ${req.completedPhases} fases`;
        card.appendChild(hint);
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
        action.textContent = `Comprar (${item.price})`;
        if (!canAfford) {
            action.disabled = true;
            action.classList.add('disabled');
        }
        action.onclick = () => {
            const prev = state.coins;
            const res = buyItem(state, item.id);
            if (!res.ok) {
                if (res.reason === 'moedas-insuficientes') {
                    flash(card, 'Moedas insuficientes!');
                } else if (res.reason === 'bloqueado') {
                    flash(card, 'Item bloqueado!');
                }
                return;
            }
            soundCoin();
            saveState(state);
            animateCoinGain(prev, state.coins);
            renderHud(state);
            // auto-equipa depois de comprar
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
