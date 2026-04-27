import { describe, it, expect, beforeEach } from 'vitest';
import {
    meetsRequirements,
    isOwned,
    isEquipped,
    buyItem,
    equipItem,
    shopCatalogView,
} from '../../public/js/shop.js';
import { SHOP_ITEMS, shopItemById } from '../../public/js/data/shop.js';
import { addCoins } from '../../public/js/rewards.js';
import { defaultState } from '../../public/js/state.js';

function makeState() {
    return defaultState();
}

describe('catálogo SHOP_ITEMS', () => {
    it('tem ids únicos', () => {
        const ids = SHOP_ITEMS.map((i) => i.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('cada categoria tem exatamente um item default', () => {
        const cats = ['theme', 'mascot', 'accessory', 'effect'];
        cats.forEach((cat) => {
            const defaults = SHOP_ITEMS.filter((i) => i.category === cat && i.default);
            expect(defaults).toHaveLength(1);
        });
    });

    it('todo item não-default tem preço positivo', () => {
        SHOP_ITEMS.filter((i) => !i.default).forEach((i) => {
            expect(i.price).toBeGreaterThan(0);
        });
    });
});

describe('meetsRequirements', () => {
    it('aceita item sem requisitos', () => {
        expect(meetsRequirements({}, makeState())).toBe(true);
    });

    it('bloqueia theme-galaxy sem medalha "all-complete"', () => {
        const item = shopItemById('theme-galaxy'); // Fase 9: requires badge all-complete
        expect(meetsRequirements(item, makeState())).toBe(false);
    });

    it('libera mascot-gold quando ganha medalha streak-10', () => {
        const item = shopItemById('mascot-gold'); // Fase 9: requires badge streak-10
        const s = makeState();
        expect(meetsRequirements(item, s)).toBe(false);
        s.badges = ['streak-10'];
        expect(meetsRequirements(item, s)).toBe(true);
    });

    it('bloqueia mascot-rainbow até ganhar a medalha three-stars-10', () => {
        const item = shopItemById('mascot-rainbow');
        const s = makeState();
        expect(meetsRequirements(item, s)).toBe(false);
        s.badges = ['three-stars-10'];
        expect(meetsRequirements(item, s)).toBe(true);
    });
});

describe('isOwned / isEquipped', () => {
    it('items default são sempre owned', () => {
        expect(isOwned(shopItemById('theme-default'), makeState())).toBe(true);
    });
    it('items não-default começam não-owned', () => {
        expect(isOwned(shopItemById('theme-space'), makeState())).toBe(false);
    });
    it('isEquipped bate com state.equipped', () => {
        const s = makeState();
        expect(isEquipped(shopItemById('theme-default'), s)).toBe(true);
        expect(isEquipped(shopItemById('theme-space'), s)).toBe(false);
    });
});

describe('buyItem', () => {
    let state;
    beforeEach(() => { state = makeState(); addCoins(state, 2000); });

    it('compra com sucesso quando pode pagar e não tem requisito', () => {
        const r = buyItem(state, 'theme-space');
        expect(r.ok).toBe(true);
        expect(state.ownedItems).toContain('theme-space');
        // Fase 9: medalhas conquistadas via checkBadges() durante a compra creditam moedas extras.
        // Apos comprar (200 gastos) o state acumula moedas das medalhas (shopper +50, coin-100/coin-1000/pila-500 se totalCoinsEarned bater).
        // Validamos: gastou os 200 do item (saldo > 0 e itens incluem theme-space).
        expect(state.coins).toBeGreaterThanOrEqual(2000 - 200);
        expect(state.totalCoinsSpent).toBe(200);
    });

    it('falha por moedas insuficientes', () => {
        state.coins = 50;
        const r = buyItem(state, 'theme-space');
        expect(r.ok).toBe(false);
        expect(r.reason).toBe('moedas-insuficientes');
    });

    it('falha por bloqueio de requisito mesmo com moedas', () => {
        const r = buyItem(state, 'theme-galaxy');
        expect(r.ok).toBe(false);
        expect(r.reason).toBe('bloqueado');
    });

    it('falha quando item já foi comprado', () => {
        buyItem(state, 'theme-space');
        const r = buyItem(state, 'theme-space');
        expect(r.ok).toBe(false);
        expect(r.reason).toBe('ja-comprado');
    });

    it('primeira compra concede badge "shopper"', () => {
        buyItem(state, 'theme-space');
        expect(state.badges).toContain('shopper');
    });
});

describe('equipItem', () => {
    let state;
    beforeEach(() => { state = makeState(); addCoins(state, 1000); });

    it('equipa item default sem precisar comprar', () => {
        const r = equipItem(state, 'mascot-default');
        expect(r.ok).toBe(true);
        expect(state.equipped.mascot).toBe('mascot-default');
    });

    it('não equipa item não comprado', () => {
        const r = equipItem(state, 'theme-space');
        expect(r.ok).toBe(false);
        expect(r.reason).toBe('nao-comprado');
    });

    it('equipa após comprar', () => {
        buyItem(state, 'theme-space');
        const r = equipItem(state, 'theme-space');
        expect(r.ok).toBe(true);
        expect(state.equipped.theme).toBe('theme-space');
    });

    it('trocar tema substitui o equipado anterior (não acumula)', () => {
        buyItem(state, 'theme-space');
        buyItem(state, 'theme-forest');
        equipItem(state, 'theme-space');
        equipItem(state, 'theme-forest');
        expect(state.equipped.theme).toBe('theme-forest');
    });
});

describe('shopCatalogView', () => {
    it('retorna uma entrada por item com flags computadas', () => {
        const s = makeState();
        addCoins(s, 250);
        const view = shopCatalogView(s);
        expect(view).toHaveLength(SHOP_ITEMS.length);
        const space = view.find((e) => e.item.id === 'theme-space');
        expect(space.owned).toBe(false);
        expect(space.canAfford).toBe(true);
        expect(space.locked).toBe(false);
        const galaxy = view.find((e) => e.item.id === 'theme-galaxy');
        expect(galaxy.locked).toBe(true);
    });
});
