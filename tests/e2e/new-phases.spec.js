import { test, expect } from '@playwright/test';

// Helper: limpa storage, planta progresso (fases 1-8 concluidas), passa pelo
// name prompt + splash, clica na ilha das Letras (que agora mostra alfa + logica).
async function startAtLogic(page, completed = [1, 2, 3, 4, 5, 6, 7, 8]) {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
    await page.fill('#nameInput', 'Tche');
    await page.click('#nameConfirmBtn');
    await page.evaluate((done) => {
        const s = JSON.parse(localStorage.getItem('thomas_learning_v3') || '{}');
        s.completedPhases = done;
        localStorage.setItem('thomas_learning_v3', JSON.stringify(s));
    }, completed);
    await page.reload();
    await page.click('text=Bah, vamos comecar!');
    await page.click('.island-letters');
}

test.describe('New Logic Phases', () => {
    test('phase 9 (Sequencia Logica) renders correctly', async ({ page }) => {
        await startAtLogic(page);
        await page.locator('#phasesGridLogic .phase-card').first().click();

        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('#activityTitle')).toContainText('Sequencia Logica');

        await expect(page.locator('.sequence-item').first()).toBeVisible();
        await expect(page.locator('.sequence-item.mystery')).toBeVisible();

        const options = page.locator('.option-btn');
        await expect(options.first()).toBeVisible();
    });

    test('phase 10 (Jogo da Memoria) renders memory grid', async ({ page }) => {
        await startAtLogic(page);
        await page.locator('#phasesGridLogic .phase-card').nth(1).click();

        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('#activityTitle')).toContainText('Jogo da Memoria');

        const cards = page.locator('.memory-card');
        await expect(cards).toHaveCount(8);

        const firstCard = cards.first();
        await expect(firstCard).not.toHaveClass(/flipped/);
    });

    test('phase 10 - clicking a card flips it', async ({ page }) => {
        await startAtLogic(page);
        await page.locator('#phasesGridLogic .phase-card').nth(1).click();

        const cards = page.locator('.memory-card');
        await cards.first().click();

        await expect(cards.first()).toHaveClass(/flipped/);
    });

    test('phase 11 (Qual e o Diferente) renders 4 items', async ({ page }) => {
        await startAtLogic(page);
        await page.locator('#phasesGridLogic .phase-card').nth(2).click();

        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('#activityTitle')).toContainText('Qual e o Diferente');

        const items = page.locator('.odd-item');
        await expect(items).toHaveCount(4);
    });

    test('phase 12 (Conte e Combine) shows items and options', async ({ page }) => {
        await startAtLogic(page);
        await page.locator('#phasesGridLogic .phase-card').nth(3).click();

        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('#activityTitle')).toContainText('Conte e Combine');

        const countItems = page.locator('.count-item');
        const count = await countItems.count();
        expect(count).toBeGreaterThan(0);

        const options = page.locator('.option-btn');
        await expect(options.first()).toBeVisible();
    });

    test('logic phases are locked when phase 8 not completed', async ({ page }) => {
        await startAtLogic(page, [1, 2, 3, 4, 5, 6, 7]);

        const logicGrid = page.locator('#phasesGridLogic');
        const firstLogicCard = logicGrid.locator('.phase-card').first();
        await expect(firstLogicCard).toHaveClass(/locked/);
    });

    test('logic phases unlock when phase 8 is completed', async ({ page }) => {
        await startAtLogic(page);
        const logicGrid = page.locator('#phasesGridLogic');
        const firstLogicCard = logicGrid.locator('.phase-card').first();
        await expect(firstLogicCard).not.toHaveClass(/locked/);
    });
});
