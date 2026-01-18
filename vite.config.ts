import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Vite Configuration
 * 
 * This configuration sets up a React + TypeScript PWA with:
 * - Hot Module Replacement (HMR)
 * - PWA support with Service Worker
 * - Stale-While-Revalidate caching strategy for static assets
 * 
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Register service worker for production
      registerType: 'autoUpdate',
      
      // Include additional assets for caching
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      
      // PWA Manifest configuration
      manifest: {
        name: 'Habit Tracker PWA',
        short_name: 'HabitTracker',
        description: 'A Progressive Web App for tracking your daily habits',
        theme_color: '#6366f1',
        background_color: '#0f172a',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      
      // Workbox configuration for Service Worker
      workbox: {
        // Files to precache
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        
        // Runtime caching strategies
        runtimeCaching: [
          {
            // Stale-While-Revalidate for static assets
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            // Stale-While-Revalidate for fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            // Stale-While-Revalidate for CSS/JS assets
            urlPattern: /\.(?:css|js)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          },
          {
            // Network-first for API calls (if any)
            urlPattern: /^https:\/\/api\..*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              }
            }
          }
        ]
      },
      
      // Development options
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  
  // Build optimization
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  
  // Server configuration
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  // Preview configuration (for production build preview)
  preview: {
    port: 4173
  }
});
