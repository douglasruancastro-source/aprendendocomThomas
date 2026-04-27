// Componente Button reutilizavel. Retorna <button> ja com classe e handler.
// variant: 'primary' | 'secondary' | 'back'

export function Button({ label, variant = 'primary', onClick, ariaLabel, type = 'button' }) {
    const btn = document.createElement('button');
    btn.type = type;
    btn.className = `btn-${variant}`;
    btn.textContent = label;
    if (ariaLabel) btn.setAttribute('aria-label', ariaLabel);
    if (onClick) btn.onclick = onClick;
    return btn;
}
