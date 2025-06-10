import quizzesData from '../mockData/quizzes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class QuizService {
  constructor() {
    this.quizzes = [...quizzesData];
  }

  async getAll() {
    await delay(300);
    return [...this.quizzes];
  }

  async getById(id) {
    await delay(250);
    const quiz = this.quizzes.find(q => q.id === id);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return { ...quiz };
  }

  async getByLessonId(lessonId) {
    await delay(300);
    const quiz = this.quizzes.find(q => q.lessonId === lessonId);
    if (!quiz) {
      throw new Error('Quiz not found for this lesson');
    }
    return { ...quiz };
  }

  async create(quizData) {
    await delay(400);
    const newQuiz = {
      ...quizData,
      id: Date.now().toString(),
    };
    this.quizzes.push(newQuiz);
    return { ...newQuiz };
  }

  async update(id, quizData) {
    await delay(350);
    const index = this.quizzes.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error('Quiz not found');
    }
    this.quizzes[index] = { ...this.quizzes[index], ...quizData };
    return { ...this.quizzes[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.quizzes.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error('Quiz not found');
    }
    this.quizzes.splice(index, 1);
    return true;
  }
}

export default new QuizService();