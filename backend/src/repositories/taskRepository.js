const { Task, Theme } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const buildSolvedTasksSubquery = (userId) => `(
  SELECT task_id
  FROM user_task_results
  WHERE user_id = ${Number(userId)} AND solved = true
)`;

class TaskRepository {
  async findAllWithFilters({ difficulty, themeId, search, limit = 10, offset = 0, userId, status }) {
    const where = {};

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (themeId) {
      where.theme_id = themeId;
    }

    if (search) {
      const searchConditions = [
        { title: { [Op.iLike]: `%${search}%` } },
        { fen: { [Op.iLike]: `%${search}%` } },
        { solution: { [Op.iLike]: `%${search}%` } },
        { '$theme.name$': { [Op.iLike]: `%${search}%` } },
      ];

      if (/^\d+$/.test(search.trim())) {
        searchConditions.push({ id: parseInt(search.trim(), 10) });
      }

      where[Op.or] = searchConditions;
    }

    if (status && userId) {
      const solvedSubquery = buildSolvedTasksSubquery(userId);
      if (status === 'completed') {
        where.id = { [Op.in]: sequelize.literal(solvedSubquery) };
      } else if (status === 'not_completed') {
        where.id = { [Op.notIn]: sequelize.literal(solvedSubquery) };
      }
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
      distinct: true,
      subQuery: false,
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
