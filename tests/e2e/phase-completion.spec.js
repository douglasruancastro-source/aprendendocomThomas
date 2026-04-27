import { test, expect } from '@playwright/test';

// Fase 10.4: completar a fase 1 (Vogais) - menu novo via Pager.
async function startLetters(page) {
    await page.goto('/');
    await page.evaluate(() => {
        const KEY = 'thomas_learning_v3';
        const s = {
            version: 5,
            hasSeenTutorial: true,
            completedPhases: [],
            equipped: { theme: 'theme-default', mascot: 'mascot-default', accessory: 'acc-none', effect: 'effect-default' },
        };
        localStorage.setItem(KEY, JSON.stringify(s));
    });
    await page.reload();
    await page.click('#startBtn');
    await expect(page.locator('#islandMap')).toBeVisible();
    await page.click('.island-letters');
    await expect(page.locator('#menu')).toBeVisible();
}

test.describe('Phase completion', () => {
    test('completar fase 1 (Vogais) leva a tela de resultado', async ({ page }) => {
        await startLetters(page);
        await page.locator('#menu .phase-card[data-phase-id="1"]').click();
        await expect(page.locator('#activity')).toBeVisible();

        // Loop ate result aparecer (max 8 rodadas pra cobrir variacoes de pool)
        for (let round = 0; round < 8; round++) {
            const resultVisible = await page.locator('#result').isVisible().catch(() => false);
            if (resultVisible) break;
            const bubbles = page.locator('.letter-bubble');
            const count = await bubbles.count();
            if (count === 0) break;
            for (let i = 0; i < count; i++) {
                const text = await bubbles.nth(i).textContent();
                if (['A', 'E', 'I', 'O', 'U'].includes(text)) {
                    await bubbles.nth(i).click();
                }
            }
            await page.click('text=Conferir!');
            await page.waitForTimeout(1400);
        }

        await expect(page.locator('#result')).toBeVisible({ timeout: 5000 });
    });

    test('barra de progresso mostra Rodada 1 de N no inicio', async ({ page }) => {
        await startLetters(page);
        await page.locator('#menu .phase-card[data-phase-id="1"]').click();
        await expect(page.locator('#roundInfo')).toContainText(/Rodada 1 de \d/);
    });

    test('powerup bar visivel durante atividade com botoes Dica e Pular', async ({ page }) => {
        await startLetters(page);
        await page.locator('#menu .phase-card[data-phase-id="1"]').click();
        await expect(page.locator('#powerupBar')).toBeVisible();
        await expect(page.locator('.powerup-btn[data-powerup="powerup-hint"]')).toBeVisible();
        await expect(page.locator('.powerup-btn[data-powerup="powerup-skip"]')).toBeVisible();
    });

    test('streak counter ativa apos 2 acertos seguidos em fase 1', async ({ page }) => {
        await startLetters(page);
        await page.locator('#menu .phase-card[data-phase-id="1"]').click();
        for (let round = 0; round < 2; round++) {
            const bubbles = page.locator('.letter-bubble');
            const count = await bubbles.count();
            if (count === 0) break;
            for (let i = 0; i < count; i++) {
                const text = await bubbles.nth(i).textContent();
                if (['A', 'E', 'I', 'O', 'U'].includes(text)) {
                    await bubbles.nth(i).click();
                }
            }
            await page.click('text=Conferir!');
            await page.waitForTimeout(1400);
        }
        await expect(page.locator('#streakDisplay')).toHaveClass(/active/);
    });
});
