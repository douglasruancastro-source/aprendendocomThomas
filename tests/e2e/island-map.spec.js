import { test, expect } from '@playwright/test';

async function landAtMap(page, name = 'Tche') {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    await page.fill('#nameInput', name);
    await page.click('#nameConfirmBtn');
    await page.click('text=Bah, vamos comecar!');
}

test.describe('Mundo das Tres Ilhas — mapa', () => {
    test('renders 4 hotspots with correct data-section', async ({ page }) => {
        await landAtMap(page);
        await expect(page.locator('#islandMap')).toBeVisible();
        const hotspots = page.locator('.island-hotspot');
        await expect(hotspots).toHaveCount(4);
        await expect(page.locator('[data-section="letters"]')).toBeVisible();
        await expect(page.locator('[data-section="numbers"]')).toBeVisible();
        await expect(page.locator('[data-section="colors"]')).toBeVisible();
        await expect(page.locator('[data-section="rewards"]')).toBeVisible();
    });

    test('island map shows brand logo and the map background image', async ({ page }) => {
        await landAtMap(page);
        await expect(page.locator('.map-logo')).toBeVisible();
        await expect(page.locator('.map-bg')).toBeVisible();
    });

    test('mascotes (tomi, ro, livi) are present near their islands', async ({ page }) => {
        await landAtMap(page);
        const tomi = page.locator('.island-letters .island-mascot');
        const ro = page.locator('.island-numbers .island-mascot');
        const livi = page.locator('.island-colors .island-mascot');
        await expect(tomi).toBeVisible();
        await expect(ro).toBeVisible();
        await expect(livi).toBeVisible();
        // Mascotes nao devem absorver clique (pointer-events: none) — botao parent recebe.
        const pointerEvents = await tomi.evaluate((el) => getComputedStyle(el).pointerEvents);
        expect(pointerEvents).toBe('none');
    });

    test('letters island routes to menu with letters filter', async ({ page }) => {
        await landAtMap(page);
        await page.click('.island-letters');
        await expect(page.locator('#menu')).toBeVisible();
        await expect(page.locator('#menu')).toHaveClass(/filter-letters/);
    });

    test('numbers island routes to menu with numbers filter', async ({ page }) => {
        await landAtMap(page);
        await page.click('.island-numbers');
        await expect(page.locator('#menu')).toBeVisible();
        await expect(page.locator('#menu')).toHaveClass(/filter-numbers/);
    });

    test('colors island routes to menu with colors filter (only fase 13 visible)', async ({ page }) => {
        await landAtMap(page);
        await page.click('.island-colors');
        await expect(page.locator('#menu')).toBeVisible();
        await expect(page.locator('#menu')).toHaveClass(/filter-colors/);
        // Fases que nao sao 13 ficam ocultas
        await expect(page.locator('#phasesGridMath .phase-card[data-phase-id="14"]')).toBeHidden();
        await expect(page.locator('#phasesGridMath .phase-card[data-phase-id="15"]')).toBeHidden();
        await expect(page.locator('#phasesGridMath .phase-card[data-phase-id="16"]')).toBeHidden();
    });

    test('rewards island opens the shop', async ({ page }) => {
        await landAtMap(page);
        await page.click('.island-rewards');
        await expect(page.locator('#shop')).toBeVisible();
    });

    test('responsive: layout holds on mobile viewport (375x812)', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await landAtMap(page);
        await expect(page.locator('#islandMap')).toBeVisible();
        await expect(page.locator('.island-hotspot')).toHaveCount(4);
        // Mapa nao transborda viewport
        const canvasWidth = await page.locator('.map-canvas').evaluate((el) => el.getBoundingClientRect().width);
        expect(canvasWidth).toBeLessThanOrEqual(375);
    });

    test('back from menu via home button returns to island map', async ({ page }) => {
        await landAtMap(page);
        await page.click('.island-letters');
        // Entra numa fase pra mostrar o homeBtn
        await page.locator('#phasesGrid .phase-card').first().click();
        await page.click('#homeBtn');
        await expect(page.locator('#islandMap')).toBeVisible();
    });
});
