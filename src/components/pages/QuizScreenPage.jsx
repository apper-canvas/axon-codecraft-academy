import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import SkeletonCard from '@/components/molecules/SkeletonCard';
import ErrorState from '@/components/molecules/ErrorState';
import QuizQuestionDisplay from '@/components/organisms/QuizQuestionDisplay';
import QuizResultSummary from '@/components/organisms/QuizResultSummary';
import Button from '@/components/atoms/Button';
import quizService from '@/services/api/quizService';
import lessonService from '@/services/api/lessonService';
import progressService from '@/services/api/progressService';

function QuizScreenPage() {
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
      } else if (code.includes('System.out.println(')) {
        const printMatches = code.match(/System\.out\.println\((.*?)\)/g);
        if (printMatches) {
          const output = printMatches.map(match => {
            const content = match.match(/System\.out\.println\((.*?)\)/)[1];
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
    if (lesson?.courseId) {
        navigate(`/course/${lesson.courseId}/lesson/${lessonId}`);
    } else {
        navigate('/'); // Fallback to home if courseId is missing
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonCard count={1} />
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
  // Add userAnswer to question object for QuizQuestionDisplay prop
  const questionWithUserAnswer = { ...question, userAnswer: answers[currentQuestion] };


  if (submitted) {
    return (
      <div className="h-full bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <QuizResultSummary
            score={score}
            passingScore={quiz.passingScore}
            retryQuiz={retryQuiz}
            goToLesson={goToLesson}
          />
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
            <Button
              onClick={goToLesson}
              className="flex items-center space-x-2 text-surface-600 hover:text-secondary px-0 py-0"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              <span>Back to Lesson</span>
            </Button>
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
          <QuizQuestionDisplay
            question={questionWithUserAnswer}
            currentQuestionIndex={currentQuestion}
            handleAnswerSelect={handleAnswerSelect}
            code={code}
            setCode={setCode}
            output={output}
            runCode={runCode}
          />
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-4 py-2 text-surface-600 hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed px-0 py-0"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-4">
            {isLastQuestion ? (
              <Button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitQuiz}
                disabled={!canSubmit}
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <span>Next</span>
                <ApperIcon name="ArrowRight" className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizScreenPage;