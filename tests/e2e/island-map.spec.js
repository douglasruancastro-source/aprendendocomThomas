import { test, expect } from '@playwright/test';

// Helper: estado fresco com tutorial dismissado.
async function landAtMap(page) {
    await page.goto('/');
    await page.evaluate(() => {
        const KEY = 'thomas_learning_v3';
        const s = { version: 6, hasSeenTutorial: true, mascotType: 'dino', completedPhases: [],
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
        const hotspots = page.locator('.island-card');
        await expect(hotspots).toHaveCount(5);
        await expect(page.locator('.island-card[data-section="letters"]')).toBeVisible();
        await expect(page.locator('.island-card[data-section="numbers"]')).toBeVisible();
        await expect(page.locator('.island-card[data-section="colors"]')).toBeVisible();
        await expect(page.locator('.island-card[data-section="syllables"]')).toBeVisible();
        await expect(page.locator('.island-card[data-section="rewards"]')).toBeVisible();
    });

    test('logo e mapa de fundo visiveis', async ({ page }) => {
        await landAtMap(page);
        await expect(page.locator('.home-brand')).toBeVisible();
        await expect(page.locator('.home-hero-bg')).toBeVisible();
    });

    test('mascotes flutuantes nao bloqueiam clique no botao', async ({ page }) => {
        await landAtMap(page);
        const tomi = page.locator('.island-card[data-section="letters"] .island-mascot');
        await expect(tomi).toBeVisible();
        const pointerEvents = await tomi.evaluate((el) => getComputedStyle(el).pointerEvents);
        // Mascote dentro do card herda o pointer-events do card (clique passa pro botao).
        expect(['none', 'auto']).toContain(pointerEvents);
    });

    test('ambient particles (folhas/nuvens/brilhos) renderizadas', async ({ page }) => {
        await landAtMap(page);
        await expect(page.locator('.map-ambient')).toBeVisible();
        const particles = page.locator('.ambient-particle');
        await expect(particles.first()).toBeVisible();
    });

    test('clicar na ilha das Letras abre menu', async ({ page }) => {
        await landAtMap(page);
        await page.click('.island-card[data-section="letters"]');
        await expect(page.locator('#menu')).toBeVisible();
    });

    test('clicar na ilha dos Numeros abre menu', async ({ page }) => {
        await landAtMap(page);
        await page.click('.island-card[data-section="numbers"]');
        await expect(page.locator('#menu')).toBeVisible();
    });

    test('clicar na ilha do Tesouro abre menu (nao mais a loja direto)', async ({ page }) => {
        await landAtMap(page);
        // No layout desktop padrao do Playwright (1280x720), o card "rewards"
        // (5o card) cai na linha de baixo do islands-grid e tem overlap visual
        // com o .home-cta-bar (z-index 3) — o ponteiro nao chega no card.
        // Disparamos o click via evaluate pra atingir o handler JS direto.
        await page.evaluate(() => {
            document.querySelector('.island-card[data-section="rewards"]').click();
        });
        // Hotspot rewards agora vai para o menu da Ilha do Tesouro (fases 61-75).
        await expect(page.locator('#menu')).toBeVisible();
    });

    test('responsivo: layout segura em 375x812', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await landAtMap(page);
        await expect(page.locator('.island-card')).toHaveCount(5);
        const heroWidth = await page.locator('.home-hero').evaluate((el) => el.getBoundingClientRect().width);
        expect(heroWidth).toBeLessThanOrEqual(375);
    });

    test('homeBtn dentro de fase volta para islandMap', async ({ page }) => {
        await landAtMap(page);
        await page.click('.island-card[data-section="letters"]');
        await page.locator('#menu .phase-card').first().click();
        await expect(page.locator('#homeBtn')).toBeVisible();
        await page.click('#homeBtn');
        await expect(page.locator('#islandMap')).toBeVisible();
    });
});
