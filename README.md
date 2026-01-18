# Habit Tracker PWA

A Progressive Web App (PWA) built with modern technologies for tracking daily habits.

## 🚀 Tech Stack

- **React 18** - UI library with hooks and functional components
- **Vite 5** - Fast build tool and development server
- **TypeScript** - Static type checking for safer code
- **Tailwind CSS v4** - Utility-first CSS framework
- **Workbox** - Service Worker toolkit for offline caching

## 📁 Project Structure

```
├── public/
│   ├── icons/              # PWA icons (192x192, 512x512)
│   └── robots.txt          # SEO robots configuration
├── src/
│   ├── assets/             # Static assets (images, fonts)
│   ├── components/         # React components
│   │   ├── common/         # Reusable UI components
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   └── features/       # Feature-specific components
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Business logic services
│   ├── styles/             # Global styles and CSS
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Root component
│   └── main.tsx            # Application entry point
├── index.html              # HTML entry with PWA meta tags
├── vite.config.ts          # Vite + PWA configuration
├── postcss.config.js       # PostCSS for Tailwind
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/jasc92/jasc92.github.io.git
cd jasc92.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## ✨ PWA Features

### 📱 Installable
Add the app to your home screen on mobile or desktop for a native-like experience.

### 🔌 Offline Support
Works without internet connection using the Service Worker with Stale-While-Revalidate caching strategy:
- **Immediate response** from cache
- **Background updates** for fresh content
- **Full offline functionality**

### ⚡ Performance Optimized
- Code splitting with manual chunks
- Optimized asset loading
- Preconnect to external resources

## 🏗️ Architecture

This project follows **SOLID principles**:

- **Single Responsibility**: Each component/hook has one specific purpose
- **Open/Closed**: Components are extensible via props, closed to modification
- **Liskov Substitution**: Consistent interfaces across components
- **Interface Segregation**: Domain-specific types, not monolithic interfaces
- **Dependency Inversion**: Services injected via Context, not direct imports

## 🌐 Caching Strategy

The PWA uses **Stale-While-Revalidate** for optimal performance:

```
User Request → Check Cache
  ├── Cache Hit → Return Cached (Fast!) → Fetch Update in Background → Update Cache
  └── Cache Miss → Fetch from Network → Store in Cache → Return Response
```

## 📱 Mobile First Design

- Base styles target mobile devices
- Progressive enhancement for larger screens
- Breakpoints: `640px` (sm), `768px` (md), `1024px` (lg)

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Focus indicators
- Screen reader support
- High contrast colors

## 📄 License

MIT License - Feel free to use this template for your projects!

---

Built with ❤️ using React + Vite + TypeScript
