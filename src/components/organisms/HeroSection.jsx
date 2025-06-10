import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@/components/atoms/Button';

function HeroSection({ title, highlightedTitle, description, primaryButtonLabel, primaryButtonAction, secondaryButtonLabel, secondaryButtonAction }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-secondary mb-6">
            {title}
            <br />
            <span className="text-primary">{highlightedTitle}</span>
          </h1>
          <p className="text-xl text-surface-600 mb-8 max-w-3xl mx-auto">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(primaryButtonAction)}
              className="px-8 py-4 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary/90"
            >
              {primaryButtonLabel}
            </Button>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(secondaryButtonAction)}
              className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5"
            >
              {secondaryButtonLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

HeroSection.propTypes = {
  title: PropTypes.string.isRequired,
  highlightedTitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  primaryButtonLabel: PropTypes.string.isRequired,
  primaryButtonAction: PropTypes.string.isRequired,
  secondaryButtonLabel: PropTypes.string.isRequired,
  secondaryButtonAction: PropTypes.string.isRequired,
};

export default HeroSection;