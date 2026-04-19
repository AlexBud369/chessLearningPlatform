const lessonService = require('../services/lessonService');

class LessonController {
  async create(req, res, next) {
    try {
      const lesson = await lessonService.createLesson(req.body, req.user);
      res.status(201).json(lesson);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const lesson = await lessonService.getLessonById(req.params.id);
      res.json(lesson);
    } catch (error) {
      next(error);
    }
  }

  async getByCourseId(req, res, next) {
    try {
      const lessons = await lessonService.getLessonsByCourseId(req.params.courseId);
      res.json(lessons);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await lessonService.updateLesson(req.params.id, req.body, req.user);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await lessonService.deleteLesson(req.params.id, req.user);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getNavigation(req, res, next) {
    try {
      const { courseId, lessonId } = req.params;
      const navigation = await lessonService.getNavigation(courseId, lessonId);
      res.json(navigation);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LessonController();