import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function QuizResultSummary({ score, passingScore, retryQuiz, goToLesson }) {
  const isPassed = score >= passingScore;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm p-8 text-center"
    >
      <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
        isPassed ? 'bg-success/10' : 'bg-error/10'
      }`}>
        <ApperIcon 
          name={isPassed ? "CheckCircle" : "XCircle"} 
          className={`w-8 h-8 ${isPassed ? 'text-success' : 'text-error'}`} 
        />
      </div>
      
      <h2 className="text-2xl font-bold text-secondary mb-2">
        {isPassed ? 'Quiz Passed!' : 'Quiz Failed'}
      </h2>
      
      <p className="text-lg text-surface-600 mb-6">
        Your score: <span className="font-semibold">{score}%</span>
        <br />
        Passing score: {passingScore}%
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={retryQuiz}
          className="px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5"
        >
          Retry Quiz
        </Button>
        <Button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={goToLesson}
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90"
        >
          Back to Lesson
        </Button>
      </div>
    </motion.div>
  );
}

QuizResultSummary.propTypes = {
  score: PropTypes.number.isRequired,
  passingScore: PropTypes.number.isRequired,
  retryQuiz: PropTypes.func.isRequired,
  goToLesson: PropTypes.func.isRequired,
};

export default QuizResultSummary;