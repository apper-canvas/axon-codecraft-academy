import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

function ProgressCard({ course, progress, onContinue }) {
  const completionPercentage = Math.round((progress.completedLessons.length / course.lessonCount) * 100);
  const isCompleted = progress.completedLessons.length === course.lessonCount;

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

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-surface-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name={getLanguageIcon(course.language)} className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-secondary">{course.title}</h3>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty}
            </span>
          </div>
        </div>
        
        {isCompleted && (
          <div className="flex items-center space-x-1 text-success">
            <ApperIcon name="Trophy" className="w-5 h-5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-surface-600">Progress</span>
          <span className="text-sm font-medium text-secondary">
            {progress.completedLessons.length} / {course.lessonCount} lessons
          </span>
        </div>
        
        <div className="w-full bg-surface-200 rounded-full h-2 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-2 rounded-full ${isCompleted ? 'bg-success' : 'bg-primary'}`}
          />
        </div>
        
        <div className="text-right">
          <span className={`text-sm font-medium ${isCompleted ? 'text-success' : 'text-primary'}`}>
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Quiz Scores */}
      {progress.quizScores && Object.keys(progress.quizScores).length > 0 && (
        <div className="mb-4 p-3 bg-surface-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ApperIcon name="ClipboardCheck" className="w-4 h-4 text-surface-600" />
            <span className="text-sm font-medium text-surface-700">Quiz Scores</span>
          </div>
          <div className="space-y-1">
            {Object.entries(progress.quizScores).map(([lessonId, score]) => (
              <div key={lessonId} className="flex justify-between text-sm">
                <span className="text-surface-600">Quiz {lessonId.slice(-1)}</span>
                <span className={`font-medium ${score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-error'}`}>
                  {score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Accessed */}
      <div className="text-xs text-surface-500 mb-4">
        Last accessed: {new Date(progress.lastAccessed).toLocaleDateString()}
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-150 ${
          isCompleted
            ? 'bg-success/10 text-success hover:bg-success/20'
            : 'bg-primary text-white hover:bg-primary/90'
        }`}
      >
        {isCompleted ? 'Review Course' : 'Continue Learning'}
      </motion.button>
    </motion.div>
  );
}

export default ProgressCard;