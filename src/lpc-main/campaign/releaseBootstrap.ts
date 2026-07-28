const RELEASE_MARKER = 'tales-blaue-adria-lpc-campaign-release';
const RELEASE_VERSION = 'sprints-1-6-v1';

if (localStorage.getItem(RELEASE_MARKER) !== RELEASE_VERSION) {
  localStorage.removeItem('tales-blaue-adria-lpc-main-v1');
  localStorage.removeItem('tales-blaue-adria-lpc-campaign-meta-v2');
  localStorage.setItem(RELEASE_MARKER, RELEASE_VERSION);
}
