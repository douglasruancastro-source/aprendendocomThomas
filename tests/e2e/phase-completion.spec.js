import { test, expect } from '@playwright/test';

async function startLetters(page) {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    await page.fill('#nameInput', 'Tche');
    await page.click('#nameConfirmBtn');
    await page.click('text=Bah, vamos comecar!');
    await page.click('.island-letters');
}

test.describe('Phase Completion', () => {
    test('completing phase 1 shows result screen', async ({ page }) => {
        await startLetters(page);
        await page.locator('#phasesGrid .phase-card').first().click();

        for (let round = 0; round < 6; round++) {
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

        const result = page.locator('#result');
        await expect(result).toBeVisible({ timeout: 5000 });
    });

    test('phase progress bar updates during activity', async ({ page }) => {
        await startLetters(page);
        await page.locator('#phasesGrid .phase-card').first().click();

        const roundInfo = page.locator('#roundInfo');
        await expect(roundInfo).toContainText('Rodada 1 de 6');
    });

    test('streak counter shows after 2 consecutive correct', async ({ page }) => {
        await startLetters(page);
        await page.locator('#phasesGrid .phase-card').first().click();

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
