import './utils/domTranslateSafety';
import { initVersionCachePurge } from './utils/versionCheck';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';

// Clean stale caches, service workers, and non-auth cookies on new deployments
initVersionCachePurge();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
