const lessonRepository = require('../repositories/lessonRepository');
const courseRepository = require('../repositories/courseRepository');

class LessonService {
  async createLesson(lessonData, user) {
    if (!['trainer', 'admin'].includes(user.role)) {
      throw new Error('Forbidden: only trainers and admins can create lessons');
    }

    const course = await courseRepository.findById(lessonData.course_id);
    if (!course) {
      throw new Error('Course not found');
    }
    if (course.author_id !== user.id && user.role !== 'admin') {
      throw new Error('Forbidden: you can only add lessons to your own courses');
    }
    return await lessonRepository.create(lessonData);
  }

  async getLessonById(id) {
    const lesson = await lessonRepository.findById(id);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    return lesson;
  }

  async getLessonsByCourseId(courseId) {
    const course = await courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    return await lessonRepository.findByCourseId(courseId);
  }

  async updateLesson(id, updateData, user) {
    const lesson = await lessonRepository.findById(id);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    const course = await courseRepository.findById(lesson.course_id);
    if (course.author_id !== user.id && user.role !== 'admin') {
      throw new Error('Forbidden: you can only edit lessons in your own courses');
    }
    return await lessonRepository.update(id, updateData);
  }

  async deleteLesson(id, user) {
    const lesson = await lessonRepository.findById(id);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    const course = await courseRepository.findById(lesson.course_id);
    if (course.author_id !== user.id && user.role !== 'admin') {
      throw new Error('Forbidden: you can only delete lessons from your own courses');
    }
    return await lessonRepository.delete(id);
  }

  async getNavigation(courseId, currentLessonId) {
    const lessons = await lessonRepository.findByCourseId(courseId);
    const currentIndex = lessons.findIndex(l => l.id === parseInt(currentLessonId));
    if (currentIndex === -1) {
      throw new Error('Lesson not found in course');
    }
    return {
      previous: currentIndex > 0 ? lessons[currentIndex - 1] : null,
      next: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
    };
  }
}

module.exports = new LessonService();