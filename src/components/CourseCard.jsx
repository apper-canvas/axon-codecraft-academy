import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from './ApperIcon';

function CourseCard({ course }) {
  const navigate = useNavigate();

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

  // Mock progress for demonstration
  const progress = Math.floor(Math.random() * 100);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/course/${course.id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name={getLanguageIcon(course.language)} className="w-6 h-6 text-primary" />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-secondary mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-surface-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>

        {/* Course Info */}
        <div className="flex items-center justify-between text-sm text-surface-500 mb-4">
          <div className="flex items-center space-x-1">
            <ApperIcon name="BookOpen" className="w-4 h-4" />
            <span>{course.lessonCount} lessons</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-600">Progress</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <div className="w-full bg-surface-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="bg-primary h-2 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-surface-50 border-t border-surface-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-surface-700">{course.language}</span>
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center space-x-1 text-primary text-sm font-medium"
          >
            <span>Start Learning</span>
            <ApperIcon name="ArrowRight" className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default CourseCard;