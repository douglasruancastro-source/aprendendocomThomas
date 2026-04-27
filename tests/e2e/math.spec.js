import { test, expect } from '@playwright/test';

// Fase 10.4: math agora vive na ilha dos Numeros (fases 16-30).
// Soma = fase 18, Subtracao = fase 19.
async function startAtNumbers(page) {
    await page.goto('/');
    await page.evaluate(() => {
        const KEY = 'thomas_learning_v3';
        const s = {
            version: 5,
            hasSeenTutorial: true,
            completedPhases: Array.from({ length: 17 }, (_, i) => i + 1), // 1..17
            equipped: { theme: 'theme-default', mascot: 'mascot-default', accessory: 'acc-none', effect: 'effect-default' },
        };
        localStorage.setItem(KEY, JSON.stringify(s));
    });
    await page.reload();
    await page.click('#startBtn');
    await expect(page.locator('#islandMap')).toBeVisible();
    await page.click('.island-numbers');
    await expect(page.locator('#menu')).toBeVisible();
}

test.describe('Matematica (ilha dos Numeros)', () => {
    test('menu da ilha dos Numeros mostra cards de fase', async ({ page }) => {
        await startAtNumbers(page);
        const cards = page.locator('#menu .phase-card');
        await expect(cards.first()).toBeVisible();
    });

    test('fase 18 (Somas) mostra equacao com sinal +', async ({ page }) => {
        await startAtNumbers(page);
        await page.locator('#menu .phase-card[data-phase-id="18"]').click();
        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('#activityTitle')).toContainText('Somar');
        await expect(page.locator('.math-equation').first()).toContainText('+');
    });

    test('fase 19 (Subtracoes) mostra equacao com sinal -', async ({ page }) => {
        await startAtNumbers(page);
        await page.locator('#menu .phase-card[data-phase-id="19"]').click();
        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('#activityTitle')).toContainText('Tirar');
        await expect(page.locator('.math-equation').first()).toContainText('-');
    });

    test('opcoes de soma sao botoes clicaveis', async ({ page }) => {
        await startAtNumbers(page);
        await page.locator('#menu .phase-card[data-phase-id="18"]').click();
        const options = page.locator('.option-btn.math-option');
        await expect(options.first()).toBeVisible();
        const count = await options.count();
        expect(count).toBeGreaterThanOrEqual(3);
    });
});
