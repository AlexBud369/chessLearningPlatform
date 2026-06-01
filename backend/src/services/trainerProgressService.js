const trainerStudentRepository = require('../repositories/trainerStudentRepository');
const assignedCourseRepository = require('../repositories/assignedCourseRepository');
const userProgressRepository = require('../repositories/userProgressRepository');
const userTaskResultRepository = require('../repositories/userTaskResultRepository');
const userRepository = require('../repositories/userRepository');

class TrainerProgressService {
  async getStudentProgressStats(studentId) {
    const { assignments } = await assignedCourseRepository.getAssignmentsForStudent(studentId, {
      limit: 1000,
      offset: 0,
    });

    let coursesProgressPercent = 0;
    let completedCoursesCount = 0;

    if (assignments.length > 0) {
      let totalPercent = 0;
      for (const assignment of assignments) {
        const status = await userProgressRepository.getCourseCompletionStatus(
          studentId,
          assignment.course_id
        );
        totalPercent += status.percent;
        if (status.percent === 100) completedCoursesCount++;
      }
      coursesProgressPercent = Math.round(totalPercent / assignments.length);
    } else {
      const summary = await userProgressRepository.getUserProgressSummary(studentId);
      if (summary.length > 0) {
        coursesProgressPercent = Math.round(
          summary.reduce((sum, item) => sum + item.percent, 0) / summary.length
        );
        completedCoursesCount = summary.filter((item) => item.percent === 100).length;
      }
    }

    const solvedTasksCount = await userTaskResultRepository.countSolved(studentId);
    const lastLessonAt = await userProgressRepository.getLastLessonActivity(studentId);
    const lastTaskAt = await userTaskResultRepository.getLastSolvedAt(studentId);

    const dates = [lastLessonAt, lastTaskAt].filter(Boolean).map((d) => new Date(d));
    const lastActivityAt = dates.length
      ? new Date(Math.max(...dates.map((d) => d.getTime()))).toISOString()
      : null;

    return {
      coursesProgressPercent,
      completedCoursesCount,
      assignedCoursesCount: assignments.length,
      solvedTasksCount,
      lastActivityAt,
    };
  }

  async getStudentsProgress(trainerId) {
    const trainer = await userRepository.findById(trainerId);
    if (!trainer || trainer.role !== 'trainer') {
      throw new Error('Only trainers can view student progress');
    }

    const relations = await trainerStudentRepository.findStudentsByTrainer(trainerId);
    const studentsProgress = [];

    for (const relation of relations) {
      const stats = await this.getStudentProgressStats(relation.student_id);
      studentsProgress.push({
        student: relation.student,
        ...stats,
      });
    }

    return studentsProgress;
  }

  async getStudentProgressForTrainer(trainerId, studentId) {
    const relation = await trainerStudentRepository.findByTrainerAndStudent(trainerId, studentId);
    if (!relation) {
      throw new Error('Student is not assigned to this trainer');
    }

    const student = await userRepository.findById(studentId);
    const stats = await this.getStudentProgressStats(studentId);

    return { student, ...stats };
  }
}

module.exports = new TrainerProgressService();
