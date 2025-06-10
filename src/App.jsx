import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import Home from './pages/Home';
import CourseLibrary from './pages/CourseLibrary';
import CourseOverview from './pages/CourseOverview';
import LessonView from './pages/LessonView';
import QuizScreen from './pages/QuizScreen';
import ProgressDashboard from './pages/ProgressDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<CourseLibrary />} />
          <Route path="course/:courseId" element={<CourseOverview />} />
          <Route path="course/:courseId/lesson/:lessonId" element={<LessonView />} />
          <Route path="lesson/:lessonId/quiz" element={<QuizScreen />} />
          <Route path="progress" element={<ProgressDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </BrowserRouter>
  );
}

export default App;