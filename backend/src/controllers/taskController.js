const taskService = require('../services/taskService');

class TaskController {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, difficulty, themeId, search } = req.query;
      const result = await taskService.getAllTasks(
        { difficulty, themeId, search },
        parseInt(page),
        parseInt(limit)
      );
      res.json({
        tasks: result.tasks,
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const taskData = { ...req.body, author_id: req.user.id };
      const task = await taskService.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await taskService.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async solve(req, res, next) {
    try {
      const { move } = req.body;
      const result = await taskService.solveTask(req.user.id, req.params.id, move);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();