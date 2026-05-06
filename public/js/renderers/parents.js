// Area dos Pais (Fase 10.3): PIN + dashboard de progresso real.
// PIN: 4 digitos. Primeira vez: setup. Depois: gate.
// Dashboard: stats agregados + progresso por ilha + reset.

import { soundClick } from '../audio.js';
import { saveState, resetState } from '../state.js';
import { ISLANDS } from '../data/islands.js';
import { BADGE_DEFS, getRank } from '../rewards.js';

export function renderParents(state, onReset) {
    const root = document.getElementById('parents');
    if (!root) return;
    root.innerHTML = '';

    // Botao voltar (preserva estilo da tela)
    const backBtn = document.createElement('button');
    backBtn.className = 'btn-back btn--secondary';
    backBtn.id = 'parentsBackBtn';
    backBtn.textContent = '← Voltar';
    root.appendChild(backBtn);

    if (!state.parentsPin) {
        renderPinSetup(root, state);
    } else {
        renderPinGate(root, state, onReset);
    }
}

// Setup: usuario escolhe PIN de 4 digitos pela primeira vez.
function renderPinSetup(root, state) {
    const card = document.createElement('div');
    card.className = 'parents-card';

    const emoji = document.createElement('div');
    emoji.className = 'parents-emoji';
    emoji.textContent = '\u{1F510}';
    card.appendChild(emoji);

    const h3 = document.createElement('h3');
    h3.textContent = 'Crie um PIN para a Area dos Pais';
    card.appendChild(h3);

    const p = document.createElement('p');
    p.textContent = 'Escolha 4 digitos. Voce vai precisar dele toda vez que entrar aqui.';
    card.appendChild(p);

    const pinInput = makePinInput('Digite 4 digitos');
    card.appendChild(pinInput.wrapper);

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn-primary btn--primary';
    confirmBtn.textContent = 'Confirmar PIN';
    confirmBtn.onclick = () => {
        const value = pinInput.getValue();
        if (value.length !== 4) {
            pinInput.flash('PIN deve ter 4 digitos');
            return;
        }
        soundClick();
        state.parentsPin = value;
        saveState(state);
        renderParents(state); // re-renderiza com gate
    };
    card.appendChild(confirmBtn);

    root.appendChild(card);
}

// Gate: usuario digita PIN para abrir o dashboard.
function renderPinGate(root, state, onReset) {
    const card = document.createElement('div');
    card.className = 'parents-card';

    const emoji = document.createElement('div');
    emoji.className = 'parents-emoji';
    emoji.textContent = '\u{1F511}';
    card.appendChild(emoji);

    const h3 = document.createElement('h3');
    h3.textContent = 'Digite o PIN dos pais';
    card.appendChild(h3);

    const pinInput = makePinInput('PIN');
    card.appendChild(pinInput.wrapper);

    const enterBtn = document.createElement('button');
    enterBtn.className = 'btn-primary btn--primary';
    enterBtn.textContent = 'Entrar';
    enterBtn.onclick = () => {
        const value = pinInput.getValue();
        if (value !== state.parentsPin) {
            pinInput.flash('PIN incorreto');
            return;
        }
        soundClick();
        renderDashboard(root, state, onReset);
    };
    card.appendChild(enterBtn);

    // "Esqueci o PIN" usa um codigo simples baseado no lastPlayDay.
    const forgot = document.createElement('button');
    forgot.className = 'btn-secondary btn--secondary';
    forgot.style.marginTop = '12px';
    forgot.textContent = 'Esqueci o PIN';
    forgot.onclick = () => {
        if (confirm('Resetar PIN? O progresso da crianca sera mantido.')) {
            state.parentsPin = null;
            saveState(state);
            renderParents(state, onReset);
        }
    };
    card.appendChild(forgot);

    root.appendChild(card);
}

// Dashboard: stats agregados.
function renderDashboard(root, state, onReset) {
    // Mantem botao voltar; remove o resto.
    const back = root.querySelector('#parentsBackBtn');
    root.innerHTML = '';
    if (back) root.appendChild(back);

    const title = document.createElement('h2');
    title.className = 'screen-title';
    title.textContent = 'Area dos Pais';
    root.appendChild(title);

    // ===== Cards de stats (grid 2x2) =====
    const grid = document.createElement('div');
    grid.className = 'parents-stats-grid';
    const totalBadges = BADGE_DEFS.length;
    const rank = getRank(state);

    [
        { label: 'Fases completas',     value: `${state.completedPhases.length} / 75`,   icon: '\u{1F3C1}' },
        { label: 'Medalhas',            value: `${(state.badges || []).length} / ${totalBadges}`, icon: '\u{1F3C5}' },
        { label: 'Moedas ganhas',       value: String(state.totalCoinsEarned || 0),       icon: '\u{1FA99}' },
        { label: 'Sequencia de dias',   value: String(state.dailyStreak || 0),             icon: '\u{1F525}' },
        { label: 'Melhor combo',        value: String(state.bestStreak || 0),              icon: '\u{26A1}' },
        { label: 'Rank atual',          value: `${rank.icon} ${rank.name}`,                icon: '\u{1F3AF}' },
    ].forEach((stat) => {
        const card = document.createElement('div');
        card.className = 'parents-stat-card';
        const ic = document.createElement('div');
        ic.className = 'parents-stat-icon';
        ic.textContent = stat.icon;
        const lbl = document.createElement('div');
        lbl.className = 'parents-stat-label';
        lbl.textContent = stat.label;
        const val = document.createElement('div');
        val.className = 'parents-stat-value';
        val.textContent = stat.value;
        card.appendChild(ic);
        card.appendChild(val);
        card.appendChild(lbl);
        grid.appendChild(card);
    });
    root.appendChild(grid);

    // ===== Progresso por ilha =====
    const islandsTitle = document.createElement('h3');
    islandsTitle.className = 'parents-section-title';
    islandsTitle.textContent = 'Progresso por ilha';
    root.appendChild(islandsTitle);

    const islandsList = document.createElement('div');
    islandsList.className = 'parents-islands-list';
    ISLANDS.forEach((island) => {
        const [from, to] = island.phaseRange;
        let count = 0;
        for (let id = from; id <= to; id++) {
            if (state.completedPhases.includes(id)) count++;
        }
        const total = to - from + 1;
        const pct = Math.round((count / total) * 100);

        const row = document.createElement('div');
        row.className = 'parents-island-row';
        row.style.setProperty('--island-color', island.color);

        const head = document.createElement('div');
        head.className = 'parents-island-head';
        const ic = document.createElement('span');
        ic.className = 'parents-island-emoji';
        ic.textContent = island.emoji;
        const nm = document.createElement('span');
        nm.className = 'parents-island-name';
        nm.textContent = island.name;
        const cnt = document.createElement('span');
        cnt.className = 'parents-island-count';
        cnt.textContent = `${count} / ${total}`;
        head.appendChild(ic);
        head.appendChild(nm);
        head.appendChild(cnt);
        row.appendChild(head);

        const bar = document.createElement('div');
        bar.className = 'parents-island-bar';
        const fill = document.createElement('div');
        fill.className = 'parents-island-bar-fill';
        fill.style.width = `${pct}%`;
        bar.appendChild(fill);
        row.appendChild(bar);

        islandsList.appendChild(row);
    });
    root.appendChild(islandsList);

    // ===== Acoes destrutivas =====
    // ===== Fase 11.3: Backup / Restore =====
    const backupSection = document.createElement('div');
    backupSection.className = 'parents-backup';

    const backupTitle = document.createElement('div');
    backupTitle.className = 'parents-section-title';
    backupTitle.textContent = '\u{1F4BE} Backup do progresso';
    backupSection.appendChild(backupTitle);

    const backupHelp = document.createElement('p');
    backupHelp.className = 'parents-backup-help';
    backupHelp.textContent = 'Salve o progresso em arquivo para restaurar em outro dispositivo.';
    backupSection.appendChild(backupHelp);

    const backupBtns = document.createElement('div');
    backupBtns.className = 'parents-backup-btns';

    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn-secondary btn--secondary';
    exportBtn.textContent = '\u{2B07}\u{FE0F} Exportar progresso';
    exportBtn.onclick = () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `educatche-progresso-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
    backupBtns.appendChild(exportBtn);

    const importBtn = document.createElement('button');
    importBtn.className = 'btn-secondary btn--secondary';
    importBtn.textContent = '\u{2B06}\u{FE0F} Importar progresso';
    importBtn.onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const txt = await file.text();
                const imported = JSON.parse(txt);
                if (!imported.completedPhases || !Array.isArray(imported.completedPhases)) {
                    alert('Arquivo invalido: nao parece um progresso do EducaTche.');
                    return;
                }
                if (!confirm('Importar este progresso vai SUBSTITUIR o progresso atual. Continuar?')) return;
                Object.keys(imported).forEach((k) => { state[k] = imported[k]; });
                saveState(state);
                alert('Progresso importado! O app vai recarregar.');
                location.reload();
            } catch {
                alert('Nao consegui ler o arquivo. Verifique se e um JSON valido.');
            }
        };
        input.click();
    };
    backupBtns.appendChild(importBtn);

    backupSection.appendChild(backupBtns);
    root.appendChild(backupSection);

    const danger = document.createElement('div');
    danger.className = 'parents-danger';

    const dangerTitle = document.createElement('div');
    dangerTitle.className = 'parents-danger-title';
    dangerTitle.textContent = '\u{26A0}\u{FE0F} Zona de cuidado';
    danger.appendChild(dangerTitle);

    const resetBtn = document.createElement('button');
    resetBtn.className = 'parents-danger-btn';
    resetBtn.textContent = 'Resetar progresso da crianca';
    resetBtn.onclick = () => {
        if (!confirm('Tem certeza? Isso APAGA todas as fases, medalhas, moedas e itens da loja. Nao da pra desfazer.')) return;
        if (!confirm('Confirma mesmo? Realmente nao da pra voltar atras.')) return;
        resetState();
        if (onReset) onReset();
    };
    danger.appendChild(resetBtn);

    const changePinBtn = document.createElement('button');
    changePinBtn.className = 'btn-secondary';
    changePinBtn.style.marginTop = '8px';
    changePinBtn.textContent = 'Mudar PIN';
    changePinBtn.onclick = () => {
        state.parentsPin = null;
        saveState(state);
        renderParents(state, onReset);
    };
    danger.appendChild(changePinBtn);

    root.appendChild(danger);
}

// Helper: cria input de PIN com 4 caixas. Retorna { wrapper, getValue, flash }.
function makePinInput(placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'parents-pin';

    const inputs = [];
    for (let i = 0; i < 4; i++) {
        const inp = document.createElement('input');
        inp.type = 'password';
        inp.inputMode = 'numeric';
        inp.maxLength = 1;
        inp.className = 'parents-pin-digit';
        inp.setAttribute('aria-label', `Digito ${i + 1}`);
        inp.oninput = (e) => {
            const v = e.target.value.replace(/[^0-9]/g, '');
            e.target.value = v;
            if (v && i < 3) inputs[i + 1].focus();
        };
        inp.onkeydown = (e) => {
            if (e.key === 'Backspace' && !inp.value && i > 0) inputs[i - 1].focus();
        };
        inputs.push(inp);
        wrapper.appendChild(inp);
    }

    const errMsg = document.createElement('div');
    errMsg.className = 'parents-pin-err';
    wrapper.appendChild(errMsg);

    return {
        wrapper,
        getValue: () => inputs.map((i) => i.value).join(''),
        flash: (msg) => {
            errMsg.textContent = msg;
            wrapper.classList.add('flash-error');
            setTimeout(() => wrapper.classList.remove('flash-error'), 800);
        },
    };
}
