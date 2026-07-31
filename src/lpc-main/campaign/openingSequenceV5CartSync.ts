let cartSyncInstalled = false;

export function installOpeningCartSync(): void {
  if (cartSyncInstalled) return;
  cartSyncInstalled = true;
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest('#campaign-shop [data-shop], #campaign-shop #shop-recommended')) return;
    window.setTimeout(syncOpeningCartCount, 0);
    window.setTimeout(syncOpeningCartCount, 32);
  }, true);
  window.addEventListener('lpc-campaign-meta', syncOpeningCartCount);
  syncOpeningCartCount();
}

export function syncOpeningCartCount(): number {
  const market = document.getElementById('campaign-shop');
  const countNode = market?.querySelector<HTMLElement>('.opening-v5-cart-count');
  if (!market || !countNode) return 0;
  const count = [...market.querySelectorAll<HTMLElement>('.shop-item footer b')]
    .reduce((sum, node) => sum + (Number(node.textContent) || 0), 0);
  countNode.textContent = `${count} ${count === 1 ? 'Teil' : 'Teile'}`;
  countNode.dataset.count = String(count);
  return count;
}

installOpeningCartSync();
