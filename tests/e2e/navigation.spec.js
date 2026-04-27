import { test, expect } from '@playwright/test';

// Fase 10.4: helpers atualizados pra arquitetura sem name prompt + tutorial dismissivel.
// Sempre marcamos hasSeenTutorial=true antes de carregar pra evitar o overlay.
async function startAtSplash(page) {
    await page.goto('/');
    await page.evaluate(() => {
        localStorage.clear();
        const seed = { hasSeenTutorial: true, version: 5 };
        // estado mínimo aceito pelo loadState (sem completedPhases dispara default)
    });
    await page.goto('/');
    // Marca tutorial como visto via state direto pra evitar overlay durante testes.
    await page.evaluate(() => {
        const KEY = 'thomas_learning_v3';
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        s.version = 5;
        s.hasSeenTutorial = true;
        s.completedPhases = s.completedPhases || [];
        s.equipped = s.equipped || { theme: 'theme-default', mascot: 'mascot-default', accessory: 'acc-none', effect: 'effect-default' };
        localStorage.setItem(KEY, JSON.stringify(s));
    });
    await page.reload();
}

async function startAtIslandMap(page) {
    await startAtSplash(page);
    await page.click('#startBtn');
    await expect(page.locator('#islandMap')).toBeVisible();
}

test.describe('Navigation (Fase 10.4)', () => {
    test('lands directly on splash (no name prompt)', async ({ page }) => {
        await startAtSplash(page);
        await expect(page.locator('#splash')).toBeVisible();
        // Sem #namePrompt na arquitetura atual
        await expect(page.locator('#namePrompt')).toHaveCount(0);
        await expect(page.locator('#startBtn')).toBeVisible();
        await expect(page.locator('#parentsBtn')).toBeVisible();
    });

    test('Comecar leva ao islandMap com 5 hotspots', async ({ page }) => {
        await startAtIslandMap(page);
        await expect(page.locator('.island-hotspot')).toHaveCount(5);
        await expect(page.locator('.island-letters')).toBeVisible();
        await expect(page.locator('.island-numbers')).toBeVisible();
        await expect(page.locator('.island-colors')).toBeVisible();
        await expect(page.locator('.island-syllables')).toBeVisible();
        await expect(page.locator('.island-rewards')).toBeVisible();
    });

    test('islandMap tem logo + missoes diarias + main-nav', async ({ page }) => {
        await startAtIslandMap(page);
        await expect(page.locator('.map-logo')).toBeVisible();
        await expect(page.locator('#missionsCard')).toBeVisible();
        await expect(page.locator('#mainNav')).toBeVisible();
        await expect(page.locator('#mainNav button[data-nav="play"]')).toBeVisible();
        await expect(page.locator('#mainNav button[data-nav="badges"]')).toBeVisible();
        await expect(page.locator('#mainNav button[data-nav="shop"]')).toBeVisible();
    });

    test('clicar na ilha das Letras abre o menu com cards', async ({ page }) => {
        await startAtIslandMap(page);
        await page.click('.island-letters');
        await expect(page.locator('#menu')).toBeVisible();
        // Pelo menos 1 card visivel (a fase 1 que esta desbloqueada)
        await expect(page.locator('#menu .phase-card').first()).toBeVisible();
    });

    test('main-nav: medalhas vai para #badges', async ({ page }) => {
        await startAtIslandMap(page);
        await page.click('#mainNav button[data-nav="badges"]');
        await expect(page.locator('#badges')).toBeVisible();
    });

    test('main-nav: loja vai para #shop', async ({ page }) => {
        await startAtIslandMap(page);
        await page.click('#mainNav button[data-nav="shop"]');
        await expect(page.locator('#shop')).toBeVisible();
    });

    test('botao Area dos Pais no splash leva para #parents', async ({ page }) => {
        await startAtSplash(page);
        await page.click('#parentsBtn');
        await expect(page.locator('#parents')).toBeVisible();
    });

    test('HUD mostra rank pill + coin pill', async ({ page }) => {
        await startAtIslandMap(page);
        await expect(page.locator('#rankPill')).toBeVisible();
        await expect(page.locator('#coinCount')).toBeVisible();
    });

    test('clicar fase 1 inicia atividade com powerup bar', async ({ page }) => {
        await startAtIslandMap(page);
        await page.click('.island-letters');
        await page.locator('#menu .phase-card').first().click();
        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('#powerupBar')).toBeVisible();
    });

    test('homeBtn durante atividade volta ao islandMap', async ({ page }) => {
        await startAtIslandMap(page);
        await page.click('.island-letters');
        await page.locator('#menu .phase-card').first().click();
        await expect(page.locator('#homeBtn')).toBeVisible();
        await page.click('#homeBtn');
        await expect(page.locator('#islandMap')).toBeVisible();
    });

    test('mascote visivel durante atividade', async ({ page }) => {
        await startAtIslandMap(page);
        await page.click('.island-letters');
        await page.locator('#menu .phase-card').first().click();
        await expect(page.locator('#mascot')).toHaveClass(/visible/);
    });

    test('tutorial nao aparece em sessoes seguintes (hasSeenTutorial=true)', async ({ page }) => {
        await startAtIslandMap(page);
        await expect(page.locator('.tutorial-overlay')).toHaveCount(0);
    });
});
