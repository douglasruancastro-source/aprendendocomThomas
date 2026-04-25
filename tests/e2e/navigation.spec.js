import { test, expect } from '@playwright/test';

// Helper: limpa storage, atravessa name prompt e splash, cai no #islandMap.
async function startAtIslandMap(page, name = 'Tchezinho') {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    await page.fill('#nameInput', name);
    await page.click('#nameConfirmBtn');
    await page.click('text=Bah, vamos comecar!');
}

// Helper: do island map, entra na ilha das Letras (menu filtrado fases 1-8).
async function enterLetters(page) {
    await page.click('.island-letters');
}

test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
    });

    test('shows name prompt on first load', async ({ page }) => {
        await page.goto('/');
        const prompt = page.locator('#namePrompt');
        await expect(prompt).toBeVisible();
        await expect(prompt).toContainText('Qual e o seu nome?');
    });

    test('name prompt advances to splash and shows EducaTche title', async ({ page }) => {
        await page.goto('/');
        await page.fill('#nameInput', 'Thomas');
        await page.click('#nameConfirmBtn');
        const splash = page.locator('#splash');
        await expect(splash).toBeVisible();
        await expect(splash).toContainText('EducaTche');
        await expect(splash).toContainText('Bah, vamos comecar!');
    });

    test('after splash, lands on island map with 4 hotspots', async ({ page }) => {
        await startAtIslandMap(page, 'Thomas');
        await expect(page.locator('#islandMap')).toBeVisible();
        await expect(page.locator('.island-hotspot')).toHaveCount(4);
        await expect(page.locator('.island-letters')).toBeVisible();
        await expect(page.locator('.island-numbers')).toBeVisible();
        await expect(page.locator('.island-colors')).toBeVisible();
        await expect(page.locator('.island-rewards')).toBeVisible();
    });

    test('island map shows brand logo in header', async ({ page }) => {
        await startAtIslandMap(page);
        await expect(page.locator('.map-logo')).toBeVisible();
    });

    test('clicking Letters island opens menu with alfabetizacao + logica (12 cards)', async ({ page }) => {
        await startAtIslandMap(page);
        await enterLetters(page);
        await expect(page.locator('#menu')).toBeVisible();
        await expect(page.locator('#phasesGrid .phase-card')).toHaveCount(8);
        await expect(page.locator('#phasesGridLogic .phase-card')).toHaveCount(4);
        // Matematica oculta pelo filtro
        await expect(page.locator('#phasesGridMath')).toBeHidden();
    });

    test('clicking Numeros island opens menu with 4 math cards', async ({ page }) => {
        await startAtIslandMap(page);
        await page.click('.island-numbers');
        await expect(page.locator('#menu')).toBeVisible();
        await expect(page.locator('#phasesGridMath .phase-card')).toHaveCount(4);
        await expect(page.locator('#phasesGrid')).toBeHidden();
    });

    test('clicking Recompensas island opens the shop', async ({ page }) => {
        await startAtIslandMap(page);
        await page.click('.island-rewards');
        await expect(page.locator('#shop')).toBeVisible();
    });

    test('menu shows personalized greeting with typed name', async ({ page }) => {
        await startAtIslandMap(page, 'Thomas');
        await enterLetters(page);
        const menu = page.locator('#menu');
        await expect(menu).toContainText('Thomas');
        await expect(menu).toContainText('Escolha uma fase!');
    });

    test('phase 1 is unlocked in Letters menu', async ({ page }) => {
        await startAtIslandMap(page);
        await enterLetters(page);
        const cards = page.locator('#phasesGrid .phase-card');
        await expect(cards.first()).not.toHaveClass(/locked/);
        await expect(cards.nth(1)).toHaveClass(/locked/);
    });

    test('shows badges section in menu', async ({ page }) => {
        await startAtIslandMap(page);
        await enterLetters(page);
        await expect(page.locator('text=Minhas Medalhas')).toBeVisible();
        const badges = page.locator('.badge-item');
        await expect(badges.first()).toBeVisible();
    });

    test('clicking phase 1 starts activity', async ({ page }) => {
        await startAtIslandMap(page);
        await enterLetters(page);
        await page.locator('#phasesGrid .phase-card').first().click();
        const activity = page.locator('#activity');
        await expect(activity).toBeVisible();
        await expect(activity).toContainText('Encontre as Vogais');
    });

    test('home button appears during activity', async ({ page }) => {
        await startAtIslandMap(page);
        await enterLetters(page);
        await page.locator('#phasesGrid .phase-card').first().click();
        await expect(page.locator('#homeBtn')).toBeVisible();
    });

    test('home button returns to island map', async ({ page }) => {
        await startAtIslandMap(page);
        await enterLetters(page);
        await page.locator('#phasesGrid .phase-card').first().click();
        await page.locator('#homeBtn').click();
        await expect(page.locator('#islandMap')).toBeVisible();
    });

    test('stars bar shows empty stars initially', async ({ page }) => {
        await startAtIslandMap(page);
        await enterLetters(page);
        const text = await page.locator('#starsBar').textContent();
        expect(text).toMatch(/☆/);
    });

    test('mascot is visible during activity', async ({ page }) => {
        await startAtIslandMap(page);
        await enterLetters(page);
        await page.locator('#phasesGrid .phase-card').first().click();
        await expect(page.locator('#mascot')).toHaveClass(/visible/);
    });

    test('name persists across reloads (no prompt shown again)', async ({ page }) => {
        await startAtIslandMap(page, 'Thomas');
        await page.reload();
        await expect(page.locator('#namePrompt')).not.toBeVisible();
        await expect(page.locator('#splash')).toBeVisible();
    });
});
