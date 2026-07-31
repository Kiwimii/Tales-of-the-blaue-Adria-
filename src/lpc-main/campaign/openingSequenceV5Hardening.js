import { OPENING_CRAWL_LINES, OPENING_SEQUENCE_VERSION } from './openingSequenceV5Model.js';

let queued = false;
let observer;

function fillOpeningCrawl() {
  const page = document.getElementById('campaign-intro');
  const kicker = document.getElementById('intro-kicker');
  const title = document.getElementById('intro-title');
  const lines = document.getElementById('intro-lines');
  const back = document.getElementById('intro-back');
  const next = document.getElementById('intro-next');
  const skip = document.getElementById('intro-skip');
  if (!page || !kicker || !title || !lines || !back || !next || !skip) return;

  if (!page.classList.contains('opening-v5-intro')) page.classList.add('opening-v5-intro');
  if (page.dataset.openingVersion !== OPENING_SEQUENCE_VERSION) page.dataset.openingVersion = OPENING_SEQUENCE_VERSION;

  const expectedKicker = 'EPISODE 0 · DIE VORBEREITUNG SCHLÄGT ZURÜCK';
  const expectedTitle = 'Tales of the Blaue Adria';
  if (kicker.textContent !== expectedKicker) kicker.textContent = expectedKicker;
  if (title.textContent !== expectedTitle) title.textContent = expectedTitle;

  const existingParagraphs = lines.querySelectorAll(':scope > p');
  const currentText = [...existingParagraphs].map((entry) => entry.textContent?.trim() ?? '');
  const contentMatches = currentText.length === OPENING_CRAWL_LINES.length
    && OPENING_CRAWL_LINES.every((line, index) => currentText[index] === line);
  if (!contentMatches) {
    lines.innerHTML = OPENING_CRAWL_LINES
      .map((line, index) => `<p style="--line:${index}">${escapeHtml(line)}</p>`)
      .join('');
  }

  if (!back.disabled) back.disabled = true;
  const nextLabel = 'Weiter zum Supermarkt';
  const skipLabel = 'Vorspann überspringen';
  if (next.textContent !== nextLabel) next.textContent = nextLabel;
  if (skip.textContent !== skipLabel) skip.textContent = skipLabel;
  next.setAttribute('aria-label', 'Weltraum-Vorspann beenden und zum Supermarkt gehen');

  const progress = document.getElementById('intro-progress');
  if (progress && !progress.hidden) progress.hidden = true;
}

function queueFill() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    observer?.disconnect();
    try { fillOpeningCrawl(); }
    finally { observer?.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] ?? character);
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  observer = new MutationObserver(queueFill);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  window.addEventListener('load', queueFill);
  queueFill();
}
