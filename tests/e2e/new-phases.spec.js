import { test, expect } from '@playwright/test';

test.describe('New Logic Phases', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Unlock all phases by completing 1-8
        await page.evaluate(() => {
            localStorage.setItem('thomas_learning_v2', JSON.stringify({
                completedPhases: [1, 2, 3, 4, 5, 6, 7, 8],
                drawingsUsed: [],
                badges: [],
                streak: 0,
                bestStreak: 0,
                totalCorrect: 0
            }));
        });
        await page.goto('/');
        await page.click('text=Vamos Comecar!');
    });

    test('phase 9 (Sequencia Logica) renders correctly', async ({ page }) => {
        // Find and click phase 9
        const phaseCards = page.locator('.phase-card');
        await phaseCards.nth(8).click(); // 0-indexed, phase 9 is at index 8

        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('#activityTitle')).toContainText('Sequencia Logica');

        // Should show sequence items and a mystery item
        await expect(page.locator('.sequence-item').first()).toBeVisible();
        await expect(page.locator('.sequence-item.mystery')).toBeVisible();

        // Should show option buttons
        const options = page.locator('.option-btn');
        await expect(options.first()).toBeVisible();
    });

    test('phase 10 (Jogo da Memoria) renders memory grid', async ({ page }) => {
        const phaseCards = page.locator('.phase-card');
        await phaseCards.nth(9).click();

        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('#activityTitle')).toContainText('Jogo da Memoria');

        // Should show memory grid with 8 cards (4 pairs)
        const cards = page.locator('.memory-card');
        await expect(cards).toHaveCount(8);

        // Cards should start face-down (not flipped)
        const firstCard = cards.first();
        await expect(firstCard).not.toHaveClass(/flipped/);
    });

    test('phase 10 - clicking a card flips it', async ({ page }) => {
        const phaseCards = page.locator('.phase-card');
        await phaseCards.nth(9).click();

        const cards = page.locator('.memory-card');
        await cards.first().click();

        // First card should be flipped
        await expect(cards.first()).toHaveClass(/flipped/);
    });

    test('phase 11 (Qual e o Diferente) renders 4 items', async ({ page }) => {
        const phaseCards = page.locator('.phase-card');
        await phaseCards.nth(10).click();

        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('#activityTitle')).toContainText('Qual e o Diferente');

        const items = page.locator('.odd-item');
        await expect(items).toHaveCount(4);
    });

    test('phase 12 (Conte e Combine) shows items and options', async ({ page }) => {
        const phaseCards = page.locator('.phase-card');
        await phaseCards.nth(11).click();

        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('#activityTitle')).toContainText('Conte e Combine');

        // Should show count items
        const countItems = page.locator('.count-item');
        const count = await countItems.count();
        expect(count).toBeGreaterThan(0);

        // Should show number options
        const options = page.locator('.option-btn');
        await expect(options.first()).toBeVisible();
    });

    test('logic phases are locked when phase 8 not completed', async ({ page }) => {
        // Reset to no completed phases
        await page.evaluate(() => {
            localStorage.setItem('thomas_learning_v2', JSON.stringify({
                completedPhases: [1, 2, 3, 4, 5, 6, 7],
                drawingsUsed: [],
                badges: [],
                streak: 0,
                bestStreak: 0,
                totalCorrect: 0
            }));
        });
        await page.goto('/');
        await page.click('text=Vamos Comecar!');

        // Phase 9 should be locked
        const logicGrid = page.locator('#phasesGridLogic');
        const firstLogicCard = logicGrid.locator('.phase-card').first();
        await expect(firstLogicCard).toHaveClass(/locked/);
    });

    test('logic phases unlock when phase 8 is completed', async ({ page }) => {
        // Phase 9 (first in logic grid) should be unlocked
        const logicGrid = page.locator('#phasesGridLogic');
        const firstLogicCard = logicGrid.locator('.phase-card').first();
        await expect(firstLogicCard).not.toHaveClass(/locked/);
    });
});
