import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import { routes } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
<Route index element={<routes.home.component />} />
          <Route path="courses" element={<routes.courses.component />} />
          <Route path="course/:courseId" element={<routes.courseOverview.component />} />
          <Route path="course/:courseId/lesson/:lessonId" element={<routes.lessonView.component />} />
          <Route path="lesson/:lessonId/quiz" element={<routes.quizScreen.component />} />
          <Route path="progress" element={<routes.progress.component />} />
          <Route path="*" element={<routes.notFound.component />} />
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