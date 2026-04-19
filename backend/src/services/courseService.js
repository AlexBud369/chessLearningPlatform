const courseRepository = require('../repositories/courseRepository');
const themeRepository = require('../repositories/themeRepository');

class CourseService {
  async createCourse(courseData, user) {
    if (!['trainer', 'admin'].includes(user.role)) {
      throw new Error('Forbidden: only trainers and admins can create courses');
    }
    const theme = await themeRepository.findById(courseData.theme_id);
    if (!theme) {
      throw new Error('Theme not found');
    }
    const newCourse = await courseRepository.create({
      ...courseData,
      author_id: user.id,
    });
    return newCourse;
  }

  async getAllCourses(filters, sortBy, sortOrder) {
    return await courseRepository.findAll(filters, { sortBy, sortOrder });
  }

  async getCourseById(id) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  async updateCourse(id, updateData, user) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }
    if (course.author_id !== user.id && user.role !== 'admin') {
      throw new Error('Forbidden: you can only edit your own courses');
    }
    if (updateData.theme_id) {
      const theme = await themeRepository.findById(updateData.theme_id);
      if (!theme) {
        throw new Error('Theme not found');
      }
    }
    return await courseRepository.update(id, updateData);
  }

  async deleteCourse(id, user) {
    const course = await courseRepository.findById(id);
    if (!course) {
      throw new Error('Course not found');
    }
    if (course.author_id !== user.id && user.role !== 'admin') {
      throw new Error('Forbidden: you can only delete your own courses');
    }
    return await courseRepository.delete(id);
  }
}

module.exports = new CourseService();