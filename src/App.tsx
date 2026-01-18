import { AppLayout } from './components';
import { NetworkProvider } from './context';

/**
 * Demo Feature Card Component
 * Displays a feature highlight in the demo content
 */
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <article className="feature-card slide-up">
      <span className="feature-card__icon" aria-hidden="true">{icon}</span>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__description">{description}</p>
    </article>
  );
}

/**
 * App Component
 * 
 * Root application component that sets up providers and renders the main layout.
 * This component demonstrates the PWA structure with:
 * - Network status context for offline detection
 * - Responsive layout with header
 * - Demo content showcasing PWA features
 * 
 * @example
 * ```tsx
 * <App />
 * ```
 */
function App() {
  const features: FeatureCardProps[] = [
    {
      icon: '📱',
      title: 'Installable',
      description: 'Add to your home screen for a native app-like experience on any device.'
    },
    {
      icon: '🔌',
      title: 'Offline Ready',
      description: 'Works without internet connection thanks to Service Worker caching.'
    },
    {
      icon: '⚡',
      title: 'Fast & Responsive',
      description: 'Optimized performance with Stale-While-Revalidate caching strategy.'
    },
    {
      icon: '🎨',
      title: 'Mobile First',
      description: 'Designed for mobile devices first, then scaled up for larger screens.'
    },
    {
      icon: '♿',
      title: 'Accessible',
      description: 'Built with accessibility in mind following WCAG guidelines.'
    },
    {
      icon: '🛡️',
      title: 'Type Safe',
      description: 'Full TypeScript support for better developer experience and fewer bugs.'
    }
  ];

  return (
    <NetworkProvider>
      <AppLayout headerTitle="Habit Tracker">
        <div className="demo-content fade-in">
          <h2 className="demo-content__title">
            Welcome to Your PWA
          </h2>
          <p className="demo-content__description">
            This is a Progressive Web App built with React, Vite, TypeScript, and Tailwind CSS.
            It features offline support, installation capability, and a clean architecture
            following SOLID principles.
          </p>

          <section className="demo-content__features" aria-label="PWA Features">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </section>
        </div>
      </AppLayout>
    </NetworkProvider>
  );
}

export default App;
