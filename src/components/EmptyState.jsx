import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

function EmptyState({ title, description, actionLabel, onAction, icon = "Package" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="mb-6"
      >
        <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto" />
      </motion.div>
      
      <h3 className="text-lg font-medium text-secondary mb-2">{title}</h3>
      <p className="text-surface-600 mb-6 max-w-md mx-auto">{description}</p>
      
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-150"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}

export default EmptyState;