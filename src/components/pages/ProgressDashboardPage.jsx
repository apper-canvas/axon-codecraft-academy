import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProgressCard from '@/components/molecules/ProgressCard';
import SkeletonCard from '@/components/molecules/SkeletonCard';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import OverallProgressSummary from '@/components/organisms/OverallProgressSummary';
import RecentActivitySection from '@/components/organisms/RecentActivitySection';
import progressService from '@/services/api/progressService';
import courseService from '@/services/api/courseService';

function ProgressDashboardPage() {
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
          <SkeletonCard count={3} />
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

  const recentActivity = progress.map(p => {
    const course = courses.find(c => c.id === p.courseId);
    if (!course) return null;
    return {
      courseId: p.courseId,
      courseTitle: course.title,
      completedLessonsCount: p.completedLessons.length,
      totalLessonsCount: course.lessonCount,
      lastAccessed: p.lastAccessed,
    };
  }).filter(Boolean);

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
        <OverallProgressSummary stats={stats} />

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
        <RecentActivitySection
          title="Recent Activity"
          activityData={recentActivity}
        />
      </div>
    </div>
  );
}

export default ProgressDashboardPage;