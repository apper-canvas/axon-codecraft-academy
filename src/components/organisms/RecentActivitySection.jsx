import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';

function RecentActivitySection({ title, activityData }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-12"
    >
      <h2 className="text-xl font-semibold text-secondary mb-6">{title}</h2>
      <div className="bg-white rounded-xl shadow-sm p-6">
        {activityData
          .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
          .slice(0, 5) // Limit to top 5 recent activities
          .map((item, index) => (
            <div
              key={item.courseId}
              className={`flex items-center justify-between py-4 ${
                index < activityData.length - 1 && index < 4 ? 'border-b border-surface-200' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="BookOpen" className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-secondary">{item.courseTitle}</p>
                  <p className="text-sm text-surface-600">
                    {item.completedLessonsCount} of {item.totalLessonsCount} lessons completed
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-surface-500">
                  {new Date(item.lastAccessed).toLocaleDateString()}
                </span>
                <button
                  onClick={() => navigate(`/course/${item.courseId}`)}
                  className="text-primary hover:text-primary/80 transition-colors duration-150"
                >
                  <ApperIcon name="ArrowRight" className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </motion.div>
  );
}

RecentActivitySection.propTypes = {
  title: PropTypes.string.isRequired,
  activityData: PropTypes.arrayOf(PropTypes.shape({
    courseId: PropTypes.string.isRequired,
    courseTitle: PropTypes.string.isRequired,
    completedLessonsCount: PropTypes.number.isRequired,
    totalLessonsCount: PropTypes.number.isRequired,
    lastAccessed: PropTypes.string.isRequired,
  })).isRequired,
};

export default RecentActivitySection;