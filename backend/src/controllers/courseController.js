const courseService = require('../services/courseService');

class CourseController {
  async create(req, res, next) {
    try {
      const course = await courseService.createCourse(req.body, req.user);
      res.status(201).json(course);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { theme_id, search, sortBy, sortOrder } = req.query;
      const filters = { theme_id, search };
      const courses = await courseService.getAllCourses(filters, sortBy, sortOrder);
      res.json(courses);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const course = await courseService.getCourseById(req.params.id);
      res.json(course);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await courseService.updateCourse(req.params.id, req.body, req.user);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await courseService.deleteCourse(req.params.id, req.user);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();