import coursesData from '../mockData/courses.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CourseService {
  constructor() {
    this.courses = [...coursesData];
  }

  async getAll() {
    await delay(300);
    return [...this.courses];
  }

  async getById(id) {
    await delay(250);
    const course = this.courses.find(c => c.id === id);
    if (!course) {
      throw new Error('Course not found');
    }
    return { ...course };
  }

  async create(courseData) {
    await delay(400);
    const newCourse = {
      ...courseData,
      id: Date.now().toString(),
    };
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, courseData) {
    await delay(350);
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Course not found');
    }
    this.courses[index] = { ...this.courses[index], ...courseData };
    return { ...this.courses[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Course not found');
    }
    this.courses.splice(index, 1);
    return true;
  }
}
// Create a single instance to export
const courseService = new CourseService();

// Export both default and named for flexibility
export default courseService;
export { courseService };