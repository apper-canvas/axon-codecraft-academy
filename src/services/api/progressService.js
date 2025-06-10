import progressData from '../mockData/progress.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProgressService {
  constructor() {
    this.progress = [...progressData];
  }

  async getAll() {
    await delay(300);
    return [...this.progress];
  }

  async getByCourseId(courseId) {
    await delay(250);
    const courseProgress = this.progress.find(p => p.courseId === courseId);
    return courseProgress ? { ...courseProgress } : {
      courseId,
      completedLessons: [],
      quizScores: {},
      lastAccessed: new Date().toISOString(),
      lastLessonId: null
    };
  }

  async markLessonComplete(courseId, lessonId) {
    await delay(300);
    let courseProgress = this.progress.find(p => p.courseId === courseId);
    
    if (!courseProgress) {
      courseProgress = {
        courseId,
        completedLessons: [],
        quizScores: {},
        lastAccessed: new Date().toISOString(),
        lastLessonId: null
      };
      this.progress.push(courseProgress);
    }

    if (!courseProgress.completedLessons.includes(lessonId)) {
      courseProgress.completedLessons.push(lessonId);
    }
    
    courseProgress.lastAccessed = new Date().toISOString();
    courseProgress.lastLessonId = lessonId;
    
    return { ...courseProgress };
  }

  async recordQuizScore(lessonId, score) {
    await delay(300);
    // Find progress by lesson (need to look through all progress to find the right course)
    const courseProgress = this.progress.find(p => 
      p.completedLessons.includes(lessonId) || p.lastLessonId === lessonId
    );
    
    if (courseProgress) {
      courseProgress.quizScores[lessonId] = score;
      courseProgress.lastAccessed = new Date().toISOString();
      return { ...courseProgress };
    }
    
    throw new Error('Progress not found for this lesson');
  }

  async create(progressData) {
    await delay(400);
    const newProgress = {
      ...progressData,
      lastAccessed: new Date().toISOString()
    };
    this.progress.push(newProgress);
    return { ...newProgress };
  }

  async update(courseId, progressData) {
    await delay(350);
    const index = this.progress.findIndex(p => p.courseId === courseId);
    if (index === -1) {
      throw new Error('Progress not found');
    }
    this.progress[index] = { 
      ...this.progress[index], 
      ...progressData,
      lastAccessed: new Date().toISOString()
    };
    return { ...this.progress[index] };
  }

  async delete(courseId) {
    await delay(300);
    const index = this.progress.findIndex(p => p.courseId === courseId);
    if (index === -1) {
      throw new Error('Progress not found');
    }
    this.progress.splice(index, 1);
    return true;
  }
}

export default new ProgressService();