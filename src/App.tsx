import { AppLayout } from './components';
import { NetworkProvider, HabitProvider } from './context';
import { YearCalendar } from './components/features';

/**
 * App Component
 * 
 * Root application component with all providers and the main calendar view.
 */
function App() {
  return (
    <NetworkProvider>
      <HabitProvider>
        <AppLayout headerTitle="Habit Tracker">
          <YearCalendar />
        </AppLayout>
      </HabitProvider>
    </NetworkProvider>
  );
}

export default App;
