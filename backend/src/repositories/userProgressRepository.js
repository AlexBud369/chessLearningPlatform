const { UserProgress, Course, Lesson } = require('../models');
const { Op } = require('sequelize');

class UserProgressRepository {
  async createOrUpdate(data) {
    const { user_id, course_id, lesson_id, task_id, completed, score } = data;
    const [progress, created] = await UserProgress.findOrCreate({
      where: { user_id, course_id, lesson_id: lesson_id || null, task_id: task_id || null },
      defaults: {
        user_id,
        course_id,
        lesson_id: lesson_id || null,
        task_id: task_id || null,
        completed: completed || false,
        score: score || 0,
        completed_at: completed ? new Date() : null,
      },
    });
    if (!created) {
      const updateData = {};
      if (completed !== undefined) {
        updateData.completed = completed;
        if (completed) updateData.completed_at = new Date();
      }
      if (score !== undefined) updateData.score = score;
      await progress.update(updateData);
      await progress.reload();
    }
    return progress;
  }

  async markLessonCompleted(userId, lessonId) {
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) throw new Error('Lesson not found');
    return await this.createOrUpdate({
      user_id: userId,
      course_id: lesson.course_id,
      lesson_id: lessonId,
      completed: true,
    });
  }

  async getUserProgressForCourse(userId, courseId) {
    return await UserProgress.findAll({
      where: { user_id: userId, course_id: courseId },
      include: [
        { model: Lesson, as: 'lesson', attributes: ['id', 'title', 'order_index'] },
      ],
    });
  }

  async getCourseCompletionStatus(userId, courseId) {
    const lessonsInCourse = await Lesson.count({ where: { course_id: courseId } });
    const completedLessons = await UserProgress.count({
      where: {
        user_id: userId,
        course_id: courseId,
        completed: true,
        lesson_id: { [Op.ne]: null },
      },
    });
    return {
      totalLessons: lessonsInCourse,
      completedLessons,
      percent: lessonsInCourse > 0 ? Math.round((completedLessons / lessonsInCourse) * 100) : 0,
    };
  }

  async getUserProgressSummary(userId) {
    const progress = await UserProgress.findAll({
      where: { user_id: userId, lesson_id: { [Op.ne]: null } },
      attributes: ['course_id', 'completed'],
      include: [{ model: Course, as: 'course', attributes: ['id', 'title'] }],
      group: ['course_id', 'course.id', 'course.title', 'completed'],
    });

    const summary = {};
    for (const p of progress) {
      if (!summary[p.course_id]) {
        summary[p.course_id] = {
          course: p.course,
          completedLessons: 0,
          totalLessons: 0,
        };
      }
      if (p.completed) summary[p.course_id].completedLessons++;
    }

    for (const courseId in summary) {
      const total = await Lesson.count({ where: { course_id: courseId } });
      summary[courseId].totalLessons = total;
      summary[courseId].percent = total > 0 ? Math.round((summary[courseId].completedLessons / total) * 100) : 0;
    }
    return Object.values(summary);
  }
}

module.exports = new UserProgressRepository();