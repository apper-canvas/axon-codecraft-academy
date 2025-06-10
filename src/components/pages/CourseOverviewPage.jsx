import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import LessonList from '@/components/organisms/LessonList';
import SkeletonCard from '@/components/molecules/SkeletonCard';
import ErrorState from '@/components/molecules/ErrorState';
import Button from '@/components/atoms/Button';
import courseService from '@/services/api/courseService';
import lessonService from '@/services/api/lessonService';
import progressService from '@/services/api/progressService';

function CourseOverviewPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [courseData, lessonsData, progressData] = await Promise.all([
        courseService.getById(courseId),
        lessonService.getByCourseId(courseId),
        progressService.getByCourseId(courseId)
      ]);
      setCourse(courseData);
      setLessons(lessonsData);
      setProgress(progressData);
    } catch (err) {
      setError(err.message || 'Failed to load course data');
      toast.error('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/10 text-success';
      case 'Intermediate': return 'bg-warning/10 text-warning';
      case 'Advanced': return 'bg-error/10 text-error';
      default: return 'bg-surface-100 text-surface-600';
    }
  };

  const getLanguageIcon = (language) => {
    switch (language) {
      case 'Python': return 'FileText';
      case 'JavaScript': return 'Zap';
      case 'Java': return 'Coffee';
      default: return 'Code';
    }
  };

  const startCourse = () => {
    if (lessons.length > 0) {
      navigate(`/course/${courseId}/lesson/${lessons[0].id}`);
    }
  };

  const resumeCourse = () => {
    if (progress?.lastLessonId) {
      navigate(`/course/${courseId}/lesson/${progress.lastLessonId}`);
    } else {
      startCourse();
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonCard count={1} />
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
            onRetry={loadCourseData}
          />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-full bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState
            message="Course not found"
            onRetry={() => navigate('/courses')}
          />
        </div>
      </div>
    );
  }

  const completedLessons = progress?.completedLessons?.length || 0;
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;
  const hasStarted = progress && progress.completedLessons.length > 0;

  return (
    <div className="min-h-full bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate('/courses')}
          className="flex items-center space-x-2 text-surface-600 hover:text-secondary mb-6 px-0 py-0"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          <span>Back to Courses</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              {/* Course Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name={getLanguageIcon(course.language)} className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-secondary mb-2">{course.title}</h1>
                  <p className="text-lg text-surface-600">{course.description}</p>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-surface-50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{course.lessonCount}</div>
                  <div className="text-sm text-surface-600">Lessons</div>
                </div>
                <div className="text-center p-4 bg-surface-50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{course.duration}</div>
                  <div className="text-sm text-surface-600">Duration</div>
                </div>
                <div className="text-center p-4 bg-surface-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{progressPercentage}%</div>
                  <div className="text-sm text-surface-600">Complete</div>
                </div>
              </div>

              {/* Progress Bar */}
              {hasStarted && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-secondary">Progress</span>
                    <span className="text-sm text-surface-600">{completedLessons} of {lessons.length} lessons</span>
                  </div>
                  <div className="w-full bg-surface-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-primary h-2 rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={hasStarted ? resumeCourse : startCourse}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary/90"
              >
                {hasStarted ? 'Continue Learning' : 'Start Course'}
              </Button>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">Course Outline</h3>
              <LessonList 
                lessons={lessons} 
                completedLessons={progress?.completedLessons || []}
                courseId={courseId}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CourseOverviewPage;