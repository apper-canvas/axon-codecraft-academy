import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import CodeEditor from '../components/CodeEditor';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import quizService from '../services/api/quizService';
import lessonService from '../services/api/lessonService';
import progressService from '../services/api/progressService';

function QuizScreen() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    loadQuizData();
  }, [lessonId]);

  const loadQuizData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [quizData, lessonData] = await Promise.all([
        quizService.getByLessonId(lessonId),
        lessonService.getById(lessonId)
      ]);
      setQuiz(quizData);
      setLesson(lessonData);
      
      // Initialize code for coding questions
      const firstCodingQuestion = quizData.questions.find(q => q.type === 'coding');
      if (firstCodingQuestion) {
        setCode(firstCodingQuestion.starterCode || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load quiz data');
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const runCode = () => {
    try {
      if (code.includes('print(')) {
        const printMatches = code.match(/print\((.*?)\)/g);
        if (printMatches) {
          const output = printMatches.map(match => {
            const content = match.match(/print\((.*?)\)/)[1];
            return content.replace(/['"]/g, '');
          }).join('\n');
          setOutput(output);
        }
      } else if (code.includes('console.log(')) {
        const logMatches = code.match(/console\.log\((.*?)\)/g);
        if (logMatches) {
          const output = logMatches.map(match => {
            const content = match.match(/console\.log\((.*?)\)/)[1];
            return content.replace(/['"]/g, '');
          }).join('\n');
          setOutput(output);
        }
      } else {
        setOutput('Code executed successfully!');
      }
      toast.success('Code executed!');
    } catch (err) {
      setOutput('Error: ' + err.message);
      toast.error('Error executing code');
    }
  };

  const submitQuiz = async () => {
    const correctAnswers = quiz.questions.reduce((count, question, index) => {
      const userAnswer = answers[index];
      if (question.type === 'multiple-choice') {
        return count + (userAnswer === question.correctAnswer ? 1 : 0);
      } else if (question.type === 'coding') {
        // Simple check for coding questions - just check if code contains expected keywords
        const hasExpectedKeywords = question.expectedKeywords?.every(keyword => 
          code.toLowerCase().includes(keyword.toLowerCase())
        );
        return count + (hasExpectedKeywords ? 1 : 0);
      }
      return count;
    }, 0);

    const calculatedScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);

    try {
      await progressService.recordQuizScore(lessonId, calculatedScore);
      
      if (calculatedScore >= quiz.passingScore) {
        toast.success(`Quiz passed! Score: ${calculatedScore}%`);
      } else {
        toast.error(`Quiz failed. Score: ${calculatedScore}%. Passing score: ${quiz.passingScore}%`);
      }
    } catch (err) {
      toast.error('Failed to save quiz score');
    }
  };

  const retryQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setCurrentQuestion(0);
    setCode('');
    setOutput('');
  };

  const goToLesson = () => {
    navigate(`/course/${lesson.courseId}/lesson/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="h-full bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonLoader count={1} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState
            message={error}
            onRetry={loadQuizData}
          />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="h-full bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState
            message="Quiz not found"
            onRetry={() => navigate(-1)}
          />
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const canSubmit = Object.keys(answers).length === quiz.questions.length;

  if (submitted) {
    return (
      <div className="h-full bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center"
          >
            <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
              score >= quiz.passingScore ? 'bg-success/10' : 'bg-error/10'
            }`}>
              <ApperIcon 
                name={score >= quiz.passingScore ? "CheckCircle" : "XCircle"} 
                className={`w-8 h-8 ${score >= quiz.passingScore ? 'text-success' : 'text-error'}`} 
              />
            </div>
            
            <h2 className="text-2xl font-bold text-secondary mb-2">
              {score >= quiz.passingScore ? 'Quiz Passed!' : 'Quiz Failed'}
            </h2>
            
            <p className="text-lg text-surface-600 mb-6">
              Your score: <span className="font-semibold">{score}%</span>
              <br />
              Passing score: {quiz.passingScore}%
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={retryQuiz}
                className="px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors duration-150"
              >
                Retry Quiz
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToLesson}
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-150"
              >
                Back to Lesson
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToLesson}
              className="flex items-center space-x-2 text-surface-600 hover:text-secondary transition-colors duration-150"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              <span>Back to Lesson</span>
            </button>
            <div className="text-sm text-surface-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-secondary mb-2">Lesson Quiz</h1>
          <div className="w-full bg-surface-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              className="bg-primary h-2 rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
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
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswerSelect(currentQuestion, option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-150 ${
                      answers[currentQuestion] === option
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-surface-200 hover:border-surface-300 text-surface-700'
                    }`}
                  >
                    {option}
                  </motion.button>
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
                <button
                  onClick={() => handleAnswerSelect(currentQuestion, code)}
                  disabled={!code.trim()}
                  className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  Submit Code
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-4 py-2 text-surface-600 hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            {isLastQuestion ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitQuiz}
                disabled={!canSubmit}
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                Submit Quiz
              </motion.button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-150"
              >
                <span>Next</span>
                <ApperIcon name="ArrowRight" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizScreen;