import { test, expect } from '@playwright/test';

// Helper que entra no menu de Matematica via ilha "Numeros" com progresso suficiente
// para destravar a fase 13.
async function startAtMath(page, name = 'Tche') {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    await page.fill('#nameInput', name);
    await page.click('#nameConfirmBtn');
    await page.click('text=Bah, vamos comecar!');
    // Simula conclusao das 12 fases iniciais injetando no localStorage.
    await page.evaluate(() => {
        const s = JSON.parse(localStorage.getItem('thomas_learning_v3') || '{}');
        s.completedPhases = [1,2,3,4,5,6,7,8,9,10,11,12];
        localStorage.setItem('thomas_learning_v3', JSON.stringify(s));
    });
    await page.reload();
    await page.click('text=Bah, vamos comecar!');
    // Clica na ilha de Numeros para chegar ao menu filtrado de Matematica.
    await page.click('.island-numbers');
}

test.describe('Matematica (fases 13-16)', () => {
    test('numeros island opens menu with 4 math cards', async ({ page }) => {
        await startAtMath(page);
        const mathGrid = page.locator('#phasesGridMath');
        await expect(mathGrid).toBeVisible();
        await expect(mathGrid.locator('.phase-card')).toHaveCount(4);
    });

    test('phase 13 Cores opens and shows color options', async ({ page }) => {
        await startAtMath(page);
        const mathGrid = page.locator('#phasesGridMath');
        await mathGrid.locator('.phase-card').first().click();
        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('#activityTitle')).toContainText('Cores');
    });

    test('phase 15 Somas shows an equation with + sign', async ({ page }) => {
        await startAtMath(page);
        // Desbloqueia ate a fase 15 adicionando 13 e 14 aos completados.
        await page.evaluate(() => {
            const s = JSON.parse(localStorage.getItem('thomas_learning_v3') || '{}');
            s.completedPhases = [...new Set([...(s.completedPhases||[]), 13, 14])];
            localStorage.setItem('thomas_learning_v3', JSON.stringify(s));
        });
        await page.reload();
        await page.click('text=Bah, vamos comecar!');
        await page.click('.island-numbers');
        const mathGrid = page.locator('#phasesGridMath');
        await mathGrid.locator('.phase-card').nth(2).click();
        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('.math-equation').first()).toContainText('+');
    });
});
