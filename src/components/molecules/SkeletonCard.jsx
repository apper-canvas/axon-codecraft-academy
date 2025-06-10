import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

function SkeletonCard({ count = 3 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-surface-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-surface-200 rounded"></div>
              <div className="h-3 bg-surface-200 rounded w-5/6"></div>
              <div className="h-3 bg-surface-200 rounded w-4/6"></div>
            </div>
            <div className="mt-4 h-2 bg-surface-200 rounded-full"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

SkeletonCard.propTypes = {
  count: PropTypes.number,
};

export default SkeletonCard;