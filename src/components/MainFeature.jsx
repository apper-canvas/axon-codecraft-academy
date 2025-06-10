import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from './ApperIcon';

function MainFeature() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lessons');

  const features = {
    lessons: {
      title: 'Interactive Lessons',
      description: 'Learn programming concepts through hands-on, interactive lessons with real-time feedback.',
      icon: 'Code',
      action: () => navigate('/courses')
    },
    quizzes: {
      title: 'Practice Quizzes',
      description: 'Test your knowledge with coding challenges and multiple-choice questions.',
      icon: 'ClipboardCheck',
      action: () => navigate('/courses')
    },
    progress: {
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking and achievements.',
      icon: 'TrendingUp',
      action: () => navigate('/progress')
    }
  };

  const tabs = Object.keys(features);

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-secondary mb-6">Key Features</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-surface-50 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
              activeTab === tab
                ? 'bg-white text-primary shadow-sm'
                : 'text-surface-600 hover:text-secondary'
            }`}
          >
            {features[tab].title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={features[activeTab].icon} className="w-8 h-8 text-primary" />
        </div>
        
        <h3 className="text-lg font-semibold text-secondary mb-2">
          {features[activeTab].title}
        </h3>
        
        <p className="text-surface-600 mb-6 max-w-md mx-auto">
          {features[activeTab].description}
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={features[activeTab].action}
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-150"
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
}

export default MainFeature;