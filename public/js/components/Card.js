// Componente Card reutilizavel. Retorna <div class="card"> com children opcionais.

export function Card({ children = [], className = '', onClick } = {}) {
    const el = document.createElement('div');
    el.className = `card ${className}`.trim();
    if (Array.isArray(children)) {
        children.forEach((c) => { if (c) el.appendChild(c); });
    } else if (children instanceof Node) {
        el.appendChild(children);
    }
    if (onClick) {
        el.setAttribute('role', 'button');
        el.tabIndex = 0;
        el.onclick = onClick;
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
            }
        });
    }
    return el;
}
