const taskRepository = require('../repositories/taskRepository');
const userTaskResultRepository = require('../repositories/userTaskResultRepository');
const { Chess } = require('chess.js');

class TaskService {
  async getAllTasks(filters, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return await taskRepository.findAllWithFilters({
      ...filters,
      limit,
      offset,
    });
  }

  async getTaskById(id) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  async createTask(taskData) {
    return await taskRepository.create(taskData);
  }

  async updateTask(id, taskData) {
    const task = await taskRepository.update(id, taskData);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  async deleteTask(id) {
    const deleted = await taskRepository.delete(id);
    if (!deleted) {
      throw new Error('Task not found');
    }
    return true;
  }

  async solveTask(userId, taskId, userMoveSan) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const chess = new Chess(task.fen);
    const expectedMove = task.solution; 
    let isCorrect = false;

    if (expectedMove.includes(' ')) {
      const firstMove = expectedMove.split(' ')[0];
      isCorrect = (userMoveSan === firstMove);
    } else {
      isCorrect = (userMoveSan === expectedMove);
    }

    await userTaskResultRepository.incrementAttempts(userId, taskId);
    if (isCorrect) {
      await userTaskResultRepository.markSolved(userId, taskId);
    }

    return {
      correct: isCorrect,
      solution: isCorrect ? null : task.solution,
    };
  }

  async getUserTaskResult(userId, taskId) {
    return await userTaskResultRepository.findByUserAndTask(userId, taskId);
  }
}

module.exports = new TaskService();