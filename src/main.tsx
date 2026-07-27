import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import OptimizedApp from './OptimizedApp';
import { installGraphicsMenuEnhancement } from './graphicsMenuEnhancement';
import './styles.css';
import './mobileFocusOverrides.css';
import './graphicsOptions.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element was not found.');
}

createRoot(root).render(
  <StrictMode>
    <OptimizedApp />
  </StrictMode>,
);

installGraphicsMenuEnhancement();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, { updateViaCache: 'none' })
      .then((registration) => registration.update())
      .catch(() => undefined);
  });
}
