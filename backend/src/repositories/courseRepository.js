const { Course, Lesson, Theme, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const buildCompletedCoursesSubquery = (userId) => `(
  SELECT l.course_id
  FROM lessons l
  GROUP BY l.course_id
  HAVING COUNT(l.id) > 0
    AND COUNT(l.id) = (
      SELECT COUNT(*)
      FROM user_progress up
      WHERE up.course_id = l.course_id
        AND up.user_id = ${Number(userId)}
        AND up.completed = true
        AND up.lesson_id IS NOT NULL
    )
)`;

class CourseRepository {
  async create(data) {
    return await Course.create(data);
  }

  async findAll(filters = {}, options = {}) {
    const where = {};
    if (filters.theme_id) where.theme_id = filters.theme_id;
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
        { '$theme.name$': { [Op.iLike]: `%${filters.search}%` } },
      ];
    }
    const order = [];
    if (options.sortBy === 'title') order.push(['title', options.sortOrder || 'ASC']);
    else if (options.sortBy === 'created_at') order.push(['created_at', options.sortOrder || 'DESC']);
    else if (options.sortBy === 'difficulty') order.push(['difficulty', options.sortOrder || 'ASC']);
    else order.push(['created_at', 'DESC']);

    return await Course.findAll({
      where,
      order,
      include: [
        { model: Theme, as: 'theme', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'first_name', 'last_name'] },
      ],
      subQuery: false,
    });
  }

  async findById(id) {
    return await Course.findByPk(id, {
      include: [
        { model: Theme, as: 'theme' },
        { model: User, as: 'author', attributes: ['id', 'first_name', 'last_name'] },
        { model: Lesson, as: 'lessons', order: [['order_index', 'ASC']] },
      ],
    });
  }

  async findWithLessons(id) {
    return await this.findById(id);
  }

  async update(id, updateData) {
    const [updatedCount, updatedRows] = await Course.update(updateData, {
      where: { id },
      returning: true,
    });
    return updatedRows[0] || null;
  }

  async delete(id) {
    const deletedCount = await Course.destroy({ where: { id } });
    return deletedCount > 0;
  }

  async isAuthorOfCourse(courseId, userId) {
    const course = await Course.findByPk(courseId, { attributes: ['author_id'] });
    return course && course.author_id === userId;
  }

  async findWithPaginationAndFilters({ filters = {}, sortBy, sortOrder, limit, offset, userId, status }) {
    const where = {};
    if (filters.theme_id) where.theme_id = filters.theme_id;
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
        { '$theme.name$': { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    if (status && userId) {
      const completedSubquery = buildCompletedCoursesSubquery(userId);
      if (status === 'completed') {
        where.id = { [Op.in]: sequelize.literal(completedSubquery) };
      } else if (status === 'not_completed') {
        where.id = { [Op.notIn]: sequelize.literal(completedSubquery) };
      }
    }

    const order = [];
    if (sortBy === 'title') order.push(['title', sortOrder || 'ASC']);
    else if (sortBy === 'created_at') order.push(['created_at', sortOrder || 'DESC']);
    else if (sortBy === 'difficulty') order.push(['difficulty', sortOrder || 'ASC']);
    else order.push(['created_at', 'DESC']);

    return await Course.findAndCountAll({
      where,
      order,
      limit,
      offset,
      include: [
        { model: Theme, as: 'theme', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'first_name', 'last_name'] },
      ],
      distinct: true,
      subQuery: false,
    });
  }
}

module.exports = new CourseRepository();