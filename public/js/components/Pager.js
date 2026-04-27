// Pager generico: recebe lista de items + renderItem + pageSize.
// Renderiza pagina atual + controle ‹ 1/N ›. Mantem foco no container ao paginar.

export function Pager({ items, pageSize, renderItem, container, emptyText = 'Sem items' }) {
    let page = 0;
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

    const wrapper = document.createElement('div');
    wrapper.className = 'pager-wrapper';

    const grid = document.createElement('div');
    grid.className = 'pager-grid';
    wrapper.appendChild(grid);

    const controls = document.createElement('div');
    controls.className = 'pager-controls';
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pager-btn pager-prev';
    prevBtn.setAttribute('aria-label', 'Pagina anterior');
    prevBtn.textContent = '‹';
    const indicator = document.createElement('span');
    indicator.className = 'pager-indicator';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pager-btn pager-next';
    nextBtn.setAttribute('aria-label', 'Proxima pagina');
    nextBtn.textContent = '›';
    controls.appendChild(prevBtn);
    controls.appendChild(indicator);
    controls.appendChild(nextBtn);
    wrapper.appendChild(controls);

    function paint() {
        grid.innerHTML = '';
        if (items.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'pager-empty';
            empty.textContent = emptyText;
            grid.appendChild(empty);
        } else {
            const start = page * pageSize;
            const slice = items.slice(start, start + pageSize);
            slice.forEach((item, idx) => {
                const el = renderItem(item, start + idx);
                if (el) grid.appendChild(el);
            });
        }
        indicator.textContent = `${page + 1} / ${totalPages}`;
        prevBtn.disabled = page === 0;
        nextBtn.disabled = page >= totalPages - 1;
        controls.style.display = totalPages > 1 ? 'flex' : 'none';
    }

    prevBtn.onclick = () => { if (page > 0) { page--; paint(); } };
    nextBtn.onclick = () => { if (page < totalPages - 1) { page++; paint(); } };

    paint();

    if (container) container.appendChild(wrapper);
    return { wrapper, refresh: paint, goTo: (p) => { page = Math.min(Math.max(0, p), totalPages - 1); paint(); } };
}
