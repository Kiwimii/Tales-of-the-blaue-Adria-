let cartSyncInstalled = false;
let cartSyncQueued = false;

export function installOpeningCartSync(): void {
  if (cartSyncInstalled) return;
  cartSyncInstalled = true;
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest('#campaign-shop [data-shop], #campaign-shop #shop-recommended')) return;
    queueOpeningCartSync();
    window.setTimeout(queueOpeningCartSync, 32);
  }, true);
  window.addEventListener('lpc-campaign-meta', queueOpeningCartSync);
  const observer = new MutationObserver((mutations) => {
    if (!mutations.some((mutation) => {
      const target = mutation.target;
      return target instanceof Element
        && Boolean(target.closest('#campaign-shop #shop-items, #campaign-shop .shop-item'));
    })) return;
    queueOpeningCartSync();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  queueOpeningCartSync();
}

function queueOpeningCartSync(): void {
  if (cartSyncQueued) return;
  cartSyncQueued = true;
  window.setTimeout(() => {
    cartSyncQueued = false;
    syncOpeningCartCount();
  }, 0);
}

export function syncOpeningCartCount(): number {
  const market = document.getElementById('campaign-shop');
  const countNode = market?.querySelector<HTMLElement>('.opening-v5-cart-count');
  if (!market || !countNode) return 0;
  const count = [...market.querySelectorAll<HTMLElement>('.shop-item footer b')]
    .reduce((sum, node) => sum + (Number(node.textContent) || 0), 0);
  const text = `${count} ${count === 1 ? 'Teil' : 'Teile'}`;
  if (countNode.textContent !== text) countNode.textContent = text;
  if (countNode.dataset.count !== String(count)) countNode.dataset.count = String(count);
  return count;
}

installOpeningCartSync();
