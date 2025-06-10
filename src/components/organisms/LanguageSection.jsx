import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function LanguageSection({ title, description, languages }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-secondary mb-4">
            {title}
          </h2>
          <p className="text-lg text-surface-600">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {languages.map((language, index) => (
            <motion.div
              key={language.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-surface-50 p-8 rounded-xl text-center hover:shadow-lg transition-shadow duration-200"
            >
              <div className={`w-16 h-16 ${language.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <ApperIcon name={language.icon} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-2">{language.name}</h3>
              <p className="text-surface-600 mb-4">
                Master {language.name} with interactive lessons and real-world projects
              </p>
              <Button
                onClick={() => navigate('/courses')}
                className="text-primary font-medium hover:text-primary/80 px-0 py-0" // Reset button default styles
              >
                View Courses →
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

LanguageSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
};

export default LanguageSection;