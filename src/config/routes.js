import HomePage from '@/components/pages/HomePage';
import CourseLibraryPage from '@/components/pages/CourseLibraryPage';
import CourseOverviewPage from '@/components/pages/CourseOverviewPage';
import LessonViewPage from '@/components/pages/LessonViewPage';
import QuizScreenPage from '@/components/pages/QuizScreenPage';
import ProgressDashboardPage from '@/components/pages/ProgressDashboardPage';
import CodePlaygroundPage from '@/components/pages/CodePlaygroundPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
component: HomePage
  },
  courses: {
    id: 'courses',
    label: 'Course Library',
    path: '/courses',
    icon: 'BookOpen',
component: CourseLibraryPage
  },
  progress: {
    id: 'progress',
    label: 'My Learning',
    path: '/progress',
    icon: 'TrendingUp',
component: ProgressDashboardPage
  },
  playground: {
    id: 'playground',
    label: 'Code Playground',
    path: '/playground',
    icon: 'Code2',
    component: CodePlaygroundPage
  },
  courseOverview: {
    id: 'courseOverview',
    path: '/course/:courseId',
    component: CourseOverviewPage,
  },
  lessonView: {
    id: 'lessonView',
    path: '/course/:courseId/lesson/:lessonId',
    component: LessonViewPage,
  },
  quizScreen: {
    id: 'quizScreen',
    path: '/lesson/:lessonId/quiz',
    component: QuizScreenPage,
  },
  notFound: {
    id: 'notFound',
    path: '*',
    component: NotFoundPage,
  },
};

export const routeArray = Object.values(routes);