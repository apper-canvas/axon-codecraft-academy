import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import CodeEditor from '../components/CodeEditor';
import LessonSidebar from '../components/LessonSidebar';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import lessonService from '../services/api/lessonService';
import progressService from '../services/api/progressService';

function LessonView() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    loadLessonData();
  }, [courseId, lessonId]);

  const loadLessonData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [lessonData, lessonsData, progressData] = await Promise.all([
        lessonService.getById(lessonId),
        lessonService.getByCourseId(courseId),
        progressService.getByCourseId(courseId)
      ]);
      setLesson(lessonData);
      setLessons(lessonsData);
      setProgress(progressData);
      
      // Set initial code if available
      if (lessonData.codeExamples && lessonData.codeExamples.length > 0) {
        setCode(lessonData.codeExamples[0].code || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load lesson data');
      toast.error('Failed to load lesson data');
    } finally {
      setLoading(false);
    }
  };

  const markLessonComplete = async () => {
    try {
      const updatedProgress = await progressService.markLessonComplete(courseId, lessonId);
      setProgress(updatedProgress);
      toast.success('Lesson completed!');
      
      // Navigate to next lesson if available
      const currentIndex = lessons.findIndex(l => l.id === lessonId);
      if (currentIndex < lessons.length - 1) {
        const nextLesson = lessons[currentIndex + 1];
        navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
      } else {
        // Last lesson, go to course overview
        navigate(`/course/${courseId}`);
      }
    } catch (err) {
      toast.error('Failed to mark lesson as complete');
    }
  };

  const runCode = () => {
    // Simple code execution simulation
    try {
      if (code.includes('print(')) {
        // Extract content from print statements
        const printMatches = code.match(/print\((.*?)\)/g);
        if (printMatches) {
          const output = printMatches.map(match => {
            const content = match.match(/print\((.*?)\)/)[1];
            // Remove quotes if present
            return content.replace(/['"]/g, '');
          }).join('\n');
          setOutput(output);
        }
      } else if (code.includes('console.log(')) {
        // JavaScript console.log
        const logMatches = code.match(/console\.log\((.*?)\)/g);
        if (logMatches) {
          const output = logMatches.map(match => {
            const content = match.match(/console\.log\((.*?)\)/)[1];
            return content.replace(/['"]/g, '');
          }).join('\n');
          setOutput(output);
        }
      } else if (code.includes('System.out.println(')) {
        // Java System.out.println
        const printMatches = code.match(/System\.out\.println\((.*?)\)/g);
        if (printMatches) {
          const output = printMatches.map(match => {
            const content = match.match(/System\.out\.println\((.*?)\)/)[1];
            return content.replace(/['"]/g, '');
          }).join('\n');
          setOutput(output);
        }
      } else {
        setOutput('Code executed successfully!');
      }
      toast.success('Code executed successfully!');
    } catch (err) {
      setOutput('Error: ' + err.message);
      toast.error('Error executing code');
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-background">
        <div className="h-full flex">
          <div className="flex-1 p-6">
            <SkeletonLoader count={1} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-background">
        <div className="h-full flex items-center justify-center">
          <ErrorState
            message={error}
            onRetry={loadLessonData}
          />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="h-full bg-background">
        <div className="h-full flex items-center justify-center">
          <ErrorState
            message="Lesson not found"
            onRetry={() => navigate(`/course/${courseId}`)}
          />
        </div>
      </div>
    );
  }

  const isCompleted = progress?.completedLessons?.includes(lessonId);
  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="h-full bg-background overflow-hidden">
      <div className="h-full flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <LessonSidebar
          lessons={lessons}
          currentLessonId={lessonId}
          completedLessons={progress?.completedLessons || []}
          courseId={courseId}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 bg-white border-b border-surface-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg text-surface-600 hover:text-secondary hover:bg-surface-50"
                >
                  <ApperIcon name="Menu" className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-secondary">{lesson.title}</h1>
                  <p className="text-sm text-surface-600">
                    Lesson {currentIndex + 1} of {lessons.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isCompleted && (
                  <div className="flex items-center space-x-1 text-success">
                    <ApperIcon name="CheckCircle" className="w-4 h-4" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
                <button
                  onClick={() => navigate(`/course/${courseId}`)}
                  className="px-4 py-2 text-surface-600 hover:text-secondary transition-colors duration-150"
                >
                  Exit Course
                </button>
              </div>
            </div>
          </div>

          {/* Split View */}
          <div className="flex-1 flex overflow-hidden">
            {/* Lesson Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl"
              >
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                </div>

                {/* Code Examples */}
                {lesson.codeExamples && lesson.codeExamples.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-secondary mb-4">Example Code</h3>
                    {lesson.codeExamples.map((example, index) => (
                      <div key={index} className="mb-6">
                        <h4 className="font-medium text-secondary mb-2">{example.title}</h4>
                        <div className="bg-secondary rounded-lg p-4 overflow-x-auto">
                          <pre className="text-sm text-white font-mono">
                            <code>{example.code}</code>
                          </pre>
                        </div>
                        {example.explanation && (
                          <p className="mt-2 text-surface-600">{example.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-surface-200">
                  <div>
                    {previousLesson && (
                      <button
                        onClick={() => navigate(`/course/${courseId}/lesson/${previousLesson.id}`)}
                        className="flex items-center space-x-2 px-4 py-2 text-surface-600 hover:text-secondary transition-colors duration-150"
                      >
                        <ApperIcon name="ArrowLeft" className="w-4 h-4" />
                        <span>Previous</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    {!isCompleted && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={markLessonComplete}
                        className="px-6 py-3 bg-success text-white font-medium rounded-lg hover:bg-success/90 transition-colors duration-150"
                      >
                        Mark Complete
                      </motion.button>
                    )}
                    {nextLesson && (
                      <button
                        onClick={() => navigate(`/course/${courseId}/lesson/${nextLesson.id}`)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-150"
                      >
                        <span>Next</span>
                        <ApperIcon name="ArrowRight" className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Code Editor */}
            <div className="w-1/2 border-l border-surface-200 bg-white">
              <CodeEditor
                code={code}
                setCode={setCode}
                output={output}
                onRun={runCode}
                language={lesson.language || 'python'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonView;