import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import Button from '@/components/atoms/Button';
import CodeEditor from '@/components/organisms/CodeEditor'; // This is an organism

function QuizQuestionDisplay({ question, currentQuestionIndex, handleAnswerSelect, code, setCode, output, runCode }) {
  return (
    <motion.div
      key={currentQuestionIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-8"
    >
      <h2 className="text-xl font-semibold text-secondary mb-6">
        {question.question}
      </h2>

      {question.type === 'multiple-choice' ? (
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
              className={`w-full text-left p-4 rounded-lg border-2 ${
                question.userAnswer === option
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-surface-200 hover:border-surface-300 text-surface-700'
              }`}
            >
              {option}
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-surface-600 mb-4">{question.instructions}</p>
          <CodeEditor
            code={code}
            setCode={setCode}
            output={output}
            onRun={runCode}
            language={question.language || 'python'}
          />
          <Button
            onClick={() => handleAnswerSelect(currentQuestionIndex, code)}
            disabled={!code.trim()}
            className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Code
          </Button>
        </div>
      )}
    </motion.div>
  );
}

QuizQuestionDisplay.propTypes = {
  question: PropTypes.shape({
    question: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['multiple-choice', 'coding']).isRequired,
    options: PropTypes.arrayOf(PropTypes.string), // For multiple-choice
    instructions: PropTypes.string, // For coding
    starterCode: PropTypes.string, // For coding
    language: PropTypes.string, // For coding
    userAnswer: PropTypes.any, // current selected answer
  }).isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  handleAnswerSelect: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired, // For coding questions
  setCode: PropTypes.func.isRequired, // For coding questions
  output: PropTypes.string.isRequired, // For coding questions
  runCode: PropTypes.func.isRequired, // For coding questions
};

export default QuizQuestionDisplay;