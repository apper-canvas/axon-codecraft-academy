import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@/components/atoms/Button';

function CtaSection({ title, description, buttonLabel, buttonAction }) {
  const navigate = useNavigate();

  return (
    <div className="bg-primary py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {description}
          </p>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(buttonAction)}
            className="px-8 py-4 bg-white text-primary font-semibold rounded-lg shadow-lg hover:bg-surface-50"
          >
            {buttonLabel}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

CtaSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  buttonAction: PropTypes.string.isRequired, // Path to navigate to
};

export default CtaSection;