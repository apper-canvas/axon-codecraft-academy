import lessonsData from '../mockData/lessons.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class LessonService {
  constructor() {
    this.lessons = [...lessonsData];
  }

  async getAll() {
    await delay(300);
    return [...this.lessons];
  }

  async getById(id) {
    await delay(250);
    const lesson = this.lessons.find(l => l.id === id);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    return { ...lesson };
  }

  async getByCourseId(courseId) {
    await delay(300);
    const courseLessons = this.lessons
      .filter(l => l.courseId === courseId)
      .sort((a, b) => a.order - b.order);
    return [...courseLessons];
  }

  async create(lessonData) {
    await delay(400);
    const newLesson = {
      ...lessonData,
      id: Date.now().toString(),
    };
    this.lessons.push(newLesson);
    return { ...newLesson };
  }

  async update(id, lessonData) {
    await delay(350);
    const index = this.lessons.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Lesson not found');
    }
    this.lessons[index] = { ...this.lessons[index], ...lessonData };
    return { ...this.lessons[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.lessons.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Lesson not found');
    }
    this.lessons.splice(index, 1);
    return true;
  }
}

export default new LessonService();