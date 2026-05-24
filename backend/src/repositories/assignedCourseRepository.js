const { AssignedCourse, Course, User } = require('../models');

class AssignedCourseRepository {
  async assignCourse(studentId, courseId, assignedBy) {
    const [assignment] = await AssignedCourse.findOrCreate({
      where: { student_id: studentId, course_id: courseId },
      defaults: {
        student_id: studentId,
        course_id: courseId,
        assigned_by: assignedBy,
      },
    });
    return assignment;
  }

  async removeAssignment(studentId, courseId) {
    const deleted = await AssignedCourse.destroy({
      where: { student_id: studentId, course_id: courseId },
    });
    return deleted > 0;
  }

  async getAssignmentsForStudent(studentId, { limit = 10, offset = 0 }) {
    const { count, rows } = await AssignedCourse.findAndCountAll({
      where: { student_id: studentId },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'description', 'cover_image'],
        },
        {
          model: User,
          as: 'assigner',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
      limit,
      offset,
      order: [['assigned_at', 'DESC']],
    });

    return { total: count, assignments: rows };
  }

  async getStudentsForCourse(courseId) {
    const assignments = await AssignedCourse.findAll({
      where: { course_id: courseId },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'first_name', 'last_name', 'email'],
        },
      ],
    });

    return assignments.map((a) => a.student).filter(Boolean);
  }

  async isAssigned(studentId, courseId) {
    const assignment = await AssignedCourse.findOne({
      where: { student_id: studentId, course_id: courseId },
    });
    return !!assignment;
  }
}

module.exports = new AssignedCourseRepository();