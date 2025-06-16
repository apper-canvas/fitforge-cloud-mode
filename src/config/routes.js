import Today from '@/components/pages/Today';
import Workout from '@/components/pages/Workout';
import History from '@/components/pages/History';
import Progress from '@/components/pages/Progress';
import Settings from '@/components/pages/Settings';
import Setup from '@/components/pages/Setup';

export const routes = {
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Home',
    component: Today
  },
  workout: {
    id: 'workout',
    label: 'Workout',
    path: '/workout/:id?',
    icon: 'Play',
    component: Workout,
    hideFromNav: true
  },
  history: {
    id: 'history',
    label: 'History',
    path: '/history',
    icon: 'Calendar',
    component: History
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  },
  setup: {
    id: 'setup',
    label: 'Setup',
    path: '/setup',
    icon: 'Target',
    component: Setup,
    hideFromNav: true
  }
};

export const routeArray = Object.values(routes);
export default routes;