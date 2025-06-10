import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from './ApperIcon';

function LessonSidebar({ lessons, currentLessonId, completedLessons, courseId, isOpen, onClose }) {
  const navigate = useNavigate();

  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={sidebarVariants}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-surface-200 overflow-y-auto
          ${isOpen ? 'block' : 'hidden lg:block'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary">Lessons</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-surface-600 hover:text-secondary hover:bg-surface-50"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lessons List */}
        <div className="p-4 space-y-2">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isCurrent = lesson.id === currentLessonId;
            const isLocked = index > 0 && !completedLessons.includes(lessons[index - 1].id);

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-3 rounded-lg border transition-all duration-150 cursor-pointer ${
                  isCurrent
                    ? 'bg-primary/10 border-primary text-primary'
                    : isCompleted
                    ? 'bg-success/5 border-success/20 hover:bg-success/10 text-success'
                    : isLocked
                    ? 'bg-surface-50 border-surface-200 opacity-50 cursor-not-allowed text-surface-500'
                    : 'bg-white border-surface-200 hover:border-primary/30 hover:bg-primary/5 text-surface-700'
                }`}
                onClick={() => {
                  if (!isLocked) {
                    navigate(`/course/${courseId}/lesson/${lesson.id}`);
                    onClose();
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCurrent
                      ? 'bg-primary text-white'
                      : isCompleted
                      ? 'bg-success text-white'
                      : isLocked
                      ? 'bg-surface-300 text-surface-500'
                      : 'bg-surface-200 text-surface-600'
                  }`}>
                    {isCompleted ? (
                      <ApperIcon name="Check" className="w-4 h-4" />
                    ) : isLocked ? (
                      <ApperIcon name="Lock" className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {lesson.title}
                    </p>
                    <p className="text-xs opacity-75 mt-1">
                      Lesson {index + 1}
                    </p>
                  </div>

                  {isCurrent && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="p-4 border-t border-surface-200 mt-auto">
          <div className="bg-surface-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary">Progress</span>
              <span className="text-sm text-surface-600">
                {completedLessons.length} / {lessons.length}
              </span>
            </div>
            <div className="w-full bg-surface-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-primary h-2 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default LessonSidebar;