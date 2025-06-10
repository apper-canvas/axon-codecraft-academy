import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

function CourseFilters({ searchTerm, setSearchTerm, selectedLanguage, setSelectedLanguage, selectedDifficulty, setSelectedDifficulty, languages, difficulties }) {
  const languageOptions = languages.map(lang => ({ value: lang, label: lang === 'all' ? 'All Languages' : lang }));
  const difficultyOptions = difficulties.map(diff => ({ value: diff, label: diff === 'all' ? 'All Levels' : diff }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white p-6 rounded-xl shadow-sm mb-8"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={ApperIcon.bind(null, { name: "Search" })} // Pass ApperIcon as a component
          />
        </div>

        {/* Language Filter */}
        <div>
          <Select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            options={languageOptions}
          />
        </div>

        {/* Difficulty Filter */}
        <div>
          <Select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            options={difficultyOptions}
          />
        </div>
      </div>
    </motion.div>
  );
}

CourseFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
  setSelectedLanguage: PropTypes.func.isRequired,
  selectedDifficulty: PropTypes.string.isRequired,
  setSelectedDifficulty: PropTypes.func.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  difficulties: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CourseFilters;