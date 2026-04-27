// Renderer do card de missoes diarias no #islandMap (Fase 9.17).
// Mostra ate 3 missoes com barra de progresso, botao "Resgatar +N" quando completa.

import { getTodayMissions, claimMission } from '../missions.js';
import { saveState } from '../state.js';
import { soundCoin, soundClick } from '../audio.js';

export function renderMissionsCard(state, onClaim) {
    // Remove card anterior pra nao duplicar.
    const old = document.getElementById('missionsCard');
    if (old) old.remove();

    const root = document.getElementById('islandMap');
    if (!root) return;

    const card = document.createElement('div');
    card.id = 'missionsCard';
    card.className = 'missions-card';

    const header = document.createElement('div');
    header.className = 'missions-header';
    const headerIcon = document.createElement('span');
    headerIcon.textContent = '\u{1F3AF}'; // 🎯
    headerIcon.className = 'missions-icon';
    const headerTitle = document.createElement('span');
    headerTitle.className = 'missions-title';
    const missions = getTodayMissions(state);
    const completed = missions.filter((m) => m.isComplete).length;
    headerTitle.textContent = `Missoes do dia (${completed}/${missions.length})`;
    header.appendChild(headerIcon);
    header.appendChild(headerTitle);
    card.appendChild(header);

    const list = document.createElement('div');
    list.className = 'missions-list';

    missions.forEach(({ mission, progress, isComplete, isClaimed }) => {
        const row = document.createElement('div');
        row.className = 'mission-row';
        if (isClaimed) row.classList.add('claimed');
        else if (isComplete) row.classList.add('complete');

        const icon = document.createElement('span');
        icon.className = 'mission-icon';
        icon.textContent = mission.icon;
        row.appendChild(icon);

        const info = document.createElement('div');
        info.className = 'mission-info';

        const label = document.createElement('div');
        label.className = 'mission-label';
        label.textContent = mission.label;
        info.appendChild(label);

        const bar = document.createElement('div');
        bar.className = 'mission-bar';
        const fill = document.createElement('div');
        fill.className = 'mission-bar-fill';
        const pct = Math.min(100, Math.round((progress / mission.target) * 100));
        fill.style.width = `${pct}%`;
        bar.appendChild(fill);
        info.appendChild(bar);

        const meta = document.createElement('div');
        meta.className = 'mission-meta';
        meta.textContent = `${progress}/${mission.target} • \u{1FA99} ${mission.reward}`;
        info.appendChild(meta);

        row.appendChild(info);

        const action = document.createElement('button');
        action.className = 'mission-action';
        if (isClaimed) {
            action.textContent = '✓'; // ✓
            action.disabled = true;
            action.classList.add('done');
        } else if (isComplete) {
            action.textContent = `+${mission.reward}`;
            action.onclick = () => {
                soundClick();
                const res = claimMission(state, mission.id);
                if (res.ok) {
                    soundCoin();
                    saveState(state);
                    if (onClaim) onClaim(res.reward);
                    renderMissionsCard(state, onClaim);
                }
            };
        } else {
            action.textContent = '⏳'; // ⏳
            action.disabled = true;
        }
        row.appendChild(action);

        list.appendChild(row);
    });

    card.appendChild(list);

    // Insere o card antes do main-nav e depois do mapa.
    const ambient = root.querySelector('.map-canvas');
    if (ambient && ambient.nextSibling) {
        root.insertBefore(card, ambient.nextSibling);
    } else {
        root.appendChild(card);
    }
}
