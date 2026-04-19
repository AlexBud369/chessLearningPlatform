const { Lesson, Course } = require('../models');
const { Op } = require('sequelize');

class LessonRepository {
  async create(data) {
    return await Lesson.create(data);
  }

  async findById(id) {
    return await Lesson.findByPk(id);
  }

  async findByCourseId(courseId, order = [['order_index', 'ASC']]) {
    return await Lesson.findAll({
      where: { course_id: courseId },
      order,
    });
  }

  async update(id, updateData) {
    const [updatedCount, updatedRows] = await Lesson.update(updateData, {
      where: { id },
      returning: true,
    });
    return updatedRows[0] || null;
  }

  async delete(id) {
    const deletedCount = await Lesson.destroy({ where: { id } });
    return deletedCount > 0;
  }

  async getNextLesson(courseId, currentOrderIndex) {
    return await Lesson.findOne({
      where: {
        course_id: courseId,
        order_index: { [Op.gt]: currentOrderIndex },
      },
      order: [['order_index', 'ASC']],
    });
  }

  async getPreviousLesson(courseId, currentOrderIndex) {
    return await Lesson.findOne({
      where: {
        course_id: courseId,
        order_index: { [Op.lt]: currentOrderIndex },
      },
      order: [['order_index', 'DESC']],
    });
  }

  async isAuthorOfLesson(lessonId, userId) {
    const lesson = await Lesson.findByPk(lessonId, {
      include: [{ model: Course, as: 'course', attributes: ['author_id'] }],
    });
    return lesson && lesson.course && lesson.course.author_id === userId;
  }
}

module.exports = new LessonRepository();