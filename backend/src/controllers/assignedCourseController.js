const assignedCourseService = require('../services/assignedCourseService');

class AssignedCourseController {
  async assign(req, res, next) {
    try {
      const { studentId, courseId } = req.body;
      const assignment = await assignedCourseService.assignCourse(req.user.id, studentId, courseId);
      res.status(201).json(assignment);
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const { studentId, courseId } = req.params;
      await assignedCourseService.removeAssignment(studentId, courseId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getMyCourses(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await assignedCourseService.getStudentCourses(req.user.id, parseInt(page), parseInt(limit));
      res.json({
        assignments: result.assignments,
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      next(error);
    }
  }

  async getCourseStudents(req, res, next) {
    try {
      const students = await assignedCourseService.getCourseStudents(req.params.courseId);
      res.json(students);
    } catch (error) {
      next(error);
    }
  }

  async checkAssigned(req, res, next) {
    try {
      const { studentId, courseId } = req.params;
      const isAssigned = await assignedCourseService.isAssigned(studentId, courseId);
      res.json({ assigned: isAssigned });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssignedCourseController();