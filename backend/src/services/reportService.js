const userRepository = require('../repositories/userRepository');
const userProgressRepository = require('../repositories/userProgressRepository');
const userTaskResultRepository = require('../repositories/userTaskResultRepository');
const refreshTokenRepository = require('../repositories/refreshTokenRepository');
const trainerProgressService = require('./trainerProgressService');

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('ru-RU');
};

const buildThemeStats = (taskResults) => {
  const byTheme = {};

  for (const row of taskResults) {
    const theme = row.task?.theme;
    if (!theme) continue;
    const key = theme.id;
    if (!byTheme[key]) {
      byTheme[key] = { themeId: theme.id, themeName: theme.name, attempted: 0, solved: 0 };
    }
    byTheme[key].attempted += 1;
    if (row.solved) byTheme[key].solved += 1;
  }

  return Object.values(byTheme)
    .map((item) => ({
      ...item,
      percent: item.attempted > 0 ? Math.round((item.solved / item.attempted) * 100) : 0,
    }))
    .sort((a, b) => a.themeName.localeCompare(b.themeName, 'ru'));
};

const buildRecommendations = (themeStats, coursesSummary) => {
  const recommendations = [];

  const weakThemes = themeStats
    .filter((t) => t.attempted > 0 && t.percent < 70)
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 2);

  for (const theme of weakThemes) {
    recommendations.push(
      `Уделите внимание теме «${theme.themeName}»: решено ${theme.solved} из ${theme.attempted} задач (${theme.percent}%).`
    );
  }

  const incompleteCourses = coursesSummary.filter((c) => c.percent > 0 && c.percent < 100);
  if (incompleteCourses.length > 0) {
    const course = incompleteCourses[0];
    recommendations.push(
      `Продолжите курс «${course.courseTitle}»: пройдено ${course.completedLessons} из ${course.totalLessons} уроков (${course.percent}%).`
    );
  }

  if (recommendations.length === 0) {
    if (themeStats.length === 0) {
      recommendations.push('Начните с решения задач из каталога и прохождения первого урока курса.');
    } else {
      recommendations.push('Отличная динамика! Продолжайте регулярно решать задачи и проходить уроки.');
    }
  }

  return recommendations;
};

class ReportService {
  async buildStudentReportData(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const [coursesSummaryRaw, completedLessonsRaw, solvedTasksRaw, taskResults, timeline30] =
      await Promise.all([
        userProgressRepository.getUserProgressSummary(userId),
        userProgressRepository.getCompletedLessonsDetailed(userId),
        userTaskResultRepository.getSolvedTasksDetailed(userId),
        userTaskResultRepository.getTaskResultsForThemeStats(userId),
        userTaskResultRepository.getTaskSolvingTimeline(userId, 30),
      ]);

    const coursesSummary = coursesSummaryRaw.map((item) => ({
      courseId: item.course.id,
      courseTitle: item.course.title,
      completedLessons: item.completedLessons,
      totalLessons: item.totalLessons,
      percent: item.percent,
    }));

    const completedLessons = completedLessonsRaw.map((row) => ({
      courseTitle: row.course?.title || '—',
      lessonTitle: row.lesson?.title || '—',
      completedAt: row.completed_at,
    }));

    const solvedTasks = solvedTasksRaw.map((row) => ({
      title: row.task?.title || `Задача #${row.task_id}`,
      themeName: row.task?.theme?.name || '—',
      difficulty: row.task?.difficulty ?? '—',
      attempts: row.attempts,
      solvedAt: row.solved_at,
    }));

    const themeStats = buildThemeStats(taskResults);
    const solvedLast30Days = timeline30.reduce((sum, p) => sum + p.count, 0);
    const recommendations = buildRecommendations(themeStats, coursesSummary);

    return {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
      generatedAt: new Date(),
      coursesSummary,
      completedLessons,
      solvedTasks,
      themeStats,
      solvedLast30Days,
      recommendations,
    };
  }

  async buildTrainerReportData(trainerId) {
    const trainer = await userRepository.findById(trainerId);
    if (!trainer || trainer.role !== 'trainer') {
      throw new Error('Only trainers can download this report');
    }

    const studentsProgress = await trainerProgressService.getStudentsProgress(trainerId);

    const students = await Promise.all(
      studentsProgress.map(async (item) => {
        const lastLoginAt = await refreshTokenRepository.getLastLoginAt(item.student.id);
        return {
          studentId: item.student.id,
          firstName: item.student.first_name,
          lastName: item.student.last_name,
          email: item.student.email,
          coursesProgressPercent: item.coursesProgressPercent,
          completedCoursesCount: item.completedCoursesCount,
          assignedCoursesCount: item.assignedCoursesCount,
          solvedTasksCount: item.solvedTasksCount,
          lastActivityAt: item.lastActivityAt,
          lastLoginAt,
        };
      })
    );

    return {
      trainer: {
        id: trainer.id,
        firstName: trainer.first_name,
        lastName: trainer.last_name,
        email: trainer.email,
      },
      generatedAt: new Date(),
      students,
    };
  }
}

module.exports = new ReportService();
module.exports.formatDate = formatDate;
