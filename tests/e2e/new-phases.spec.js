import { test, expect } from '@playwright/test';

// Fase 10.4: testa que tipos de atividade legados (sequencia, memoria, etc.)
// continuam renderizando corretamente quando alcançamos as fases corretas.
// Atualmente: fase 9 = logical-sequence, 10 = memory-game, 11 = odd-one-out, 16 = count-match.
async function startWithCompleted(page, completed = []) {
    await page.goto('/');
    await page.evaluate((done) => {
        const KEY = 'thomas_learning_v3';
        const s = {
            version: 6,
            hasSeenTutorial: true,
            mascotType: 'dino',
            completedPhases: done,
            equipped: { theme: 'theme-default', mascot: 'mascot-default', accessory: 'acc-none', effect: 'effect-default' },
        };
        localStorage.setItem(KEY, JSON.stringify(s));
    }, completed);
    await page.reload();
    await page.click('#startBtn');
    await expect(page.locator('#islandMap')).toBeVisible();
}

async function clickPhase(page, phaseId) {
    const sel = `#menu .phase-card[data-phase-id="${phaseId}"]`;
    const card = page.locator(sel);
    // Menu agora usa Pager (PAGE_SIZE=6); navegar pra pagina certa se preciso.
    for (let i = 0; i < 6; i++) {
        if (await card.count()) break;
        const next = page.locator('#menu .pager-next:not([disabled])');
        if (!(await next.count())) break;
        await next.click();
        await page.waitForTimeout(150);
    }
    await card.click();
}

test.describe('Tipos de atividade reaproveitados', () => {
    test('fase 9 (Sequencia Logica) renderiza sequence + mystery + opcoes', async ({ page }) => {
        await startWithCompleted(page, [1,2,3,4,5,6,7,8]);
        await page.click('.island-card[data-section="letters"]');
        await clickPhase(page, 9);
        await expect(page.locator('#activity')).toBeVisible();
        await expect(page.locator('#activityTitle')).toContainText('Sequencia');
        await expect(page.locator('.sequence-item').first()).toBeVisible();
        await expect(page.locator('.sequence-item.mystery')).toBeVisible();
    });

    test('fase 10 (Memoria) renderiza grade de cartas', async ({ page }) => {
        await startWithCompleted(page, [1,2,3,4,5,6,7,8,9]);
        await page.click('.island-card[data-section="letters"]');
        await clickPhase(page, 10);
        await expect(page.locator('#activityTitle')).toContainText('Memoria');
        const cards = page.locator('.memory-card');
        await expect(cards.first()).toBeVisible();
        // Pelo menos 4 pares = 8 cartas
        const count = await cards.count();
        expect(count).toBeGreaterThanOrEqual(8);
    });

    test('fase 10 - clicar carta de memoria vira a carta', async ({ page }) => {
        await startWithCompleted(page, [1,2,3,4,5,6,7,8,9]);
        await page.click('.island-card[data-section="letters"]');
        await clickPhase(page, 10);
        const card = page.locator('.memory-card').first();
        await card.click();
        await expect(card).toHaveClass(/flipped/);
    });

    test('fase 11 (Diferente) renderiza 4 itens', async ({ page }) => {
        await startWithCompleted(page, [1,2,3,4,5,6,7,8,9,10]);
        await page.click('.island-card[data-section="letters"]');
        await clickPhase(page, 11);
        await expect(page.locator('#activityTitle')).toContainText('Diferente');
        await expect(page.locator('.odd-item')).toHaveCount(4);
    });

    test('fase 16 (Conte e Combine na ilha dos Numeros) renderiza count-items', async ({ page }) => {
        await startWithCompleted(page, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
        await page.click('.island-card[data-section="numbers"]');
        await clickPhase(page, 16);
        await expect(page.locator('#activityTitle')).toContainText('Conte');
        const countItems = page.locator('.count-item');
        const c = await countItems.count();
        expect(c).toBeGreaterThan(0);
        await expect(page.locator('.option-btn').first()).toBeVisible();
    });

    test('fase 9 fica bloqueada se fase 8 nao foi completada', async ({ page }) => {
        await startWithCompleted(page, [1,2,3,4,5,6,7]);
        await page.click('.island-card[data-section="letters"]');
        // Fase 9 esta na pagina 2 do Pager (PAGE_SIZE=6); paginar pra encontrar.
        const card9 = page.locator('#menu .phase-card[data-phase-id="9"]');
        for (let i = 0; i < 6 && !(await card9.count()); i++) {
            const next = page.locator('#menu .pager-next:not([disabled])');
            if (!(await next.count())) break;
            await next.click();
            await page.waitForTimeout(150);
        }
        await expect(card9).toHaveClass(/locked/);
    });
});
