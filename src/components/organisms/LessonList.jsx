import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';

function LessonList({ lessons, completedLessons, courseId }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      {lessons.map((lesson, index) => {
        const isCompleted = completedLessons.includes(lesson.id);
        const isLocked = index > 0 && !completedLessons.includes(lessons[index - 1].id);

        return (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-3 rounded-lg border transition-colors duration-150 cursor-pointer ${
              isCompleted
                ? 'bg-success/5 border-success/20 hover:bg-success/10'
                : isLocked
                ? 'bg-surface-50 border-surface-200 opacity-50 cursor-not-allowed'
                : 'bg-white border-surface-200 hover:border-primary/30 hover:bg-primary/5'
            }`}
            onClick={() => {
              if (!isLocked) {
                navigate(`/course/${courseId}/lesson/${lesson.id}`);
              }
            }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isCompleted
                  ? 'bg-success text-white'
                  : isLocked
                  ? 'bg-surface-300 text-surface-500'
                  : 'bg-primary/10 text-primary'
              }`}>
                {isCompleted ? (
                  <ApperIcon name="Check" className="w-3 h-3" />
                ) : isLocked ? (
                  <ApperIcon name="Lock" className="w-3 h-3" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  isCompleted ? 'text-success' : isLocked ? 'text-surface-500' : 'text-secondary'
                }`}>
                  {lesson.title}
                </p>
              </div>

              {!isLocked && (
                <ApperIcon 
                  name="ChevronRight" 
                  className={`w-4 h-4 ${isCompleted ? 'text-success' : 'text-surface-400'}`} 
                />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

LessonList.propTypes = {
  lessons: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  completedLessons: PropTypes.arrayOf(PropTypes.string).isRequired,
  courseId: PropTypes.string.isRequired,
};

export default LessonList;