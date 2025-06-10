import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import CourseCard from '../components/CourseCard';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import courseService from '../services/api/courseService';

function CourseLibrary() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const navigate = useNavigate();

  const languages = ['all', 'Python', 'JavaScript', 'Java'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.getAll();
      setCourses(result);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || course.language === selectedLanguage;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesLanguage && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="min-h-full bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-surface-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-4 bg-surface-200 rounded w-96 animate-pulse"></div>
          </div>
          <SkeletonLoader count={6} />
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
            onRetry={loadCourses}
          />
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-full bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            title="No courses available"
            description="Check back later for new programming courses"
            actionLabel="Go Home"
            onAction={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-secondary mb-2">Course Library</h1>
          <p className="text-lg text-surface-600">
            Discover programming courses designed to take you from beginner to expert
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                />
              </div>
            </div>

            {/* Language Filter */}
            <div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-white"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang === 'all' ? 'All Languages' : lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-white"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff === 'all' ? 'All Levels' : diff}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {filteredCourses.length === 0 ? (
          <EmptyState
            title="No courses match your filters"
            description="Try adjusting your search terms or filters to find more courses"
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedLanguage('all');
              setSelectedDifficulty('all');
            }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default CourseLibrary;