const userProgressRepository = require('../repositories/userProgressRepository');
const lessonRepository = require('../repositories/lessonRepository');
const courseRepository = require('../repositories/courseRepository');
const userRepository = require('../repositories/userRepository');

class UserProgressService {
  async markLessonCompleted(userId, lessonId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    const lesson = await lessonRepository.findById(lessonId);
    if (!lesson) throw new Error('Lesson not found');
    const course = await courseRepository.findById(lesson.course_id);
    if (!course) throw new Error('Course not found');
    return await userProgressRepository.markLessonCompleted(userId, lessonId);
  }

  async getUserProgressForCourse(userId, courseId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    const course = await courseRepository.findById(courseId);
    if (!course) throw new Error('Course not found');
    return await userProgressRepository.getUserProgressForCourse(userId, courseId);
  }

  async getCourseCompletionStatus(userId, courseId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    const course = await courseRepository.findById(courseId);
    if (!course) throw new Error('Course not found');
    return await userProgressRepository.getCourseCompletionStatus(userId, courseId);
  }

  async getUserProgressSummary(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    return await userProgressRepository.getUserProgressSummary(userId);
  }
}

module.exports = new UserProgressService();