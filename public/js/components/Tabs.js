// Tabs generico: lista de { key, label, emoji? } e callback ao trocar.
// Renderiza barra de tabs com aria-current na ativa.

export function Tabs({ tabs, active, onChange }) {
    const wrapper = document.createElement('div');
    wrapper.className = 'tabs-bar';
    wrapper.setAttribute('role', 'tablist');

    const buttons = new Map();
    tabs.forEach((t) => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.type = 'button';
        btn.setAttribute('role', 'tab');
        btn.dataset.tabKey = t.key;
        if (t.emoji) {
            const e = document.createElement('span');
            e.className = 'tab-emoji';
            e.setAttribute('aria-hidden', 'true');
            e.textContent = t.emoji;
            btn.appendChild(e);
        }
        const label = document.createElement('span');
        label.className = 'tab-label';
        label.textContent = t.label;
        btn.appendChild(label);
        btn.onclick = () => {
            if (btn.getAttribute('aria-selected') === 'true') return;
            setActive(t.key);
            onChange && onChange(t.key);
        };
        buttons.set(t.key, btn);
        wrapper.appendChild(btn);
    });

    function setActive(key) {
        buttons.forEach((b, k) => {
            b.setAttribute('aria-selected', k === key ? 'true' : 'false');
        });
    }

    setActive(active || tabs[0]?.key);
    return { element: wrapper, setActive };
}
