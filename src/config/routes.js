import Home from '../pages/Home';
import CourseLibrary from '../pages/CourseLibrary';
import ProgressDashboard from '../pages/ProgressDashboard';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  courses: {
    id: 'courses',
    label: 'Course Library',
    path: '/courses',
    icon: 'BookOpen',
    component: CourseLibrary
  },
  progress: {
    id: 'progress',
    label: 'My Learning',
    path: '/progress',
    icon: 'TrendingUp',
    component: ProgressDashboard
  }
};

export const routeArray = Object.values(routes);