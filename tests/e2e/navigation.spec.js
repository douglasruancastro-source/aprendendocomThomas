import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Clear localStorage
        await page.evaluate(() => localStorage.clear());
    });

    test('shows splash screen on load', async ({ page }) => {
        await page.goto('/');
        const splash = page.locator('#splash');
        await expect(splash).toBeVisible();
        await expect(splash).toContainText('Aprendendo com Thomas');
        await expect(splash).toContainText('Vamos Comecar!');
    });

    test('navigates from splash to menu', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Vamos Comecar!');
        const menu = page.locator('#menu');
        await expect(menu).toBeVisible();
        await expect(menu).toContainText('Escolha uma fase!');
    });

    test('shows 12 phase cards in menu', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Vamos Comecar!');
        const cards = page.locator('.phase-card');
        await expect(cards).toHaveCount(12);
    });

    test('shows section labels for Alfabetizacao and Raciocinio Logico', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Vamos Comecar!');
        await expect(page.locator('text=Alfabetizacao')).toBeVisible();
        await expect(page.locator('text=Raciocinio Logico')).toBeVisible();
    });

    test('phase 1 is unlocked, phase 2 is locked', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Vamos Comecar!');
        const cards = page.locator('.phase-card');
        const first = cards.first();
        const second = cards.nth(1);
        await expect(first).not.toHaveClass(/locked/);
        await expect(second).toHaveClass(/locked/);
    });

    test('shows badges section', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Vamos Comecar!');
        await expect(page.locator('text=Minhas Medalhas')).toBeVisible();
        const badges = page.locator('.badge-item');
        await expect(badges).toHaveCount(8);
    });

    test('clicking phase 1 starts activity', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Vamos Comecar!');
        const firstCard = page.locator('.phase-card').first();
        await firstCard.click();
        const activity = page.locator('#activity');
        await expect(activity).toBeVisible();
        await expect(activity).toContainText('Encontre as Vogais');
    });

    test('home button appears during activity', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Vamos Comecar!');
        await page.locator('.phase-card').first().click();
        const homeBtn = page.locator('#homeBtn');
        await expect(homeBtn).toBeVisible();
    });

    test('home button returns to menu', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Vamos Comecar!');
        await page.locator('.phase-card').first().click();
        await page.locator('#homeBtn').click();
        await expect(page.locator('#menu')).toBeVisible();
    });

    test('stars bar shows empty stars initially', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Vamos Comecar!');
        const starsBar = page.locator('#starsBar');
        const text = await starsBar.textContent();
        // Should have 12 empty stars (☆) and 0 filled stars (⭐)
        expect(text).toMatch(/☆/);
    });

    test('mascot is visible during activity', async ({ page }) => {
        await page.goto('/');
        await page.click('text=Vamos Comecar!');
        await page.locator('.phase-card').first().click();
        const mascot = page.locator('#mascot');
        await expect(mascot).toHaveClass(/visible/);
    });
});
