import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { HydrationWrapper } from './components/shared/HydrationWrapper'

// Determine basename based on environment
// Development: no basename (serves from root)
// Production: use '/your-wealth/' for GitHub Pages
const getBaseName = () => {
  // Check if we're running on GitHub Pages
  const isGitHubPages = window.location.hostname === 'gannino.github.io' ||
                      window.location.hostname.includes('github.io');

  if (isGitHubPages) {
    return '/your-wealth/';
  }
  return '/';
};

// Handle redirect from 404.html for direct route navigation on GitHub Pages
const handleRedirect = () => {
  const redirect = sessionStorage.getItem('redirect');
  if (redirect) {
    sessionStorage.removeItem('redirect');
    const basename = getBaseName();
    // Remove the basename prefix if present
    let path = redirect;
    if (redirect.startsWith(basename)) {
      path = redirect.slice(basename.length - 1);
    }
    // Use replaceState to navigate to the correct route
    window.history.replaceState('', '', basename + path.slice(1));
  }
};

handleRedirect();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={getBaseName()}>
        <HydrationWrapper>
          <App />
        </HydrationWrapper>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
