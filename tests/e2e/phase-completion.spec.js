import { test, expect } from '@playwright/test';

test.describe('Phase Completion', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.goto('/');
    });

    test('completing phase 1 shows result screen', async ({ page }) => {
        await page.click('text=Vamos Comecar!');
        await page.locator('.phase-card').first().click();

        // Complete 6 rounds of finding vowels
        for (let round = 0; round < 6; round++) {
            // Click all vowels (they have letters A, E, I, O, U)
            const bubbles = page.locator('.letter-bubble');
            const count = await bubbles.count();
            for (let i = 0; i < count; i++) {
                const text = await bubbles.nth(i).textContent();
                if (['A', 'E', 'I', 'O', 'U'].includes(text)) {
                    await bubbles.nth(i).click();
                }
            }
            await page.click('text=Conferir!');
            // Wait for feedback to dismiss
            await page.waitForTimeout(1500);
        }

        // Should show result
        const result = page.locator('#result');
        await expect(result).toBeVisible({ timeout: 5000 });
    });

    test('phase progress bar updates during activity', async ({ page }) => {
        await page.click('text=Vamos Comecar!');
        await page.locator('.phase-card').first().click();

        const roundInfo = page.locator('#roundInfo');
        await expect(roundInfo).toContainText('Rodada 1 de 6');
    });

    test('streak counter shows after 2 consecutive correct', async ({ page }) => {
        await page.click('text=Vamos Comecar!');
        await page.locator('.phase-card').first().click();

        // Complete 2 rounds correctly
        for (let round = 0; round < 2; round++) {
            const bubbles = page.locator('.letter-bubble');
            const count = await bubbles.count();
            for (let i = 0; i < count; i++) {
                const text = await bubbles.nth(i).textContent();
                if (['A', 'E', 'I', 'O', 'U'].includes(text)) {
                    await bubbles.nth(i).click();
                }
            }
            await page.click('text=Conferir!');
            await page.waitForTimeout(1500);
        }

        const streakDisplay = page.locator('#streakDisplay');
        await expect(streakDisplay).toHaveClass(/active/);
    });
});
