import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import global styles
import './styles/globals.css';

/**
 * Application Entry Point
 * 
 * This is the main entry point for the React application.
 * It sets up:
 * - React StrictMode for development warnings
 * - Service Worker registration for PWA functionality
 * - Root component mounting
 */

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a div with id="root" in index.html');
}

// Create React root and render app
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

/**
 * Service Worker Registration
 * 
 * The Service Worker is automatically registered by vite-plugin-pwa.
 * This provides:
 * - Offline caching with Stale-While-Revalidate strategy
 * - PWA installation support
 * - Background sync capabilities
 * 
 * For manual control, you can use the workbox-window library:
 * 
 * @example
 * ```ts
 * import { Workbox } from 'workbox-window';
 * 
 * if ('serviceWorker' in navigator) {
 *   const wb = new Workbox('/sw.js');
 *   wb.register();
 * }
 * ```
 */
