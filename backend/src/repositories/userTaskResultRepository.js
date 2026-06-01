const { UserTaskResult } = require('../models');
const { Op } = require('sequelize');

class UserTaskResultRepository {
  async findByUserAndTask(userId, taskId) {
    return await UserTaskResult.findOne({
      where: { user_id: userId, task_id: taskId },
    });
  }

  async createOrUpdate(userId, taskId, solved, attempts) {
    const record = await UserTaskResult.findOne({
      where: { user_id: userId, task_id: taskId },
    });
    if (record) {
      const updateData = {};
      if (solved !== undefined) updateData.solved = solved;
      if (attempts !== undefined) updateData.attempts = attempts;
      if (solved === true && !record.solved_at) updateData.solved_at = new Date();
      await record.update(updateData);
      return record;
    }

    return await UserTaskResult.create({
      user_id: userId,
      task_id: taskId,
      solved: solved || false,
      attempts: attempts || 1,
      solved_at: solved ? new Date() : null,
    });
  }

  async markSolved(userId, taskId) {
    return await this.createOrUpdate(userId, taskId, true, undefined);
  }

  async incrementAttempts(userId, taskId) {
    const record = await this.findByUserAndTask(userId, taskId);
    if (record) {
      await record.increment('attempts');
      return record;
    }
    return await this.createOrUpdate(userId, taskId, false, 1);
  }

  async getUserStats(userId) {
    const results = await UserTaskResult.findAll({
      where: { user_id: userId },
      attributes: ['solved', 'attempts', 'solved_at', 'created_at'],
    });
    return {
      totalSolved: results.filter((r) => r.solved).length,
      totalAttempts: results.reduce((sum, r) => sum + r.attempts, 0),
      results,
    };
  }

  async countSolved(userId) {
    return await UserTaskResult.count({
      where: { user_id: userId, solved: true },
    });
  }

  async getLastSolvedAt(userId) {
    return await UserTaskResult.max('solved_at', {
      where: { user_id: userId, solved: true },
    });
  }

  async getSolvedTasksDetailed(userId) {
    const { Task, Theme } = require('../models');
    return await UserTaskResult.findAll({
      where: { user_id: userId, solved: true },
      include: [
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'title', 'difficulty'],
          include: [{ model: Theme, as: 'theme', attributes: ['id', 'name'] }],
        },
      ],
      order: [['solved_at', 'DESC']],
    });
  }

  async getTaskResultsForThemeStats(userId) {
    const { Task, Theme } = require('../models');
    return await UserTaskResult.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Task,
          as: 'task',
          attributes: ['id'],
          include: [{ model: Theme, as: 'theme', attributes: ['id', 'name'] }],
        },
      ],
    });
  }

  async getTaskSolvingTimeline(userId, days = 30) {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (days - 1));

    const results = await UserTaskResult.findAll({
      where: {
        user_id: userId,
        solved: true,
        solved_at: { [Op.gte]: since },
      },
      attributes: ['solved_at'],
      order: [['solved_at', 'ASC']],
    });

    const byDate = {};
    for (const row of results) {
      if (!row.solved_at) continue;
      const date = row.solved_at.toISOString().slice(0, 10);
      byDate[date] = (byDate[date] || 0) + 1;
    }

    const timeline = [];
    const cursor = new Date(since);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (cursor <= today) {
      const key = cursor.toISOString().slice(0, 10);
      timeline.push({ date: key, count: byDate[key] || 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    return timeline;
  }
}

module.exports = new UserTaskResultRepository();
