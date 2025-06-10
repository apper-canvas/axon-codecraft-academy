import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="mb-4"
      >
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto" />
      </motion.div>
      
      <h3 className="text-lg font-medium text-secondary mb-2">Something went wrong</h3>
      <p className="text-surface-600 mb-6">{message}</p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-150"
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
}

export default ErrorState;