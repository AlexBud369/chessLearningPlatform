const { Task, Theme, UserTaskResult } = require('../models');
const { Op } = require('sequelize');

class TaskRepository {
  async findAllWithFilters({ difficulty, themeId, search, limit = 10, offset = 0 }) {
    const where = {};

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (themeId) {
      where.theme_id = themeId;
    }

    if (search) {
      where[Op.or] = [
        { fen: { [Op.iLike]: `%${search}%` } },
        { solution: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Task.findAndCountAll({
      where,
      include: [
        {
          model: Theme,
          as: 'theme',
          attributes: ['id', 'name'],
        },
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return { total: count, tasks: rows };
  }

  async findById(id) {
    return await Task.findByPk(id, {
      include: [
        {
          model: Theme,
          as: 'theme',
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  async create(taskData) {
    return await Task.create(taskData);
  }

  async update(id, taskData) {
    const task = await Task.findByPk(id);
    if (!task) return null;
    await task.update(taskData);
    return task;
  }

  async delete(id) {
    const task = await Task.findByPk(id);
    if (!task) return false;
    await task.destroy();
    return true;
  }
}

module.exports = new TaskRepository();