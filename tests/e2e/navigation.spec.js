import { test, expect } from '@playwright/test';

// Helper: clear storage and go through the name prompt + splash to land on menu.
async function startWithName(page, name = 'Tchezinho') {
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    await page.fill('#nameInput', name);
    await page.click('#nameConfirmBtn');
    await page.click('text=Bah, vamos comecar!');
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

    test('menu shows personalized greeting with typed name', async ({ page }) => {
        await startWithName(page, 'Thomas');
        const menu = page.locator('#menu');
        await expect(menu).toBeVisible();
        await expect(menu).toContainText('Thomas');
        await expect(menu).toContainText('Escolha uma fase!');
    });

    test('shows 16 phase cards in menu', async ({ page }) => {
        await startWithName(page);
        const cards = page.locator('.phase-card');
        await expect(cards).toHaveCount(16);
    });

    test('shows section labels for Alfabetizacao, Raciocinio Logico and Matematica', async ({ page }) => {
        await startWithName(page);
        await expect(page.locator('text=Alfabetizacao')).toBeVisible();
        await expect(page.locator('text=Raciocinio Logico')).toBeVisible();
        await expect(page.locator('text=Matematica')).toBeVisible();
    });

    test('phase 1 is unlocked, phase 2 is locked', async ({ page }) => {
        await startWithName(page);
        const cards = page.locator('.phase-card');
        await expect(cards.first()).not.toHaveClass(/locked/);
        await expect(cards.nth(1)).toHaveClass(/locked/);
    });

    test('shows badges section', async ({ page }) => {
        await startWithName(page);
        await expect(page.locator('text=Minhas Medalhas')).toBeVisible();
        const badges = page.locator('.badge-item');
        // Agora temos badges originais + 4 novos inspirados no RS
        await expect(badges.first()).toBeVisible();
    });

    test('clicking phase 1 starts activity', async ({ page }) => {
        await startWithName(page);
        await page.locator('.phase-card').first().click();
        const activity = page.locator('#activity');
        await expect(activity).toBeVisible();
        await expect(activity).toContainText('Encontre as Vogais');
    });

    test('home button appears during activity', async ({ page }) => {
        await startWithName(page);
        await page.locator('.phase-card').first().click();
        await expect(page.locator('#homeBtn')).toBeVisible();
    });

    test('home button returns to menu', async ({ page }) => {
        await startWithName(page);
        await page.locator('.phase-card').first().click();
        await page.locator('#homeBtn').click();
        await expect(page.locator('#menu')).toBeVisible();
    });

    test('stars bar shows empty stars initially', async ({ page }) => {
        await startWithName(page);
        const text = await page.locator('#starsBar').textContent();
        expect(text).toMatch(/☆/);
    });

    test('mascot is visible during activity', async ({ page }) => {
        await startWithName(page);
        await page.locator('.phase-card').first().click();
        await expect(page.locator('#mascot')).toHaveClass(/visible/);
    });

    test('name persists across reloads (no prompt shown again)', async ({ page }) => {
        await startWithName(page, 'Thomas');
        await page.reload();
        // Apos reload, vai direto ao splash (nao mostra prompt).
        await expect(page.locator('#namePrompt')).not.toBeVisible();
        await expect(page.locator('#splash')).toBeVisible();
    });
});
