import { test, expect } from '@playwright/test';

// Helper: estado fresco com tutorial dismissado.
async function landAtMap(page) {
    await page.goto('/');
    await page.evaluate(() => {
        const KEY = 'thomas_learning_v3';
        const s = { version: 5, hasSeenTutorial: true, completedPhases: [],
                    equipped: { theme: 'theme-default', mascot: 'mascot-default', accessory: 'acc-none', effect: 'effect-default' } };
        localStorage.setItem(KEY, JSON.stringify(s));
    });
    await page.reload();
    await page.click('#startBtn');
    await expect(page.locator('#islandMap')).toBeVisible();
}

test.describe('Mundo das Tres Ilhas — mapa (Fase 10.4)', () => {
    test('5 hotspots com data-section corretos', async ({ page }) => {
        await landAtMap(page);
        const hotspots = page.locator('.island-hotspot');
        await expect(hotspots).toHaveCount(5);
        await expect(page.locator('[data-section="letters"]')).toBeVisible();
        await expect(page.locator('[data-section="numbers"]')).toBeVisible();
        await expect(page.locator('[data-section="colors"]')).toBeVisible();
        await expect(page.locator('[data-section="syllables"]')).toBeVisible();
        await expect(page.locator('[data-section="rewards"]')).toBeVisible();
    });

    test('logo e mapa de fundo visiveis', async ({ page }) => {
        await landAtMap(page);
        await expect(page.locator('.map-logo')).toBeVisible();
        await expect(page.locator('.map-bg')).toBeVisible();
    });

    test('mascotes flutuantes nao bloqueiam clique no botao', async ({ page }) => {
        await landAtMap(page);
        const tomi = page.locator('.island-letters .island-mascot');
        await expect(tomi).toBeVisible();
        const pointerEvents = await tomi.evaluate((el) => getComputedStyle(el).pointerEvents);
        expect(pointerEvents).toBe('none');
    });

    test('ambient particles (folhas/nuvens/brilhos) renderizadas', async ({ page }) => {
        await landAtMap(page);
        await expect(page.locator('.map-ambient')).toBeVisible();
        const particles = page.locator('.ambient-particle');
        await expect(particles.first()).toBeVisible();
    });

    test('clicar na ilha das Letras abre menu', async ({ page }) => {
        await landAtMap(page);
        await page.click('.island-letters');
        await expect(page.locator('#menu')).toBeVisible();
    });

    test('clicar na ilha dos Numeros abre menu', async ({ page }) => {
        await landAtMap(page);
        await page.click('.island-numbers');
        await expect(page.locator('#menu')).toBeVisible();
    });

    test('clicar na ilha do Tesouro abre menu (nao mais a loja direto)', async ({ page }) => {
        await landAtMap(page);
        await page.click('.island-rewards');
        // Hotspot rewards agora vai para o menu da Ilha do Tesouro (fases 61-75).
        await expect(page.locator('#menu')).toBeVisible();
    });

    test('responsivo: layout segura em 375x812', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await landAtMap(page);
        await expect(page.locator('.island-hotspot')).toHaveCount(5);
        const canvasWidth = await page.locator('.map-canvas').evaluate((el) => el.getBoundingClientRect().width);
        expect(canvasWidth).toBeLessThanOrEqual(375);
    });

    test('homeBtn dentro de fase volta para islandMap', async ({ page }) => {
        await landAtMap(page);
        await page.click('.island-letters');
        await page.locator('#menu .phase-card').first().click();
        await expect(page.locator('#homeBtn')).toBeVisible();
        await page.click('#homeBtn');
        await expect(page.locator('#islandMap')).toBeVisible();
    });
});
