import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import ProgressCard from '../components/ProgressCard';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import progressService from '../services/api/progressService';
import courseService from '../services/api/courseService';

function ProgressDashboard() {
  const [progress, setProgress] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [progressData, coursesData] = await Promise.all([
        progressService.getAll(),
        courseService.getAll()
      ]);
      setProgress(progressData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message || 'Failed to load progress data');
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const getOverallStats = () => {
    const totalCourses = courses.length;
    const coursesStarted = progress.length;
    const coursesCompleted = progress.filter(p => {
      const course = courses.find(c => c.id === p.courseId);
      return course && p.completedLessons.length === course.lessonCount;
    }).length;

    const totalLessons = courses.reduce((sum, course) => sum + course.lessonCount, 0);
    const completedLessons = progress.reduce((sum, p) => sum + p.completedLessons.length, 0);

    return {
      totalCourses,
      coursesStarted,
      coursesCompleted,
      totalLessons,
      completedLessons,
      overallProgress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    };
  };

  if (loading) {
    return (
      <div className="min-h-full bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-surface-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-4 bg-surface-200 rounded w-96 animate-pulse"></div>
          </div>
          <SkeletonLoader count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState
            message={error}
            onRetry={loadProgressData}
          />
        </div>
      </div>
    );
  }

  if (progress.length === 0) {
    return (
      <div className="min-h-full bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            title="No progress yet"
            description="Start your first course to begin tracking your learning journey"
            actionLabel="Browse Courses"
            onAction={() => navigate('/courses')}
          />
        </div>
      </div>
    );
  }

  const stats = getOverallStats();

  return (
    <div className="min-h-full bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-secondary mb-2">My Learning Progress</h1>
          <p className="text-lg text-surface-600">
            Track your learning journey and achievements
          </p>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">Overall Progress</p>
                <p className="text-2xl font-bold text-primary">{stats.overallProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">Courses Started</p>
                <p className="text-2xl font-bold text-secondary">{stats.coursesStarted}</p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="BookOpen" className="w-6 h-6 text-info" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">Courses Completed</p>
                <p className="text-2xl font-bold text-success">{stats.coursesCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Trophy" className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-600">Lessons Completed</p>
                <p className="text-2xl font-bold text-secondary">
                  {stats.completedLessons}/{stats.totalLessons}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-secondary mb-6">Course Progress</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {progress.map((progressItem, index) => {
              const course = courses.find(c => c.id === progressItem.courseId);
              if (!course) return null;

              return (
                <motion.div
                  key={progressItem.courseId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <ProgressCard
                    course={course}
                    progress={progressItem}
                    onContinue={() => {
                      if (progressItem.lastLessonId) {
                        navigate(`/course/${course.id}/lesson/${progressItem.lastLessonId}`);
                      } else {
                        navigate(`/course/${course.id}`);
                      }
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold text-secondary mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm p-6">
            {progress
              .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
              .slice(0, 5)
              .map((progressItem, index) => {
                const course = courses.find(c => c.id === progressItem.courseId);
                if (!course) return null;

                return (
                  <div
                    key={progressItem.courseId}
                    className={`flex items-center justify-between py-4 ${
                      index < 4 ? 'border-b border-surface-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ApperIcon name="BookOpen" className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary">{course.title}</p>
                        <p className="text-sm text-surface-600">
                          {progressItem.completedLessons.length} of {course.lessonCount} lessons completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-surface-500">
                        {new Date(progressItem.lastAccessed).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="text-primary hover:text-primary/80 transition-colors duration-150"
                      >
                        <ApperIcon name="ArrowRight" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProgressDashboard;