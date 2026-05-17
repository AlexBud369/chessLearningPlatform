const userProgressService = require('../services/userProgressService');

class UserProgressController {
  async markLessonCompleted(req, res, next) {
    try {
      const userId = req.user.id;
      const { lessonId } = req.body;
      if (!lessonId) {
        return res.status(400).json({ message: 'lessonId is required' });
      }
      const progress = await userProgressService.markLessonCompleted(userId, lessonId);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  async getUserProgressForCourse(req, res, next) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;
      const progress = await userProgressService.getUserProgressForCourse(userId, courseId);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  async getCourseCompletionStatus(req, res, next) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;
      const status = await userProgressService.getCourseCompletionStatus(userId, courseId);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }

  async getUserProgressSummary(req, res, next) {
    try {
      const userId = req.user.id;
      const summary = await userProgressService.getUserProgressSummary(userId);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }

  async getProgressByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const summary = await userProgressService.getUserProgressSummary(userId);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserProgressController();