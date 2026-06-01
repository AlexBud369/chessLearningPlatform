const assignedCourseRepository = require('../repositories/assignedCourseRepository');
const courseRepository = require('../repositories/courseRepository');
const userRepository = require('../repositories/userRepository');

class AssignedCourseService {
  async assignCourse(trainerId, studentId, courseId) {
    const student = await userRepository.findById(studentId);
    if (!student || student.role !== 'player') {
      throw new Error('Student not found or user is not a player');
    }
    const course = await courseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    const assignment = await assignedCourseRepository.assignCourse(studentId, courseId, trainerId);
    return assignment;
  }

  async removeAssignment(studentId, courseId) {
    const removed = await assignedCourseRepository.removeAssignment(studentId, courseId);
    if (!removed) {
      throw new Error('Assignment not found');
    }
    return true;
  }

  async getStudentCourses(studentId, page = 1, limit = 10) {
    return await assignedCourseRepository.getAssignmentsForStudent(studentId, { limit, offset: (page - 1) * limit });
  }

  async getCourseStudents(courseId) {
    return await assignedCourseRepository.getStudentsForCourse(courseId);
  }

  async isAssigned(studentId, courseId) {
    return await assignedCourseRepository.isAssigned(studentId, courseId);
  }

  async getTrainerAssignments(trainerId) {
    return await assignedCourseRepository.getAssignmentsByTrainer(trainerId);
  }

  async assignCoursesBulk(trainerId, studentId, courseIds) {
    const student = await userRepository.findById(studentId);
    if (!student || student.role !== 'player') {
      throw new Error('Student not found or user is not a player');
    }

    const results = [];
    for (const courseId of courseIds) {
      const course = await courseRepository.findById(courseId);
      if (!course) continue;

      const alreadyAssigned = await assignedCourseRepository.isAssigned(studentId, courseId);
      if (alreadyAssigned) continue;

      const assignment = await assignedCourseRepository.assignCourse(studentId, courseId, trainerId);
      results.push(assignment);
    }
    return results;
  }
}

module.exports = new AssignedCourseService();