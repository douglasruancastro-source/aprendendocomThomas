// Pill animado mostrando saldo de moedas. XSS-safe.

export function CurrencyBadge(coins = 0) {
    const span = document.createElement('span');
    span.className = 'coin-badge';
    const icon = document.createElement('span');
    icon.className = 'coin-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '\uD83E\uDE99';
    const value = document.createElement('b');
    value.textContent = String(coins);
    const label = document.createElement('span');
    label.className = 'coin-label';
    label.textContent = 'moedas';
    span.appendChild(icon);
    span.appendChild(value);
    span.appendChild(label);
    return span;
}
