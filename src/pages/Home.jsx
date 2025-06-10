import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'Code',
      title: 'Interactive Lessons',
      description: 'Learn by doing with hands-on coding exercises and real-time feedback.'
    },
    {
      icon: 'Zap',
      title: 'Instant Feedback',
      description: 'See your code run immediately with syntax highlighting and error detection.'
    },
    {
      icon: 'Target',
      title: 'Structured Learning',
      description: 'Follow carefully crafted courses that build your skills step by step.'
    },
    {
      icon: 'Trophy',
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking and achievements.'
    }
  ];

  const languages = [
    { name: 'Python', icon: 'FileText', color: 'bg-blue-100 text-blue-600' },
    { name: 'JavaScript', icon: 'Zap', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Java', icon: 'Coffee', color: 'bg-red-100 text-red-600' }
  ];

  return (
    <div className="min-h-full bg-background">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-secondary mb-6">
              Master Programming
              <br />
              <span className="text-primary">One Lesson at a Time</span>
            </h1>
            <p className="text-xl text-surface-600 mb-8 max-w-3xl mx-auto">
              Learn to code with interactive lessons, hands-on projects, and instant feedback. 
              Build real skills with our comprehensive programming courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/courses')}
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-colors duration-150"
              >
                Start Learning Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/progress')}
                className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors duration-150"
              >
                View My Progress
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Learn Popular Programming Languages
            </h2>
            <p className="text-lg text-surface-600">
              Choose from our comprehensive courses designed for all skill levels
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
                <button
                  onClick={() => navigate('/courses')}
                  className="text-primary font-medium hover:text-primary/80 transition-colors duration-150"
                >
                  View Courses →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Why Choose CodeCraft Academy?
            </h2>
            <p className="text-lg text-surface-600">
              Our platform is designed to make learning programming effective and enjoyable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={feature.icon} className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">{feature.title}</h3>
                <p className="text-surface-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Coding Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of learners who have successfully mastered programming with CodeCraft Academy
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/courses')}
              className="px-8 py-4 bg-white text-primary font-semibold rounded-lg shadow-lg hover:bg-surface-50 transition-colors duration-150"
            >
              Browse Courses
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Home;