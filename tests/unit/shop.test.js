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

    it('bloqueia se totalCoinsEarned insuficiente', () => {
        const item = shopItemById('theme-galaxy'); // requires 2500
        expect(meetsRequirements(item, makeState())).toBe(false);
    });

    it('libera quando totalCoinsEarned atinge o requisito', () => {
        const item = shopItemById('mascot-gold'); // requires 1000
        const s = makeState();
        s.totalCoinsEarned = 1000;
        expect(meetsRequirements(item, s)).toBe(true);
    });

    it('bloqueia mascot-rainbow até 6 fases completas', () => {
        const item = shopItemById('mascot-rainbow');
        const s = makeState();
        expect(meetsRequirements(item, s)).toBe(false);
        s.completedPhases = [1, 2, 3, 4, 5, 6];
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
        expect(state.coins).toBe(2000 - 200);
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
